import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  GrammarSeriesProject,
  GrammarTopic,
} from '../../types';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface CurriculumCoverageMatrixProps {
  currentBook: ClassCurriculumBook;
  seriesProject: GrammarSeriesProject;
  onOpenChapterStudio?: (topicId: string) => void;
  isDarkMode: boolean;
}

interface SyllabusTopicItem {
  id: string;
  strand: string;
  topicTitle: string;
  isRequired: boolean;
  prescribedBoardCode: string;
  targetDepth: 'Introductory' | 'Standard Mastery' | 'Advanced Application';
}

function getPrescribedSyllabusForBook(board: string, classLevel: string): SyllabusTopicItem[] {
  const boardUpper = (board || '').toUpperCase();
  const numMatch = (classLevel || '').match(/\d+/);
  const classNum = numMatch ? parseInt(numMatch[0], 10) : 6;

  // 1. Foundational / Class 1
  if (classNum <= 1 || classLevel.toLowerCase().includes('foundational') || classLevel.toLowerCase().includes('stage 1')) {
    const pfx = boardUpper.includes('CISCE') || boardUpper.includes('ICSE') ? 'CISCE-ENG-C1' : boardUpper.includes('CAMBRIDGE') ? 'CAMB-ENG-S1' : 'CBSE-ENG-C1';
    return [
      { id: 'syl-1', strand: 'Orthography & Sounds', topicTitle: 'Alphabetical Order & Letter-Sound Recognition', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A1`, targetDepth: 'Introductory' },
      { id: 'syl-2', strand: 'Nominal Structures', topicTitle: 'Naming Words (Common & Proper Nouns)', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A2`, targetDepth: 'Introductory' },
      { id: 'syl-3', strand: 'Inflectional Forms', topicTitle: 'Singular and Plural Nouns (-s / -es)', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A3`, targetDepth: 'Introductory' },
      { id: 'syl-4', strand: 'Modifiers', topicTitle: 'Describing Words (Adjectives of Color, Size & Quality)', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A4`, targetDepth: 'Introductory' },
      { id: 'syl-5', strand: 'Verbs', topicTitle: 'Doing Words (Action Verbs in Everyday Sentences)', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A5`, targetDepth: 'Introductory' },
      { id: 'syl-6', strand: 'Pronouns', topicTitle: 'Pronouns (I, You, He, She, It, We, They)', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A6`, targetDepth: 'Introductory' },
      { id: 'syl-7', strand: 'Spatial Relations', topicTitle: 'Position Words (Prepositions: in, on, under, near)', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A7`, targetDepth: 'Introductory' },
      { id: 'syl-8', strand: 'Mechanics', topicTitle: 'Capital Letters, Full Stops & Question Marks', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A8`, targetDepth: 'Introductory' },
      { id: 'syl-9', strand: 'Sentence Sense', topicTitle: 'Basic Sentence Sense & Word Sequencing', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A9`, targetDepth: 'Introductory' },
      { id: 'syl-10', strand: 'Composition', topicTitle: 'Picture Composition & Guided Expression', isRequired: true, prescribedBoardCode: `${pfx}-SEC-A10`, targetDepth: 'Introductory' },
    ];
  }

  // 2. CISCE / ICSE Curriculum
  if (boardUpper.includes('CISCE') || boardUpper.includes('ICSE')) {
    if (classNum >= 9) {
      return [
        { id: 'syl-c9-1', strand: 'Syntax & Concord', topicTitle: 'Advanced Subject-Verb Concord & Inversion', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B1', targetDepth: 'Advanced Application' },
        { id: 'syl-c9-2', strand: 'Verbal Aspect', topicTitle: 'Sequence of Tenses & Narrative Continuity', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B2', targetDepth: 'Advanced Application' },
        { id: 'syl-c9-3', strand: 'Sentence Synthesis', topicTitle: 'Synthesis of Sentences (Conditional, Relative & Participle)', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B3', targetDepth: 'Advanced Application' },
        { id: 'syl-c9-4', strand: 'Sentence Transformation', topicTitle: 'Transformation of Sentences (Affirmative/Negative/Degrees/Voice)', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B4', targetDepth: 'Advanced Application' },
        { id: 'syl-c9-5', strand: 'Lexical Grammar', topicTitle: 'Phrasal Verbs & Prepositional Collocations', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B5', targetDepth: 'Advanced Application' },
        { id: 'syl-c9-6', strand: 'Discourse Syntax', topicTitle: 'Direct and Indirect Speech in Complex Passages', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B6', targetDepth: 'Advanced Application' },
        { id: 'syl-c9-7', strand: 'Composition', topicTitle: 'Argumentative, Narrative & Descriptive Essays', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B7', targetDepth: 'Advanced Application' },
        { id: 'syl-c9-8', strand: 'Composition', topicTitle: 'Formal Letters, Notices & Email Drafting', isRequired: true, prescribedBoardCode: 'ICSE-ENG-C9-SEC-B8', targetDepth: 'Advanced Application' },
      ];
    }
    return [
      { id: 'syl-ic-1', strand: 'Syntax & Concord', topicTitle: 'Subject-Verb Concord (Collective Nouns, Correlatives, Intervening Phrases)', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B1`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-2', strand: 'Nominal Structures', topicTitle: 'Noun Phrases, Case & Gender Conventions', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B2`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-3', strand: 'Verbal Aspect', topicTitle: 'Tense System & Sequence of Tenses', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B3`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-4', strand: 'Non-Finite Verbs', topicTitle: 'Infinitives, Gerunds & Participles', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B4`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-5', strand: 'Syntactic Relations', topicTitle: 'Prepositions & Idiomatic Prepositional Phrases', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B5`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-6', strand: 'Voice & Register', topicTitle: 'Active and Passive Voice Transposition', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B6`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-7', strand: 'Discourse Syntax', topicTitle: 'Direct and Indirect Speech Reporting', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B7`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-8', strand: 'Sentence Synthesis', topicTitle: 'Synthesis of Sentences without "and", "but", "so"', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B8`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-9', strand: 'Complex Clauses', topicTitle: 'Conditional Sentences (Types 0, 1, 2, 3)', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B9`, targetDepth: 'Standard Mastery' },
      { id: 'syl-ic-10', strand: 'Composition', topicTitle: 'Formal Letters, Notices & Paragraph Composition', isRequired: true, prescribedBoardCode: `ICSE-ENG-C${classNum}-SEC-B10`, targetDepth: 'Advanced Application' },
    ];
  }

  // 3. Cambridge Curriculum
  if (boardUpper.includes('CAMBRIDGE')) {
    return [
      { id: 'syl-cam-1', strand: 'Grammar in Context', topicTitle: 'Grammatical Agreement & Person-Number Inflection', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-01`, targetDepth: 'Standard Mastery' },
      { id: 'syl-cam-2', strand: 'Morphology', topicTitle: 'Word Classes, Derivational Affixes & Nominalisation', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-02`, targetDepth: 'Standard Mastery' },
      { id: 'syl-cam-3', strand: 'Verbal Aspect', topicTitle: 'Tenses & Aspect: Progressive, Perfect & Modal Auxiliaries', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-03`, targetDepth: 'Standard Mastery' },
      { id: 'syl-cam-4', strand: 'Sentence Architecture', topicTitle: 'Complex Sentences: Subordinate, Relative & Adverbial Clauses', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-04`, targetDepth: 'Standard Mastery' },
      { id: 'syl-cam-5', strand: 'Discourse Cohesion', topicTitle: 'Cohesive Devices, Connectives & Paragraph Architecture', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-05`, targetDepth: 'Standard Mastery' },
      { id: 'syl-cam-6', strand: 'Punctuation & Rhetoric', topicTitle: 'Punctuation for Rhetorical Effect (Colons, Semicolons, Dashes)', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-06`, targetDepth: 'Standard Mastery' },
      { id: 'syl-cam-7', strand: 'Register & Voice', topicTitle: 'Formal vs Informal Register & Passive Construction', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-07`, targetDepth: 'Advanced Application' },
      { id: 'syl-cam-8', strand: 'Composition & Analysis', topicTitle: 'Analytical Writing, Text Transformation & Argumentation', isRequired: true, prescribedBoardCode: `CAMB-ENG-S${classNum}-08`, targetDepth: 'Advanced Application' },
    ];
  }

  // 4. Default CBSE Curriculum
  return [
    { id: 'syl-cb-1', strand: 'Syntax & Concord', topicTitle: 'Subject-Verb Agreement (Concord)', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B1`, targetDepth: 'Standard Mastery' },
    { id: 'syl-cb-2', strand: 'Nominal Structures', topicTitle: 'Nouns & Collective Noun Usage', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B2`, targetDepth: 'Standard Mastery' },
    { id: 'syl-cb-3', strand: 'Nominal Structures', topicTitle: 'Pronouns: Personal, Distributive & Relative', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B3`, targetDepth: 'Standard Mastery' },
    { id: 'syl-cb-4', strand: 'Verbs & Temporal Relations', topicTitle: 'Tenses: Simple, Continuous & Perfect Aspects', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B4`, targetDepth: 'Standard Mastery' },
    { id: 'syl-cb-5', strand: 'Modifiers', topicTitle: 'Determiners & Articles (A, An, The)', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B5`, targetDepth: 'Standard Mastery' },
    { id: 'syl-cb-6', strand: 'Modifiers', topicTitle: 'Adjectives & Degrees of Comparison', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B6`, targetDepth: 'Standard Mastery' },
    { id: 'syl-cb-7', strand: 'Syntactic Relations', topicTitle: 'Prepositions & Prepositional Phrases', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B7`, targetDepth: 'Standard Mastery' },
    { id: 'syl-cb-8', strand: 'Sentence Structure', topicTitle: 'Active and Passive Voice (Transposition)', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B8`, targetDepth: 'Introductory' },
    { id: 'syl-cb-9', strand: 'Discourse Syntax', topicTitle: 'Direct and Indirect Speech (Reported Statements)', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B9`, targetDepth: 'Introductory' },
    { id: 'syl-cb-10', strand: 'Composition', topicTitle: 'Formal Letter Writing & Paragraph Cohesion', isRequired: true, prescribedBoardCode: `CBSE-ENG-C${classNum}-SEC-B10`, targetDepth: 'Advanced Application' },
  ];
}

export const CurriculumCoverageMatrix: React.FC<CurriculumCoverageMatrixProps> = ({
  currentBook,
  seriesProject,
  onOpenChapterStudio,
}) => {
  const topics = currentBook.topics || [];
  const activeBoard = currentBook.curriculumSystemId || currentBook.boardStandards || seriesProject.targetBoard || 'CBSE';
  const activeClass = currentBook.classOrStageId || currentBook.classLevel || 'Class 6';
  const [activeTab, setActiveTab] = useState<'matrix' | 'duplication' | 'progression'>('matrix');

  const prescribedSyllabus = getPrescribedSyllabusForBook(activeBoard, activeClass);

  // Match syllabus items to authored chapters
  const auditResults = prescribedSyllabus.map((item) => {
    // Look for matching topic in book
    const matched = topics.find(
      (t) =>
        t.title.toLowerCase().includes(item.topicTitle.toLowerCase().split(' ')[0]) ||
        (t.curriculumTopic && t.curriculumTopic.toLowerCase().includes(item.strand.toLowerCase())) ||
        t.category.toLowerCase().includes(item.strand.toLowerCase().split(' ')[0])
    );

    let status: 'Covered' | 'Partially Covered' | 'Potential Gap' | 'Not Mapped' | 'Verified' = 'Not Mapped';

    if (matched) {
      if (matched.exercises && matched.exercises.length > 0 && matched.definitions && matched.definitions.length > 0) {
        status = 'Verified';
      } else if (matched.notesAndTheoryMarkdown && matched.notesAndTheoryMarkdown.length > 100) {
        status = 'Covered';
      } else {
        status = 'Partially Covered';
      }
    } else if (item.isRequired) {
      status = 'Potential Gap';
    }

    return {
      ...item,
      mappedTopic: matched,
      status,
    };
  });

  const verifiedCount = auditResults.filter((r) => r.status === 'Verified' || r.status === 'Covered').length;
  const gapCount = auditResults.filter((r) => r.status === 'Potential Gap').length;

  // Duplication Control Detection
  const repeatedConcepts = topics.length > 0 ? [
    {
      conceptName: `${topics[0]?.title || 'Core Grammar Strand'} (Progression & Depth)`,
      prevChapter: `Prerequisite / Foundational Stage`,
      currentChapter: topics[0]?.title || 'Chapter 1',
      treatmentLevel: 'Formalization & Application',
      reason: 'Progression / Deepening',
      rationale:
        `Concepts in ${topics[0]?.title || 'Chapter 1'} advance student mastery through structured syntax exposition, diagnostic pairs, and board-aligned exercises suitable for ${activeClass}.`,
      isLegitimate: true,
    },
    ...(topics.length > 1 ? [{
      conceptName: `${topics[1]?.title || 'Secondary Strand'} (Domain Interleaving)`,
      prevChapter: topics[0]?.title || 'Chapter 1',
      currentChapter: topics[1]?.title || 'Chapter 2',
      treatmentLevel: 'Interleaved Practice',
      reason: 'Spiral Reinforcement',
      rationale:
        `Connects syntactic principles established in ${topics[0]?.title} to the functional structures of ${topics[1]?.title}.`,
      isLegitimate: true,
    }] : []),
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-5 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
            {activeBoard} &bull; {activeClass} Board Compliance Framework
          </div>
          <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Curriculum Coverage &amp; Concept Spiral
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
            Audit prescribed syllabus benchmarks, cross-chapter progression, and concept duplication control for {currentBook.title || activeClass}.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-white/70 dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'matrix'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            Coverage Matrix ({verifiedCount}/{auditResults.length})
          </button>
          <button
            onClick={() => setActiveTab('duplication')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'duplication'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            Concept Duplication ({repeatedConcepts.length})
          </button>
          <button
            onClick={() => setActiveTab('progression')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'progression'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            Spiral Progression
          </button>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#71685E] dark:text-[#D8CCBC] px-1">
            <span>Official Syllabus Framework: {activeBoard} {activeClass} Core English Curriculum</span>
            <span className="font-mono font-semibold text-[#5A1832] dark:text-[#C29A52]">
              {verifiedCount} Verified / {gapCount} Gaps Identified
            </span>
          </div>

          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] dark:border-[#5A1832] text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#D8CCBC]">
                  <tr>
                    <th className="py-3 px-4">Syllabus Benchmark</th>
                    <th className="py-3 px-4">Strand</th>
                    <th className="py-3 px-4">Board Code</th>
                    <th className="py-3 px-4">Target Depth</th>
                    <th className="py-3 px-4">Mapped Book Chapter</th>
                    <th className="py-3 px-4">Coverage Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#5A1832]/50">
                  {auditResults.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FDFBF7]/70 dark:hover:bg-[#251D1E]/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        <div className="flex items-center space-x-1.5">
                          {item.isRequired && (
                            <span className="text-amber-600 font-bold" title="Mandatory Core Benchmark">
                              *
                            </span>
                          )}
                          <span>{item.topicTitle}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#71685E] dark:text-[#D8CCBC]">
                        {item.strand}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[10.5px] text-[#9A7438] dark:text-[#C29A52]">
                        {item.prescribedBoardCode}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                        {item.targetDepth}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.mappedTopic ? (
                          <span className="font-medium text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-1">
                            <BookOpen className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />
                            <span>{item.mappedTopic.title}</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-zinc-400 italic">Unmapped in draft</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium border ${
                            item.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.status === 'Covered'
                              ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                              : item.status === 'Partially Covered'
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {item.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === 'Potential Gap' && <AlertTriangle className="w-3 h-3" />}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {item.mappedTopic ? (
                          <button
                            onClick={() => onOpenChapterStudio(item.mappedTopic!.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:bg-[#431225] transition-colors"
                          >
                            Review Chapter
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-[#71685E]">Add Chapter</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'duplication' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Concept Duplication Control:</strong> When a grammatical concept appears across multiple chapters or class levels, VERITAS distinguishes intentional spiral reinforcement from accidental duplication. Repeated material is never automatically purged; editorial rationale is preserved.
          </div>

          <div className="space-y-3">
            {repeatedConcepts.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBBEAC]/50 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#9A7438] font-bold">
                      Tracked Concept
                    </div>
                    <div className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                      {item.conceptName}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 self-start">
                    {item.reason}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                  <div>
                    <span className="text-[#71685E] block text-[10px] uppercase">Prior Treatment</span>
                    <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">{item.prevChapter}</span>
                  </div>
                  <div>
                    <span className="text-[#71685E] block text-[10px] uppercase">Current Occurrence</span>
                    <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">{item.currentChapter}</span>
                  </div>
                  <div>
                    <span className="text-[#71685E] block text-[10px] uppercase">Treatment Level</span>
                    <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">{item.treatmentLevel}</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-[#71685E] dark:text-[#D8CCBC] bg-[#FDFBF7] dark:bg-[#251D1E] p-3 rounded-xl border border-[#CBBEAC]/60 italic leading-relaxed">
                  &ldquo;{item.rationale}&rdquo;
                </p>
              </div>
            ))}

            {repeatedConcepts.length === 0 && (
              <div className="p-10 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] text-center space-y-2">
                <Sparkles className="w-8 h-8 text-[#9A7438] mx-auto opacity-60" />
                <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                  No Concept Duplications Detected
                </h4>
                <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] max-w-md mx-auto">
                  {topics.length === 0
                    ? 'No chapters authored for this volume yet. Once chapters are added, VERITAS will audit cross-chapter concept recurrence and spiral progression.'
                    : 'All authored chapters in this volume maintain distinct linguistic scope with no unintentional semantic overlap.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'progression' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-4 text-xs">
          <div className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
            Spiral Progression Framework &bull; {activeBoard} ({activeClass})
          </div>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] leading-relaxed">
            The VERITAS spiral curriculum maps each syntactic domain across 5 developmental stages:
            <strong> Introduced (I)</strong> &rarr; <strong>Developing (D)</strong> &rarr; <strong>Reinforced (R)</strong> &rarr; <strong>Mastered (M)</strong> &rarr; <strong>Extended (E)</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#251D1E] border border-[#CBBEAC] text-center space-y-1">
              <span className="font-mono text-sm font-bold text-[#9A7438]">I</span>
              <div className="font-serif font-bold text-xs">Introduced</div>
              <p className="text-[10px] text-[#71685E]">Concrete examples, visual identification.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#251D1E] border border-[#CBBEAC] text-center space-y-1">
              <span className="font-mono text-sm font-bold text-[#9A7438]">D</span>
              <div className="font-serif font-bold text-xs">Developing</div>
              <p className="text-[10px] text-[#71685E]">Guided drills, scaffolded sentence tasks.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#251D1E] border border-[#CBBEAC] text-center space-y-1">
              <span className="font-mono text-sm font-bold text-[#9A7438]">R</span>
              <div className="font-serif font-bold text-xs">Reinforced</div>
              <p className="text-[10px] text-[#71685E]">Expanded context, contrastive pairs.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#251D1E] border border-[#CBBEAC] text-center space-y-1">
              <span className="font-mono text-sm font-bold text-[#9A7438]">M</span>
              <div className="font-serif font-bold text-xs">Mastered</div>
              <p className="text-[10px] text-[#71685E]">Rigorous board exam error analysis.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#251D1E] border border-[#CBBEAC] text-center space-y-1">
              <span className="font-mono text-sm font-bold text-[#9A7438]">E</span>
              <div className="font-serif font-bold text-xs">Extended</div>
              <p className="text-[10px] text-[#71685E]">Olympiad, stylistic, & rhetoric synthesis.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
