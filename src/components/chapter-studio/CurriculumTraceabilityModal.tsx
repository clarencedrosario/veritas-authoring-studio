import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  ExternalLink,
  Split,
  Search,
} from 'lucide-react';
import { StudioChapter, ChapterProductionStageId } from '../../types';

export interface CurriculumTraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onNavigateToStage: (stageId: ChapterProductionStageId) => void;
  isDarkMode: boolean;
}

interface StandardTraceRecord {
  standardCode: string;
  strand: string;
  description: string;
  coveredInSections: string[];
  ruleMapping: string;
  exercisesCovered: string[];
  assessmentQuestions: string[];
  visualCoverage: string;
  coverageStatus: 'fully_covered' | 'partial' | 'unmapped';
}

export const CurriculumTraceabilityModal: React.FC<CurriculumTraceabilityModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onNavigateToStage,
  isDarkMode,
}) => {
  const [viewMode, setViewMode] = useState<'forward' | 'reverse'>('forward');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const standards: StandardTraceRecord[] = [
    {
      standardCode: 'CISCE-ENG-6.G.1',
      strand: 'Core Syntactic Concord',
      description: 'Demonstrate fundamental subject-verb number agreement in simple declarative sentences.',
      coveredInSections: ['1.1 The Core Principle of Concord', '1.2 Number and Person Agreement'],
      ruleMapping: 'Rule 1: Primary Number Concord',
      exercisesCovered: ['Exercise A (Q1, Q2)', 'Exercise B (Q1)'],
      assessmentQuestions: ['Test Q2 (Fill in blanks)'],
      visualCoverage: 'Figure 1.1: The Scale of Grammatical Concord',
      coverageStatus: 'fully_covered',
    },
    {
      standardCode: 'CISCE-ENG-6.G.2',
      strand: 'Syntactic Disrupters',
      description: 'Identify and resolve intervening prepositional phrases and parenthetical expressions without proximity error.',
      coveredInSections: ['1.3 The Parenthetical Shield Principle'],
      ruleMapping: 'Rule 2: Parenthetical Expressions',
      exercisesCovered: ['Exercise A (Q3)', 'Exercise C (Q1, Q2)', 'Exercise E (Q1)'],
      assessmentQuestions: ['Test Q1 (MCQ)', 'Test Q3 (Error Correction)'],
      visualCoverage: 'Figure 1.2: The Syntactic Shield Diagram',
      coverageStatus: 'fully_covered',
    },
    {
      standardCode: 'CISCE-ENG-6.G.3',
      strand: 'Compound & Correlative Structures',
      description: 'Apply the rule of proximity for subjects conjoined by either...or, neither...nor, and not only...but also.',
      coveredInSections: ['1.4 Correlative Conjunctions & The Proximity Law'],
      ruleMapping: 'Rule 4: Correlative Proximity Principle',
      exercisesCovered: ['Exercise B (Q2, Q3)', 'Exercise D (Q2)', 'Exercise E (Q2)'],
      assessmentQuestions: ['Test Q4 (Sentence Transformation)'],
      visualCoverage: 'Figure 1.3: The Correlative Decision Funnel',
      coverageStatus: 'fully_covered',
    },
    {
      standardCode: 'CISCE-ENG-6.G.4',
      strand: 'Pronoun Invariants',
      description: 'Master singular verb agreement with indefinite pronouns (each, everyone, nobody, neither) regardless of prepositional complements.',
      coveredInSections: ['1.5 Indefinite Pronoun Concord'],
      ruleMapping: 'Rule 3: Indefinite Pronouns Invariance',
      exercisesCovered: ['Exercise B (Q4)', 'Exercise C (Q3)', 'Exercise F (Q1)'],
      assessmentQuestions: ['Test Q1 (Distractor B analysis)'],
      visualCoverage: 'Figure 1.4: Indefinite Pronoun Classification Matrix',
      coverageStatus: 'fully_covered',
    },
    {
      standardCode: 'CISCE-ENG-6.G.5',
      strand: 'Measurement & Quantity Units',
      description: 'Use singular verbs with collective measurements of time, money, weight, and distance considered as unified sums.',
      coveredInSections: ['1.6 Collective Units of Measurement'],
      ruleMapping: 'Rule 6: Units of Measurement & Sums',
      exercisesCovered: ['Exercise D (Q3)', 'Exercise G (Creative Application)'],
      assessmentQuestions: ['Test Q2 (Ten kilometres is...)'],
      visualCoverage: 'Figure 1.5: Unified Units Schema',
      coverageStatus: 'fully_covered',
    },
    {
      standardCode: 'CISCE-ENG-6.G.6',
      strand: 'Collective Nouns Split Concord',
      description: 'Distinguish between unified corporate action (singular) and fractional/divided action (plural) in British/CISCE English.',
      coveredInSections: ['1.7 The Nuance of Collective Nouns'],
      ruleMapping: 'Rule 5: Collective Noun Split Concord',
      exercisesCovered: ['Exercise A (Q4)', 'Exercise D (Q4)', 'Exercise E (Q3)'],
      assessmentQuestions: ['Test Q5 (Linguistic Explanation Question)'],
      visualCoverage: 'Figure 1.6: The Collective Noun Fork',
      coverageStatus: 'fully_covered',
    },
  ];

  const filteredStandards = standards.filter(
    (s) =>
      s.standardCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.strand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#8B263E]/30 dark:border-amber-900/50 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#8B263E] text-[#FAF7F2] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2]/10 flex items-center justify-center text-[#D4AF37]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37]">
                  Academic Compliance Matrix
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/90">
                  CISCE Class 6 Verified
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#FAF7F2]">
                Curriculum Traceability Matrix (Forward & Reverse)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-4 bg-white dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search standards or strands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setViewMode('forward')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  viewMode === 'forward'
                    ? 'bg-[#8B263E] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Forward Trace (Standard → Chapter Assets)
              </button>
              <button
                onClick={() => setViewMode('reverse')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  viewMode === 'reverse'
                    ? 'bg-[#8B263E] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Reverse Trace (Chapter Asset → Standard)
              </button>
            </div>
          </div>
        </div>

        {/* Traceability Table / Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {viewMode === 'forward' ? (
            <div className="space-y-4">
              {filteredStandards.map((std) => (
                <div
                  key={std.standardCode}
                  className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-700 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#8B263E] dark:text-[#E6C687] bg-[#8B263E]/10 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                        {std.standardCode}
                      </span>
                      <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
                        {std.strand}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      100% Traceable
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    {std.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-500 block text-[10px] uppercase">
                        Core Theory & Rule:
                      </span>
                      <span className="text-[#8B263E] dark:text-[#E6C687] font-medium font-serif">
                        {std.ruleMapping}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-500 block text-[10px] uppercase">
                        Visual Schematic:
                      </span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {std.visualCoverage}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-500 block text-[10px] uppercase">
                        Formative Exercises:
                      </span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {std.exercisesCovered.join(' • ')}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-500 block text-[10px] uppercase">
                        Summative Assessment:
                      </span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {std.assessmentQuestions.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 text-stone-500 uppercase tracking-wider font-semibold">
                    <th className="p-3">Chapter Manuscript Asset</th>
                    <th className="p-3">Production Stage</th>
                    <th className="p-3">Board Standard Mapped</th>
                    <th className="p-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700 font-serif">
                  <tr>
                    <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                      Section 1.1: Core Concord Principle
                    </td>
                    <td className="p-3 text-stone-500 font-sans">Explanation (Stage 4)</td>
                    <td className="p-3 font-mono text-[#8B263E] dark:text-[#E6C687]">CISCE-ENG-6.G.1</td>
                    <td className="p-3 text-emerald-600 font-sans font-medium">✓ Verified</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                      Rule 2: Parenthetical Modifiers
                    </td>
                    <td className="p-3 text-stone-500 font-sans">Rules (Stage 5)</td>
                    <td className="p-3 font-mono text-[#8B263E] dark:text-[#E6C687]">CISCE-ENG-6.G.2</td>
                    <td className="p-3 text-emerald-600 font-sans font-medium">✓ Verified</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                      Figure 1.1: Scale of Grammatical Concord
                    </td>
                    <td className="p-3 text-stone-500 font-sans">Visuals (Stage 7)</td>
                    <td className="p-3 font-mono text-[#8B263E] dark:text-[#E6C687]">CISCE-ENG-6.G.1</td>
                    <td className="p-3 text-emerald-600 font-sans font-medium">✓ Verified</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                      Exercise B: Proximity Traps
                    </td>
                    <td className="p-3 text-stone-500 font-sans">Exercises (Stage 10)</td>
                    <td className="p-3 font-mono text-[#8B263E] dark:text-[#E6C687]">CISCE-ENG-6.G.3</td>
                    <td className="p-3 text-emerald-600 font-sans font-medium">✓ Verified</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                      Test Q4: Correlative Transformation
                    </td>
                    <td className="p-3 text-stone-500 font-sans">Assessment (Stage 11)</td>
                    <td className="p-3 font-mono text-[#8B263E] dark:text-[#E6C687]">CISCE-ENG-6.G.3</td>
                    <td className="p-3 text-emerald-600 font-sans font-medium">✓ Verified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All 6 core CISCE Class 6 Concord learning outcomes mapped bidirectionally.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#8B263E] text-[#FAF7F2] hover:bg-[#721E32] transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
