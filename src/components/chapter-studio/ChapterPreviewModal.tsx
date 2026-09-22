import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  X,
  Printer,
  Eye,
  GraduationCap,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Check,
  HelpCircle,
  Sparkles,
  Layers,
  Info,
  ShieldCheck,
  Clock,
  Bookmark,
  Target,
  ChevronRight,
  Hash,
  Database,
  Cpu,
  Key,
} from 'lucide-react';
import { StudioChapter } from '../../types';
import { TextbookMarkdown } from '../common/TextbookMarkdown';
import {
  sanitizeChapterDataIntegrity,
  normalizeExerciseTitle,
  cleanExerciseSubtitleOnly,
} from '../../utils/dataIntegrityGuard';

interface ChapterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  isDarkMode: boolean;
}

export const ChapterPreviewModal: React.FC<ChapterPreviewModalProps> = ({
  isOpen,
  onClose,
  chapter: rawChapter,
  isDarkMode,
}) => {
  const [previewMode, setPreviewMode] = useState<'student' | 'teacher' | 'manuscript'>('student');

  // Lock body scroll and listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Enforce runtime data integrity and chapter domain isolation across all preview modes
  const chapter = useMemo(() => {
    if (!rawChapter) return rawChapter;
    return sanitizeChapterDataIntegrity(rawChapter, rawChapter.id).chapter;
  }, [rawChapter]);

  // Helper to format exercise titles cleanly without duplicating "Exercise A: Exercise A:"
  const formatExerciseTitle = (title: string, letter: string) => {
    return normalizeExerciseTitle(title, letter);
  };

  // Helper to deduplicate question items inside an exercise
  const getDeduplicatedQuestions = (questions: typeof chapter.exercises[0]['questions']) => {
    if (!questions || questions.length === 0) return [];
    const seen = new Set<string>();
    return questions.filter((q) => {
      const rawKey = (q.prompt || q.blanksSentence || q.originalSentence || q.id || '').trim();
      if (!rawKey) return true;
      if (seen.has(rawKey)) return false;
      seen.add(rawKey);
      return true;
    });
  };

  const revision = chapter?.revisionData;
  const ending = chapter?.ending;

  // Sourced strictly from canonical architecture component data (Task 8)
  const hasAuthoredSummary = Boolean(
    (revision?.rulesAtAGlance && revision.rulesAtAGlance.length > 0) ||
    (ending?.rulesRecap && ending.rulesRecap.length > 0) ||
    (ending?.rulesAtAGlance && ending.rulesAtAGlance.length > 0) ||
    (ending?.whatYouLearned && ending.whatYouLearned.length > 0)
  );

  if (!isOpen || !chapter) return null;

  // Compute total questions count across exercises
  const totalQuestionsCount = (chapter.exercises || []).reduce(
    (acc, ex) => acc + (ex.questions ? ex.questions.length : 0),
    0
  );

  return createPortal(
    <div
      id="textbook-preview-modal-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5 md:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="textbook-preview-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
        className="w-full max-w-5xl xl:max-w-6xl h-[94vh] max-h-[960px] rounded-2xl shadow-2xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Top Preview Toolbar */}
        <div className="p-3.5 sm:px-5 border-b border-[#CBBEAC] bg-[#EDE4D6] flex flex-wrap items-center justify-between shrink-0 shadow-xs gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-lg bg-[#5A1832] text-[#FFFDF8] shrink-0">
              <BookOpen className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="font-bold uppercase tracking-wider text-[#5A1832]">
                  {chapter.seriesTitle || chapter.bookTitle || 'Classical Grammar: ICSE English'}
                </span>
                <span className="text-[#CBBEAC]">•</span>
                <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-[#FFFDF8] text-[#5A1832] border border-[#CBBEAC]">
                  {chapter.systemId || chapter.curriculumBoard || 'CISCE'}
                </span>
                <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-[#FFFDF8] text-[#71685E] border border-[#CBBEAC]">
                  {chapter.equivalentClass || 'Class 6'}
                </span>
                <span className="text-[#CBBEAC]">•</span>
                <span className="px-1.5 py-0.5 rounded font-sans font-semibold bg-[#5A1832]/10 text-[#5A1832]">
                  {previewMode === 'student' ? 'Student Edition' : previewMode === 'teacher' ? 'Teacher Edition' : 'Manuscript'}
                </span>
              </div>
              <h3 id="preview-modal-title" className="font-bold text-sm sm:text-base text-[#292521] truncate mt-0.5 font-serif">
                Chapter {chapter.chapterNumber || 1} • {chapter.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl p-1 bg-[#F6F0E7] border border-[#CBBEAC] text-xs font-semibold">
              <button
                type="button"
                id="btn-preview-mode-student"
                onClick={() => setPreviewMode('student')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  previewMode === 'student'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Student Edition</span>
                <span className="sm:hidden">Student</span>
              </button>
              <button
                type="button"
                id="btn-preview-mode-teacher"
                onClick={() => setPreviewMode('teacher')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  previewMode === 'teacher'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Teacher Edition</span>
                <span className="sm:hidden">Teacher</span>
              </button>
              <button
                type="button"
                id="btn-preview-mode-manuscript"
                onClick={() => setPreviewMode('manuscript')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  previewMode === 'manuscript'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manuscript</span>
                <span className="sm:hidden">Draft</span>
              </button>
            </div>

            <button
              type="button"
              id="btn-preview-print"
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] hover:bg-[#EDE4D6] text-[#292521] cursor-pointer"
              title="Print preview"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="btn-close-textbook-preview"
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] transition-colors font-semibold text-xs shadow-xs cursor-pointer"
              title="Close Preview (Esc)"
              aria-label="Close Preview"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#F6F0E7]">
          {/* ========================================================================= */}
          {/* 1. STUDENT EDITION OR 2. TEACHER EDITION (Textbook Publishing Simulations) */}
          {/* ========================================================================= */}
          {previewMode !== 'manuscript' && (
            <div className="w-full max-w-3xl rounded-2xl shadow-xl p-8 sm:p-12 space-y-8 font-serif bg-[#FFFDF8] text-[#292521] border border-[#CBBEAC]">
              {/* Teacher Edition Master Header Banner (Teacher Mode Only) */}
              {previewMode === 'teacher' && (
                <div className="p-4 rounded-xl bg-purple-900 text-[#FFFDF8] font-sans shadow-md space-y-1.5 border-2 border-[#C29A52]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-[#C29A52]" />
                      <span className="font-bold text-xs uppercase tracking-widest text-[#C29A52]">
                        Teacher Master Edition • Annotated Instructor Text
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-800 text-[10px] font-mono uppercase font-semibold">
                      Board: {chapter.systemId || chapter.curriculumBoard || 'CBSE'}
                    </span>
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed font-normal">
                    This annotated edition provides classroom instructional strategies, complete exercise answer keys with grammatical rationales, common learner misconception alerts, and formative diagnostic prompts.
                  </p>
                </div>
              )}

              {/* Running Header */}
              <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-widest text-[#71685E] border-b border-[#CBBEAC] pb-3">
                <span>{chapter.systemId || chapter.curriculumBoard || 'CBSE'} English Grammar • {chapter.equivalentClass}</span>
                <span>
                  Chapter {chapter.chapterNumber || 1}: {chapter.title}
                </span>
              </div>

              {/* Chapter Header Box */}
              <div className="space-y-4 font-sans">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#5A1832]/10 text-[#5A1832]">
                  Chapter {chapter.chapterNumber || 1} • {chapter.category || 'Grammar'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight leading-tight text-[#292521]">
                  {chapter.title}
                </h1>
                {chapter.subtitle && (
                  <p className="text-sm sm:text-base text-[#71685E] font-sans leading-relaxed">
                    {chapter.subtitle}
                  </p>
                )}

                {/* Opening Hook */}
                {chapter.opening?.openingHook && (
                  <div className="p-4 rounded-xl border-l-4 border-[#C29A52] bg-[#EDE4D6]/50 font-serif italic text-sm text-[#292521] leading-relaxed">
                    &ldquo;{chapter.opening.openingHook}&rdquo;
                  </div>
                )}

                {/* Short Introduction */}
                {chapter.opening?.shortIntroduction && (
                  <p className="text-sm font-serif text-[#292521] leading-relaxed">
                    {chapter.opening.shortIntroduction}
                  </p>
                )}

                {/* Learning Objectives Box (Component 2) */}
                {chapter.opening?.learningObjectives && chapter.opening.learningObjectives.length > 0 && (
                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] font-sans space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A1832]">
                      Learning Objectives &amp; Competencies
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#292521]">
                      {chapter.opening.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-[#C29A52] font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Teacher Annotation for Component 2 */}
                    {previewMode === 'teacher' && (
                      <div className="mt-3 pt-2.5 border-t border-[#CBBEAC]/60 bg-[#EDE4D6]/70 p-3 rounded-lg text-xs space-y-1 text-[#292521]">
                        <span className="font-bold text-[#5A1832] flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#5A1832]" />
                          <span>TEACHER ANNOTATION • Curriculum Mapping &amp; Cognitive Progression</span>
                        </span>
                        <p className="font-serif leading-relaxed text-[#292521] text-[11px]">
                          Objectives 1–2 target foundational recall and structural identification; Objectives 3–4 target syntactic application across simple and expanded subjects; Objectives 5–6 target error diagnosis and sentence synthesis as mandated by CISCE Class 6 benchmarks.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Component 3: Warm-Up & Diagnostic Starter */}
                {(chapter.opening?.warmUpActivity || chapter.opening?.priorKnowledge) && (
                  <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-4 font-sans">
                    <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A1832]">
                          Warm-Up • Diagnostic Starter
                        </span>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#292521]">
                          The Sentence Repair Workshop (2-Minute Diagnostic Starter)
                        </h3>
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {chapter.opening?.priorKnowledge && (
                      <div className="p-3 rounded-xl bg-[#EDE4D6]/50 border border-[#CBBEAC]/60 text-xs font-serif space-y-1 text-[#292521]">
                        <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#5A1832] block">
                          Prerequisites for CISCE Class 6
                        </span>
                        <div className="whitespace-pre-line leading-relaxed text-[#292521]">
                          {chapter.opening.priorKnowledge}
                        </div>
                      </div>
                    )}

                    {/* Diagnostic Activity */}
                    {chapter.opening?.warmUpActivity && (
                      <div className="text-xs sm:text-sm font-serif leading-relaxed text-[#292521] whitespace-pre-line">
                        {chapter.opening.warmUpActivity}
                      </div>
                    )}

                    {/* Teacher-Only Master Annotations for Component 3 */}
                    {previewMode === 'teacher' && (
                      <div className="mt-4 pt-3 border-t-2 border-dashed border-[#C29A52] bg-[#EDE4D6]/80 p-4 rounded-xl space-y-3 text-xs">
                        <div className="flex items-center gap-1.5 text-[#5A1832] font-bold uppercase tracking-wider text-[11px]">
                          <Bookmark className="w-4 h-4 text-[#5A1832]" />
                          <span>Teacher Edition Commentary • Diagnostic Solutions &amp; Misconceptions</span>
                        </div>
                        <div className="space-y-2 text-[#292521]">
                          <div>
                            <span className="font-bold text-[#5A1832] block">Suggested Diagnostic Responses:</span>
                            <ul className="list-disc list-inside space-y-0.5 font-serif text-[11px]">
                              <li><strong>Pair A:</strong> (a) is correct. <em>Whistle</em> is a singular third-person subject; takes singular verb <em>blows</em>.</li>
                              <li><strong>Pair B:</strong> (b) is correct. <em>Squirrels</em> is plural; takes base plural verb <em>chase</em>.</li>
                              <li><strong>Pair C:</strong> (b) is correct. <em>Players</em> is the true plural subject; takes <em>are</em>. The noun <em>field</em> is merely the object of the preposition <em>on</em>.</li>
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-[#5A1832] block">Key Learner Misconceptions to Intercept:</span>
                            <p className="font-serif leading-relaxed text-[11px]">
                              <strong>1. Proximity Trap:</strong> In Pair C, students frequently choose <em>is</em> because <em>field</em> sits directly next to the verb slot. Instruct students to draw mental brackets around [on the field] to reveal the true subject.<br />
                              <strong>2. The Double-S Fallacy:</strong> In Pair B, students often believe that because <em>squirrels</em> has an &apos;-s&apos;, the verb must also have an &apos;-s&apos; (<em>chases</em>). Clarify that noun plurals take &apos;-s&apos;, whereas present verbs take &apos;-s&apos; for <em>singular</em> subjects.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* COMP-04: Concept Introduction & Discovery Vignette */}
                {(() => {
                  const vignette =
                    chapter.opening?.discoveryVignette ||
                    chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'text')?.textContent ||
                    '';
                  const questions =
                    chapter.opening?.discoveryQuestions ||
                    chapter.opening?.discoveryQuestion ||
                    chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'try_this')?.textContent ||
                    '';

                  if (!vignette && !questions) return null;

                  return (
                    <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-4 font-sans">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A1832]">
                            Concept Introduction • Discovery Scenario
                          </span>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#292521]">
                            Contextual Discovery &amp; Linguistic Inquiry
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                          COMP-04
                        </span>
                      </div>

                      {/* Vignette narrative / scenario */}
                      {vignette && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-[#5A1832] block">
                            Authentic Reading Scenario
                          </span>
                          <div className="p-4 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]/70 text-xs sm:text-sm font-serif leading-relaxed text-[#292521] whitespace-pre-line">
                            {vignette}
                          </div>
                        </div>
                      )}

                      {/* Student Discovery Questions (Notice & Inquire) */}
                      {questions && (
                        <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#C29A52]/60 space-y-2">
                          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#5A1832] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                            <span>Notice &amp; Inquire: Guided Discovery Questions</span>
                          </h4>
                          <div className="text-xs sm:text-sm font-serif leading-relaxed text-[#292521] whitespace-pre-line">
                            {questions}
                          </div>
                        </div>
                      )}

                      {/* Teacher-Only Pedagogical Instructional Note */}
                      {previewMode === 'teacher' && (
                        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#C29A52] bg-[#EDE4D6]/80 p-4 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 text-[#5A1832] font-bold uppercase tracking-wider text-[11px]">
                            <GraduationCap className="w-4 h-4 text-[#5A1832]" />
                            <span>Teacher Edition Instructional Note • Intended Discovery Objective</span>
                          </div>
                          <p className="font-serif leading-relaxed text-[11px] text-[#292521]">
                            <strong>Discovery Objective:</strong> This scenario utilizes inductive learning to foster grammatical awareness before deductive rules are formulated. By following the dialogue between student editors, pupils notice that the true subject (<em>captain</em>) dictates the verb form (<em>has scored</em>) despite an intervening prepositional phrase (<em>of the school cricket team</em>). Instructors should guide students to identify the head noun first and test sentences with their auditory intuition before formalizing the concordance rule.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-05: Theoretical Content & Syntactic Analysis */}
                {(() => {
                  const c05 = chapter.component05;
                  const explanation = c05?.conceptualExplanation;
                  const analyses = Array.isArray(c05?.syntacticAnalysis) ? c05.syntacticAnalysis : [];
                  const conceptChecks = Array.isArray(c05?.conceptChecks) ? c05.conceptChecks : [];
                  const insight = c05?.linguisticInsight;
                  const teacherAnnotations = c05?.teacherAnnotations;
                  const wordCount = c05?.wordCount || (explanation ? explanation.trim().split(/\s+/).length : 0);

                  if (!explanation && analyses.length === 0 && conceptChecks.length === 0 && !insight) {
                    return null;
                  }

                  return (
                    <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-5 font-sans">
                      {/* Header */}
                      <div className="border-b border-[#CBBEAC]/60 pb-2 flex items-center justify-between flex-wrap gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A1832]">
                            Theoretical Content
                          </span>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#292521]">
                            Understanding {chapter.title || 'Subject–Verb Agreement'}
                          </h3>
                        </div>
                        {previewMode !== 'student' && (
                          <div className="flex items-center gap-2">
                            {wordCount > 0 && (
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                                wordCount >= 250 && wordCount <= 450
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-[#EDE4D6] text-[#5A1832] border-[#CBBEAC]'
                              }`}>
                                {wordCount} words {wordCount >= 250 && wordCount <= 450 ? '• Target Met' : ''}
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                              COMP-05
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 1. Conceptual Explanation */}
                      {explanation && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-[#5A1832] block">
                            Core Theoretical Explanation
                          </span>
                          <div className="p-4 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]/70 text-xs sm:text-sm font-serif leading-relaxed text-[#292521] whitespace-pre-line">
                            {explanation}
                          </div>
                        </div>
                      )}

                      {/* 2. Syntactic Analysis */}
                      {analyses.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-[#5A1832] block">
                            How the Sentence Works — Syntactic Analysis
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analyses.map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] space-y-2.5 text-xs shadow-2xs"
                              >
                                <div className="flex items-start justify-between gap-2 border-b border-[#CBBEAC]/50 pb-1.5">
                                  <div className="font-serif font-bold text-xs sm:text-sm text-[#292521]">
                                    &ldquo;{item.sentence}&rdquo;
                                  </div>
                                  {item.isContrastivePair && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold border border-purple-200 shrink-0">
                                      Contrastive
                                    </span>
                                  )}
                                </div>

                                {/* Tripartite Visual Structure Banner */}
                                {(item.subjectHeadNoun || item.interveningPhrase || item.verbPhrase) && (
                                  <div className="p-2 rounded-lg bg-[#EDE4D6]/60 border border-[#CBBEAC]/80 flex flex-wrap items-center gap-1 text-[10px] font-mono">
                                    <span className="px-1.5 py-0.5 rounded bg-[#5A1832] text-white font-bold" title="Governing Head Noun">
                                      [{item.subjectHeadNoun || 'HEAD NOUN'}]
                                    </span>
                                    {item.interveningPhrase && (
                                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-medium" title="Intervening Phrase (Ignored for agreement)">
                                        ({item.interveningPhrase})
                                      </span>
                                    )}
                                    <span className="text-[#C29A52] font-bold">⟶</span>
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold" title="Finite Verb (Agrees with Head Noun)">
                                      [{item.verbPhrase || 'VERB'}]
                                    </span>
                                  </div>
                                )}

                                <div className="space-y-1 text-[11px]">
                                  <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-[#71685E] font-medium">Head Noun:</span>
                                    <span className="font-bold text-[#5A1832] font-mono">{item.subjectHeadNoun}</span>
                                  </div>
                                  {item.expandedSubject && (
                                    <div className="flex items-baseline justify-between gap-2">
                                      <span className="text-[#71685E] font-medium">Expanded Subject:</span>
                                      <span className="font-serif text-[#292521] text-right">{item.expandedSubject}</span>
                                    </div>
                                  )}
                                  {item.interveningPhrase && (
                                    <div className="flex items-baseline justify-between gap-2">
                                      <span className="text-amber-900 font-medium">Intervening Phrase:</span>
                                      <span className="font-serif text-amber-950 text-right italic">{item.interveningPhrase}</span>
                                    </div>
                                  )}
                                  <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-[#71685E] font-medium">Verb Phrase:</span>
                                    <span className="font-bold text-[#5A1832] font-mono">{item.verbPhrase}</span>
                                  </div>
                                  <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-[#71685E] font-medium">Number &amp; Person:</span>
                                    <span className="font-mono text-[#292521]">
                                      {item.grammaticalNumber ? <span className="capitalize">{item.grammaticalNumber}</span> : 'singular'}
                                      {item.person ? ` • ${item.person}` : ' • 3rd person'}
                                    </span>
                                  </div>
                                  {item.agreementRelationship && (
                                    <div className="p-1.5 rounded bg-[#EDE4D6] text-[10px] font-mono text-[#5A1832] font-bold border border-[#CBBEAC]/60">
                                      {item.agreementRelationship}
                                    </div>
                                  )}
                                  {item.explanation && (
                                    <p className="text-[11px] text-[#292521] font-serif leading-relaxed pt-1 border-t border-[#CBBEAC]/30">
                                      {item.explanation}
                                    </p>
                                  )}
                                  {item.notes && (
                                    <p className="text-[10px] text-[#71685E] font-serif italic pt-1 border-t border-[#CBBEAC]/30">
                                      <strong>Note:</strong> {item.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Concept Checks (Pause & Think) */}
                      {conceptChecks.length > 0 && (
                        <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#C29A52]/60 space-y-2">
                          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#5A1832] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                            <span>Pause &amp; Think (Concept Checks)</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs sm:text-sm font-serif leading-relaxed text-[#292521]">
                            {conceptChecks.map((q, qIdx) => (
                              <li key={qIdx} className="flex items-start gap-2">
                                <span className="font-bold text-[#5A1832] font-mono shrink-0">{qIdx + 1}.</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 4. Language Insight */}
                      {insight && (
                        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 flex items-start gap-3">
                          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                            <Lightbulb className="w-4 h-4 text-amber-700" />
                          </div>
                          <div className="space-y-0.5 text-xs">
                            <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-amber-900 block">
                              Language Insight
                            </span>
                            <p className="font-serif italic text-amber-950 leading-relaxed">
                              &ldquo;{insight}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Teacher-Only Pedagogical Guidance */}
                      {previewMode === 'teacher' && (
                        <div className="mt-5 pt-4 border-t-2 border-dashed border-[#C29A52] bg-[#EDE4D6]/80 p-5 rounded-xl space-y-4 text-xs font-sans">
                          <div className="flex items-center justify-between border-b border-[#C29A52]/50 pb-2 flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-[#5A1832] font-bold uppercase tracking-wider text-xs">
                              <GraduationCap className="w-4 h-4 text-[#5A1832]" />
                              <span>Teacher Edition Pedagogical Guidance • COMP-05 Syntactic Instruction</span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-white text-[#5A1832] border border-[#CBBEAC]">
                              CISCE Class 6
                            </span>
                          </div>

                          {/* Teaching Focus */}
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#5A1832] block">
                              1. Core Instructional Focus &amp; Objective
                            </span>
                            <p className="font-serif leading-relaxed text-[11px] text-[#292521]">
                              {teacherAnnotations?.teachingFocus || (
                                <>
                                  Establish the foundational syntactic hierarchy: sentences require agreement between the <em>true structural head noun</em> and the <em>finite verb</em> in number and person. Guide pupils to isolate head nouns from surrounding descriptive prepositional phrases before determining verb concord.
                                </>
                              )}
                            </p>
                          </div>

                          {/* Terminology Guidance */}
                          {(teacherAnnotations?.terminologyGuidance || true) && (
                            <div className="space-y-1">
                              <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#71685E] block">
                                2. Terminology &amp; Conceptual Distinctions
                              </span>
                              <p className="font-serif leading-relaxed text-[11px] text-[#292521]">
                                {teacherAnnotations?.terminologyGuidance || (
                                  <>
                                    Clearly differentiate <em>head noun</em> (the central governing noun) from <em>intervening phrase</em> (modifiers that do not alter the subject&apos;s number). Use the term <em>concord</em> to denote grammatical harmony, reminding students that the third-person singular present tense requires the <em>-s/-es</em> inflection on verbs, unlike plural nouns.
                                  </>
                                )}
                              </p>
                            </div>
                          )}

                          {/* Common Misconceptions */}
                          <div className="space-y-1.5 p-3 rounded-lg bg-amber-50/80 border border-amber-300">
                            <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                              <span>3. Preempting Common Learner Misconceptions</span>
                            </span>
                            <ul className="space-y-1 text-[11px] font-serif text-amber-950 list-disc list-inside">
                              {(teacherAnnotations?.commonMisconceptions && teacherAnnotations.commonMisconceptions.length > 0)
                                ? teacherAnnotations.commonMisconceptions.map((mis, mIdx) => (
                                    <li key={mIdx}>{mis}</li>
                                  ))
                                : (
                                  <>
                                    <li><strong>Attraction to Proximity:</strong> Students naturally match the verb to the noun physically closest to it (e.g. matching the verb to &lsquo;team&rsquo; rather than &lsquo;captain&rsquo;).</li>
                                    <li><strong>Noun vs. Verb &lsquo;-s&rsquo; Inversion:</strong> Pupils frequently assume that a verb ending in <em>-s</em> is plural because nouns ending in <em>-s</em> are plural.</li>
                                  </>
                                )}
                            </ul>
                          </div>

                          {/* Blackboard Demonstration */}
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#5A1832] block">
                              4. Suggested Blackboard Demonstration
                            </span>
                            <div className="p-2.5 rounded bg-white border border-[#CBBEAC] font-mono text-[11px] text-[#5A1832] space-y-1">
                              {teacherAnnotations?.suggestedBoardExplanation ? (
                                <p className="font-serif text-[#292521] whitespace-pre-line">{teacherAnnotations.suggestedBoardExplanation}</p>
                              ) : (
                                <>
                                  <p className="font-bold text-[11px] text-[#292521]">Write on board and annotate with chalk:</p>
                                  <p className="text-xs">[The <span className="underline decoration-[#5A1832] decoration-2">captain</span>] (of the school cricket team) [<span className="underline decoration-emerald-700 decoration-2">has scored</span>] three centuries.</p>
                                  <p className="text-[10px] text-[#71685E] font-serif italic">Step 1: Put square brackets around the true subject head noun. Step 2: Put parentheses around intervening prepositional phrases to mentally isolate them. Step 3: Draw a bridging arrow connecting head noun to finite verb.</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Questioning Strategies & Diagnostic Checks */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                              <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#71685E] block">
                                5. Diagnostic Notebook Checks
                              </span>
                              <p className="font-serif text-[11px] text-[#292521] leading-relaxed">
                                {teacherAnnotations?.diagnosticObservations || (
                                  'During desk rounds, check whether pupils physically isolate the head noun before choosing auxiliary verbs. Watch for hesitation on collective phrases.'
                                )}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#71685E] block">
                                6. Extension for High-Achieving Pupils
                              </span>
                              <p className="font-serif text-[11px] text-[#292521] leading-relaxed">
                                {teacherAnnotations?.extensionSuggestions || (
                                  'Challenge pupils to write inverted sentences (e.g. "Behind the pavilion stands/stand the old banyan trees") or sentences with correlative conjunctions (neither... nor).'
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-06: Grammar Rules & Structural Form Boxes Preview */}
                {(() => {
                  const c06 = chapter.component06;
                  const hasRules = Boolean(
                    c06 &&
                    ((c06.formalRuleStatement && c06.formalRuleStatement.trim().length > 0) ||
                     (Array.isArray(c06.ruleVariations) && c06.ruleVariations.length > 0) ||
                     (c06.structuralFormula && c06.structuralFormula.trim().length > 0))
                  );

                  if (!hasRules) {
                    return null;
                  }

                  const wordCount = c06?.wordCount || 0;
                  const teacherAnnotations = c06?.teacherAnnotations;

                  return (
                    <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-5 font-sans">
                      {/* Header */}
                      <div className="border-b border-[#CBBEAC]/60 pb-2 flex items-center justify-between flex-wrap gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A1832] font-mono">
                            {c06?.ruleIdentifier || 'RULE 6.1 • PRINCIPAL LAW OF SYNTACTIC CONCORD'}
                          </span>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#292521]">
                            Grammar Rules &amp; Structural Form Boxes
                          </h3>
                        </div>
                        {previewMode !== 'student' && (
                          <div className="flex items-center gap-2">
                            {wordCount > 0 && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold border bg-[#EDE4D6] text-[#5A1832] border-[#CBBEAC]">
                                {wordCount} words
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                              COMP-06
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 1. Master Rule Statement */}
                      {c06?.formalRuleStatement && (
                        <div className="p-4 rounded-xl bg-[#F6F0E7] border-2 border-[#5A1832] space-y-3 shadow-xs">
                          <div className="flex items-center gap-2 text-[#5A1832] font-bold text-xs uppercase tracking-wider font-mono">
                            <BookOpen className="w-4 h-4 text-[#C29A52]" />
                            <span>The Principal Rule</span>
                          </div>

                          <p className="font-serif text-xs sm:text-sm leading-relaxed text-[#292521] font-semibold">
                            {c06.formalRuleStatement}
                          </p>

                          {c06.pedagogicalSummary && (
                            <p className="font-serif text-xs text-[#71685E] italic border-t border-[#CBBEAC]/60 pt-2">
                              <strong>In simple terms:</strong> {c06.pedagogicalSummary}
                            </p>
                          )}

                          {/* Visual Formula Box */}
                          <div className="p-3.5 rounded-lg bg-[#FFFDF8] border border-[#CBBEAC] flex flex-wrap items-center justify-center gap-2 text-xs shadow-inner">
                            {(c06.formulaTokens && c06.formulaTokens.length > 0
                              ? c06.formulaTokens
                              : [
                                  { text: '[SUBJECT / HEAD NOUN]', role: 'subject' },
                                  { text: '+', role: 'operator' },
                                  { text: '(intervening phrase)', role: 'modifier' },
                                  { text: '⟶', role: 'operator' },
                                  { text: '[FINITE VERB]', role: 'verb' },
                                ]
                            ).map((tok, tIdx) => {
                              const isSubject = tok.role === 'subject';
                              const isVerb = tok.role === 'verb';
                              const isModifier = tok.role === 'modifier';
                              const isOperator = tok.role === 'operator' || tok.role === 'punctuation';

                              return (
                                <span
                                  key={tok.id || tIdx}
                                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold ${
                                    isSubject
                                      ? 'bg-[#5A1832] text-white'
                                      : isVerb
                                      ? 'bg-emerald-700 text-white'
                                      : isModifier
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300 italic'
                                      : isOperator
                                      ? 'bg-transparent text-[#5A1832] font-black text-sm px-1'
                                      : 'bg-[#EDE4D6] text-[#292521]'
                                  }`}
                                >
                                  {tok.text}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. Sub-Rules & Variations */}
                      {c06?.ruleVariations && c06.ruleVariations.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-[#5A1832] block">
                            Rule Variations &amp; Structural Applications
                          </span>
                          <div className="grid grid-cols-1 gap-3">
                            {c06.ruleVariations.map((v, vIdx) => (
                              <div
                                key={v.id || vIdx}
                                className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] space-y-2 text-xs shadow-2xs"
                              >
                                <div className="flex items-baseline justify-between gap-2 border-b border-[#CBBEAC]/50 pb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#5A1832] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                                      {vIdx + 1}
                                    </span>
                                    <h5 className="font-serif font-bold text-xs sm:text-sm text-[#292521]">
                                      {v.title}
                                    </h5>
                                  </div>
                                  <span className="text-[10px] font-mono text-[#5A1832] font-semibold">
                                    {v.condition}
                                  </span>
                                </div>

                                <p className="font-serif text-[#292521] leading-relaxed">
                                  {v.ruleStatement}
                                </p>

                                {/* Exemplars Pair */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-300 text-[11px] space-y-0.5">
                                    <span className="font-mono font-bold text-emerald-900 uppercase text-[9px] flex items-center gap-1">
                                      <Check className="w-3 h-3 text-emerald-700" />
                                      <span>Correct:</span>
                                    </span>
                                    <p className="font-serif text-emerald-950 font-semibold">
                                      &ldquo;{v.correctExample}&rdquo;
                                    </p>
                                  </div>

                                  {v.incorrectExample && (
                                    <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-300 text-[11px] space-y-0.5">
                                      <span className="font-mono font-bold text-rose-900 uppercase text-[9px]">
                                        * Incorrect:
                                      </span>
                                      <p className="font-serif text-rose-950 line-through">
                                        &ldquo;{v.incorrectExample}&rdquo;
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {v.explanation && (
                                  <p className="text-[11px] text-[#71685E] font-serif leading-relaxed pt-1 border-t border-[#CBBEAC]/40">
                                    <strong>Why:</strong> {v.explanation}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Exceptions & Caution Box */}
                      {c06?.exceptions && c06.exceptions.length > 0 && (
                        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-2.5">
                          <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider font-mono">
                            <AlertTriangle className="w-4 h-4 text-amber-700" />
                            <span>Caution Box • Special Exceptions</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            {c06.exceptions.map((exc, eIdx) => (
                              <div
                                key={exc.id || eIdx}
                                className="p-2.5 rounded-lg bg-white/80 border border-amber-300/80 space-y-1"
                              >
                                <span className="font-mono font-bold text-amber-950 text-[11px] block">
                                  {exc.caseTitle}
                                </span>
                                <p className="font-serif text-[11px] text-[#292521] leading-relaxed">
                                  {exc.explanation}
                                </p>
                                <p className="font-serif text-[11px] font-semibold text-emerald-900 italic pt-0.5">
                                  &ldquo;{exc.example}&rdquo;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Rule of Thumb */}
                      {c06?.ruleOfThumb && (c06.ruleOfThumb.summary || c06.ruleOfThumb.mnemonicOrContrast) && (
                        <div className="p-3.5 rounded-xl bg-[#EDE4D6] border border-[#C29A52] flex items-start gap-2.5 text-xs">
                          <Lightbulb className="w-4 h-4 text-[#C29A52] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-xs text-[#5A1832] uppercase tracking-wider block">
                              {c06.ruleOfThumb.title || 'Rule of Thumb'}
                            </span>
                            <p className="font-serif text-xs text-[#292521] leading-relaxed">
                              {c06.ruleOfThumb.summary}
                            </p>
                            {c06.ruleOfThumb.mnemonicOrContrast && (
                              <p className="font-mono text-[11px] text-[#5A1832] font-semibold pt-1 border-t border-[#CBBEAC]/50">
                                💡 {c06.ruleOfThumb.mnemonicOrContrast}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 5. Teacher Edition Pedagogical Guidance (Only in Teacher Mode) */}
                      {previewMode === 'teacher' && teacherAnnotations && (
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-[#C29A52] bg-[#EDE4D6]/70 p-4 rounded-xl space-y-3 text-xs">
                          <div className="flex items-center justify-between border-b border-[#C29A52]/50 pb-2">
                            <div className="flex items-center gap-2 text-[#5A1832] font-bold uppercase tracking-wider text-xs">
                              <GraduationCap className="w-4 h-4 text-[#5A1832]" />
                              <span>Teacher Edition Guidance • COMP-06 Rules &amp; Form Boxes</span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-white text-[#5A1832] border border-[#CBBEAC]">
                              CISCE Class 6
                            </span>
                          </div>

                          {teacherAnnotations.boardExamAlignmentNote && (
                            <div className="space-y-0.5">
                              <strong className="text-[#5A1832] block uppercase tracking-wide text-[10px] font-mono">
                                Board Exam Traps:
                              </strong>
                              <p className="font-serif text-[11px] text-[#292521] leading-relaxed">
                                {teacherAnnotations.boardExamAlignmentNote}
                              </p>
                            </div>
                          )}

                          {teacherAnnotations.introductionStrategy && (
                            <div className="space-y-0.5">
                              <strong className="text-[#71685E] block uppercase tracking-wide text-[10px] font-mono">
                                Introduction Strategy:
                              </strong>
                              <p className="font-serif text-[11px] text-[#292521] leading-relaxed">
                                {teacherAnnotations.introductionStrategy}
                              </p>
                            </div>
                          )}

                          {teacherAnnotations.blackboardSummarySchema && (
                            <div className="space-y-0.5">
                              <strong className="text-[#71685E] block uppercase tracking-wide text-[10px] font-mono">
                                Blackboard Schema:
                              </strong>
                              <p className="font-mono text-[10px] text-[#292521] bg-white/70 p-2 rounded border border-[#CBBEAC]/50 whitespace-pre-line">
                                {teacherAnnotations.blackboardSummarySchema}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Sections & Manuscript Blocks */}
              <div className="space-y-10">
                {chapter.sections && chapter.sections.length > 0 ? (
                  chapter.sections
                    .filter((s) => s.id !== 'sec-concept-discovery' && !s.title?.toLowerCase().includes('concept discovery') && !s.title?.toLowerCase().includes('discovery vignette'))
                    .map((section, sIdx) => (
                    <div key={section.id || sIdx} className="space-y-4">
                      {/* Section Title */}
                      <div className="border-b border-[#CBBEAC] pb-2">
                        <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#292521] flex items-baseline space-x-2">
                          <span className="font-mono text-sm text-[#5A1832] font-semibold">
                            {section.numberLabel || `${chapter.chapterNumber || 1}.${sIdx + 1}`}
                          </span>
                          <span>{section.title}</span>
                        </h2>
                      </div>

                      {/* Blocks inside section */}
                      <div className="space-y-4">
                        {section.blocks
                          ?.filter((b) => {
                            if (previewMode === 'student') return b.visibility === 'student';
                            if (previewMode === 'teacher') return b.visibility !== 'author_only';
                            return true;
                          })
                          .map((b) => (
                            <div key={b.id} className="space-y-3">
                              {/* Heading Block */}
                              {(b.type === 'heading' || b.type === 'subheading') && (
                                <h3 className="font-serif font-bold text-lg text-[#5A1832] mt-4 mb-2">
                                  {b.title || b.textContent}
                                </h3>
                              )}

                              {/* Text / Prose Block */}
                              {b.type === 'text' && (
                                <TextbookMarkdown
                                  content={b.textContent || ''}
                                  className="text-[#292521] text-sm sm:text-base leading-relaxed font-serif"
                                  isDarkMode={isDarkMode}
                                />
                              )}

                              {/* Grammar Rule Block */}
                              {b.type === 'grammar_rule' && (
                                <div className="p-4 rounded-xl border border-[#C29A52]/80 bg-[#EDE4D6]/40 font-sans space-y-2.5">
                                  <div className="flex items-center justify-between border-b border-[#C29A52]/40 pb-1.5">
                                    <span className="font-bold text-xs uppercase tracking-wider text-[#5A1832] flex items-center space-x-1.5">
                                      <Award className="w-3.5 h-3.5 text-[#C29A52]" />
                                      <span>{b.calloutTitle || b.title || 'GRAMMAR RULE'}</span>
                                    </span>
                                  </div>

                                  {/* Rule statement */}
                                  {b.associatedRuleData?.ruleText ? (
                                    <p className="font-serif font-bold text-sm text-[#292521] leading-relaxed">
                                      {b.associatedRuleData.ruleText}
                                    </p>
                                  ) : (
                                    <TextbookMarkdown
                                      content={b.calloutText || b.textContent || ''}
                                      className="text-xs sm:text-sm font-medium text-[#292521] leading-relaxed"
                                      isDarkMode={isDarkMode}
                                    />
                                  )}

                                  {/* Associated Explanation */}
                                  {b.associatedRuleData?.explanation && (
                                    <p className="text-xs sm:text-sm text-[#71685E] leading-relaxed">
                                      {b.associatedRuleData.explanation}
                                    </p>
                                  )}

                                  {/* Syntactic Formula / Pattern */}
                                  {b.associatedRuleData?.formulaOrPattern && (
                                    <div className="p-2.5 rounded-lg bg-[#FFFDF8] border border-[#CBBEAC] font-mono text-xs text-[#5A1832] font-semibold">
                                      <span className="text-[10px] uppercase font-bold text-[#71685E] block mb-0.5">
                                        Syntactic Formula:
                                      </span>
                                      {b.associatedRuleData.formulaOrPattern}
                                    </div>
                                  )}

                                  {/* Exemplary Correct Sentences */}
                                  {b.associatedRuleData?.correctExamples &&
                                    b.associatedRuleData.correctExamples.length > 0 && (
                                      <div className="space-y-1 pt-1">
                                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                                          Exemplary Usage:
                                        </span>
                                        <div className="space-y-1">
                                          {b.associatedRuleData.correctExamples.map((ex, i) => (
                                            <div key={i} className="flex items-start space-x-2 text-xs text-[#292521]">
                                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                              <span className="font-medium">{ex}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {/* Incorrect Examples with Failure Rationale */}
                                  {b.associatedRuleData?.incorrectExamples &&
                                    b.associatedRuleData.incorrectExamples.length > 0 && (
                                      <div className="space-y-1 pt-1">
                                        <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                                          Incorrect Form:
                                        </span>
                                        <div className="space-y-1">
                                          {b.associatedRuleData.incorrectExamples.map((ex, i) => (
                                            <div key={i} className="flex items-start space-x-2 text-xs text-rose-700">
                                              <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                              <span className="line-through">{ex}</span>
                                            </div>
                                          ))}
                                        </div>
                                        {b.associatedRuleData.whyIncorrectFails && (
                                          <p className="text-[11px] text-[#71685E] italic mt-1">
                                            Why it fails: {b.associatedRuleData.whyIncorrectFails}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                  {/* TEACHER EDITION ONLY: Common Learner Error and Teacher Notes */}
                                  {previewMode === 'teacher' && (
                                    <div className="space-y-2 pt-2 border-t border-[#CBBEAC] text-xs">
                                      {b.associatedRuleData?.commonLearnerError && (
                                        <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900">
                                          <span className="font-bold block mb-0.5">Learner Trap to Anticipate:</span>
                                          <span>{b.associatedRuleData.commonLearnerError}</span>
                                        </div>
                                      )}
                                      {b.associatedRuleData?.teacherNote && (
                                        <div className="p-2.5 rounded bg-purple-50 border border-purple-200 text-purple-900">
                                          <span className="font-bold block mb-0.5">Instructor Pedagogy Note:</span>
                                          <span>{b.associatedRuleData.teacherNote}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Worked Example */}
                              {b.type === 'worked_example' && b.workedExample && (
                                <div className="p-5 rounded-2xl border-2 border-[#C29A52] bg-[#FFFDF8] shadow-xs font-sans space-y-3">
                                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                                    <span className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                                      Worked Example • {b.workedExample.difficulty}
                                    </span>
                                    <span className="text-[11px] text-[#71685E]">
                                      Rule: {b.workedExample.ruleApplied}
                                    </span>
                                  </div>
                                  <p className="font-bold text-sm text-[#292521] font-serif">
                                    Problem: &ldquo;{b.workedExample.problem}&rdquo;
                                  </p>

                                  <div className="space-y-2 text-xs">
                                    {b.workedExample.steps.map((st) => (
                                      <div
                                        key={st.stepNumber}
                                        className="p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC]"
                                      >
                                        <span className="font-bold text-[#5A1832] block mb-0.5">
                                          {st.title}
                                        </span>
                                        <p className="text-[#292521] mb-1">{st.instruction}</p>
                                        {st.sampleWork && (
                                          <p className="font-mono text-[11px] text-[#292521] bg-[#FFFDF8] p-1.5 rounded border border-[#CBBEAC]">
                                            {st.sampleWork}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                                    <span className="font-bold text-emerald-800 block mb-0.5">
                                      Final Answer:
                                    </span>
                                    <p className="font-semibold text-[#292521]">
                                      {b.workedExample.finalAnswer}
                                    </p>
                                    <p className="text-[#71685E] text-[11px] mt-1">
                                      Why: {b.workedExample.whyRationale}
                                    </p>
                                  </div>

                                  {/* TEACHER EDITION ONLY: Teacher Tip in Worked Example */}
                                  {previewMode === 'teacher' && b.workedExample.teacherNote && (
                                    <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900">
                                      <span className="font-bold block mb-0.5">Teacher Tip:</span>
                                      <span>{b.workedExample.teacherNote}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Visual Pedagogical Specimen */}
                              {(b.type === 'visual' || b.type === 'diagram' || b.type === 'illustration') &&
                                b.visualData && (
                                  <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] font-sans space-y-2">
                                    <div className="p-6 rounded-lg border border-dashed border-[#CBBEAC] text-center space-y-2 bg-[#FFFDF8]">
                                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold bg-[#5A1832]/10 text-[#5A1832]">
                                        [Visual Specimen: {b.visualData.visualType}]
                                      </span>
                                      <h4 className="font-bold text-sm text-[#292521]">
                                        {b.visualData.title}
                                      </h4>
                                      {b.visualData.svgIllustrationBrief && (
                                        <p className="font-mono text-xs text-[#71685E] max-w-lg mx-auto">
                                          {b.visualData.svgIllustrationBrief}
                                        </p>
                                      )}
                                    </div>
                                    <p className="text-xs text-[#71685E] italic text-center">
                                      {b.visualData.caption}
                                    </p>
                                  </div>
                                )}

                              {/* Common Error Block */}
                              {(b.type === 'common_error' || b.type === 'warning_trap') && b.commonError && (
                                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 font-sans space-y-2 text-xs">
                                  <span className="font-bold uppercase tracking-wider text-rose-700">
                                    COMMON ERROR / EXAM TRAP
                                  </span>
                                  <div className="space-y-1">
                                    <p className="text-rose-600 line-through">
                                      ✗ {b.commonError.incorrectSentence}
                                    </p>
                                    <p className="text-emerald-700 font-bold">
                                      ✓ {b.commonError.correctSentence}
                                    </p>
                                  </div>
                                  <p className="text-[#71685E] text-[11px]">
                                    {b.commonError.explanation}
                                  </p>
                                </div>
                              )}

                              {/* Try This / Inquiry / Discovery Questions Block */}
                              {(b.type === 'try_this' || b.type === 'activity' || (b.type as string) === 'inquiry') && (
                                <div className="p-4 sm:p-5 rounded-xl border border-[#C29A52] bg-[#F6F0E7] font-sans space-y-3">
                                  <div className="flex items-center space-x-2 border-b border-[#CBBEAC] pb-1.5">
                                    <Sparkles className="w-4 h-4 text-[#C29A52]" />
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                                      {b.title || 'Guided Practice Activity'}
                                    </h4>
                                  </div>
                                  <TextbookMarkdown
                                    content={b.textContent || ''}
                                    className="text-xs sm:text-sm text-[#292521] leading-relaxed font-serif"
                                    isDarkMode={isDarkMode}
                                  />
                                </div>
                              )}

                              {/* TEACHER EDITION ONLY: Standalone Teacher Guidance block */}
                              {previewMode === 'teacher' && b.visibility === 'teacher_only' && (
                                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs font-sans space-y-1">
                                  <span className="font-bold block uppercase tracking-wider text-purple-800 text-[10px]">
                                    TEACHER GUIDANCE:
                                  </span>
                                  <p>{b.textContent || b.teacherGuidance}</p>
                                </div>
                              )}
                            </div>
                          ))}

                        {/* TEACHER EDITION ONLY: Discovery Facilitation Guidance for Component 4 */}
                        {previewMode === 'teacher' && (section.id === 'sec-concept-discovery' || section.id.includes('discovery')) && (
                          <div className="mt-4 pt-3 border-t-2 border-dashed border-[#C29A52] bg-[#EDE4D6]/80 p-4 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center gap-1.5 text-[#5A1832] font-bold uppercase tracking-wider text-[11px]">
                              <Bookmark className="w-4 h-4 text-[#5A1832]" />
                              <span>Teacher Edition Guidance • Discovery Facilitation</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 font-serif text-[11px] text-[#292521]">
                              <li><strong>Choral / Paired Reading:</strong> Invite two students to read the dialogue in character as Kabir and Ananya. Pause after the cricket captain headline and ask the class to explain why &apos;has&apos; sounds balanced.</li>
                              <li><strong>Inductive Method:</strong> Do NOT introduce the formal rule formulas (proximity, collective concord) yet. Allow students to deduce the inverse &apos;-s&apos; relationship inductively through the four guided questions.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 border border-dashed border-[#CBBEAC] rounded-xl text-center text-[#71685E] text-xs">
                    No theoretical sections authored yet for {chapter.title}.
                  </div>
                )}
              </div>

              {/* Practice Exercises Section */}
              {chapter.exercises && chapter.exercises.length > 0 && (
                <div className="space-y-8 pt-6 border-t border-[#CBBEAC] font-sans">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-serif text-[#292521]">Chapter Practice Exercises</h2>
                    <span className="text-xs font-mono text-[#71685E]">
                      {chapter.exercises.length} Exercises • {totalQuestionsCount} Questions Total
                    </span>
                  </div>

                  {chapter.exercises.map((ex) => {
                    const uniqueQuestions = getDeduplicatedQuestions(ex.questions);
                    const exerciseHeading = formatExerciseTitle(ex.title, ex.letter);

                    return (
                      <div key={ex.id} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-1.5">
                          <h3 className="font-bold text-base text-[#5A1832]">
                            {exerciseHeading}
                          </h3>
                          <span className="text-xs text-[#71685E] font-mono">
                            [{ex.suggestedMarks || 5} Marks]
                          </span>
                        </div>
                        <p className="text-xs text-[#71685E] italic">
                          {ex.instructions}
                        </p>

                        <div className="space-y-2 text-xs">
                          {uniqueQuestions.map((q, qIdx) => (
                            <div
                              key={q.id || qIdx}
                              className="p-3 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7]/60"
                            >
                              <div className="flex items-start space-x-2">
                                <span className="font-bold text-[#5A1832]">
                                  {qIdx + 1}.
                                </span>
                                <div className="flex-1 space-y-1">
                                  <p className="text-[#292521] font-medium font-serif">
                                    {q.prompt || q.blanksSentence || q.originalSentence}
                                  </p>

                                  {/* Options for MCQ */}
                                  {q.options && q.options.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                      {q.options.map((opt, oIdx) => (
                                        <div
                                          key={oIdx}
                                          className="p-1.5 rounded bg-[#FFFDF8] border border-[#CBBEAC] text-[#292521] text-[11px]"
                                        >
                                          <span className="font-bold mr-1 text-[#5A1832]">
                                            {String.fromCharCode(65 + oIdx)}.
                                          </span>
                                          <span>{opt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* TEACHER EDITION ONLY: Visible Answer Key & Grammatical Rationale */}
                                  {previewMode === 'teacher' && (
                                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-emerald-800">
                                          ✓ Answer: {q.correctAnswer || 'Accept valid grammatical construction'}
                                        </span>
                                        {q.conceptTested && (
                                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                                            Concept: {q.conceptTested}
                                          </span>
                                        )}
                                      </div>
                                      {q.explanation && (
                                        <p className="text-[11px] text-[#292521] italic">
                                          Rationale: {q.explanation}
                                        </p>
                                      )}
                                      {q.teacherNote && (
                                        <p className="text-[11px] text-purple-900 bg-purple-50/80 p-1.5 rounded border border-purple-200">
                                          Instructor Alert: {q.teacherNote}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Chapter Summary & Revision (Sourced strictly from canonical architecture component data) */}
              {hasAuthoredSummary && (
                <div className="space-y-6 pt-8 border-t-2 border-[#CBBEAC] font-sans">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-[#5A1832]/10 text-[#5A1832]">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h2 className="text-2xl font-bold font-serif text-[#292521]">
                      Chapter Summary &amp; Revision
                    </h2>
                  </div>

                  {/* Rules at a Glance Table */}
                  {((revision?.rulesAtAGlance && revision.rulesAtAGlance.length > 0) ||
                    (ending?.rulesRecap && ending.rulesRecap.length > 0)) && (
                    <div className="p-5 rounded-2xl border border-[#C29A52] bg-[#EDE4D6]/40 space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                        Golden Rules at a Glance
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#CBBEAC] text-[#71685E] font-semibold">
                              <th className="py-2 pr-3">Rule Statement</th>
                              <th className="py-2">Summary &amp; Exemplary Usage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#CBBEAC]/50">
                            {revision?.rulesAtAGlance?.map((r, i) => (
                              <tr key={i} className="text-[#292521]">
                                <td className="py-2.5 pr-3 font-bold align-top text-[#5A1832]">
                                  {r.ruleTitle}
                                </td>
                                <td className="py-2.5 text-[#292521] font-serif align-top leading-relaxed">
                                  {r.summary}
                                </td>
                              </tr>
                            )) ||
                              ending?.rulesRecap?.map((r, i) => (
                                <tr key={i} className="text-[#292521]">
                                  <td className="py-2.5 pr-3 font-bold align-top text-[#5A1832]">
                                    {r.rule}
                                  </td>
                                  <td className="py-2.5 text-[#292521] font-serif align-top leading-relaxed">
                                    <span className="font-mono text-emerald-800">{r.example}</span>
                                    {r.trap && (
                                      <span className="block text-rose-700 text-[11px] mt-0.5">
                                        Watch out: {r.trap}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Golden Principles / Remember Points */}
                  {revision?.rememberPoints && revision.rememberPoints.length > 0 && (
                    <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-[#C29A52]" />
                        <span>Golden Principles (Remember)</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#292521]">
                        {revision.rememberPoints.map((pt, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-[#C29A52] font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* High-Frequency Traps / Common Mistakes */}
                  {revision?.commonMistakes && revision.commonMistakes.length > 0 && (
                    <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2 text-xs">
                      <h4 className="font-bold uppercase tracking-wider text-rose-800">
                        High-Frequency Traps &amp; Exam Pitfalls
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {revision.commonMistakes.map((m, i) => (
                          <div key={i} className="p-3 rounded-lg bg-[#FFFDF8] border border-rose-200 space-y-1">
                            <div className="text-rose-700 line-through">✗ {m.mistake}</div>
                            <div className="text-emerald-800 font-bold">✓ {m.correction}</div>
                            <p className="text-[11px] text-[#71685E] italic">{m.why}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Vocabulary */}
                  {revision?.keyVocabulary && revision.keyVocabulary.length > 0 && (
                    <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                        Key Vocabulary Glossary
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {revision.keyVocabulary.map((v, i) => (
                          <div key={i} className="p-2.5 rounded bg-[#FFFDF8] border border-[#CBBEAC]">
                            <span className="font-bold text-[#5A1832] mr-1.5">{v.term}:</span>
                            <span className="text-[#292521]">{v.definition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Check Questions */}
                  {revision?.quickCheckQuestions && revision.quickCheckQuestions.length > 0 && (
                    <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#5A1832]" />
                        <span>Quick Check Self-Assessment Quiz</span>
                      </h4>
                      <div className="space-y-2.5 text-xs">
                        {revision.quickCheckQuestions.map((q, i) => (
                          <div key={i} className="p-3 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] space-y-1.5">
                            <div className="flex items-start gap-2 text-[#292521] font-medium font-serif">
                              <span className="font-bold text-[#5A1832]">{i + 1}.</span>
                              <span>{q.prompt}</span>
                            </div>

                            {/* TEACHER EDITION ONLY: Displays Answer Key */}
                            {previewMode === 'teacher' ? (
                              <div className="pl-4 text-emerald-800 font-mono text-[11px] bg-emerald-50 p-2 rounded border border-emerald-200">
                                <span className="font-bold font-sans">TEACHER ANSWER KEY: </span>
                                {q.answer}
                              </div>
                            ) : (
                              /* Student Edition: Blank response line */
                              <div className="pl-4 pt-1">
                                <div className="border-b border-dashed border-[#CBBEAC] h-5 w-full"></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Student "I Can" Competency Checklist */}
                  {revision?.selfAssessmentChecklist && revision.selfAssessmentChecklist.length > 0 && (
                    <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Student "I Can" Competency Checklist</span>
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        {revision.selfAssessmentChecklist.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded bg-[#FFFDF8] border border-[#CBBEAC]">
                            <input
                              type="checkbox"
                              defaultChecked={false}
                              className="w-3.5 h-3.5 rounded text-[#5A1832] focus:ring-[#5A1832]"
                            />
                            <span className="font-serif text-[#292521]">{item.statement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chapter Summative Assessment Test */}
              {chapter.chapterTest && (
                <div className="space-y-6 pt-8 border-t-2 border-[#CBBEAC] font-sans">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-[#5A1832]/10 text-[#5A1832] block w-max mb-1">
                        Summative Assessment
                      </span>
                      <h2 className="text-2xl font-bold font-serif text-[#292521]">
                        {chapter.chapterTest.title || 'Chapter Assessment Test'}
                      </h2>
                    </div>
                    <div className="text-right font-mono text-xs text-[#71685E]">
                      <div>Total Marks: {chapter.chapterTest.totalMarks || 25}</div>
                      <div>Time: {chapter.chapterTest.suggestedDurationMinutes || 40} mins</div>
                    </div>
                  </div>

                  {chapter.chapterTest.instructions && (
                    <p className="text-xs italic text-[#71685E] bg-[#F6F0E7] p-3 rounded-lg border border-[#CBBEAC]">
                      Instructions: {chapter.chapterTest.instructions}
                    </p>
                  )}

                  {/* Test Sections & Questions */}
                  <div className="space-y-6">
                    {chapter.chapterTest.sections?.map((tSec, sIdx) => (
                      <div key={tSec.id || sIdx} className="space-y-3">
                        <div className="flex items-center justify-between bg-[#EDE4D6] px-3 py-1.5 rounded-lg border border-[#CBBEAC]">
                          <span className="font-bold text-xs uppercase tracking-wider text-[#35101F]">
                            Section {tSec.sectionLetter || String.fromCharCode(65 + sIdx)}: {tSec.title}
                          </span>
                          <span className="font-mono text-[11px] text-[#71685E] font-semibold">
                            [{tSec.totalMarks} Marks]
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {tSec.questions.map((q, qIdx) => (
                            <div
                              key={q.id || qIdx}
                              className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-2">
                                  <span className="font-bold text-[#5A1832]">
                                    {qIdx + 1}.
                                  </span>
                                  <div>
                                    <p className="font-medium text-[#292521] font-serif">
                                      {q.prompt || q.blanksSentence || q.originalSentence}
                                    </p>
                                    {q.options && q.options.length > 0 && (
                                      <div className="grid grid-cols-2 gap-1.5 mt-2">
                                        {q.options.map((opt, oIdx) => (
                                          <div
                                            key={oIdx}
                                            className="px-2.5 py-1 rounded border border-[#CBBEAC] text-[#292521] bg-[#F6F0E7]"
                                          >
                                            <span className="font-bold mr-1.5 text-[#5A1832]">
                                              {String.fromCharCode(65 + oIdx)}.
                                            </span>
                                            <span>{opt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <span className="font-mono text-[11px] font-bold text-[#71685E] shrink-0 ml-2">
                                  [{q.marks || 1} M]
                                </span>
                              </div>

                              {/* TEACHER EDITION ONLY: Marking guidance & correct answer */}
                              {previewMode === 'teacher' && (
                                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs mt-2 space-y-1 font-sans">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-emerald-800 font-mono">
                                      Answer: {q.correctAnswer}
                                    </span>
                                    {q.rationale && (
                                      <span className="text-[#71685E]">
                                        • Rationale: {q.rationale}
                                      </span>
                                    )}
                                  </div>
                                  {q.markingGuidance && (
                                    <p className="text-[11px] text-[#71685E] italic">
                                      Marking Guidance: {q.markingGuidance}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMP-22: Chapter Answer Key & Model Rationale (TEACHER EDITION ONLY) */}
              {previewMode === 'teacher' && (
                <div className="space-y-6 pt-8 border-t-2 border-emerald-300 font-sans bg-emerald-50/40 p-6 rounded-2xl border border-emerald-200">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
                      <Key className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          COMP-22 • Teacher Master Edition
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold font-serif text-emerald-950 mt-1">
                        Answer Key &amp; Model Rationale
                      </h2>
                      <p className="text-xs text-emerald-800">
                        Prescriptive solutions, diagnostic error notes, syntactic rationales, and marking allocations. Hidden from Student Edition.
                      </p>
                    </div>
                  </div>

                  {chapter.answerKey && chapter.answerKey.length > 0 ? (
                    <div className="space-y-3">
                      {chapter.answerKey.map((item, akIdx) => (
                        <div
                          key={item.id || akIdx}
                          className="p-3.5 rounded-xl bg-[#FFFDF8] border border-emerald-200 shadow-2xs space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-900 font-mono">
                              {item.exerciseLetterOrNumber ? `Ex ${item.exerciseLetterOrNumber}` : ''} Q{item.questionNumber}: {item.ruleApplied ? `[${item.ruleApplied}]` : ''}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              {item.markingGuidance || '1 Mark'}
                            </span>
                          </div>
                          <div className="font-serif font-bold text-emerald-950">
                            Answer: {item.correctAnswer}
                          </div>
                          {item.grammarRationale && (
                            <div className="text-[#71685E] italic text-[11px]">
                              Grammar Rationale: {item.grammarRationale}
                            </div>
                          )}
                          {item.promptSummary && (
                            <div className="text-amber-800 text-[11px]">
                              Prompt: {item.promptSummary}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chapter.exercises?.map((ex) => (
                        <div key={ex.id} className="p-3.5 rounded-xl bg-[#FFFDF8] border border-emerald-200 shadow-2xs space-y-2 text-xs">
                          <h4 className="font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-100 pb-1">
                            {ex.title || `Exercise ${ex.letter}`} Solutions
                          </h4>
                          <div className="space-y-1.5">
                            {ex.questions?.map((q, idx) => (
                              <div key={q.id || idx} className="p-2 rounded bg-emerald-50/50 border border-emerald-100">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-[#5A1832]">Q{idx + 1}. {q.prompt || q.blanksSentence || q.originalSentence}</span>
                                  <span className="font-mono text-[10px] text-emerald-800 font-bold shrink-0">[{q.marks || 1} M]</span>
                                </div>
                                <div className="font-serif font-bold text-emerald-900 mt-1">
                                  Answer: {q.correctAnswer || 'Consult master rubric'}
                                </div>
                                {q.rationale && (
                                  <div className="text-[11px] text-[#71685E] italic mt-0.5">
                                    Rationale: {q.rationale}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Comprehensive Teacher Guide (TEACHER EDITION ONLY) */}
              {previewMode === 'teacher' && chapter.teacherNotes && (
                <div className="space-y-6 pt-8 border-t-2 border-purple-300 font-sans bg-purple-50/40 p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold font-serif text-purple-950">
                        Teacher Edition: Instructional Guide &amp; Lesson Notes
                      </h2>
                      <p className="text-xs text-purple-800">
                        Pedagogical sequencing, common misconception alerts, and scaffolding instructions for classroom educators.
                      </p>
                    </div>
                  </div>

                  {typeof chapter.teacherNotes === 'string' ? (
                    <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-purple-200 text-[#292521] text-sm">
                      <TextbookMarkdown content={chapter.teacherNotes} isDarkMode={isDarkMode} />
                    </div>
                  ) : (
                    <>
                      {chapter.teacherNotes.pedagogicalNotes && (
                        <div className="space-y-1.5 text-xs">
                          <h4 className="font-bold uppercase tracking-wider text-purple-900">
                            Pedagogical Philosophy &amp; Classroom Delivery
                          </h4>
                          <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-purple-200 text-[#292521]">
                            <TextbookMarkdown
                              content={chapter.teacherNotes.pedagogicalNotes}
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </div>
                      )}

                      {chapter.teacherNotes.lessonPlanFlow && chapter.teacherNotes.lessonPlanFlow.length > 0 && (
                        <div className="space-y-2 text-xs">
                          <h4 className="font-bold uppercase tracking-wider text-purple-900">
                            Suggested Teaching Sequence
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {chapter.teacherNotes.lessonPlanFlow.map((lp, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg bg-[#FFFDF8] border border-purple-200 space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-purple-800">
                                    Period {lp.periodNumber}: {lp.topic}
                                  </span>
                                  <span className="font-mono text-[10px] text-[#71685E]">
                                    {lp.durationMinutes} mins
                                  </span>
                                </div>
                                <p className="text-[#71685E] text-[11px]">{lp.activities}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {chapter.teacherNotes.misconceptions && chapter.teacherNotes.misconceptions.length > 0 && (
                        <div className="space-y-2 text-xs">
                          <h4 className="font-bold uppercase tracking-wider text-purple-900">
                            Anticipated Misconceptions &amp; Remedial Intervention
                          </h4>
                          <div className="space-y-1.5">
                            {chapter.teacherNotes.misconceptions.map((m, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg bg-[#FFFDF8] border border-purple-200"
                              >
                                <span className="font-bold text-rose-700 block mb-0.5">
                                  Student Assumption: {m.misconception}
                                </span>
                                <span className="text-[#292521]">
                                  Remedy: {m.correctionStrategy}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MANUSCRIPT VIEW (Authentic Editorial / Production Publishing View) */}
          {/* ========================================================================= */}
          {previewMode === 'manuscript' && (
            <div className="w-full max-w-4xl space-y-6 font-sans">
              {/* Editorial Master Metadata Header */}
              <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#CBBEAC] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#5A1832] text-[#FFFDF8] font-mono text-xs font-bold uppercase">
                        Publishing Manuscript Dossier
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EDE4D6] text-[#5A1832] font-mono text-xs font-bold border border-[#CBBEAC]">
                        {chapter.systemId || chapter.curriculumBoard || 'CBSE'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EDE4D6] text-[#71685E] font-mono text-xs border border-[#CBBEAC]">
                        {chapter.equivalentClass}
                      </span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-[#35101F]">
                      {chapter.title}
                    </h1>
                    <p className="text-xs text-[#71685E]">
                      {chapter.subtitle || 'Textbook Unit Manuscript & Pedagogical Content File'}
                    </p>
                  </div>

                  <div className="text-right space-y-1 font-mono text-xs text-[#71685E]">
                    <div>
                      <span className="font-semibold text-[#292521]">Canonical ID: </span>
                      <span className="text-[#5A1832] font-bold">{chapter.id}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#292521]">Architecture: </span>
                      <span>
                        {chapter.architectureId ||
                          chapter.architectureState?.governingArchitectureId ||
                          (chapter.curriculumBoard === 'CISCE' || chapter.systemId === 'CISCE'
                            ? 'arch-cisce-middle-grammar'
                            : 'arch-cbse-std')}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#292521]">Status: </span>
                      <span className="uppercase text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                        {chapter.status || 'draft'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Production Inventory Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <div className="text-[10px] uppercase font-bold text-[#71685E]">Sections</div>
                    <div className="text-xl font-bold text-[#5A1832] font-serif">
                      {chapter.sections?.length || 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <div className="text-[10px] uppercase font-bold text-[#71685E]">Practice Exercises</div>
                    <div className="text-xl font-bold text-[#5A1832] font-serif">
                      {chapter.exercises?.length || 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <div className="text-[10px] uppercase font-bold text-[#71685E]">Questions Total</div>
                    <div className="text-xl font-bold text-[#5A1832] font-serif">
                      {totalQuestionsCount}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <div className="text-[10px] uppercase font-bold text-[#71685E]">Grammar Rules</div>
                    <div className="text-xl font-bold text-[#5A1832] font-serif">
                      {chapter.rules?.length ||
                        chapter.sections?.reduce(
                          (acc, s) => acc + (s.blocks?.filter((b) => b.type === 'grammar_rule').length || 0),
                          0
                        ) ||
                        0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <div className="text-[10px] uppercase font-bold text-[#71685E]">Audit Score</div>
                    <div className="text-xl font-bold text-emerald-700 font-serif">
                      {chapter.academicQualityScore || 95}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Sequential Component Registry (Architecture Components 01 to 23) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#71685E] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#5A1832]" />
                    <span>Editorial Architecture Component Breakdown (23 Components)</span>
                  </h3>
                  <span className="text-xs text-[#71685E]">
                    Live Canonical Chapter State: <strong className="font-mono text-[#5A1832]">{chapter.id}</strong>
                  </span>
                </div>

                {/* COMP-01: Chapter Opener & Orientation */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-01
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Chapter Opener &amp; Orientation
                      </h4>
                    </div>
                    {(() => {
                      const hasHook = Boolean(chapter.opening?.openingHook && chapter.opening.openingHook.trim().length > 15);
                      const hasIntro = Boolean(chapter.opening?.shortIntroduction && chapter.opening.shortIntroduction.trim().length > 30);
                      const isAuthored = Boolean(hasHook && hasIntro);
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isAuthored ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {isAuthored ? '[AUTHORED]' : '[PENDING DRAFT]'}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#71685E] font-bold block">Hook / Provocation:</span>
                      <p className="font-serif italic text-[#292521]">
                        {chapter.opening?.openingHook || (
                          <span className="text-[#71685E] italic">Pending authoring.</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#71685E] font-bold block">Estimated Study Duration:</span>
                      <p className="font-mono text-[#292521]">
                        {chapter.opening?.estimatedStudyTimeMinutes || 120} Minutes
                      </p>
                    </div>
                  </div>
                  {chapter.opening?.shortIntroduction && (
                    <div className="pt-2 border-t border-[#CBBEAC]/50">
                      <span className="text-[#71685E] font-bold block text-xs mb-1">Introductory Exposition:</span>
                      <p className="font-serif text-xs text-[#292521] leading-relaxed">
                        {chapter.opening.shortIntroduction}
                      </p>
                    </div>
                  )}
                </div>

                {/* COMP-02: Learning Objectives & Key Competencies */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-02
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Learning Objectives &amp; Pedagogical Competencies
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      chapter.opening?.learningObjectives && chapter.opening.learningObjectives.length >= 2
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {chapter.opening?.learningObjectives && chapter.opening.learningObjectives.length >= 2
                        ? `[AUTHORED] (${chapter.opening.learningObjectives.length} Objectives)`
                        : '[PENDING DRAFT]'}
                    </span>
                  </div>
                  {chapter.opening?.learningObjectives && chapter.opening.learningObjectives.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {chapter.opening.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#292521]">
                          <span className="text-[#C29A52]">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#71685E] italic">
                      Learning objectives have not been authored yet for this chapter.
                    </p>
                  )}
                </div>

                {/* COMP-03: Warm-Up / Prior Knowledge Activation (Task 6) */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-03
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Warm-Up &amp; Prior Knowledge Activation
                      </h4>
                    </div>
                    {(() => {
                      const hasWarmUp = Boolean(
                        chapter.opening?.warmUpActivity && chapter.opening.warmUpActivity.trim().length > 20
                      );
                      const hasPrior = Boolean(
                        chapter.opening?.priorKnowledge && String(chapter.opening.priorKnowledge).trim().length > 10
                      );
                      const isAuthored = Boolean(hasWarmUp && hasPrior);
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isAuthored ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {isAuthored ? '[AUTHORED]' : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="space-y-3">
                    {chapter.opening?.warmUpActivity ? (
                      <div>
                        <span className="text-[#71685E] font-bold block text-xs mb-1">Diagnostic 2-Minute Starter:</span>
                        <p className="text-xs font-serif text-[#292521] leading-relaxed whitespace-pre-line">
                          {chapter.opening.warmUpActivity}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#71685E] italic">
                        Diagnostic starter has not been authored yet.
                      </p>
                    )}
                    {chapter.opening?.priorKnowledge && (
                      <div className="p-3 rounded-lg bg-[#EDE4D6]/60 border border-[#CBBEAC] text-xs">
                        <span className="font-bold text-[#5A1832] block mb-1">Prerequisites Check:</span>
                        <p className="font-serif text-[#292521] whitespace-pre-line">
                          {String(chapter.opening.priorKnowledge)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* COMP-04: Concept Introduction & Discovery Vignette */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-04
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Concept Introduction &amp; Discovery Vignette
                      </h4>
                    </div>
                    {(() => {
                      const vignette =
                        chapter.opening?.discoveryVignette ||
                        chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'text')?.textContent ||
                        '';
                      const inquiry =
                        chapter.opening?.discoveryQuestions ||
                        chapter.opening?.discoveryQuestion ||
                        chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'try_this')?.textContent ||
                        '';
                      const hasContent = Boolean(
                        (vignette && vignette.trim().length > 0) ||
                        (inquiry && inquiry.trim().length > 0)
                      );
                      const isComplete = chapter.architectureState?.customizations?.['comp-4']?.status === 'complete';
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isComplete
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : hasContent
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}>
                          {isComplete ? '[COMPLETE]' : hasContent ? '[DRAFT]' : '[PENDING DRAFT]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const vignette =
                      chapter.opening?.discoveryVignette ||
                      chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'text')?.textContent ||
                      '';
                    const inquiry =
                      chapter.opening?.discoveryQuestions ||
                      chapter.opening?.discoveryQuestion ||
                      chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'try_this')?.textContent ||
                      '';
                    if (vignette || inquiry) {
                      return (
                        <div className="space-y-3">
                          {vignette && (
                            <div>
                              <span className="text-[#71685E] font-bold block text-xs mb-1">Authentic Reading Scenario:</span>
                              <p className="text-xs font-serif text-[#292521] leading-relaxed whitespace-pre-line">
                                {vignette}
                              </p>
                            </div>
                          )}
                          {inquiry && (
                            <div className="p-3 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-xs font-serif">
                              <span className="font-bold font-sans uppercase text-[10px] block text-[#5A1832] mb-1">
                                Notice &amp; Inquire (Discovery Questions):
                              </span>
                              <p className="whitespace-pre-line text-[#292521]">{inquiry}</p>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        Contextual discovery vignette and inquiry dialogue have not been authored yet.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-05: Theoretical Content & Syntactic Analysis */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-05
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Theoretical Content &amp; Syntactic Analysis
                      </h4>
                    </div>
                    {(() => {
                      const c05 = chapter.component05;
                      const hasC05 = Boolean(
                        (c05?.conceptualExplanation && c05.conceptualExplanation.trim().length > 0) ||
                        (Array.isArray(c05?.syntacticAnalysis) && c05.syntacticAnalysis.length > 0) ||
                        (c05?.linguisticInsight && c05.linguisticInsight.trim().length > 0)
                      );
                      const isComplete = c05?.status === 'complete';
                      const wordCount = c05?.wordCount || (c05?.conceptualExplanation ? c05.conceptualExplanation.trim().split(/\s+/).length : 0);
                      return (
                        <div className="flex items-center gap-2">
                          {wordCount > 0 && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                              wordCount >= 250 && wordCount <= 450
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}>
                              {wordCount} words {wordCount >= 250 && wordCount <= 450 ? '• Target Met' : ''}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isComplete
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : hasC05
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            {isComplete ? '[COMPLETE]' : hasC05 ? '[DRAFT]' : '[NOT STARTED]'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {(() => {
                    const c05 = chapter.component05;
                    const explanation = c05?.conceptualExplanation;
                    const analyses = Array.isArray(c05?.syntacticAnalysis) ? c05.syntacticAnalysis : [];
                    const checks = Array.isArray(c05?.conceptChecks) ? c05.conceptChecks : [];
                    const insight = c05?.linguisticInsight;
                    const teacherAnnotations = c05?.teacherAnnotations;

                    if (explanation || analyses.length > 0 || checks.length > 0 || insight) {
                      return (
                        <div className="space-y-4">
                          {/* 1. Core Concept / Theoretical Explanation */}
                          {explanation && (
                            <div className="space-y-1">
                              <span className="text-[#71685E] font-bold block text-xs font-mono uppercase">
                                Core Concept / Theoretical Explanation:
                              </span>
                              <p className="text-xs font-serif text-[#292521] leading-relaxed whitespace-pre-line p-3 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC]">
                                {explanation}
                              </p>
                            </div>
                          )}

                          {/* 2. Syntactic Analysis */}
                          {analyses.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[#71685E] font-bold block text-xs font-mono uppercase">
                                Syntactic Analysis ({analyses.length} Models):
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {analyses.map((item, idx) => (
                                  <div
                                    key={item.id || idx}
                                    className="p-3 rounded-lg bg-[#FFFDF8] border border-[#CBBEAC] text-xs space-y-2"
                                  >
                                    <div className="flex items-start justify-between gap-1 font-serif font-bold text-xs text-[#292521] pb-1 border-b border-[#CBBEAC]/50">
                                      <span>&ldquo;{item.sentence}&rdquo;</span>
                                      {item.isContrastivePair && (
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold border border-purple-200 shrink-0">
                                          Contrastive
                                        </span>
                                      )}
                                    </div>

                                    {/* Visual Tripartite Structure */}
                                    {(item.subjectHeadNoun || item.interveningPhrase || item.verbPhrase) && (
                                      <div className="p-1.5 rounded bg-[#EDE4D6]/60 border border-[#CBBEAC]/70 flex flex-wrap items-center gap-1 text-[10px] font-mono">
                                        <span className="px-1.5 py-0.5 rounded bg-[#5A1832] text-white font-bold text-[9px]">
                                          [{item.subjectHeadNoun || 'HEAD NOUN'}]
                                        </span>
                                        {item.interveningPhrase && (
                                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px]">
                                            ({item.interveningPhrase})
                                          </span>
                                        )}
                                        <span className="text-[#C29A52] font-bold">⟶</span>
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-[9px]">
                                          [{item.verbPhrase || 'VERB'}]
                                        </span>
                                      </div>
                                    )}

                                    <div className="text-[11px] space-y-0.5">
                                      <div><span className="text-[#71685E]">Head Noun:</span> <span className="font-bold text-[#5A1832]">{item.subjectHeadNoun}</span></div>
                                      {item.expandedSubject && <div><span className="text-[#71685E]">Expanded Subject:</span> {item.expandedSubject}</div>}
                                      {item.interveningPhrase && <div><span className="text-amber-900 font-medium">Intervening Material:</span> <span className="italic">{item.interveningPhrase}</span></div>}
                                      <div><span className="text-[#71685E]">Verb Phrase:</span> <span className="font-bold text-[#5A1832]">{item.verbPhrase}</span></div>
                                      <div><span className="text-[#71685E]">Concord:</span> <span className="capitalize font-mono">{item.grammaticalNumber || 'singular'}{item.person ? ` • ${item.person}` : ''}</span></div>
                                      {item.agreementRelationship && (
                                        <div className="text-[10px] font-mono text-[#5A1832] font-semibold bg-[#EDE4D6] p-1 rounded">
                                          {item.agreementRelationship}
                                        </div>
                                      )}
                                      {item.explanation && <p className="text-[10px] text-[#292521] pt-0.5 border-t border-[#CBBEAC]/30">{item.explanation}</p>}
                                      {item.notes && <p className="text-[10px] text-[#71685E] italic pt-0.5 border-t border-[#CBBEAC]/30">{item.notes}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Pause & Think */}
                          {checks.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[#71685E] font-bold block text-xs font-mono uppercase">
                                Pause &amp; Think (Concept Checks):
                              </span>
                              <div className="p-3 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-xs space-y-1">
                                {checks.map((q, qIdx) => (
                                  <div key={qIdx} className="flex items-start gap-1.5">
                                    <span className="font-bold text-[#5A1832] font-mono shrink-0">{qIdx + 1}.</span>
                                    <span className="font-serif text-[#292521]">{q}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Language Insight */}
                          {insight && (
                            <div className="space-y-1">
                              <span className="text-[#71685E] font-bold block text-xs font-mono uppercase">
                                Language Insight:
                              </span>
                              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-300 text-xs font-serif italic text-amber-950">
                                &ldquo;{insight}&rdquo;
                              </div>
                            </div>
                          )}

                          {/* 5. Teacher Annotations */}
                          {teacherAnnotations && (
                            <div className="space-y-1 pt-2 border-t border-dashed border-[#CBBEAC]">
                              <span className="text-[#5A1832] font-bold block text-xs font-mono uppercase flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5" />
                                <span>Teacher Edition Annotations:</span>
                              </span>
                              <div className="p-3 rounded-lg bg-[#EDE4D6]/70 border border-[#CBBEAC] text-xs space-y-2">
                                {teacherAnnotations.teachingFocus && (
                                  <div>
                                    <strong className="text-[#5A1832]">Focus:</strong> {teacherAnnotations.teachingFocus}
                                  </div>
                                )}
                                {teacherAnnotations.commonMisconceptions && teacherAnnotations.commonMisconceptions.length > 0 && (
                                  <div>
                                    <strong className="text-amber-900">Preempt Misconceptions:</strong>
                                    <ul className="list-disc list-inside space-y-0.5 text-[11px] mt-0.5">
                                      {teacherAnnotations.commonMisconceptions.map((m, mIdx) => (
                                        <li key={mIdx}>{m}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {teacherAnnotations.suggestedBoardExplanation && (
                                  <div>
                                    <strong className="text-[#5A1832]">Board Demonstration:</strong> {teacherAnnotations.suggestedBoardExplanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <p className="text-xs text-[#71685E] italic">
                        Theoretical content and syntactic analysis have not been authored yet. Select COMP-05 in Chapter Architecture to generate or draft.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-06: Grammar Rules & Structural Form Boxes */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-06
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Formal Grammar Rules &amp; Structural Form Boxes
                      </h4>
                    </div>
                    {(() => {
                      const c06 = chapter.component06;
                      const hasC06 = Boolean(
                        c06 &&
                        ((c06.formalRuleStatement && c06.formalRuleStatement.trim().length > 0) ||
                         (Array.isArray(c06.ruleVariations) && c06.ruleVariations.length > 0))
                      );
                      const isComplete = c06?.status === 'complete';
                      const rules = chapter.sections
                        ?.flatMap((s) => s.blocks || [])
                        .filter((b) => b.type === 'grammar_rule') || [];

                      if (hasC06) {
                        return (
                          <div className="flex items-center gap-2">
                            {c06?.wordCount ? (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold border bg-stone-100 text-stone-700 border-stone-200">
                                {c06.wordCount} words
                              </span>
                            ) : null}
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isComplete
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {isComplete ? '[COMPLETE]' : '[DRAFT]'}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          rules.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {rules.length > 0 ? `[AUTHORED] (${rules.length} Rules)` : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const c06 = chapter.component06;
                    const hasC06 = Boolean(
                      c06 &&
                      ((c06.formalRuleStatement && c06.formalRuleStatement.trim().length > 0) ||
                       (Array.isArray(c06.ruleVariations) && c06.ruleVariations.length > 0))
                    );

                    if (hasC06 && c06) {
                      return (
                        <div className="space-y-3 text-xs">
                          {c06.ruleIdentifier && (
                            <span className="font-mono text-[10px] font-bold text-[#5A1832] uppercase block">
                              {c06.ruleIdentifier}
                            </span>
                          )}
                          {c06.formalRuleStatement && (
                            <p className="font-serif text-[#292521] leading-relaxed p-3 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC]">
                              {c06.formalRuleStatement}
                            </p>
                          )}
                          {c06.structuralFormula && (
                            <div className="p-2.5 rounded bg-white border border-[#CBBEAC] font-mono text-[11px] text-[#5A1832] font-bold text-center">
                              {c06.structuralFormula}
                            </div>
                          )}
                          {c06.ruleVariations && c06.ruleVariations.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="font-mono text-[10px] font-bold text-[#71685E] uppercase block">
                                Sub-Rule Variations ({c06.ruleVariations.length}):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {c06.ruleVariations.map((v, i) => (
                                  <div key={v.id || i} className="p-2 rounded bg-white border border-[#CBBEAC] text-[11px]">
                                    <strong className="text-[#5A1832] block">{v.title}</strong>
                                    <p className="font-serif text-emerald-950 font-medium mt-0.5">&ldquo;{v.correctExample}&rdquo;</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    const rules = chapter.sections
                      ?.flatMap((s) => s.blocks || [])
                      .filter((b) => b.type === 'grammar_rule') || [];
                    if (rules.length > 0) {
                      return (
                        <div className="space-y-1.5 text-xs">
                          {rules.map((r, i) => (
                            <div key={i} className="p-2.5 rounded bg-[#EDE4D6]/50 border border-[#CBBEAC]">
                              <span className="font-bold text-[#5A1832] block">
                                Rule {i + 1}: {r.calloutTitle || r.title || (r as any).ruleData?.title || 'Grammar Rule'}
                              </span>
                              <p className="text-[11px] text-[#292521] mt-0.5 font-serif">
                                {r.associatedRuleData?.formulaOrPattern || r.calloutText || r.textContent || (r as any).ruleData?.formula || 'Formal rule definition.'}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        Formal rule callouts and form boxes have not been authored yet.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-07: Specimen Sentences & Contrastive Pairs */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-07
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Specimen Sentences &amp; Contrastive Pairs
                      </h4>
                    </div>
                    {(() => {
                      const sets = chapter.sections
                        ?.flatMap((s) => s.blocks || [])
                        .filter((b) => b.type === 'example_set' || b.type === 'example' || b.type === 'example_pair') || [];
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          sets.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {sets.length > 0 ? `[AUTHORED] (${sets.length} Sets)` : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const sets = chapter.sections
                      ?.flatMap((s) => s.blocks || [])
                      .filter((b) => b.type === 'example_set' || b.type === 'example' || b.type === 'example_pair') || [];
                    if (sets.length > 0) {
                      return (
                        <div className="space-y-1.5 text-xs">
                          {sets.map((es, i) => (
                            <div key={i} className="p-2 rounded bg-[#F6F0E7] border border-[#CBBEAC]">
                              <span className="font-bold text-[#5A1832] block">
                                {es.title || (es as any).exampleSet?.title || `Example Group ${i + 1}`}
                              </span>
                              <span className="text-[11px] text-[#71685E]">
                                {es.exampleData?.items?.length || (es as any).exampleSet?.examples?.length || (es.examplePair ? 2 : 1)} Exemplary Sentences
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        Contrastive example pairs have not been defined in theoretical sections.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-08: Visual Pedagogical Anchor & Diagram */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-08
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Visual Pedagogical Anchor &amp; Conceptual Diagram
                      </h4>
                    </div>
                    {(() => {
                      const visualBlock = chapter.sections
                        ?.flatMap((s) => s.blocks || [])
                        .find((b) => b.type === 'visual' || b.type === 'diagram' || b.type === 'illustration');
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          visualBlock ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {visualBlock ? '[AUTHORED]' : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const visualBlock = chapter.sections
                      ?.flatMap((s) => s.blocks || [])
                      .find((b) => b.type === 'visual' || b.type === 'diagram' || b.type === 'illustration');
                    if (visualBlock?.visualData) {
                      return (
                        <div className="space-y-1.5 text-xs">
                          <div className="font-bold text-[#5A1832]">
                            {visualBlock.visualData.title}
                          </div>
                          <p className="text-[#71685E] italic">{visualBlock.visualData.caption}</p>
                          <div className="p-2 rounded bg-[#F6F0E7] font-mono text-[11px] text-[#292521] border border-[#CBBEAC]">
                            Illustration Brief: {visualBlock.visualData.svgIllustrationBrief || 'Specimen brief'}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        No pedagogical visual anchor defined yet for {chapter.title}.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-09: Worked Examples with Step-by-Step Commentary */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-09
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Worked Examples with Step-by-Step Commentary
                      </h4>
                    </div>
                    {(() => {
                      const worked = chapter.sections
                        ?.flatMap((s) => s.blocks || [])
                        .filter((b) => b.type === 'worked_example') || [];
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          worked.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {worked.length > 0 ? `[AUTHORED] (${worked.length} Models)` : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const worked = chapter.sections
                      ?.flatMap((s) => s.blocks || [])
                      .filter((b) => b.type === 'worked_example') || [];
                    if (worked.length > 0) {
                      return (
                        <div className="space-y-1.5 text-xs">
                          {worked.map((w, i) => (
                            <div key={i} className="p-2 rounded bg-[#F6F0E7] border border-[#CBBEAC]">
                              <span className="font-bold text-[#5A1832] block">
                                {w.workedExample?.problem || (w.workedExample as any)?.problemStatement || w.title || `Worked Example ${i + 1}`}
                              </span>
                              <p className="text-[11px] text-[#71685E] mt-0.5">
                                {w.workedExample?.steps?.map((s) => s.sampleWork || s.instruction).join(' → ') ||
                                 (w.workedExample as any)?.stepByStepSolution?.join(' → ') ||
                                 'Step-by-step solution provided.'}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        Step-by-step worked models have not been authored yet.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-10: Common Pitfalls & Examination Traps */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-10
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Common Pitfalls &amp; Examination Traps
                      </h4>
                    </div>
                    {(() => {
                      const errors = chapter.sections
                        ?.flatMap((s) => s.blocks || [])
                        .filter((b) => b.type === 'common_error' || b.type === 'warning_trap') || [];
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          errors.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {errors.length > 0 ? `[AUTHORED] (${errors.length} Traps)` : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const errors = chapter.sections
                      ?.flatMap((s) => s.blocks || [])
                      .filter((b) => b.type === 'common_error' || b.type === 'warning_trap') || [];
                    if (errors.length > 0) {
                      return (
                        <div className="space-y-1.5 text-xs">
                          {errors.map((e, i) => (
                            <div key={i} className="p-2 rounded bg-rose-50 border border-rose-200">
                              <span className="font-bold text-rose-700 block">
                                Trap: ✗ {e.commonError?.incorrectSentence || 'Incorrect usage'}
                              </span>
                              <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                                Fix: ✓ {e.commonError?.correctSentence || 'Correct usage'}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        No common error alerts or exam traps configured in section blocks.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-11: Remember & Board Alert Callouts */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-11
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Remember &amp; Board Alert Callouts
                      </h4>
                    </div>
                    {(() => {
                      const tips = chapter.sections
                        ?.flatMap((s) => s.blocks || [])
                        .filter((b) => (b.type as string) === 'tip_box' || (b.type as string) === 'callout' || b.type === 'tip' || b.type === 'remember' || b.type === 'grammar_tip' || b.type === 'watch_out' || b.type === 'important_note') || [];
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          tips.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {tips.length > 0 ? `[AUTHORED] (${tips.length} Callouts)` : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const tips = chapter.sections
                      ?.flatMap((s) => s.blocks || [])
                      .filter((b) => (b.type as string) === 'tip_box' || (b.type as string) === 'callout' || b.type === 'tip' || b.type === 'remember' || b.type === 'grammar_tip' || b.type === 'watch_out' || b.type === 'important_note') || [];
                    if (tips.length > 0) {
                      return (
                        <div className="space-y-1.5 text-xs">
                          {tips.map((t, i) => (
                            <div key={i} className="p-2 rounded bg-amber-50 border border-amber-200">
                              <span className="font-bold text-amber-900 block">
                                {t.calloutTitle || t.title || (t as any).tipData?.title || 'Tip & Board Alert'}
                              </span>
                              <p className="text-[11px] text-amber-800 mt-0.5">
                                {t.calloutText || t.textContent || (t as any).tipData?.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        No pedagogical tip callouts or board alerts configured.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-12: Guided Practice & Classroom Drills */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-12
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Guided Practice &amp; Classroom Drills
                      </h4>
                    </div>
                    {(() => {
                      const drills = chapter.sections
                        ?.filter((s) => s.id !== 'sec-concept-discovery' && !s.title?.toLowerCase().includes('discovery') && s.metadata?.componentId !== 'comp-4')
                        ?.flatMap((s) => s.blocks || [])
                        .filter((b) =>
                          b.metadata?.componentId !== 'comp-4' &&
                          b.id !== 'blk-discovery-inquiry' &&
                          !b.id?.startsWith('blk-discovery') &&
                          !b.title?.toLowerCase().includes('discovery') &&
                          (b.metadata?.componentId === 'comp-12' ||
                           (b.type as string) === 'practice_drill' ||
                           b.type === 'practice' ||
                           ((b.type === 'try_this' || b.type === 'activity') && b.title?.toLowerCase().includes('guided practice')))
                        ) || [];
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          drills.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {drills.length > 0 ? `[AUTHORED] (${drills.length} Drills)` : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const drills = chapter.sections
                      ?.filter((s) => s.id !== 'sec-concept-discovery' && !s.title?.toLowerCase().includes('discovery') && s.metadata?.componentId !== 'comp-4')
                      ?.flatMap((s) => s.blocks || [])
                      .filter((b) =>
                        b.metadata?.componentId !== 'comp-4' &&
                        b.id !== 'blk-discovery-inquiry' &&
                        !b.id?.startsWith('blk-discovery') &&
                        !b.title?.toLowerCase().includes('discovery') &&
                        (b.metadata?.componentId === 'comp-12' ||
                         (b.type as string) === 'practice_drill' ||
                         b.type === 'practice' ||
                         ((b.type === 'try_this' || b.type === 'activity') && b.title?.toLowerCase().includes('guided practice')))
                      ) || [];
                    if (drills.length > 0) {
                      return (
                        <div className="space-y-1.5 text-xs">
                          {drills.map((d, i) => (
                            <div key={i} className="p-2 rounded bg-[#F6F0E7] border border-[#CBBEAC]">
                              <span className="font-bold text-[#5A1832] block">
                                {d.title || (d as any).practiceDrill?.title || `Classroom Drill ${i + 1}`}
                              </span>
                              <span className="text-[11px] text-[#71685E]">
                                {d.listItems?.length || (d as any).practiceDrill?.items?.length || 1} In-class practice prompts
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        In-class guided practice drills have not been authored yet.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-13: Exercise A: Recognition & Identification */}
                {(() => {
                  const exA = chapter.exercises?.find((e) => e.letter === 'A' || e.letter === '1') || chapter.exercises?.[0];
                  return (
                    <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                            COMP-13
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#292521]">
                            Exercise A: Recognition &amp; Identification Drill
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          exA && exA.questions && exA.questions.length > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {exA && exA.questions && exA.questions.length > 0
                            ? `[AUTHORED] (${exA.questions.length} Questions)`
                            : '[NOT STARTED]'}
                        </span>
                      </div>
                      {exA ? (
                        <div className="text-xs space-y-1 text-[#292521]">
                          <div className="font-bold text-[#5A1832]">
                            {formatExerciseTitle(exA.title, exA.letter)}
                          </div>
                          <p className="text-[#71685E] italic">{exA.instructions}</p>
                          <span className="font-mono text-[11px] text-[#71685E]">
                            {exA.questions?.length || 0} Questions • [{exA.suggestedMarks || 5} M]
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#71685E] italic">
                          Exercise A has not been authored yet.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-14: Exercise B: Fill in the Blanks / Selection */}
                {(() => {
                  const exB = chapter.exercises?.find((e) => e.letter === 'B') || chapter.exercises?.[1];
                  return (
                    <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                            COMP-14
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#292521]">
                            Exercise B: Fill in the Blanks / Selection Drill
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          exB && exB.questions && exB.questions.length > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {exB && exB.questions && exB.questions.length > 0
                            ? `[AUTHORED] (${exB.questions.length} Questions)`
                            : '[NOT STARTED]'}
                        </span>
                      </div>
                      {exB ? (
                        <div className="text-xs space-y-1 text-[#292521]">
                          <div className="font-bold text-[#5A1832]">
                            {formatExerciseTitle(exB.title, exB.letter)}
                          </div>
                          <p className="text-[#71685E] italic">{exB.instructions}</p>
                          <span className="font-mono text-[11px] text-[#71685E]">
                            {exB.questions?.length || 0} Questions • [{exB.suggestedMarks || 5} M]
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#71685E] italic">
                          Exercise B has not been authored yet.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-15: Exercise C: Sentence Rewriting & Transformation */}
                {(() => {
                  const exC = chapter.exercises?.find((e) => e.letter === 'C') || chapter.exercises?.[2];
                  return (
                    <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                            COMP-15
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#292521]">
                            Exercise C: Sentence Rewriting &amp; Transformation Drill
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          exC && exC.questions && exC.questions.length > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {exC && exC.questions && exC.questions.length > 0
                            ? `[AUTHORED] (${exC.questions.length} Questions)`
                            : '[NOT STARTED]'}
                        </span>
                      </div>
                      {exC ? (
                        <div className="text-xs space-y-1 text-[#292521]">
                          <div className="font-bold text-[#5A1832]">
                            {formatExerciseTitle(exC.title, exC.letter)}
                          </div>
                          <p className="text-[#71685E] italic">{exC.instructions}</p>
                          <span className="font-mono text-[11px] text-[#71685E]">
                            {exC.questions?.length || 0} Questions • [{exC.suggestedMarks || 5} M]
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#71685E] italic">
                          Exercise C has not been authored yet.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-16: Exercise D: Error Correction & Editing */}
                {(() => {
                  const exD = chapter.exercises?.find((e) => e.letter === 'D') || chapter.exercises?.[3];
                  return (
                    <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                            COMP-16
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#292521]">
                            Exercise D: Error Correction &amp; Editing Drill
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          exD && exD.questions && exD.questions.length > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {exD && exD.questions && exD.questions.length > 0
                            ? `[AUTHORED] (${exD.questions.length} Questions)`
                            : '[NOT STARTED]'}
                        </span>
                      </div>
                      {exD ? (
                        <div className="text-xs space-y-1 text-[#292521]">
                          <div className="font-bold text-[#5A1832]">
                            {formatExerciseTitle(exD.title, exD.letter)}
                          </div>
                          <p className="text-[#71685E] italic">{exD.instructions}</p>
                          <span className="font-mono text-[11px] text-[#71685E]">
                            {exD.questions?.length || 0} Questions • [{exD.suggestedMarks || 5} M]
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#71685E] italic">
                          Exercise D has not been authored yet.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-17: Exercise E: Contextual Application & Composition */}
                {(() => {
                  const exE = chapter.exercises?.find((e) => e.letter === 'E') || chapter.exercises?.[4];
                  return (
                    <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                            COMP-17
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#292521]">
                            Exercise E: Contextual Application &amp; Composition Drill
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          exE && exE.questions && exE.questions.length > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {exE && exE.questions && exE.questions.length > 0
                            ? `[AUTHORED] (${exE.questions.length} Questions)`
                            : '[NOT STARTED]'}
                        </span>
                      </div>
                      {exE ? (
                        <div className="text-xs space-y-1 text-[#292521]">
                          <div className="font-bold text-[#5A1832]">
                            {formatExerciseTitle(exE.title, exE.letter)}
                          </div>
                          <p className="text-[#71685E] italic">{exE.instructions}</p>
                          <span className="font-mono text-[11px] text-[#71685E]">
                            {exE.questions?.length || 0} Questions • [{exE.suggestedMarks || 5} M]
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#71685E] italic">
                          Exercise E has not been authored yet.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-18: Additional Exercises & Extended Practice Sets */}
                {(() => {
                  const extraExercises = chapter.exercises?.slice(5) || [];
                  return (
                    <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                            COMP-18
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#292521]">
                            Additional Exercises &amp; Extended Practice Sets
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          extraExercises.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {extraExercises.length > 0 ? `[AUTHORED] (${extraExercises.length} Additional Sets)` : '[NOT STARTED]'}
                        </span>
                      </div>
                      {extraExercises.length > 0 ? (
                        <div className="divide-y divide-[#CBBEAC]/50">
                          {extraExercises.map((ex) => (
                            <div key={ex.id} className="py-1.5 text-xs flex items-center justify-between">
                              <span className="font-bold text-[#5A1832]">
                                {formatExerciseTitle(ex.title, ex.letter)}
                              </span>
                              <span className="font-mono text-[#71685E]">
                                {ex.questions?.length || 0} Qs • [{ex.suggestedMarks || 5} M]
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#71685E] italic">
                          No supplementary exercises appended beyond standard drills.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-19: Application / Challenge Drill */}
                {(() => {
                  const challengeEx = chapter.exercises?.find((e) => e.progression === 'challenge');
                  return (
                    <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                            COMP-19
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#292521]">
                            Application &amp; Challenge Mastery Drill
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          challengeEx ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {challengeEx ? '[AUTHORED]' : '[NOT STARTED]'}
                        </span>
                      </div>
                      {challengeEx ? (
                        <div className="text-xs space-y-1 text-[#292521]">
                          <div className="font-bold text-[#5A1832]">
                            {formatExerciseTitle(challengeEx.title, challengeEx.letter)}
                          </div>
                          <p className="text-[#71685E] italic">{challengeEx.instructions}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-[#71685E] italic">
                          HOTS / Challenge drill has not been configured for this chapter.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* COMP-20: Chapter Summary & Rules at a Glance */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-20
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Chapter Summary &amp; Rules at a Glance
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      hasAuthoredSummary ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {hasAuthoredSummary ? '[AUTHORED]' : '[NOT STARTED / DRAFT]'}
                    </span>
                  </div>
                  {hasAuthoredSummary ? (
                    <div className="text-xs space-y-1.5 text-[#292521]">
                      <div>
                        <span className="font-bold text-[#5A1832]">Rules at a Glance Count: </span>
                        <span>
                          {revision?.rulesAtAGlance?.length || ending?.rulesRecap?.length || ending?.rulesAtAGlance?.length || 0} Rules
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-[#5A1832]">Common Examination Pitfalls: </span>
                        <span>
                          {revision?.commonMistakes?.length || ending?.commonTraps?.length || 0} Entries
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-[#5A1832]">Key Glossary Terms: </span>
                        <span>{revision?.keyVocabulary?.length || ending?.keyVocabulary?.length || 0} Terms</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#71685E] italic">
                      Chapter summary and rules at a glance have not been authored yet. Slot remains unpopulated.
                    </p>
                  )}
                </div>

                {/* COMP-21: Summative Assessment Test & Mastery Examination */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-21
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Summative Assessment Test &amp; Mastery Examination
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      chapter.chapterTest ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {chapter.chapterTest ? '[AUTHORED]' : '[NOT STARTED]'}
                    </span>
                  </div>
                  {chapter.chapterTest ? (
                    <div className="text-xs space-y-1 text-[#292521]">
                      <div>
                        <span className="font-bold text-[#5A1832]">Title: </span>
                        <span>{chapter.chapterTest.title}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#5A1832]">Structure: </span>
                        <span>
                          {chapter.chapterTest.sections?.length || 0} Test Sections • {chapter.chapterTest.totalMarks || 25} Marks
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#71685E] italic">
                      Chapter assessment test has not been configured yet.
                    </p>
                  )}
                </div>

                {/* COMP-22: Answer Key & Model Rationale */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-22
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Answer Key &amp; Model Rationale
                      </h4>
                    </div>
                    {(() => {
                      const hasAnswers = Boolean(
                        (chapter.answerKey && chapter.answerKey.length > 0) ||
                        (chapter.exercises || []).some((e) => e.questions?.some((q) => q.correctAnswer))
                      );
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          hasAnswers ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {hasAnswers ? '[AUTHORED]' : '[NOT STARTED]'}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const hasAnswers = Boolean(
                      (chapter.answerKey && chapter.answerKey.length > 0) ||
                      (chapter.exercises || []).some((e) => e.questions?.some((q) => q.correctAnswer))
                    );
                    if (hasAnswers) {
                      return (
                        <p className="text-xs text-[#292521]">
                          Model answer keys and diagnostic rationales configured for exercises.
                        </p>
                      );
                    }
                    return (
                      <p className="text-xs text-[#71685E] italic">
                        Answer keys and teacher rationales have not been compiled yet.
                      </p>
                    );
                  })()}
                </div>

                {/* COMP-23: Teacher Notes & Instructional Guide */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#5A1832] bg-[#EDE4D6] px-2 py-0.5 rounded border border-[#CBBEAC]">
                        COMP-23
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521]">
                        Teacher Instructional Guide &amp; Lesson Plan Flow
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      chapter.teacherNotes ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {chapter.teacherNotes ? '[AUTHORED]' : '[PENDING DRAFT]'}
                    </span>
                  </div>
                  {chapter.teacherNotes ? (
                    <p className="text-xs text-[#292521] line-clamp-2">
                      {typeof chapter.teacherNotes === 'string'
                        ? chapter.teacherNotes
                        : chapter.teacherNotes.pedagogicalNotes || 'Lesson plan sequence and pedagogical notes configured.'}
                    </p>
                  ) : (
                    <p className="text-xs text-[#71685E] italic">
                      Teacher edition lesson flow is pending authoring.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
