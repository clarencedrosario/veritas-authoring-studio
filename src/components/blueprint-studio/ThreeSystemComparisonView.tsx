import React from 'react';
import {
  Scale,
  AlertTriangle,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Info,
} from 'lucide-react';
import { SYSTEM_ASSESSMENT_PROFILES } from '../../utils/boardBlueprintIntelligenceData';

export const ThreeSystemComparisonView: React.FC = () => {
  const comparisonAspects = [
    {
      id: 'style_and_format',
      title: 'Question Style & Format',
      cbse: {
        description: 'Contextual, discourse-embedded short items (cloze, editing/omission, dialogue reporting). Isolated drill questions are actively discouraged in modern papers.',
        status: 'SOURCE-BASED',
        citation: 'CBSE Curriculum Subject Code 184 (2024-25), Section B',
      },
      cisce: {
        description: 'Rigorous sentence-level precision questions. Question 5 features cloze verb forms (4 marks), prepositions (4 marks), sentence synthesis (4 marks), and transformation with strict constraint beginnings (8 marks).',
        status: 'SOURCE-BASED',
        citation: 'CISCE ICSE English Language Regulations & Specimen Paper 1 (2026)',
      },
      cambridge: {
        description: 'Text-grounded communicative and analytical tasks. Grammar assessed via stylistic choice in writing and authorial effect analysis in reading texts.',
        status: 'SOURCE-BASED',
        citation: 'Cambridge Checkpoint English Framework 0861, Paper 1 & 2',
      },
    },
    {
      id: 'grammar_explicitness',
      title: 'Grammar Explicitness & Nomenclature',
      cbse: {
        description: 'Moderate. Prescribes functional syllabus areas (Tenses, Modals, Concord, Reported Speech, Determiners) but avoids pedantic parsing or Latinate structural labeling in prompts.',
        status: 'SOURCE-BASED',
        citation: 'NCERT Learning Outcomes for Secondary Stage & CBSE 184',
      },
      cisce: {
        description: 'High. Demands exact command of formal syntactic terminology (finite vs non-finite verbs, subordinating conjunctions, voice, mood, degrees of comparison).',
        status: 'SOURCE-BASED',
        citation: 'CISCE Regulations & Guidelines for English Paper 1',
      },
      cambridge: {
        description: 'Functional / Rhetorical. Focuses on how linguistic choices shape tone, register, pace, and audience engagement rather than testing nomenclature in isolation.',
        status: 'SOURCE-BASED',
        citation: 'CAIE English Syllabus Aims & Assessment Objectives',
      },
    },
    {
      id: 'transformation_rules',
      title: 'Sentence Transformation Rules',
      cbse: {
        description: 'Primarily reported speech dialogue transformations or error corrections embedded in contextual dialogues or brief letters.',
        status: 'SOURCE-BASED',
        citation: 'CBSE Class 10 Board Marking Schemes (2023, 2024)',
      },
      cisce: {
        description: 'Strict constraint transformations: candidates must rewrite the sentence beginning with specified words without changing meaning; any omission or uninstructed alteration incurs mark penalties.',
        status: 'SOURCE-BASED',
        citation: 'ICSE Examination Marking Instructions Paper 1 Question 5(iv)',
      },
      cambridge: {
        description: 'Varied clause manipulation within extended drafting. Learners alter active/passive voice or sentence length to achieve specific reader impact.',
        status: 'SOURCE-BASED',
        citation: 'CAIE Scheme of Work: Lower Secondary English Stage 9',
      },
    },
    {
      id: 'marking_approach',
      title: 'Marking Approach & Strictness',
      cbse: {
        description: 'Positive marking philosophy. Minor slip-ups in handwriting or non-target mechanics may not penalize if the target grammatical concord is evident.',
        status: 'EDITORIAL ANALYSIS',
        citation: 'VERITAS Editorial Board Analysis of CBSE Evaluator Guidelines',
      },
      cisce: {
        description: 'Zero-tolerance for spelling errors in key grammatical inflections. Exact syntactic compliance required; tense shifts or agreement errors award 0 marks for that item.',
        status: 'EDITORIAL ANALYSIS',
        citation: 'VERITAS Editorial Board Analysis of CISCE Examiner Reports',
      },
      cambridge: {
        description: 'Level-based analytic rubrics. Credit awarded along a continuum of accuracy, range of structures, and purposeful stylistic control.',
        status: 'SOURCE-BASED',
        citation: 'CAIE Standard Mark Scheme & Assessment Criteria',
      },
    },
    {
      id: 'reading_writing_integration',
      title: 'Reading & Writing Integration',
      cbse: {
        description: 'Grammar is tested in Section B (Grammar & Creative Writing). Often contextualized around school or civic topics.',
        status: 'SOURCE-BASED',
        citation: 'CBSE 184 Paper Structure (Reading 20m, Writing & Grammar 20m, Lit 40m)',
      },
      cisce: {
        description: 'Grammar forms the climax of Paper 1 (Question 5) following Composition (Q1), Letter (Q2), Notice/Email (Q3), and Unseen Comprehension (Q4).',
        status: 'SOURCE-BASED',
        citation: 'ICSE Syllabus 2026 Paper 1 Architecture',
      },
      cambridge: {
        description: 'Full integration. Paper 1 (Non-Fiction) and Paper 2 (Fiction) each combine reading comprehension, grammar in context, and directed writing.',
        status: 'SOURCE-BASED',
        citation: 'Cambridge Checkpoint 0861 Component Specifications',
      },
    },
    {
      id: 'cognitive_distribution',
      title: 'Cognitive Demand Distribution (Bloom)',
      cbse: {
        description: 'Heavy emphasis on Applying (60%), Understanding (25%), and Analysing (15%) per NCF-SE competency-based assessment guidelines.',
        status: 'EDITORIAL ANALYSIS',
        citation: 'NEP 2020 / NCF-SE 2023 Competency Framework Evaluation',
      },
      cisce: {
        description: 'High concentration on Applying (50%) and Analysing syntactic structures (35%), with precision Remembering of grammatical forms (15%).',
        status: 'EDITORIAL ANALYSIS',
        citation: 'CISCE Examination Matrix Editorial Review',
      },
      cambridge: {
        description: 'Balanced between Understanding (25%), Analysing authorial intent (35%), and Creating / Synthesizing in response to stimuli (40%).',
        status: 'SOURCE-BASED',
        citation: 'CAIE Assessment Objectives AO1, AO2, AO3 Weightage Matrix',
      },
    },
  ];

  return (
    <div id="three-system-comparison-view" className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* MANDATORY PROMINENT ACADEMIC DISCLAIMER BANNER */}
      <div className="p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/90 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-2 shadow-xs">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-sm font-mono font-black uppercase tracking-wider">
            EDITORIAL COMPARISON — NOT OFFICIAL EQUIVALENCE
          </h2>
        </div>
        <p className="text-xs leading-relaxed font-sans">
          This comparative analysis is conducted strictly for educational resource planning and textbook sequencing. <strong>Cambridge stages represent distinct developmental progression frameworks and must NOT be conflated with Indian standard Class/Grade equivalents.</strong> Assessment cultures, grading criteria, and qualification frameworks differ fundamentally across jurisdictions.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              Grammar &amp; Language Assessment Approaches Across Three Systems
            </h3>
          </div>
          <span className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-mono">
            6 Core Assessment Dimensions Evaluated
          </span>
        </div>

        <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] font-serif">
                  <th className="py-3.5 px-4 w-1/5 font-bold">Assessment Dimension</th>
                  <th className="py-3.5 px-4 w-1/4 font-bold border-l border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-mono text-[10px] font-bold">
                        CBSE
                      </span>
                      <span>Central Board (India)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-1/4 font-bold border-l border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-mono text-[10px] font-bold">
                        CISCE
                      </span>
                      <span>ICSE / ISC (India)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-1/4 font-bold border-l border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-mono text-[10px] font-bold">
                        CAMBRIDGE
                      </span>
                      <span>CAIE (International)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#4d2b3b]/50">
                {comparisonAspects.map((aspect) => (
                  <tr key={aspect.id} className="hover:bg-stone-50/50 dark:hover:bg-slate-900/30">
                    <td className="py-4 px-4 align-top font-semibold text-[#292521] dark:text-[#F6F0E7]">
                      {aspect.title}
                    </td>

                    {/* CBSE Column */}
                    <td className="py-4 px-4 align-top border-l border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 space-y-2">
                      <p className="text-xs text-[#292521] dark:text-[#EDE4D6] leading-relaxed">
                        {aspect.cbse.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#71685E] dark:text-[#c9b9a6] truncate max-w-[140px]" title={aspect.cbse.citation}>
                          {aspect.cbse.citation}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                            aspect.cbse.status === 'SOURCE-BASED'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {aspect.cbse.status}
                        </span>
                      </div>
                    </td>

                    {/* CISCE Column */}
                    <td className="py-4 px-4 align-top border-l border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 space-y-2">
                      <p className="text-xs text-[#292521] dark:text-[#EDE4D6] leading-relaxed">
                        {aspect.cisce.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#71685E] dark:text-[#c9b9a6] truncate max-w-[140px]" title={aspect.cisce.citation}>
                          {aspect.cisce.citation}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                            aspect.cisce.status === 'SOURCE-BASED'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {aspect.cisce.status}
                        </span>
                      </div>
                    </td>

                    {/* Cambridge Column */}
                    <td className="py-4 px-4 align-top border-l border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 space-y-2">
                      <p className="text-xs text-[#292521] dark:text-[#EDE4D6] leading-relaxed">
                        {aspect.cambridge.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#71685E] dark:text-[#c9b9a6] truncate max-w-[140px]" title={aspect.cambridge.citation}>
                          {aspect.cambridge.citation}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                            aspect.cambridge.status === 'SOURCE-BASED'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {aspect.cambridge.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
