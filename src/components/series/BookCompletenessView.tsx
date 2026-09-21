import React, { useState } from 'react';
import {
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Layers,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  BookProject,
  ClassCurriculumBook,
  MasterGrammarConcept,
  SpiralCurriculumMatrix,
  ReadinessCategoryScore,
  ReadinessVerificationStatus,
} from '../../types';
import { calculateBookReadiness } from '../../utils/bookProjectUtils';

interface BookCompletenessViewProps {
  project: BookProject;
  book?: ClassCurriculumBook;
  masterConcepts?: MasterGrammarConcept[];
  curriculumMatrix?: SpiralCurriculumMatrix;
  onUpdateProjectReadiness: (report: any) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const BookCompletenessView: React.FC<BookCompletenessViewProps> = ({
  project,
  book,
  masterConcepts,
  onUpdateProjectReadiness,
  onNavigateToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReadinessCategoryScore | null>(null);

  // Generate or read cached readiness
  const report =
    project.readiness || calculateBookReadiness(project, book, masterConcepts);

  const handleRecalculate = () => {
    const updated = calculateBookReadiness(project, book, masterConcepts);
    onUpdateProjectReadiness(updated);
  };

  const getVerificationBadge = (status: ReadinessVerificationStatus) => {
    switch (status) {
      case 'Internally Verified':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Mapped':
        return 'bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      case 'Needs Academic Review':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Potential Gap':
        return 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Not Checked':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const getStatusBadge = (status: ReadinessCategoryScore['status']) => {
    switch (status) {
      case 'Complete':
      case 'Verified':
        return 'bg-emerald-600 text-white';
      case 'In Progress':
        return 'bg-[#C29A52] text-white';
      case 'Needs Review':
        return 'bg-amber-600 text-white';
      case 'Missing':
        return 'bg-rose-600 text-white';
    }
  };

  return (
    <div id="book-completeness-dashboard" className="space-y-6">
      {/* Top Banner with Overall Book Readiness Gauge */}
      <div className="bg-gradient-to-r from-[#5A1832] via-[#431225] to-[#2B0B18] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C29A52]/30">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C29A52] text-slate-950 font-serif">
              Readiness Engine
            </span>
            <span className="text-xs text-[#E6C994]/80">
              Audit Date: {new Date(report.lastAudited).toLocaleDateString()}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold tracking-tight text-[#FAF8F2]">
            Book Readiness & Completeness Score
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed">
            Multi-stage audit assessing curriculum alignment, editorial depth, exercise scaffolding,
            and prepress readiness for <span className="font-semibold text-[#E6C994]">{project.bookTitle}</span> ({project.board} {project.classOrStage}).
          </p>

          <div className="pt-2 flex items-center space-x-4 text-xs text-slate-300">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {report.categories.filter((c) => c.status === 'Complete' || c.status === 'Verified').length}{' '}
                Stages Complete
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                {report.categories.filter((c) => c.status === 'In Progress').length} In Progress
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>
                {report.categories.filter((c) => c.status === 'Needs Review' || c.status === 'Missing').length}{' '}
                Needs Review
              </span>
            </div>
          </div>
        </div>

        {/* Big Circular Dial / Score Display */}
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-xs p-6 rounded-2xl border border-white/15 min-w-[200px]">
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/20"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - report.overallScore / 100)}
                strokeLinecap="round"
                className="text-[#E6C994] transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold font-serif text-[#FAF8F2]">
                {report.overallScore}%
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#E6C994] font-medium">
                Readiness
              </span>
            </div>
          </div>

          <button
            onClick={handleRecalculate}
            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C29A52] hover:bg-[#A8813C] text-slate-950 flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate Readiness</span>
          </button>
        </div>
      </div>

      {/* Notice on Academic Verification Terminology */}
      <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p>
          <strong className="font-semibold">Academic Verification Standard:</strong> Veritas utilizes rigorous internal verification benchmarks (<span className="font-mono text-[11px]">Mapped</span>, <span className="font-mono text-[11px]">Internally Verified</span>, <span className="font-mono text-[11px]">Needs Academic Review</span>). We strictly avoid unauthorized claims of official board endorsement.
        </p>
      </div>

      {/* 14 Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {report.categories.map((cat) => (
          <div
            key={cat.category}
            onClick={() => setSelectedCategory(cat)}
            className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-[#C29A52]/60 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
                  {cat.category}
                </h4>
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(
                      cat.status
                    )}`}
                  >
                    {cat.status}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                    {cat.percent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.percent >= 80
                      ? 'bg-emerald-600'
                      : cat.percent >= 50
                      ? 'bg-[#C29A52]'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {cat.notes}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span
                className={`px-2 py-0.5 rounded-md border font-medium text-[10px] ${getVerificationBadge(
                  cat.verificationStatus
                )}`}
              >
                {cat.verificationStatus}
              </span>
              <span className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center space-x-0.5">
                <span>Details</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Category Detail Drawer/Modal */}
      {selectedCategory && (
        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                {selectedCategory.category} Breakdown
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#5A1832] text-[#E6C994] font-bold">
                {selectedCategory.percent}% Complete
              </span>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {selectedCategory.details}
          </p>
          <div className="flex items-center space-x-3 pt-1">
            <span
              className={`px-2.5 py-1 rounded-md text-xs border font-semibold ${getVerificationBadge(
                selectedCategory.verificationStatus
              )}`}
            >
              Verification: {selectedCategory.verificationStatus}
            </span>
            {onNavigateToTab && (
              <button
                onClick={() => {
                  if (selectedCategory.category.includes('Authoring')) onNavigateToTab('chapter_studio');
                  else if (selectedCategory.category.includes('Mapping')) onNavigateToTab('curriculum_mapping');
                  else if (selectedCategory.category.includes('Exercise')) onNavigateToTab('question_bank');
                  else if (selectedCategory.category.includes('Assessment')) onNavigateToTab('assessment_builder');
                  else if (selectedCategory.category.includes('Layout')) onNavigateToTab('textbook_exporter');
                }}
                className="text-xs text-[#5A1832] dark:text-[#E6C994] font-semibold hover:underline flex items-center space-x-1"
              >
                <span>Open relevant studio</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
