import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  BookTeacherMaterial,
  GrammarSeriesProject,
} from '../../types';
import {
  GraduationCap,
  Calendar,
  Layers,
  BookOpen,
  CheckCircle2,
  FileText,
  Printer,
  Edit2,
  Save,
  Check,
} from 'lucide-react';

interface TeacherEditionManagerProps {
  currentBook: ClassCurriculumBook;
  seriesProject: GrammarSeriesProject;
  onUpdateBook: (updated: ClassCurriculumBook) => void;
  onOpenChapterStudio: (topicId: string) => void;
  isDarkMode: boolean;
}

export const TeacherEditionManager: React.FC<TeacherEditionManagerProps> = ({
  currentBook,
  seriesProject,
  onUpdateBook,
  onOpenChapterStudio,
}) => {
  const teacherMat: BookTeacherMaterial = currentBook.teacherMaterial || {
    id: 'tm-default',
    introForTeachers: `This Teacher's Companion is designed to accompany ${currentBook.title} (${currentBook.classLevel}).`,
    pedagogicalApproach: 'Inductive grammar presentation through authentic discourse contexts.',
    suggestedSchedule: 'Term-based schedule with 4-5 periods per chapter.',
    differentiationGuidance: 'Tiered scaffolding for diverse learner cohorts.',
    assessmentGuidance: 'Diagnostic pre-tests, formative checks, and summative board tests.',
    additionalActivities: 'Sentence diagramming, error hunting, and collaborative parsing.',
    teacherGuideIntro: `This Teacher's Companion is designed to accompany ${currentBook.title} (${currentBook.classLevel}), aligned to the ${seriesProject.targetBoard} pedagogical framework. It provides structured lesson plans, diagnostic rubrics, inductive syntactic exploration techniques, and differentiation strategies.`,
    pedagogicalPrinciples: [
      'Inductive grammar presentation through authentic discourse contexts rather than isolated rule recitation.',
      'Contrastive analysis of minimal pairs to expose syntactic traps and concord ambiguities.',
      'Graded practice: Recognition (Tier 1) -> Production (Tier 2) -> Transformation & Error Correction (Tier 3).',
      'Integration of formal writing conventions with board examination scoring criteria.',
    ],
    yearLongTeachingScheme: [
      {
        term: 'Term 1: Autumn / Foundation',
        week: 'Weeks 1-4',
        unitTitle: 'Unit 1: Syntax & Concord Foundations',
        chaptersCovered: ['Subject-Verb Agreement', 'Helping Verbs & Concord'],
        periodsAllocated: 16,
      },
      {
        term: 'Term 1: Autumn / Foundation',
        week: 'Weeks 5-9',
        unitTitle: 'Unit 2: Nominal Structures & Determinatives',
        chaptersCovered: ['Nouns & Determiners', 'Pronoun Reference & Case'],
        periodsAllocated: 20,
      },
      {
        term: 'Term 2: Winter / Applied Syntax',
        week: 'Weeks 10-15',
        unitTitle: 'Unit 3: Verbal Architecture & Tense System',
        chaptersCovered: ['Finite & Non-Finite Verbs', 'Aspectual Consistency'],
        periodsAllocated: 24,
      },
      {
        term: 'Term 2: Winter / Applied Syntax',
        week: 'Weeks 16-20',
        unitTitle: 'Unit 4: Clauses & Sentence Transposition',
        chaptersCovered: ['Active & Passive Voice', 'Direct & Indirect Speech'],
        periodsAllocated: 20,
      },
      {
        term: 'Term 3: Spring / Revision & Mastery',
        week: 'Weeks 21-26',
        unitTitle: 'Unit 5: Revision, Assessment & Board Preparation',
        chaptersCovered: ['Diagnostic Test Series', 'Cumulative Board Drills'],
        periodsAllocated: 18,
      },
    ],
    differentiationGuidelines: {
      strugglingLearners:
        'Use visual syntax diagrams, color-coded word cards for subjects and verbs, and scaffolded sentence frames with explicit clue brackets.',
      advancedLearners:
        'Task students with analyzing ambiguous literary quotations, transposing passages from 19th-century prose, and participating in grammar Olympiad challenges.',
      ellSupport:
        'Provide explicit contrastive notes comparing L1 word order structures with English Subject-Verb-Object (SVO) syntax.',
    },
    diagnosticAssessmentGuidance:
      'Administer the diagnostic benchmark at the beginning of each term. Students scoring under 60% should complete the prerequisite remediation exercises before progressing to advanced sentence transformation.',
  };

  const [activeTab, setActiveTab] = useState<'guide' | 'pacing' | 'differentiation' | 'chapter_notes'>('guide');
  const [localIntro, setLocalIntro] = useState(teacherMat.teacherGuideIntro);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveIntro = () => {
    onUpdateBook({
      ...currentBook,
      teacherMaterial: {
        ...teacherMat,
        teacherGuideIntro: localIntro,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const topics = currentBook.topics || [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
            Teacher&apos;s Wraparound Edition Material
          </div>
          <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Teacher Material &amp; Pedagogical Architecture
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
            Year-long pacing schemes, lesson plan frameworks, differentiation protocols, and annotated chapter notes.
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex items-center p-1 rounded-xl bg-white/70 dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            Teacher Guide
          </button>
          <button
            onClick={() => setActiveTab('pacing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'pacing'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            Year-Long Pacing Calendar
          </button>
          <button
            onClick={() => setActiveTab('differentiation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'differentiation'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            Differentiation &amp; Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('chapter_notes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'chapter_notes'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            Chapter Lesson Notes ({topics.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Teacher Guide & Principles */}
      {activeTab === 'guide' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                Teacher Companion Introduction
              </h3>
              <p className="text-xs text-[#71685E]">
                Authoritative orientation for instructors adopting {currentBook.title}.
              </p>
            </div>
            <button
              onClick={handleSaveIntro}
              className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-[#C29A52]" />}
              <span>{isSaved ? 'Saved' : 'Save Introduction'}</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={localIntro}
            onChange={(e) => setLocalIntro(e.target.value)}
            className="w-full p-4 rounded-xl border border-[#CBBEAC] bg-[#FDFBF7] dark:bg-[#251D1E] text-xs leading-relaxed"
          />

          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-xs text-[#292521] dark:text-[#F6F0E7]">
              Prescribed Pedagogical Principles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teacherMat.pedagogicalPrinciples.map((principle, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FDFBF7] dark:bg-[#251D1E] border border-[#CBBEAC]/70 flex items-start space-x-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#5A1832] text-[#F6F0E7] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                    {principle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Year-Long Pacing Calendar */}
      {activeTab === 'pacing' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] text-[10px] font-mono uppercase text-[#71685E]">
                  <tr>
                    <th className="py-3 px-4">Academic Term</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Unit Covered</th>
                    <th className="py-3 px-4">Chapters &amp; Focus Strands</th>
                    <th className="py-3 px-4 text-right">Periods Allocated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/50">
                  {teacherMat.yearLongTeachingScheme.map((scheme, idx) => (
                    <tr key={idx} className="hover:bg-[#FDFBF7]/70">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#9A7438]">
                        {scheme.term}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#71685E]">
                        {scheme.week}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        {scheme.unitTitle}
                      </td>
                      <td className="py-3.5 px-4 text-[#71685E]">
                        {scheme.chaptersCovered.join(', ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-right text-[#5A1832] dark:text-[#C29A52]">
                        {scheme.periodsAllocated} periods
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Differentiation & Diagnostics */}
      {activeTab === 'differentiation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] space-y-2">
            <span className="font-mono text-[10px] uppercase text-blue-700 font-bold block">
              Remediation &amp; Scaffolding
            </span>
            <div className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
              Support for Struggling Learners
            </div>
            <p className="text-[#71685E] dark:text-[#D8CCBC] leading-relaxed">
              {teacherMat.differentiationGuidelines.strugglingLearners}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] space-y-2">
            <span className="font-mono text-[10px] uppercase text-emerald-700 font-bold block">
              Enrichment &amp; Olympiad
            </span>
            <div className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
              Strategies for High Achievers
            </div>
            <p className="text-[#71685E] dark:text-[#D8CCBC] leading-relaxed">
              {teacherMat.differentiationGuidelines.advancedLearners}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] space-y-2 md:col-span-2">
            <span className="font-mono text-[10px] uppercase text-[#9A7438] font-bold block">
              Diagnostic Assessment Guidance
            </span>
            <div className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
              Benchmark Testing &amp; Diagnostic Rubrics
            </div>
            <p className="text-[#71685E] dark:text-[#D8CCBC] leading-relaxed">
              {teacherMat.diagnosticAssessmentGuidance}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Chapter Lesson Notes */}
      {activeTab === 'chapter_notes' && (
        <div className="space-y-4">
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
            Pedagogical guides and common syntactic misconceptions authored inside Chapter Studio:
          </p>

          <div className="space-y-3">
            {topics.map((topic, idx) => {
              const rawNotes = topic.studioChapter?.teacherNotes;
              const pedNote =
                typeof rawNotes === 'string'
                  ? rawNotes
                  : rawNotes?.pedagogicalNotes ||
                    'Focus on inductive exploration. Present contrasting sentences before formalizing the rule.';
              const misconceptionsNote =
                typeof rawNotes === 'string'
                  ? ''
                  : rawNotes?.misconceptions?.map((m) => m.misconception).join(', ') ||
                    'Mistaking intervening prepositional nouns for the true syntactic subject.';

              return (
                <div
                  key={topic.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[#9A7438]">CH {idx + 1}</span>
                      <span className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                        {topic.title}
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenChapterStudio(topic.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold"
                    >
                      Edit in Studio
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#71685E] block font-bold">
                        Pedagogical Strategy:
                      </span>
                      <p className="text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                        {pedNote}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase text-rose-700 block font-bold">
                        Common Misconceptions:
                      </span>
                      <p className="text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                        {misconceptionsNote}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
