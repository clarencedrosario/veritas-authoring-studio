import React, { useState } from 'react';
import {
  BookMarked,
  FileText,
  GraduationCap,
  Feather,
  Film,
  Download,
  Eye,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  Settings,
  Layers,
  ChevronRight,
  ChevronDown,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import {
  NovelProject,
  GrammarSeriesProject,
  ContentWritingProject,
  ScriptProject,
} from '../types';
import { exportToDocx, exportToMarkdown, exportToPlainText } from '../utils/export';

interface PublishingStudioViewProps {
  activeStudio: 'academic' | 'novel' | 'content' | 'film';
  novelProject: NovelProject;
  grammarProject: GrammarSeriesProject;
  contentProject: ContentWritingProject;
  scriptProject: ScriptProject;
  onNavigateToTab: (tab: any) => void;
  isDarkMode: boolean;
}

export const PublishingStudioView: React.FC<PublishingStudioViewProps> = ({
  activeStudio,
  novelProject,
  grammarProject,
  contentProject,
  scriptProject,
  onNavigateToTab,
  isDarkMode,
}) => {
  const [selectedStudio, setSelectedStudio] = useState<'academic' | 'novel' | 'content' | 'film'>(activeStudio);

  // Academic Book Publishing State
  const [academicEdition, setAcademicEdition] = useState<'Student Edition' | 'Teacher Edition'>('Student Edition');
  const [academicActiveTab, setAcademicActiveTab] = useState<'preview' | 'front_matter' | 'toc' | 'back_matter' | 'metadata' | 'export'>('preview');

  // Novel Publishing State
  const [novelActiveTab, setNovelActiveTab] = useState<'preview' | 'front_matter' | 'toc' | 'back_matter' | 'metadata' | 'export'>('preview');
  const [novelFont, setNovelFont] = useState<'EB Garamond' | 'Lora' | 'Literata' | 'Source Serif 4'>('EB Garamond');
  const [novelTrim, setNovelTrim] = useState<'5.5x8.5' | '6x9' | '5x8'>('6x9');

  // Content Publishing State
  const [contentActiveTab, setContentActiveTab] = useState<'preview' | 'seo' | 'export'>('preview');

  // Film / Script Publishing State
  const [scriptActiveTab, setScriptActiveTab] = useState<'preview' | 'metadata' | 'export'>('preview');

  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const notifyCopy = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Active book context for academic
  const activeAcademicProject =
    (grammarProject.bookProjects &&
      grammarProject.activeBookProjectId &&
      grammarProject.bookProjects[grammarProject.activeBookProjectId]) ||
    (grammarProject.bookProjects && Object.values(grammarProject.bookProjects)[0]) || {
      bookTitle: `English Language & Grammar — ${grammarProject.selectedClass || 'Class 6'}`,
      subtitle: `${grammarProject.targetBoard} Curriculum Framework`,
      board: grammarProject.targetBoard,
      classLevel: grammarProject.selectedClass || 'Class 6',
    };

  const activeContentDoc = contentProject.documents.find((d) => d.id === contentProject.activeDocumentId) || contentProject.documents[0];

  return (
    <div className="w-full h-full flex flex-col bg-[#F6F0E7] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] overflow-hidden">
      {/* Top Banner: Studio Selection & Context Header */}
      <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#2c1320] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-[#5A1832] text-[#C29A52]">
              <BookMarked className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
              Publishing Studio
            </h1>
          </div>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5 font-sans">
            Typesetting, manuscript compilation, front/back matter, and multi-format production exports.
          </p>
        </div>

        {/* Project Studio Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#CBBEAC]/40 dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832]">
          {[
            { id: 'academic', label: 'Academic Book', icon: GraduationCap },
            { id: 'novel', label: 'Novel', icon: Feather },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'film', label: 'Film & Script', icon: Film },
          ].map((s) => {
            const Icon = s.icon;
            const isSel = selectedStudio === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStudio(s.id as any)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                    : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#292521] dark:hover:text-[#F6F0E7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-[#C29A52]' : ''}`} />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-emerald-800 text-white text-xs px-4 py-2 font-medium text-center shadow-md animate-in fade-in">
          {copiedNotification}
        </div>
      )}

      {/* Main Publishing Work Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ==================================================== */}
        {/* 1. ACADEMIC BOOK PUBLISHING WORKSPACE               */}
        {/* ==================================================== */}
        {selectedStudio === 'academic' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Academic Header Info */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/70 dark:bg-[#2a1320] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-[#5A1832] text-[#F6F0E7] font-mono text-[11px] font-bold">
                    {activeAcademicProject.board} • {activeAcademicProject.classLevel}
                  </span>
                  <span className="text-xs text-[#9A7438] dark:text-[#C29A52] font-semibold">
                    NEP 2020 Pedagogical Alignment
                  </span>
                </div>
                <h2 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] mt-1">
                  {activeAcademicProject.bookTitle}
                </h2>
                <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] font-sans">
                  {activeAcademicProject.subtitle}
                </p>
              </div>

              {/* Student Edition vs Teacher Edition Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-[#71685E] dark:text-[#D8CCBC]">Edition:</span>
                <div className="flex rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] overflow-hidden p-0.5 bg-[#F6F0E7] dark:bg-[#200b14]">
                  {(['Student Edition', 'Teacher Edition'] as const).map((ed) => (
                    <button
                      key={ed}
                      onClick={() => setAcademicEdition(ed)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        academicEdition === ed
                          ? 'bg-[#5A1832] text-[#F6F0E7]'
                          : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#35101F]'
                      }`}
                    >
                      {ed}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Publishing Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-[#CBBEAC] dark:border-[#4d1e2e] pb-2">
              {[
                { id: 'preview', label: 'Book Preview & Layout' },
                { id: 'front_matter', label: 'Front Matter' },
                { id: 'toc', label: 'Table of Contents' },
                { id: 'back_matter', label: 'Back Matter & Keys' },
                { id: 'metadata', label: 'Metadata & ISBN' },
                { id: 'export', label: 'Print / PDF Export' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAcademicActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    academicActiveTab === tab.id
                      ? 'bg-[#5A1832] text-[#F6F0E7]'
                      : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Academic Tab Content */}
            {academicActiveTab === 'preview' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                      {academicEdition} — Live Typeset Preview
                    </h3>
                    <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
                      Format: Crown Quarto (189 × 246 mm) • 2-Column Applied Grammar Grid
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onNavigateToTab('textbook_preview')}
                      className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-medium text-[#5A1832] dark:text-[#C29A52] hover:bg-[#EDE4D6] flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Textbook Viewer</span>
                    </button>
                    <button
                      onClick={() => onNavigateToTab('textbook_exporter')}
                      className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold hover:bg-[#722040] flex items-center space-x-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#C29A52]" />
                      <span>Layout Exporter</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Book Preview Sheet */}
                <div className="p-8 rounded-xl border border-[#CBBEAC]/60 bg-[#FBF9F5] text-[#292521] font-serif space-y-6 shadow-inner max-w-3xl mx-auto">
                  <div className="border-b border-[#9A7438]/40 pb-4 text-center">
                    <div className="text-[11px] font-mono tracking-widest text-[#9A7438] uppercase">
                      Veritas Academic Press &bull; {activeAcademicProject.board} Series
                    </div>
                    <h1 className="text-2xl font-bold text-[#35101F] mt-1">
                      {activeAcademicProject.bookTitle}
                    </h1>
                    <div className="text-sm italic text-[#71685E] mt-0.5">
                      {academicEdition} &bull; Academic Year 2026–2027
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-sans leading-relaxed text-[#3a3530]">
                    <div className="p-3 rounded-lg bg-[#EDE4D6]/50 border border-[#CBBEAC]">
                      <span className="font-bold text-[#5A1832]">NEP 2020 Competency Statement:</span> This volume integrates experiential syntax analysis, contextual cloze tests, and multi-tiered assessments conforming strictly to {activeAcademicProject.board} regulations.
                    </div>

                    <div className="text-sm font-serif font-bold text-[#35101F]">
                      Sample Chapter Unit Structure:
                    </div>
                    <ol className="list-decimal pl-5 space-y-1.5 font-mono text-[11px] text-[#5A1832]">
                      <li>COMP-01: Core Concept Definition &amp; Etymological Root</li>
                      <li>COMP-02: Structural Sentence Blueprint &amp; Syntax Diagram</li>
                      <li>COMP-03: Rule Invariant &amp; Common Learner Fallacies</li>
                      <li>COMP-04: Guided Differentiated Practice Exercises</li>
                      <li>COMP-05: High-Order Board Exam Question Bank</li>
                      <li>COMP-06: Formative Assessment &amp; Rubric Key</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {academicActiveTab === 'front_matter' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Academic Front Matter
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-2">
                    <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">Title Page &amp; Imprint</div>
                    <p className="text-[#71685E] dark:text-[#D8CCBC]">
                      Veritas Academic Press, New Delhi &bull; London. All rights reserved under International Copyright Convention.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-2">
                    <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">Preface &amp; Curriculum Rationale</div>
                    <p className="text-[#71685E] dark:text-[#D8CCBC]">
                      Designed to nurture grammatical agility, conceptual mastery, and articulate written expression for {activeAcademicProject.classLevel} students.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {academicActiveTab === 'toc' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                    Syllabus Table of Contents
                  </h3>
                  <button
                    onClick={() => onNavigateToTab('book_planner')}
                    className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    Edit in Book Planner &rarr;
                  </button>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {(grammarProject.books[grammarProject.selectedClass || 'Class 6']?.topics || []).map((t, idx) => (
                    <div key={t.id} className="p-2.5 rounded-lg border border-[#CBBEAC]/50 flex items-center justify-between">
                      <span className="font-bold text-[#5A1832] dark:text-[#C29A52]">Chapter {idx + 1}: {t.title}</span>
                      <span className="text-[#71685E] dark:text-[#D8CCBC]">Page {(idx + 1) * 8}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {academicActiveTab === 'back_matter' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Back Matter &amp; Assessment Solutions
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
                  Includes comprehensive teacher answer keys, syntactic index, and glossary of pedagogical grammar terminology.
                </p>
                <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/30 text-xs font-mono space-y-1">
                  <div>Appendix A: Comprehensive Irregular Verb Conjugation Matrix</div>
                  <div>Appendix B: British vs. International Spelling Conventions</div>
                  <div>Appendix C: Formative Assessment Rubrics</div>
                </div>
              </div>
            )}

            {academicActiveTab === 'metadata' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                    Publisher Submission &amp; ISBN Metadata
                  </h3>
                  <button
                    onClick={() => onNavigateToTab('publisher_submission')}
                    className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                  >
                    Open Submission Centre &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-[#71685E] dark:text-[#D8CCBC] block mb-1">Target ISBN</label>
                    <input type="text" readOnly value="978-93-89012-44-1 (Provisional)" className="w-full h-8 px-2 rounded border border-[#CBBEAC] bg-stone-100 dark:bg-[#35101F]" />
                  </div>
                  <div>
                    <label className="font-semibold text-[#71685E] dark:text-[#D8CCBC] block mb-1">Target Page Count</label>
                    <input type="text" readOnly value="192 Pages (Crown Quarto)" className="w-full h-8 px-2 rounded border border-[#CBBEAC] bg-stone-100 dark:bg-[#35101F]" />
                  </div>
                </div>
              </div>
            )}

            {academicActiveTab === 'export' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-5">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Academic Book Export Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 space-y-3">
                    <div className="font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">Print-Ready PDF (CMYK)</div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                      300 DPI high-resolution with 3mm crop marks and bleeds for offset printing.
                    </p>
                    <button
                      onClick={() => onNavigateToTab('textbook_exporter')}
                      className="w-full h-8 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                    >
                      Export Print PDF
                    </button>
                  </div>
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 space-y-3">
                    <div className="font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">Digital Interactive Edition</div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                      Optimized for tablets, classroom smartboards, and online PDF portals.
                    </p>
                    <button
                      onClick={() => onNavigateToTab('textbook_preview')}
                      className="w-full h-8 rounded-lg border border-[#5A1832] text-[#5A1832] dark:text-[#C29A52] text-xs font-semibold"
                    >
                      Launch Digital Viewer
                    </button>
                  </div>
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 space-y-3">
                    <div className="font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">Publisher Dossier</div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                      Complete board compliance audit, TOC specification, and sample unit packet.
                    </p>
                    <button
                      onClick={() => onNavigateToTab('publisher_submission')}
                      className="w-full h-8 rounded-lg border border-[#5A1832] text-[#5A1832] dark:text-[#C29A52] text-xs font-semibold"
                    >
                      Export Dossier
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 2. NOVEL WRITING PUBLISHING WORKSPACE               */}
        {/* ==================================================== */}
        {selectedStudio === 'novel' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Novel Info */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/70 dark:bg-[#2a1320] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-200 font-mono text-[11px] font-bold border border-emerald-700/50">
                    {novelProject.genre}
                  </span>
                  <span className="text-xs text-[#71685E] dark:text-[#D8CCBC] font-mono">
                    {novelProject.chapters.length} Chapters &bull; {novelProject.targetTotalWords.toLocaleString()} target words
                  </span>
                </div>
                <h2 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] mt-1">
                  {novelProject.title}
                </h2>
                <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] font-sans">
                  {novelProject.logline || novelProject.subtitle}
                </p>
              </div>

              {/* Format Controls */}
              <div className="flex items-center space-x-3 text-xs">
                <div>
                  <span className="text-[#71685E] dark:text-[#D8CCBC] mr-1 font-medium">Font:</span>
                  <select
                    value={novelFont}
                    onChange={(e) => setNovelFont(e.target.value as any)}
                    className="h-8 px-2 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] dark:bg-[#200b14] outline-none"
                  >
                    <option value="EB Garamond">EB Garamond</option>
                    <option value="Lora">Lora</option>
                    <option value="Literata">Literata</option>
                    <option value="Source Serif 4">Source Serif 4</option>
                  </select>
                </div>
                <div>
                  <span className="text-[#71685E] dark:text-[#D8CCBC] mr-1 font-medium">Trim:</span>
                  <select
                    value={novelTrim}
                    onChange={(e) => setNovelTrim(e.target.value as any)}
                    className="h-8 px-2 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] dark:bg-[#200b14] outline-none"
                  >
                    <option value="6x9">6 × 9 in (Trade Paperback)</option>
                    <option value="5.5x8.5">5.5 × 8.5 in (Demy)</option>
                    <option value="5x8">5 × 8 in (Pocket)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Novel Tabs */}
            <div className="flex items-center space-x-2 border-b border-[#CBBEAC] dark:border-[#4d1e2e] pb-2">
              {[
                { id: 'preview', label: 'Typeset Manuscript Preview' },
                { id: 'front_matter', label: 'Front Matter' },
                { id: 'toc', label: 'Table of Contents' },
                { id: 'back_matter', label: 'Back Matter' },
                { id: 'metadata', label: 'Query Pitch Kit' },
                { id: 'export', label: 'Export Book' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setNovelActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    novelActiveTab === tab.id
                      ? 'bg-[#5A1832] text-[#F6F0E7]'
                      : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Novel Tab Contents */}
            {novelActiveTab === 'preview' && (
              <div className="p-8 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#FBF9F5] text-[#292521] shadow-sm max-w-3xl mx-auto space-y-6">
                <div className="text-center border-b border-[#CBBEAC]/50 pb-6">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#9A7438]">
                    {novelProject.authorName || 'Author'}
                  </div>
                  <h1 className="text-3xl font-serif font-bold text-[#35101F] mt-2">
                    {novelProject.title}
                  </h1>
                  <div className="text-xs font-mono text-[#71685E] mt-1">
                    Complete Manuscript &bull; {novelTrim} Standard Layout &bull; {novelFont}
                  </div>
                </div>

                {/* Assembled First Chapter Preview */}
                <div className="space-y-4 text-sm leading-relaxed" style={{ fontFamily: novelFont }}>
                  {novelProject.chapters.slice(0, 1).map((chap) => (
                    <div key={chap.id} className="space-y-3">
                      <h2 className="text-center font-serif text-lg font-bold text-[#35101F] tracking-wide pt-4">
                        Chapter {chap.number}
                      </h2>
                      <div className="text-center text-xs italic text-[#71685E] pb-4">
                        {chap.title}
                      </div>
                      {chap.scenes.slice(0, 2).map((s) => (
                        <div key={s.id} className="text-justify indent-8 text-[#292521] leading-7">
                          {s.content || 'Scene drafting in progress...'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {novelActiveTab === 'front_matter' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Novel Front Matter Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-2">
                    <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">Half Title &amp; Title Page</div>
                    <p className="text-[#71685E] dark:text-[#D8CCBC]">Includes primary book title, author byline, and publisher seal imprint.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-2">
                    <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">Copyright Notice</div>
                    <p className="text-[#71685E] dark:text-[#D8CCBC]">&copy; 2026 {novelProject.authorName}. All rights reserved. First Edition.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-2">
                    <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">Dedication &amp; Epigraph</div>
                    <p className="text-[#71685E] dark:text-[#D8CCBC]">Optional thematic literary quote and personalized inscription.</p>
                  </div>
                </div>
              </div>
            )}

            {novelActiveTab === 'toc' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Novel Manuscript Table of Contents
                </h3>
                <div className="space-y-1.5 font-serif text-xs">
                  {novelProject.chapters.map((chap) => (
                    <div key={chap.id} className="p-2 border-b border-[#CBBEAC]/40 flex items-center justify-between">
                      <span className="font-bold text-[#35101F] dark:text-[#F6F0E7]">
                        Chapter {chap.number}: {chap.title}
                      </span>
                      <span className="text-[#71685E] dark:text-[#D8CCBC] font-mono text-[11px]">
                        {chap.scenes.reduce((a, s) => a + (s.wordCount || 0), 0)} words
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {novelActiveTab === 'back_matter' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Novel Back Matter
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-1.5">
                    <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">Acknowledgements</div>
                    <p className="text-[#71685E] dark:text-[#D8CCBC]">Acknowledgements to editors, readers, and research consultants.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-1.5">
                    <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">About the Author</div>
                    <p className="text-[#71685E] dark:text-[#D8CCBC]">Biographical statement and literary background.</p>
                  </div>
                </div>
              </div>
            )}

            {novelActiveTab === 'metadata' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                    Query Pitch Kit &amp; Representation Dossier
                  </h3>
                  <button
                    onClick={() => onNavigateToTab('querykit')}
                    className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                  >
                    Open Query Kit &rarr;
                  </button>
                </div>
                <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/30 text-xs space-y-2">
                  <div className="font-bold text-[#5A1832] dark:text-[#C29A52]">Logline:</div>
                  <div className="italic">{novelProject.logline || 'A high-stakes fiction narrative.'}</div>
                </div>
              </div>
            )}

            {novelActiveTab === 'export' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Manuscript Export Suite
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <button
                    onClick={() => {
                      exportToDocx(novelProject);
                      notifyCopy('Exported manuscript to Microsoft Word (.docx)');
                    }}
                    className="p-4 rounded-xl border border-[#CBBEAC] hover:border-[#5A1832] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 text-left space-y-2 transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-[#5A1832] dark:text-[#C29A52]" />
                    <div className="font-bold text-[#35101F] dark:text-[#F6F0E7]">Microsoft Word (.docx)</div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">Standard 12pt Times New Roman double-spaced submission manuscript.</p>
                  </button>

                  <button
                    onClick={() => {
                      exportToMarkdown(novelProject);
                      notifyCopy('Exported manuscript to Markdown (.md)');
                    }}
                    className="p-4 rounded-xl border border-[#CBBEAC] hover:border-[#5A1832] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 text-left space-y-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-[#5A1832] dark:text-[#C29A52]" />
                    <div className="font-bold text-[#35101F] dark:text-[#F6F0E7]">Markdown (.md)</div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">Universal clean text format with heading levels and metadata.</p>
                  </button>

                  <button
                    onClick={() => {
                      exportToPlainText(novelProject);
                      notifyCopy('Exported manuscript to Plain Text (.txt)');
                    }}
                    className="p-4 rounded-xl border border-[#CBBEAC] hover:border-[#5A1832] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 text-left space-y-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-[#5A1832] dark:text-[#C29A52]" />
                    <div className="font-bold text-[#35101F] dark:text-[#F6F0E7]">Plain Text (.txt)</div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">Raw manuscript text without proprietary styling.</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. CONTENT WRITING PUBLISHING WORKSPACE             */}
        {/* ==================================================== */}
        {selectedStudio === 'content' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/70 dark:bg-[#2a1320] flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-200 font-mono text-[11px] font-bold">
                  Content Article &bull; {activeContentDoc.contentType.toUpperCase()}
                </span>
                <h2 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] mt-1">
                  {activeContentDoc.title}
                </h2>
                <div className="text-xs text-[#71685E] dark:text-[#D8CCBC] font-mono mt-0.5">
                  {activeContentDoc.wordCount} words &bull; {activeContentDoc.readingTimeMinutes} min reading time
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeContentDoc.bodyContent);
                  notifyCopy('Copied article content to clipboard');
                }}
                className="h-8 px-3 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Copy Text</span>
              </button>
            </div>

            {/* Content Tabs */}
            <div className="flex items-center space-x-2 border-b border-[#CBBEAC] dark:border-[#4d1e2e] pb-2">
              {[
                { id: 'preview', label: 'Article Preview' },
                { id: 'seo', label: 'SEO & Metadata' },
                { id: 'export', label: 'Export Options' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setContentActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    contentActiveTab === tab.id
                      ? 'bg-[#5A1832] text-[#F6F0E7]'
                      : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {contentActiveTab === 'preview' && (
              <div className="p-8 rounded-2xl border border-[#CBBEAC] bg-white text-[#292521] shadow-sm max-w-2xl mx-auto space-y-4">
                <h1 className="text-2xl font-serif font-bold text-[#35101F]">
                  {activeContentDoc.title}
                </h1>
                <div className="text-xs text-[#71685E] italic">
                  By Julian Mercer &bull; Published via Veritas Content Writing Studio
                </div>
                <div className="text-xs font-sans leading-relaxed text-[#292521] whitespace-pre-wrap pt-4 border-t border-[#CBBEAC]/50">
                  {activeContentDoc.bodyContent}
                </div>
              </div>
            )}

            {contentActiveTab === 'seo' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  SEO &amp; OpenGraph Social Metadata
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold block mb-1">Meta Title (Max 60 chars)</label>
                    <input type="text" readOnly value={`${activeContentDoc.title} | Veritas Analysis`} className="w-full h-8 px-2 rounded border border-[#CBBEAC] bg-stone-50 dark:bg-[#35101F]" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Meta Description</label>
                    <textarea rows={3} readOnly value={activeContentDoc.subtitle || activeContentDoc.thesisStatement} className="w-full p-2 rounded border border-[#CBBEAC] bg-stone-50 dark:bg-[#35101F]" />
                  </div>
                </div>
              </div>
            )}

            {contentActiveTab === 'export' && (
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] space-y-4">
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Content Export Formats
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <button
                    onClick={() => {
                      const blob = new Blob([`# ${activeContentDoc.title}\n\n${activeContentDoc.bodyContent}`], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${activeContentDoc.title.replace(/\s+/g, '_')}.md`;
                      a.click();
                      notifyCopy('Downloaded Markdown file');
                    }}
                    className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 text-left space-y-1.5"
                  >
                    <Download className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                    <div className="font-bold">Download Markdown (.md)</div>
                    <p className="text-[11px] text-[#71685E]">For web publication, Substack, Medium, or CMS.</p>
                  </button>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 text-left space-y-1.5"
                  >
                    <Printer className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                    <div className="font-bold">Print / Save as PDF</div>
                    <p className="text-[11px] text-[#71685E]">Clean typographic print stylesheet.</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. FILM & SCRIPT PUBLISHING WORKSPACE               */}
        {/* ==================================================== */}
        {selectedStudio === 'film' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/70 dark:bg-[#2a1320] flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 font-mono text-[11px] font-bold">
                  {scriptProject.format.toUpperCase()} SCREENPLAY
                </span>
                <h2 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] mt-1">
                  {scriptProject.title}
                </h2>
                <div className="text-xs text-[#71685E] dark:text-[#D8CCBC] font-mono mt-0.5">
                  Written by {scriptProject.screenwriter} &bull; {scriptProject.scenes.length} Scenes
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="h-8 px-3.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Print Screenplay</span>
              </button>
            </div>

            {/* Screenplay Courier Preview */}
            <div className="p-10 rounded-2xl border border-[#CBBEAC] bg-white text-black font-mono text-xs shadow-lg max-w-2xl mx-auto space-y-4">
              <div className="text-center pb-8 border-b border-stone-200">
                <div className="text-base font-bold tracking-wider">{scriptProject.title.toUpperCase()}</div>
                <div className="text-xs text-stone-600 mt-1">by {scriptProject.screenwriter}</div>
                <div className="text-[10px] text-stone-500 mt-2">DRAFT &bull; {new Date().toLocaleDateString()}</div>
              </div>

              {scriptProject.scenes.map((sc, i) => (
                <div key={sc.id} className="space-y-2 pt-4">
                  <div className="font-bold tracking-wider">
                    {i + 1}. {sc.heading}
                  </div>
                  {sc.elements.map((el) => {
                    if (el.type === 'action') {
                      return <div key={el.id} className="text-justify leading-relaxed">{el.text}</div>;
                    }
                    if (el.type === 'character') {
                      return <div key={el.id} className="text-center font-bold tracking-wide pt-2 uppercase">{el.text}</div>;
                    }
                    if (el.type === 'parenthetical') {
                      return <div key={el.id} className="text-center italic">{el.text}</div>;
                    }
                    if (el.type === 'dialogue') {
                      return <div key={el.id} className="w-3/4 mx-auto text-left leading-snug">{el.text}</div>;
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
