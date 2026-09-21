// =============================================================
// VERITAS Academic Publishing — Exercise & Practice Production Studio
// Phase 4F: Professional 3-Column Textbook Exercise Authoring System
// =============================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  StudioExercise,
  GrammarQuestion,
  StudioChapter,
  GrammarSeriesProject,
  ExerciseAuditIssue,
} from '../../types';
import {
  getInitialStudioExercises,
  runExerciseQualityAudit,
  buildExerciseCoverageMatrix,
} from '../../utils/exerciseStudioDefaults';
import { ExerciseStudioTopDashboard } from './exercise-studio/ExerciseStudioTopDashboard';
import { ExerciseNavigatorPanel } from './exercise-studio/ExerciseNavigatorPanel';
import { ExerciseAuthoringCenter } from './exercise-studio/ExerciseAuthoringCenter';
import { ExerciseIntelligencePanel } from './exercise-studio/ExerciseIntelligencePanel';
import { ExerciseCoverageMatrixView } from './exercise-studio/ExerciseCoverageMatrixView';
import { ExerciseStudentPreview } from './exercise-studio/ExerciseStudentPreview';
import { ExerciseTeacherPreview } from './exercise-studio/ExerciseTeacherPreview';
import { AiExerciseGeneratorModal } from './exercise-studio/AiExerciseGeneratorModal';
import { ExerciseQualityAuditModal } from './exercise-studio/ExerciseQualityAuditModal';
import { ExerciseExportIntegrationsModal } from './exercise-studio/ExerciseExportIntegrationsModal';

export interface ExerciseStudioViewProps {
  exercises: StudioExercise[];
  onUpdateExercises: (updated: StudioExercise[]) => void;
  chapter?: StudioChapter;
  onUpdateChapter?: (updatedChapter: StudioChapter) => void;
  seriesProject?: GrammarSeriesProject;
  onSaveToQuestionBank?: (exercise: StudioExercise) => void;
  isDarkMode?: boolean;
  onOpenVisualStudio?: (visualId?: string) => void;
}

export type StudioSubView = 'authoring' | 'coverage_matrix' | 'student_preview' | 'teacher_preview';

export const ExerciseStudioView: React.FC<ExerciseStudioViewProps> = ({
  exercises,
  onUpdateExercises,
  chapter,
  onUpdateChapter,
  seriesProject,
  onSaveToQuestionBank,
  isDarkMode = false,
  onOpenVisualStudio,
}) => {
  // Construct fallback synthetic chapter if not directly provided
  const activeChapter: StudioChapter = useMemo(() => {
    if (chapter) return chapter;
    return {
      id: 'chap-exercise-studio',
      bookId: 'book-grammar-studio',
      chapterNumber: 1,
      title: 'Grammar Practice & Exercises',
      subtitle: 'Applied Syntax, Sentence Transformation & Analysis',
      category: 'Syntax & Concord',
      workflowStatus: 'writing',
      curriculumBoard: 'CISCE',
      equivalentClass: 'Class 6',
      estimatedPages: 6,
      status: 'Draft',
      qualityScore: 0,
      lastSaved: new Date().toISOString(),
      opening: {
        shortIntroduction: '',
        openingHook: '',
        chapterNumber: 1,
        title: 'Grammar Practice & Exercises',
        subtitle: '',
        learningObjectives: [],
        keyVocabulary: [],
        conceptsCovered: [],
        estimatedStudyTimeMinutes: 45,
      },
      sections: [],
      exercises: exercises && exercises.length > 0 ? exercises : [],
      ending: {
        whatYouLearned: [],
        rulesAtAGlance: [],
        commonMistakes: [],
        quickRevisionChecklist: [],
        keyVocabulary: [],
        examReminders: [],
      },
      visuals: [],
      qualityAudit: {
        overallReadinessScore: 94,
        workflowStatus: 'writing',
        lastAudited: new Date().toISOString(),
        dimensions: {
          content: { score: 95, status: 'complete', notes: 'Comprehensive coverage' },
          pedagogy: { score: 94, status: 'complete', notes: 'Scaffolded progression' },
          visualLearning: { score: 92, status: 'complete', notes: 'Stimulus figures present' },
          practice: { score: 96, status: 'complete', notes: 'Multi-tiered practice set' },
          assessment: { score: 93, status: 'complete', notes: 'Aligned with blueprint' },
          editorial: { score: 95, status: 'complete', notes: 'High editorial polish' },
          publishing: { score: 92, status: 'complete', notes: 'Print ready' },
        },
        distinctiveness: {
          score: 92,
          rating: 'High Distinction',
          highlights: ['Rich scaffolding', 'Authentic visual integration'],
          areasForDeepening: [],
          recommendations: [],
        },
        repetitionAlerts: [],
        crossGradeProgression: {
          conceptName: 'Nouns',
          previousTreatmentClass5: '',
          currentTreatmentClass6: '',
          nextLevelTreatmentClass7: '',
        },
        checklistItems: [],
      },
    };
  }, [chapter, exercises]);

  // Preserve active exercises strictly without fabricating fallback content
  const activeExercises = exercises || [];

  // View state
  const [activeSubView, setActiveSubView] = useState<StudioSubView>('authoring');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    activeExercises[0]?.id || ''
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | undefined>(undefined);
  const [selectedQuestionForAi, setSelectedQuestionForAi] = useState<GrammarQuestion | undefined>(undefined);

  // Modals state
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [aiGeneratorInitialMode, setAiGeneratorInitialMode] = useState<any>('generate_entire_exercise');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isExportIntegrationsOpen, setIsExportIntegrationsOpen] = useState(false);

  // Panel collapsing states (Section 24: Left and Right panels can collapse)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isIntelligenceCollapsed, setIsIntelligenceCollapsed] = useState(false);

  // Currently selected exercise
  const currentExercise =
    activeExercises.find((ex) => ex.id === selectedExerciseId) || activeExercises[0];

  // Live Audit findings
  const chapterForAudit: StudioChapter = {
    ...activeChapter,
    exercises: activeExercises,
  };
  const auditResult = useMemo(() => runExerciseQualityAudit(chapterForAudit), [chapterForAudit]);

  // Handlers for modifying exercises
  const handleUpdateCurrentExercise = (updated: StudioExercise) => {
    const nextList = activeExercises.map((ex) => (ex.id === updated.id ? updated : ex));
    onUpdateExercises(nextList);
    if (onUpdateChapter) {
      onUpdateChapter({
        ...activeChapter,
        exercises: nextList,
        lastSaved: new Date().toISOString(),
      });
    }
  };

  // Move a question between exercises (Section 13)
  const handleMoveQuestionToExercise = (questionId: string, targetExerciseId: string) => {
    if (!currentExercise || currentExercise.id === targetExerciseId) return;
    const qToMove = (currentExercise.questions || []).find((q) => q.id === questionId);
    if (!qToMove) return;

    const updatedSourceQuestions = (currentExercise.questions || []).filter((q) => q.id !== questionId);
    const updatedSourceEx: StudioExercise = {
      ...currentExercise,
      questions: updatedSourceQuestions,
      questionCount: updatedSourceQuestions.length,
      suggestedMarks: updatedSourceQuestions.reduce((acc, q) => acc + (q.marks || 1), 0),
    };

    const targetEx = activeExercises.find((e) => e.id === targetExerciseId);
    if (!targetEx) return;
    const updatedTargetQuestions = [...(targetEx.questions || []), qToMove];
    const updatedTargetEx: StudioExercise = {
      ...targetEx,
      questions: updatedTargetQuestions,
      questionCount: updatedTargetQuestions.length,
      suggestedMarks: updatedTargetQuestions.reduce((acc, q) => acc + (q.marks || 1), 0),
    };

    const nextList = activeExercises.map((e) => {
      if (e.id === updatedSourceEx.id) return updatedSourceEx;
      if (e.id === updatedTargetEx.id) return updatedTargetEx;
      return e;
    });

    onUpdateExercises(nextList);
    if (onUpdateChapter) {
      onUpdateChapter({
        ...activeChapter,
        exercises: nextList,
        lastSaved: new Date().toISOString(),
      });
    }
  };

  const handleSaveQuestionToBank = (question: GrammarQuestion) => {
    if (onSaveToQuestionBank && currentExercise) {
      onSaveToQuestionBank({
        ...currentExercise,
        questions: [question],
        questionCount: 1,
        title: `${currentExercise.title} - Item ${question.id}`,
      });
    }
  };

  const handleAddExercise = (newEx: StudioExercise) => {
    const nextList = [...activeExercises, newEx];
    onUpdateExercises(nextList);
    setSelectedExerciseId(newEx.id);
    if (onUpdateChapter) {
      onUpdateChapter({
        ...activeChapter,
        exercises: nextList,
        lastSaved: new Date().toISOString(),
      });
    }
  };

  const handleDeleteExercise = (exId: string) => {
    if (activeExercises.length <= 1) return;
    const nextList = activeExercises.filter((e) => e.id !== exId);
    onUpdateExercises(nextList);
    if (selectedExerciseId === exId) {
      setSelectedExerciseId(nextList[0]?.id || '');
    }
    if (onUpdateChapter) {
      onUpdateChapter({
        ...activeChapter,
        exercises: nextList,
        lastSaved: new Date().toISOString(),
      });
    }
  };

  const handleCreateBlankExercise = () => {
    const nextLetter = String.fromCharCode(65 + activeExercises.length);
    const newEx: StudioExercise = {
      id: `ex-${Date.now()}-${nextLetter}`,
      letter: nextLetter,
      title: `Exercise ${nextLetter}`,
      progression: 'application',
      developmentalTier: 'APPLICATION',
      status: 'Drafting',
      instructions: 'Complete the following questions.',
      difficulty: 'Medium',
      suggestedMarks: 5,
      questions: [],
    };
    handleAddExercise(newEx);
  };

  const handleDuplicateExercise = (ex: StudioExercise) => {
    const nextLetter = String.fromCharCode(65 + activeExercises.length);
    const duplicated: StudioExercise = {
      ...ex,
      id: `ex-${Date.now()}-${nextLetter}`,
      letter: nextLetter,
      title: `${ex.title} (Variant)`,
      status: 'Author Review',
      questions: (ex.questions || []).map((q, i) => ({
        ...q,
        id: `q-${Date.now()}-${i}`,
      })),
    };
    handleAddExercise(duplicated);
  };

  const handleReorderExercises = (startIndex: number, endIndex: number) => {
    const result: StudioExercise[] = [...activeExercises];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    // Re-index letters A, B, C...
    const relettered: StudioExercise[] = result.map((ex, i) => ({
      ...ex,
      letter: String.fromCharCode(65 + i),
    }));
    onUpdateExercises(relettered);
    if (onUpdateChapter) {
      onUpdateChapter({
        ...activeChapter,
        exercises: relettered,
        lastSaved: new Date().toISOString(),
      });
    }
  };

  // AI Generation workflows
  const handleOpenAiWithMode = (mode: any) => {
    setAiGeneratorInitialMode(mode);
    setIsAiGeneratorOpen(true);
  };

  const handleAcceptAiQuestionsIntoExercise = (
    exerciseId: string,
    newQuestions: GrammarQuestion[]
  ) => {
    const targetEx = activeExercises.find((e) => e.id === exerciseId);
    if (!targetEx) return;
    const updatedQuestions = [...(targetEx.questions || []), ...newQuestions];
    const updatedEx: StudioExercise = {
      ...targetEx,
      questions: updatedQuestions,
      questionCount: updatedQuestions.length,
      suggestedMarks: (targetEx.suggestedMarks || 0) + newQuestions.length,
    };
    handleUpdateCurrentExercise(updatedEx);
  };

  // Compute coverage matrix
  const coverageResult = useMemo(
    () => buildExerciseCoverageMatrix(chapterForAudit),
    [chapterForAudit]
  );

  return (
    <div
      id="exercise-practice-production-studio"
      className="h-full flex flex-col min-h-0 bg-[#FAF7F2] text-[#292521] select-none"
    >
      {/* 1. TOP DASHBOARD & METRICS BAR */}
      <ExerciseStudioTopDashboard
        chapter={activeChapter}
        activeView={activeSubView}
        onSelectView={setActiveSubView}
        onOpenAiGenerator={() => handleOpenAiWithMode('generate_entire_exercise')}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenExportModal={() => setIsExportIntegrationsOpen(true)}
        onAddNewExercise={handleCreateBlankExercise}
        auditResult={auditResult}
        coveragePercentage={coverageResult.coveragePercentage}
      />

      {/* 2. SUBVIEW ROUTING */}
      {activeSubView === 'authoring' && currentExercise && (
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* LEFT COLUMN: EXERCISE NAVIGATOR (280px) */}
          <ExerciseNavigatorPanel
            exercises={activeExercises}
            selectedExerciseId={selectedExerciseId}
            onSelectExercise={(id) => {
              setSelectedExerciseId(id);
              setSelectedQuestionId(undefined);
            }}
            onAddExercise={handleCreateBlankExercise}
            onDeleteExercise={handleDeleteExercise}
            onDuplicateExercise={(id) => {
              const ex = activeExercises.find((e) => e.id === id);
              if (ex) handleDuplicateExercise(ex);
            }}
            onMoveExercise={(index, direction) => {
              const targetIdx = direction === 'up' ? index - 1 : index + 1;
              if (targetIdx >= 0 && targetIdx < activeExercises.length) {
                handleReorderExercises(index, targetIdx);
              }
            }}
            isCollapsed={isNavCollapsed}
            onToggleCollapse={() => setIsNavCollapsed((prev) => !prev)}
            onOpenAiGenerator={() => handleOpenAiWithMode('generate_entire_exercise')}
          />

          {/* MIDDLE COLUMN: EXERCISE & QUESTIONS AUTHORING (flex-1) */}
          <ExerciseAuthoringCenter
            exercise={currentExercise}
            onUpdateExercise={handleUpdateCurrentExercise}
            onOpenVisualStudio={onOpenVisualStudio}
            onOpenAiGeneratorForQuestion={(q) => {
              setSelectedQuestionForAi(q);
              handleOpenAiWithMode('more_like_this');
            }}
            onSelectQuestionForIntelligence={setSelectedQuestionId}
            selectedQuestionId={selectedQuestionId}
            availableExercises={activeExercises}
            onMoveQuestionToExercise={handleMoveQuestionToExercise}
            onSaveToQuestionBank={handleSaveQuestionToBank}
          />

          {/* RIGHT COLUMN: PROPERTIES & CURRICULUM INTELLIGENCE (320px) */}
          <ExerciseIntelligencePanel
            exercise={currentExercise}
            chapter={activeChapter}
            onUpdateExercise={handleUpdateCurrentExercise}
            auditIssues={auditResult.findings}
            onOpenAiGeneratorWithMode={handleOpenAiWithMode}
            selectedQuestionId={selectedQuestionId}
            isCollapsed={isIntelligenceCollapsed}
            onToggleCollapse={() => setIsIntelligenceCollapsed((prev) => !prev)}
          />
        </div>
      )}

      {/* 3. COVERAGE MATRIX VIEW */}
      {activeSubView === 'coverage_matrix' && (
        <ExerciseCoverageMatrixView
          chapter={chapterForAudit}
          onSelectExercise={(exLetter) => {
            const found = activeExercises.find((e) => e.letter === exLetter);
            if (found) {
              setSelectedExerciseId(found.id);
              setActiveSubView('authoring');
            }
          }}
          onOpenAiGeneratorForUncovered={(concept) => {
            handleOpenAiWithMode('from_concept');
          }}
        />
      )}

      {/* 4. STUDENT EDITION SIMULATED TEXTBOOK PREVIEW */}
      {activeSubView === 'student_preview' && (
        <ExerciseStudentPreview
          chapter={chapterForAudit}
          onOpenVisualStudio={onOpenVisualStudio}
        />
      )}

      {/* 5. TEACHER EDITION ANNOTATED MASTER KEY PREVIEW */}
      {activeSubView === 'teacher_preview' && (
        <ExerciseTeacherPreview chapter={chapterForAudit} />
      )}

      {/* 6. MODALS */}
      {isAiGeneratorOpen && currentExercise && (
        <AiExerciseGeneratorModal
          isOpen={isAiGeneratorOpen}
          onClose={() => setIsAiGeneratorOpen(false)}
          chapter={activeChapter}
          currentExercise={currentExercise}
          initialMode={aiGeneratorInitialMode}
          sourceQuestion={selectedQuestionForAi}
          onAcceptQuestionsIntoExercise={handleAcceptAiQuestionsIntoExercise}
          onAcceptAsNewExercise={handleAddExercise}
        />
      )}

      {isAuditModalOpen && (
        <ExerciseQualityAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          chapter={chapterForAudit}
          onJumpToExercise={(letter) => {
            const found = activeExercises.find((e) => e.letter === letter);
            if (found) {
              setSelectedExerciseId(found.id);
              setActiveSubView('authoring');
            }
          }}
        />
      )}

      {isExportIntegrationsOpen && (
        <ExerciseExportIntegrationsModal
          isOpen={isExportIntegrationsOpen}
          onClose={() => setIsExportIntegrationsOpen(false)}
          chapter={chapterForAudit}
          onSendToQuestionBank={(questions) => {
            if (onSaveToQuestionBank && currentExercise) {
              onSaveToQuestionBank({
                ...currentExercise,
                questions,
              });
            }
          }}
        />
      )}
    </div>
  );
};
