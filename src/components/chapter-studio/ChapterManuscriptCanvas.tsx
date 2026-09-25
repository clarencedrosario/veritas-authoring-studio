import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Loader2,
  Eye,
  Award,
  Save,
  CheckCircle2,
  Clock,
  ChevronDown,
  Plus,
  Trash2,
  Edit3,
  Copy,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  BookOpen,
  Check,
  AlertTriangle,
  Lightbulb,
  FileText,
  SlidersHorizontal,
  GraduationCap,
  Key,
  Layers,
  HelpCircle,
  ShieldCheck,
  Move,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Target,
} from 'lucide-react';
import {
  StudioChapter,
  ChapterSection,
  TextbookContentBlock,
  ContentBlockType,
  ChapterWorkflowStatus,
  StudioExercise,
  Component05Data,
  SyntacticAnalysisItem,
  Component05TeacherAnnotations,
} from '../../types';
import { BookArchitectureConfig } from '../book-planner/architecture/types';
import { mapComponentToStudioView } from './architecture/chapterArchitectureBridge';
import { ExerciseStudioView } from './ExerciseStudioView';
import { ChapterSetupView } from './ChapterSetupView';
import { ExamplesStudioView } from './ExamplesStudioView';
import { VisualsStudioView } from './VisualsStudioView';
import { RuleStudioView } from './RuleStudioView';
import { ChapterSummaryRevisionView } from './ChapterSummaryRevisionView';
import { TeacherAuthorNotesView } from './TeacherAuthorNotesView';
import { ChapterAssessmentView } from './ChapterAssessmentView';
import { AnswerKeyStudioView } from './AnswerKeyStudioView';
import { ChapterChallengeDrillView } from './ChapterChallengeDrillView';
import { ChapterAuditStudioView } from './ChapterAuditStudioView';
import { Component06RulesAuthoring } from './Component06RulesAuthoring';
import { ReusableComponentView } from './engine/ReusableComponentView';
import { TextbookMarkdown } from '../common/TextbookMarkdown';
import { cleanHeadingTitle, cleanMarkdownSyntax } from '../../utils/pedagogicalProfileSystem';

export interface ChapterManuscriptCanvasProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  activeView: string;
  activeSectionId: string;
  onSelectSection?: (sectionId: string) => void;
  onSelectView?: (view: any) => void;
  onOpenPreview: () => void;
  onOpenQualityAudit: () => void;
  onOpenVisualStudio: (visualId?: string) => void;
  onOpenBoardAdapt?: () => void;
  onEditBlock: (block: TextbookContentBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onAddBlockToCurrentSection: (type: ContentBlockType) => void;
  seriesProject: any;
  onSaveToQuestionBank?: (exercise: StudioExercise) => void;
  isDarkMode: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  architecture?: BookArchitectureConfig;
  activeArchitectureItemId?: string;
}

export const ChapterManuscriptCanvas: React.FC<ChapterManuscriptCanvasProps> = ({
  chapter,
  onUpdateChapter,
  activeView,
  activeSectionId,
  onSelectView,
  onOpenPreview,
  onOpenQualityAudit,
  onOpenVisualStudio,
  onOpenBoardAdapt,
  onEditBlock,
  onDeleteBlock,
  onMoveBlock,
  onAddBlockToCurrentSection,
  seriesProject,
  onSaveToQuestionBank,
  isDarkMode,
  onScroll,
  scrollRef,
  architecture,
  activeArchitectureItemId,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
  const [isGeneratingDiscoveryVignette, setIsGeneratingDiscoveryVignette] = useState(false);
  const [discoveryNotice, setDiscoveryNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Component 5: Theoretical Content & Syntactic Analysis State
  const [isGeneratingComp05, setIsGeneratingComp05] = useState(false);
  const [comp05Notice, setComp05Notice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showRegenerateConfirm05, setShowRegenerateConfirm05] = useState(false);

  const handleGenerateDiscoveryVignette = async () => {
    setIsGeneratingDiscoveryVignette(true);
    setDiscoveryNotice(null);
    try {
      const currentVignette =
        chapter.opening.discoveryVignette ||
        chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'text')?.textContent ||
        '';
      const currentQuestions =
        chapter.opening.discoveryQuestions ||
        chapter.opening.discoveryQuestion ||
        chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'try_this')?.textContent ||
        '';

      const payload = {
        board: chapter.systemId || 'CISCE',
        grade: chapter.equivalentClass || 'Class 6',
        classLevel: chapter.equivalentClass || 'Class 6',
        chapterTitle: chapter.title || 'Subject–Verb Agreement: Concord & Syntactic Synthesis',
        grammarTopic: chapter.shortTitle || chapter.title || 'Subject–Verb Agreement',
        componentNumber: 4,
        existingContextualVignette: currentVignette,
        existingGuidedDiscoveryQuestions: currentQuestions,
      };

      const res = await fetch('/api/chapter-studio/generate-discovery-vignette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const generatedVignette = typeof data.contextualVignette === 'string' ? data.contextualVignette.trim() : '';
      let generatedQuestions = '';
      if (Array.isArray(data.guidedDiscoveryQuestions)) {
        generatedQuestions = data.guidedDiscoveryQuestions
          .map((q: string, idx: number) => {
            const trimmed = q.trim();
            return trimmed.match(/^\d+[\.\)]/) ? trimmed : `${idx + 1}. ${trimmed}`;
          })
          .join('\n\n');
      } else if (typeof data.guidedDiscoveryQuestions === 'string') {
        generatedQuestions = data.guidedDiscoveryQuestions.trim();
      }

      let updatedSections = [...(chapter.sections || [])];
      const discoveryIndex = updatedSections.findIndex(
        (s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery')
      );

      const discoveryBlocks: TextbookContentBlock[] = [
        {
          id: `blk-discovery-vignette-${Date.now()}`,
          type: 'text',
          title: 'The Editorial Dilemma: Contextual Discovery Scenario',
          textContent: generatedVignette,
          metadata: { componentId: 'comp-4', stage: 'concept_introduction' },
          order: 1,
          visibility: 'student',
        },
        {
          id: `blk-discovery-inquiry-${Date.now()}`,
          type: 'try_this',
          title: 'Notice & Inquire: Guided Discovery Questions',
          textContent: generatedQuestions,
          metadata: { componentId: 'comp-4', stage: 'concept_introduction' },
          order: 2,
          visibility: 'student',
        },
      ];

      if (discoveryIndex >= 0) {
        updatedSections[discoveryIndex] = {
          ...updatedSections[discoveryIndex],
          blocks: discoveryBlocks,
        };
      } else {
        updatedSections.splice(0, 0, {
          id: 'sec-concept-discovery',
          chapterId: chapter.id,
          title: 'Concept Discovery: The School Newspaper Dilemma',
          numberLabel: '1.1',
          order: 1,
          blocks: discoveryBlocks,
        });
      }

      const updatedChapter: StudioChapter = {
        ...chapter,
        opening: {
          ...chapter.opening,
          discoveryVignette: generatedVignette,
          discoveryQuestions: generatedQuestions,
          discoveryQuestion: generatedQuestions,
        },
        sections: updatedSections,
        stageStatuses: {
          ...chapter.stageStatuses,
          concept_intro: 'in_progress',
        },
      };

      onUpdateChapter(updatedChapter);
      setDiscoveryNotice({
        type: 'success',
        message: 'Discovery Vignette and guided inquiry questions successfully generated and saved to Draft.',
      });
    } catch (err: any) {
      console.error('Failed to generate discovery vignette:', err);
      setDiscoveryNotice({
        type: 'error',
        message: 'Could not generate discovery vignette. Please try again or edit manually.',
      });
    } finally {
      setIsGeneratingDiscoveryVignette(false);
    }
  };

  const handleVignetteChange = (newVignette: string) => {
    let updatedSections = [...(chapter.sections || [])];
    const discoveryIndex = updatedSections.findIndex(
      (s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery')
    );
    if (discoveryIndex >= 0) {
      const existingBlocks = updatedSections[discoveryIndex].blocks || [];
      const hasTextBlock = existingBlocks.some((b) => b.type === 'text');
      const updatedBlocks = hasTextBlock
        ? existingBlocks.map((b) => (b.type === 'text' ? { ...b, textContent: newVignette } : b))
        : [
            {
              id: `blk-discovery-text-${Date.now()}`,
              type: 'text' as const,
              title: 'Contextual Discovery Scenario',
              textContent: newVignette,
              metadata: { componentId: 'comp-4', stage: 'concept_introduction' },
              order: 1,
              visibility: 'student' as const,
            },
            ...existingBlocks,
          ];
      updatedSections[discoveryIndex] = {
        ...updatedSections[discoveryIndex],
        blocks: updatedBlocks,
      };
    } else {
      updatedSections.splice(0, 0, {
        id: 'sec-concept-discovery',
        chapterId: chapter.id,
        title: 'Concept Discovery: Authentic Reading Scenario',
        numberLabel: '1.1',
        order: 1,
        blocks: [
          {
            id: `blk-discovery-text-${Date.now()}`,
            type: 'text',
            title: 'Contextual Discovery Scenario',
            textContent: newVignette,
            metadata: { componentId: 'comp-4', stage: 'concept_introduction' },
            order: 1,
            visibility: 'student',
          },
        ],
      });
    }

    onUpdateChapter({
      ...chapter,
      opening: {
        ...chapter.opening,
        discoveryVignette: newVignette,
      },
      sections: updatedSections,
      stageStatuses: {
        ...chapter.stageStatuses,
        concept_intro: 'in_progress',
      },
    });
  };

  const handleQuestionsChange = (newQuestions: string) => {
    let updatedSections = [...(chapter.sections || [])];
    const discoveryIndex = updatedSections.findIndex(
      (s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery')
    );
    if (discoveryIndex >= 0) {
      const existingBlocks = updatedSections[discoveryIndex].blocks || [];
      const hasInquiryBlock = existingBlocks.some((b) => b.type === 'try_this');
      const updatedBlocks = hasInquiryBlock
        ? existingBlocks.map((b) => (b.type === 'try_this' ? { ...b, textContent: newQuestions } : b))
        : [
            ...existingBlocks,
            {
              id: `blk-discovery-questions-${Date.now()}`,
              type: 'try_this' as const,
              title: 'Notice & Inquire: Guided Discovery Questions',
              textContent: newQuestions,
              metadata: { componentId: 'comp-4', stage: 'concept_introduction' },
              order: 2,
              visibility: 'student' as const,
            },
          ];
      updatedSections[discoveryIndex] = {
        ...updatedSections[discoveryIndex],
        blocks: updatedBlocks,
      };
    } else {
      updatedSections.splice(0, 0, {
        id: 'sec-concept-discovery',
        chapterId: chapter.id,
        title: 'Concept Discovery: Authentic Reading Scenario',
        numberLabel: '1.1',
        order: 1,
        blocks: [
          {
            id: `blk-discovery-questions-${Date.now()}`,
            type: 'try_this',
            title: 'Notice & Inquire: Guided Discovery Questions',
            textContent: newQuestions,
            metadata: { componentId: 'comp-4', stage: 'concept_introduction' },
            order: 2,
            visibility: 'student',
          },
        ],
      });
    }

    onUpdateChapter({
      ...chapter,
      opening: {
        ...chapter.opening,
        discoveryQuestions: newQuestions,
        discoveryQuestion: newQuestions,
      },
      sections: updatedSections,
      stageStatuses: {
        ...chapter.stageStatuses,
        concept_intro: 'in_progress',
      },
    });
  };

  // ==========================================================================
  // COMPONENT 5: Theoretical Content & Syntactic Analysis Handlers
  // ==========================================================================
  const handleGenerateComp05 = async (force = false) => {
    const c05 = chapter.component05;
    const hasExistingContent = Boolean(
      c05 &&
      ((c05.conceptualExplanation && c05.conceptualExplanation.trim().length > 0) ||
       (Array.isArray(c05.syntacticAnalysis) && c05.syntacticAnalysis.length > 0) ||
       (Array.isArray(c05.conceptChecks) && c05.conceptChecks.length > 0) ||
       (c05.linguisticInsight && c05.linguisticInsight.trim().length > 0))
    );

    if (hasExistingContent && !force) {
      setShowRegenerateConfirm05(true);
      return;
    }

    setShowRegenerateConfirm05(false);
    setIsGeneratingComp05(true);
    setComp05Notice(null);

    try {
      const payload = {
        board: chapter.curriculumBoard || chapter.systemId || 'CISCE',
        grade: chapter.equivalentClass || 'Class 6',
        classLevel: chapter.equivalentClass || 'Class 6',
        chapterTitle: chapter.title || 'Subject–Verb Agreement: Concord & Syntactic Synthesis',
        grammarTopic: chapter.shortTitle || chapter.title?.split(':')[0]?.trim() || 'Subject–Verb Agreement',
        chapterObjectives: chapter.opening?.learningObjectives || [],
        priorKnowledgeContent: chapter.prerequisiteKnowledge || '',
        discoveryVignette: chapter.opening?.discoveryVignette || '',
        discoveryQuestions: chapter.opening?.discoveryQuestions || '',
        existingConceptualExplanation: c05?.conceptualExplanation || '',
        existingSyntacticAnalysis: c05?.syntacticAnalysis || [],
        existingConceptChecks: c05?.conceptChecks || [],
        existingLinguisticInsight: c05?.linguisticInsight || '',
        componentNumber: 5,
      };

      const res = await fetch('/api/chapter-studio/generate-theoretical-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const updatedComponent05: Component05Data = {
        status: 'draft',
        conceptualExplanation: typeof data.conceptualExplanation === 'string' ? data.conceptualExplanation.trim() : '',
        syntacticAnalysis: Array.isArray(data.syntacticAnalysis) ? data.syntacticAnalysis : [],
        conceptChecks: Array.isArray(data.conceptChecks)
          ? data.conceptChecks
          : typeof data.conceptChecks === 'string'
          ? data.conceptChecks.split('\n').filter(Boolean)
          : [],
        linguisticInsight: typeof data.linguisticInsight === 'string' ? data.linguisticInsight.trim() : '',
        teacherAnnotations: data.teacherAnnotations || undefined,
        wordCount: data.wordCount || (data.conceptualExplanation ? data.conceptualExplanation.trim().split(/\s+/).length : 0),
        generatedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        generationMetadata: data.generationMetadata || {
          board: chapter.curriculumBoard || 'CISCE',
          grade: chapter.equivalentClass || 'Class 6',
          topic: chapter.title,
          model: 'gemini-3.8-flash',
          generatedAt: new Date().toISOString(),
        },
      };

      const updatedChapter: StudioChapter = {
        ...chapter,
        component05: updatedComponent05,
        stageStatuses: {
          ...chapter.stageStatuses,
          explanation: 'in_progress',
        },
        lastSaved: new Date().toISOString(),
        saveStatus: 'saved',
      };

      onUpdateChapter(updatedChapter);
      setComp05Notice({
        type: 'success',
        message: 'Theoretical Content & Syntactic Analysis generated and saved to Draft.',
      });
    } catch (err: any) {
      console.error('Failed to generate theoretical explanation:', err);
      setComp05Notice({
        type: 'error',
        message: `Generation failed: ${err.message || 'Unable to contact generation engine.'}`,
      });
    } finally {
      setIsGeneratingComp05(false);
    }
  };

  const handleComp05ExplanationChange = (newText: string) => {
    const prevC05 = chapter.component05 || {};
    const wordCount = newText.trim() ? newText.trim().split(/\s+/).length : 0;
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      conceptualExplanation: newText,
      wordCount,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      stageStatuses: {
        ...chapter.stageStatuses,
        explanation: 'in_progress',
      },
      lastSaved: new Date().toISOString(),
    });
  };

  const handleComp05SyntacticItemChange = (
    index: number,
    field: keyof SyntacticAnalysisItem,
    value: any
  ) => {
    const prevC05 = chapter.component05 || {};
    const currentList: SyntacticAnalysisItem[] = Array.isArray(prevC05.syntacticAnalysis)
      ? [...prevC05.syntacticAnalysis]
      : [];
    if (!currentList[index]) {
      currentList[index] = {
        sentence: '',
        subjectHeadNoun: '',
        verbPhrase: '',
      };
    }
    currentList[index] = {
      ...currentList[index],
      [field]: value,
    };
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      syntacticAnalysis: currentList,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      stageStatuses: {
        ...chapter.stageStatuses,
        explanation: 'in_progress',
      },
      lastSaved: new Date().toISOString(),
    });
  };

  const handleAddSyntacticItem = () => {
    const prevC05 = chapter.component05 || {};
    const currentList: SyntacticAnalysisItem[] = Array.isArray(prevC05.syntacticAnalysis)
      ? [...prevC05.syntacticAnalysis]
      : [];
    currentList.push({
      id: `syn-${Date.now()}`,
      sentence: '',
      subjectHeadNoun: '',
      expandedSubject: '',
      interveningPhrase: '',
      verbPhrase: '',
      grammaticalNumber: 'singular',
      person: '3rd person',
      agreementRelationship: '',
      explanation: '',
      notes: '',
      isContrastivePair: false,
    });
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      syntacticAnalysis: currentList,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleTeacherAnnotationChange = (
    field: keyof Component05TeacherAnnotations,
    value: any
  ) => {
    const prevC05 = chapter.component05 || {};
    const prevAnnotations: Component05TeacherAnnotations = prevC05.teacherAnnotations || {
      teachingFocus: '',
      terminologyGuidance: '',
      commonMisconceptions: [],
      suggestedBoardExplanation: '',
      questioningStrategies: [],
      diagnosticObservations: '',
      extensionSuggestions: '',
    };
    const updatedAnnotations: Component05TeacherAnnotations = {
      ...prevAnnotations,
      [field]: value,
    };
    const updatedComponent05: Component05Data = {
      ...prevC05,
      teacherAnnotations: updatedAnnotations,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleRemoveSyntacticItem = (index: number) => {
    const prevC05 = chapter.component05 || {};
    const currentList: SyntacticAnalysisItem[] = Array.isArray(prevC05.syntacticAnalysis)
      ? [...prevC05.syntacticAnalysis]
      : [];
    currentList.splice(index, 1);
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      syntacticAnalysis: currentList,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleMoveSyntacticItem = (index: number, direction: 'up' | 'down') => {
    const prevC05 = chapter.component05 || {};
    const currentList: SyntacticAnalysisItem[] = Array.isArray(prevC05.syntacticAnalysis)
      ? [...prevC05.syntacticAnalysis]
      : [];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;
    const temp = currentList[index];
    currentList[index] = currentList[targetIdx];
    currentList[targetIdx] = temp;
    const updatedComponent05: Component05Data = {
      ...prevC05,
      syntacticAnalysis: currentList,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleConceptCheckChange = (index: number, value: string) => {
    const prevC05 = chapter.component05 || {};
    const currentList: string[] = Array.isArray(prevC05.conceptChecks)
      ? [...prevC05.conceptChecks]
      : [];
    currentList[index] = value;
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      conceptChecks: currentList,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      stageStatuses: {
        ...chapter.stageStatuses,
        explanation: 'in_progress',
      },
      lastSaved: new Date().toISOString(),
    });
  };

  const handleAddConceptCheck = () => {
    const prevC05 = chapter.component05 || {};
    const currentList: string[] = Array.isArray(prevC05.conceptChecks)
      ? [...prevC05.conceptChecks]
      : [];
    currentList.push('');
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      conceptChecks: currentList,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleRemoveConceptCheck = (index: number) => {
    const prevC05 = chapter.component05 || {};
    const currentList: string[] = Array.isArray(prevC05.conceptChecks)
      ? [...prevC05.conceptChecks]
      : [];
    currentList.splice(index, 1);
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      conceptChecks: currentList,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleLinguisticInsightChange = (newText: string) => {
    const prevC05 = chapter.component05 || {};
    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: prevC05.status === 'complete' ? 'complete' : 'draft',
      linguisticInsight: newText,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      stageStatuses: {
        ...chapter.stageStatuses,
        explanation: 'in_progress',
      },
      lastSaved: new Date().toISOString(),
    });
  };

  const handleToggleComp05Status = () => {
    const prevC05 = chapter.component05 || {};
    const currentStatus = prevC05.status || 'draft';
    const nextStatus: 'draft' | 'complete' | 'needs_review' =
      currentStatus === 'complete' ? 'needs_review' : currentStatus === 'needs_review' ? 'draft' : 'complete';

    const updatedComponent05: Component05Data = {
      ...prevC05,
      status: nextStatus,
      lastModified: new Date().toISOString(),
    };
    onUpdateChapter({
      ...chapter,
      component05: updatedComponent05,
      stageStatuses: {
        ...chapter.stageStatuses,
        explanation: nextStatus === 'complete' ? 'complete' : 'in_progress',
      },
      lastSaved: new Date().toISOString(),
    });
  };

  const activeSection =
    chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];

  // Resolve effective view to guarantee the center canvas is NEVER blank
  const effectiveView = useMemo(() => {
    const validViews = [
      'setup', 'opener', 'objectives', 'warm_up', 'concept_intro',
      'section', 'explanation', 'rules', 'concepts', 'examples',
      'visuals', 'worked_examples', 'common_errors', 'tips',
      'guided_practice', 'exercises', 'challenge', 'summary',
      'ending', 'assessment', 'test', 'answer_key', 'teacher_notes',
      'teacher_guide', 'preview', 'student_preview', 'teacher_preview', 'audit'
    ];
    if (activeView && validViews.includes(activeView)) {
      return activeView;
    }
    // If activeView is 'content', 'write', empty, or unrecognized, restore from activeArchitectureItemId or fallback
    const fallbackTarget = mapComponentToStudioView(
      activeArchitectureItemId || 'comp-1',
      architecture,
      activeSectionId || chapter.sections?.[0]?.id
    );
    return fallbackTarget.viewId || 'opener';
  }, [activeView, activeArchitectureItemId, architecture, activeSectionId, chapter.sections]);

  const handleStatusChange = (newStatus: ChapterWorkflowStatus) => {
    onUpdateChapter({
      ...chapter,
      workflowStatus: newStatus,
      lastSaved: new Date().toISOString(),
      saveStatus: 'saved',
    });
  };

  const handleManualSave = () => {
    onUpdateChapter({
      ...chapter,
      lastSaved: new Date().toISOString(),
      saveStatus: 'saved',
    });
  };

  const handleConvertExampleToQuestion = (sentence: string, highlight?: string) => {
    if (!chapter.exercises || chapter.exercises.length === 0) return;
    const targetEx = chapter.exercises[0];
    const newQuestion = {
      id: `q-conv-${Date.now()}`,
      type: 'fill_in_blanks' as const,
      prompt: `Fill in the blank with the correct verb concord: ${sentence.replace(
        highlight || 'delivers',
        '_____'
      )}`,
      sentence: sentence,
      targetWord: highlight,
      correctAnswer: highlight || '',
      difficulty: 'Medium' as const,
      marks: 1,
      explanation: `Concord rule applied for: ${highlight}`,
    };
    const updatedEx = {
      ...targetEx,
      questions: [...targetEx.questions, newQuestion],
    };
    const updatedExercises = chapter.exercises.map((e) =>
      e.id === targetEx.id ? updatedEx : e
    );
    onUpdateChapter({
      ...chapter,
      exercises: updatedExercises,
      lastSaved: new Date().toISOString(),
    });
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0 min-w-0 text-xs select-text overflow-hidden bg-[#F6F0E7]">
      {/* Formatting & Block Toolbar */}
      <div
        className="px-3 py-1.5 border-b border-[#CBBEAC] flex flex-wrap items-center justify-between gap-2 shrink-0 select-none bg-[#EDE4D6] text-[#292521]"
      >
        <div className="flex items-center space-x-1 flex-wrap">
          <span className="font-bold text-[10px] uppercase text-[#71685E] mr-1">Toolbar:</span>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FFFDF8] text-[#292521] border border-transparent hover:border-[#CBBEAC] transition-colors cursor-pointer"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5 text-[#5A1832]" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FFFDF8] text-[#292521] border border-transparent hover:border-[#CBBEAC] transition-colors cursor-pointer"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5 text-[#5A1832]" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FFFDF8] text-[#292521] border border-transparent hover:border-[#CBBEAC] transition-colors cursor-pointer"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5 text-[#5A1832]" />
          </button>
          <span className="text-[#CBBEAC] mx-0.5">|</span>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FFFDF8] text-[#292521] border border-transparent hover:border-[#CBBEAC] transition-colors cursor-pointer"
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5 text-[#5A1832]" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FFFDF8] text-[#292521] border border-transparent hover:border-[#CBBEAC] transition-colors cursor-pointer"
            title="Numbered list"
          >
            <ListOrdered className="w-3.5 h-3.5 text-[#5A1832]" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md hover:bg-[#FFFDF8] text-[#292521] border border-transparent hover:border-[#CBBEAC] transition-colors cursor-pointer"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5 text-[#5A1832]" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Canvas Content Area (One Scroll Owner, flex: 1 1 auto, min-height: 0, pb: 96px) */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 min-h-0 overscroll-contain w-full pb-[96px]"
      >
        {/* Stage 1: Chapter Setup View */}
        {effectiveView === 'setup' && (
          <ChapterSetupView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            onOpenBoardAdapt={onOpenBoardAdapt}
            isDarkMode={false}
          />
        )}

        {/* Stage 2: Opener View */}
        {effectiveView === 'opener' && (
          <div
            className="p-6 rounded-2xl border border-[#CBBEAC] space-y-5 bg-[#FFFDF8] shadow-xs text-[#292521]"
          >
            <div className="border-b border-[#CBBEAC]/60 pb-3 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                Chapter Opener &amp; Orientation
              </span>
              <span className="text-[11px] text-[#71685E] font-semibold font-mono">
                Estimated Study Time: {chapter.opening.estimatedStudyTimeMinutes} mins
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#5A1832] mb-1">
                  Chapter Number
                </label>
                <input
                  type="number"
                  value={chapter.opening.chapterNumber}
                  onChange={(e) =>
                    onUpdateChapter({
                      ...chapter,
                      chapterNumber: Number(e.target.value) || 1,
                      opening: {
                        ...chapter.opening,
                        chapterNumber: Number(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-bold font-mono focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                />
              </div>

              <div className="col-span-3">
                <label className="block text-[11px] font-bold text-[#5A1832] mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapter.opening.title}
                  onChange={(e) =>
                    onUpdateChapter({
                      ...chapter,
                      title: e.target.value,
                      opening: { ...chapter.opening, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A1832] mb-1">
                Subtitle &amp; Scope Summary
              </label>
              <input
                type="text"
                value={chapter.opening.subtitle || ''}
                onChange={(e) =>
                  onUpdateChapter({
                    ...chapter,
                    subtitle: e.target.value,
                    opening: { ...chapter.opening, subtitle: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A1832] mb-1">
                Opening Hook / Provocation Question
              </label>
              <textarea
                rows={2}
                value={chapter.opening.openingHook || ''}
                onChange={(e) =>
                  onUpdateChapter({
                    ...chapter,
                    opening: { ...chapter.opening, openingHook: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A1832] mb-1">
                Short Chapter Introduction Prose
              </label>
              <textarea
                rows={4}
                value={chapter.opening.shortIntroduction}
                onChange={(e) =>
                  onUpdateChapter({
                    ...chapter,
                    opening: { ...chapter.opening, shortIntroduction: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A1832] mb-1">
                Learning Objectives (One per line)
              </label>
              <textarea
                rows={4}
                value={chapter.opening.learningObjectives.join('\n')}
                onChange={(e) =>
                  onUpdateChapter({
                    ...chapter,
                    opening: {
                      ...chapter.opening,
                      learningObjectives: e.target.value.split('\n').filter(Boolean),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#EDE4D6]/70 border border-[#CBBEAC] space-y-1">
              <span className="font-bold text-[11px] text-[#5A1832] block">
                Opening Illustration Brief:
              </span>
              <p className="text-[11px] text-[#292521] font-mono leading-relaxed">
                {chapter.opening.openingIllustrationPrompt || (
                  <span className="italic text-stone-500 font-sans">No opening illustration brief specified yet.</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Stage 3: Learning Objectives View */}
        {effectiveView === 'objectives' && (
          <div className="space-y-6">
            <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
                  <Target className="w-5 h-5 text-[#C29A52]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                      Production Stage 3 • Pedagogical Target
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium border border-blue-200">
                      Bloom Taxonomy Aligned
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#292521]">
                    Learning Objectives &amp; Competencies
                  </h2>
                  <p className="text-xs text-[#71685E] mt-0.5">
                    Measurable student outcomes mapped to cognitive depth, {chapter.systemId || 'CBSE'} grammar standards, and formative assessments.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(chapter.opening.learningObjectives || []).map((obj, i) => (
                <div key={i} className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#5A1832]">
                      Objective {i + 1}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE4D6] text-[#292521] border border-[#CBBEAC] font-medium">
                      {i === 0 ? 'Remembering' : i === 1 ? 'Understanding' : i === 2 ? 'Applying' : i === 3 ? 'Analyzing' : 'Evaluating'}
                    </span>
                  </div>
                  <p className="text-sm font-serif text-[#292521]">
                    {obj}
                  </p>
                  <div className="pt-2 border-t border-[#CBBEAC]/50 flex items-center justify-between text-[11px] text-[#71685E]">
                    <span>Target: {chapter.systemId || 'CBSE'} Standard {i + 1}</span>
                    <span className="text-emerald-700 font-medium">Assessed in Exercises</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Component 3: Warm-Up / Prior Knowledge View */}
        {effectiveView === 'warm_up' && (
          <div className="space-y-6">
            <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#C29A52]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                      Component 3 • Diagnostic Starter
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium border border-amber-200">
                      Prior Knowledge Activation
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#292521]">
                    Warm-Up &amp; Diagnostic Starter
                  </h2>
                  <p className="text-xs text-[#71685E] mt-0.5">
                    Activate foundational knowledge, assess baseline readiness, and introduce the target linguistic structure in an informal classroom discussion.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-4 shadow-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A1832] font-mono uppercase">
                  Classroom Warm-Up Activity / Hook:
                </label>
                <textarea
                  rows={4}
                  value={chapter.opening.warmUpActivity || ''}
                  onChange={(e) =>
                    onUpdateChapter({
                      ...chapter,
                      opening: {
                        ...chapter.opening,
                        warmUpActivity: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="Describe a quick, engaging 2-minute diagnostic oral or written activity..."
                />
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6]/70 border border-[#CBBEAC] space-y-2">
                <span className="font-bold text-xs text-[#5A1832] block">
                  Prerequisites Check ({chapter.systemId || 'CISCE'} {chapter.equivalentClass || 'Class 6'}):
                </span>
                <textarea
                  rows={3}
                  value={
                    typeof chapter.opening.priorKnowledge === 'string'
                      ? chapter.opening.priorKnowledge
                      : Array.isArray(chapter.opening.priorKnowledge)
                      ? (chapter.opening.priorKnowledge as string[]).join('\n')
                      : ''
                  }
                  onChange={(e) =>
                    onUpdateChapter({
                      ...chapter,
                      opening: {
                        ...chapter.opening,
                        priorKnowledge: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="List foundational grammar topics required before studying this chapter..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Component 4: Concept Introduction View */}
        {effectiveView === 'concept_intro' && (() => {
          const currentVignetteValue =
            chapter.opening.discoveryVignette ||
            chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'text')?.textContent ||
            '';

          const currentQuestionsValue =
            chapter.opening.discoveryQuestions ||
            chapter.opening.discoveryQuestion ||
            chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'try_this')?.textContent ||
            '';

          const hasComponent4Content = Boolean(
            (currentVignetteValue && currentVignetteValue.trim().length > 0) ||
            (currentQuestionsValue && currentQuestionsValue.trim().length > 0)
          );

          return (
            <div className="space-y-6">
              <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
                    <BookOpen className="w-5 h-5 text-[#C29A52]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                        Component 4 • Inductive Inquiry
                      </span>
                      {hasComponent4Content ? (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          DRAFT
                        </span>
                      ) : (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium border border-stone-200">
                          PENDING DRAFT
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#292521]">
                      Concept Introduction &amp; Discovery Vignette
                    </h2>
                    <p className="text-xs text-[#71685E] mt-0.5">
                      Present authentic linguistic evidence through an illustrated vignette, dialogue, or story snippet where the target grammar rule naturally emerges.
                    </p>
                  </div>
                </div>

                {/* AI Generation Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateDiscoveryVignette}
                    disabled={isGeneratingDiscoveryVignette}
                    className="h-10 px-4 inline-flex items-center space-x-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] active:bg-[#250813] shadow-xs hover:shadow-sm transition-all cursor-pointer border border-[#C29A52]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                    title="Generate an authentic inductive reading scenario and guided discovery questions using Gemini"
                  >
                    {isGeneratingDiscoveryVignette ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#C29A52] animate-spin" />
                        <span>Generating Vignette...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#C29A52]" />
                        <span>Generate Discovery Vignette</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {discoveryNotice && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    discoveryNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {discoveryNotice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{discoveryNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDiscoveryNotice(null)}
                    className="text-[11px] underline font-medium hover:opacity-80 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-5 shadow-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#5A1832] font-mono uppercase">
                      Contextual Vignette / Reading Scenario:
                    </label>
                    <span className="text-[11px] font-mono text-[#71685E]">
                      {currentVignetteValue.trim().length > 0
                        ? `${currentVignetteValue.trim().split(/\s+/).length} words`
                        : 'Empty'}
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={currentVignetteValue}
                    onChange={(e) => handleVignetteChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                    placeholder="Draft an authentic reading scenario with character dialogue where students encounter the grammatical structure inductively..."
                  />
                  <p className="text-[11px] text-[#71685E] italic">
                    Tip: A short 150–250 word dialogue or narrative featuring relatable characters that showcases the grammatical pattern without immediately lecturing the formal rule.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#5A1832] font-mono uppercase">
                      Guided Discovery Questions for Students (Notice &amp; Inquire):
                    </label>
                    <span className="text-[11px] font-mono text-[#71685E]">
                      {currentQuestionsValue.trim().length > 0
                        ? `${currentQuestionsValue.trim().split('\n').filter(Boolean).length} lines`
                        : 'Empty'}
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={currentQuestionsValue}
                    onChange={(e) => handleQuestionsChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                    placeholder="Guiding questions directing students to analyze and deduce the grammatical pattern from the vignette..."
                  />
                  <p className="text-[11px] text-[#71685E] italic">
                    Tip: 3–5 scaffolded questions (e.g. Subject Hunt, Verb Spotting, Pattern Discovery, Ear Check) that guide students to infer the concord principle.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Component 5: Theoretical Content & Syntactic Analysis View */}
        {(effectiveView === 'explanation' || activeArchitectureItemId === 'comp-5') && (() => {
          const c05 = chapter.component05;
          const currentExplanation = c05?.conceptualExplanation || '';
          const currentSyntacticItems: SyntacticAnalysisItem[] = Array.isArray(c05?.syntacticAnalysis)
            ? c05.syntacticAnalysis
            : typeof c05?.syntacticAnalysis === 'string' && c05.syntacticAnalysis.trim()
            ? [{ sentence: c05.syntacticAnalysis, subjectHeadNoun: '', verbPhrase: '' }]
            : [];
          const currentChecks: string[] = Array.isArray(c05?.conceptChecks)
            ? c05.conceptChecks
            : typeof c05?.conceptChecks === 'string' && c05.conceptChecks.trim()
            ? c05.conceptChecks.split('\n').filter(Boolean)
            : [];
          const currentInsight = c05?.linguisticInsight || '';
          const currentStatus = c05?.status || (currentExplanation ? 'draft' : 'not_started');

          const hasContent = Boolean(
            currentExplanation.trim().length > 0 ||
            currentSyntacticItems.length > 0 ||
            currentChecks.length > 0 ||
            currentInsight.trim().length > 0
          );

          const wordCount = currentExplanation.trim()
            ? currentExplanation.trim().split(/\s+/).length
            : 0;

          return (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
                    <Layers className="w-5 h-5 text-[#C29A52]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                        Component 5 • Theoretical Instruction
                      </span>
                      <button
                        type="button"
                        onClick={handleToggleComp05Status}
                        className="cursor-pointer group flex items-center gap-1"
                        title="Click to toggle status: Draft → Complete → Needs Review"
                      >
                        {currentStatus === 'complete' ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> COMPLETE
                          </span>
                        ) : currentStatus === 'needs_review' ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-300">
                            NEEDS REVIEW
                          </span>
                        ) : hasContent ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                            DRAFT
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium border border-stone-200">
                            PENDING DRAFT
                          </span>
                        )}
                      </button>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#292521]">
                      Theoretical Content &amp; Syntactic Analysis
                    </h2>
                    <p className="text-xs text-[#71685E] mt-0.5">
                      Develop the core grammatical explanation through clear conceptual teaching, sentence analysis and progressive linguistic reasoning.
                    </p>
                  </div>
                </div>

                {/* AI Generation Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateComp05(false)}
                    disabled={isGeneratingComp05}
                    className="h-10 px-4 inline-flex items-center space-x-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] active:bg-[#250813] shadow-xs hover:shadow-sm transition-all cursor-pointer border border-[#C29A52]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                    title="Generate theoretical explanation, syntactic analysis examples, and conceptual checks aligned to CISCE Class 6"
                  >
                    {isGeneratingComp05 ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#C29A52] animate-spin" />
                        <span>Generating Theory &amp; Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#C29A52]" />
                        <span>{hasContent ? 'Regenerate Theoretical Explanation' : 'Generate Theoretical Explanation'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Overwrite Confirmation Alert */}
              {showRegenerateConfirm05 && (
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Existing Theoretical Content Found</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Regenerating will replace your current conceptual explanation, syntactic analyses, concept checks, and linguistic insight with newly generated curriculum content.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowRegenerateConfirm05(false)}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 bg-white hover:bg-amber-100 font-semibold cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenerateComp05(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-white hover:bg-[#35101F] font-bold cursor-pointer text-xs shadow-xs"
                    >
                      Overwrite &amp; Regenerate
                    </button>
                  </div>
                </div>
              )}

              {/* Status Notice Alert */}
              {comp05Notice && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    comp05Notice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : comp05Notice.type === 'error'
                      ? 'bg-rose-50 text-rose-900 border-rose-300'
                      : 'bg-blue-50 text-blue-900 border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {comp05Notice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{comp05Notice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setComp05Notice(null)}
                    className="text-[11px] underline font-medium hover:opacity-80 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Authoring Fields Container */}
              <div className="space-y-6">
                {/* 1. Core Concept / Theoretical Explanation */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <label className="text-xs font-bold text-[#5A1832] font-mono uppercase tracking-wide">
                        1. Core Concept / Theoretical Explanation:
                      </label>
                      <p className="text-[11px] text-[#71685E] mt-0.5">
                        Explain the grammatical concept clearly and progressively (Subject → Head Noun → Finite Verb → Concord → Intervening Material). Explain meaning and syntactic logic before formal rule terminology.
                      </p>
                    </div>
                    <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md font-semibold border ${
                      wordCount >= 250 && wordCount <= 450
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : wordCount > 450
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : wordCount > 0
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-[#EDE4D6] text-[#5A1832] border-[#CBBEAC]'
                    }`}>
                      {wordCount} words {wordCount >= 250 && wordCount <= 450 ? '• Optimal Class 6 Target (250–450)' : wordCount > 450 ? '• Long (Target: 250–450)' : wordCount > 0 ? '• Developing (Target: 250–450)' : ''}
                    </span>
                  </div>
                  <textarea
                    rows={9}
                    value={currentExplanation}
                    onChange={(e) => handleComp05ExplanationChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                    placeholder="Draft progressive theoretical explanation of the grammar topic. For Subject-Verb Agreement, explain that every sentence requires concord between subject and finite verb in number and person, and examine how intervening phrases challenge head-noun identification..."
                  />
                  <p className="text-[11px] text-[#71685E] italic">
                    Tip: Target 250–450 words for middle school (Class 6). Avoid generic conversational openings; write with the academic authority of an edited CISCE grammar treatise.
                  </p>
                </div>

                {/* 2. How the Sentence Works — Syntactic Analysis */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <label className="text-xs font-bold text-[#5A1832] font-mono uppercase tracking-wide">
                        2. How the Sentence Works — Syntactic Analysis:
                      </label>
                      <p className="text-[11px] text-[#71685E] mt-0.5">
                        Show students how sentences work structurally. Contrastive specimens show how the finite verb agrees strictly with the head noun, ignoring intervening phrases.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#71685E]">
                        {currentSyntacticItems.length} specimens
                      </span>
                      <button
                        type="button"
                        onClick={handleAddSyntacticItem}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC] hover:bg-[#E2D6C3] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Example Card</span>
                      </button>
                    </div>
                  </div>

                  {currentSyntacticItems.length === 0 ? (
                    <div className="p-6 border border-dashed border-[#CBBEAC] rounded-xl bg-[#FAF6F0] text-center space-y-2">
                      <p className="text-xs text-[#71685E]">
                        No syntactic analysis examples added yet. Click &quot;Add Example Card&quot; or use &quot;Generate Theoretical Explanation&quot; to auto-generate 3–5 analysed sentences.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentSyntacticItems.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-4 rounded-xl border border-[#CBBEAC] bg-[#FAF6F0] space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#5A1832] flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#5A1832] text-white flex items-center justify-center text-[10px]">
                                  {idx + 1}
                                </span>
                                <span>Specimen Sentence Analysis</span>
                              </span>
                              {item.isContrastivePair && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
                                  Contrastive Pair
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <label className="flex items-center gap-1 text-[10px] font-mono text-[#71685E] mr-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={Boolean(item.isContrastivePair)}
                                  onChange={(e) =>
                                    handleComp05SyntacticItemChange(idx, 'isContrastivePair', e.target.checked)
                                  }
                                  className="rounded border-[#CBBEAC] text-[#5A1832] focus:ring-[#C29A52] w-3 h-3 cursor-pointer"
                                />
                                <span>Contrastive Pair</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleMoveSyntacticItem(idx, 'up')}
                                disabled={idx === 0}
                                className="text-stone-400 hover:text-[#5A1832] disabled:opacity-30 disabled:hover:text-stone-400 p-1 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                                title="Move specimen up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveSyntacticItem(idx, 'down')}
                                disabled={idx === currentSyntacticItems.length - 1}
                                className="text-stone-400 hover:text-[#5A1832] disabled:opacity-30 disabled:hover:text-stone-400 p-1 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                                title="Move specimen down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSyntacticItem(idx)}
                                className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer ml-1"
                                title="Delete this specimen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Full Sentence */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-[#292521] uppercase tracking-wider font-mono">
                              Specimen Sentence:
                            </label>
                            <input
                              type="text"
                              value={item.sentence}
                              onChange={(e) =>
                                handleComp05SyntacticItemChange(idx, 'sentence', e.target.value)
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-serif font-semibold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. The captain of the school cricket team has scored three centuries."
                            />
                          </div>

                          {/* Visual Syntactic Structure Banner */}
                          {(item.subjectHeadNoun || item.interveningPhrase || item.verbPhrase) && (
                            <div className="p-2.5 rounded-lg bg-[#EDE4D6]/70 border border-[#CBBEAC] space-y-1">
                              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-[#5A1832] block">
                                Visual Syntactic Breakdown:
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                                <span className="px-2 py-0.5 rounded bg-[#5A1832] text-white font-bold text-[11px]" title="Governing Head Noun">
                                  [HEAD NOUN: {item.subjectHeadNoun || '?'}]
                                </span>
                                {item.interveningPhrase && (
                                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-medium text-[11px]" title="Intervening Prepositional / Modifying Phrase">
                                  (INTERVENING: {item.interveningPhrase})
                                </span>
                                )}
                                <span className="text-[#C29A52] font-bold">⟶</span>
                                <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[11px]" title="Finite Verb (Concord with Head Noun)">
                                  [FINITE VERB: {item.verbPhrase || '?'}]
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 4-Field Syntactic Breakdown Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                                Subject Head Noun:
                              </label>
                              <input
                                type="text"
                                value={item.subjectHeadNoun}
                                onChange={(e) =>
                                  handleComp05SyntacticItemChange(idx, 'subjectHeadNoun', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-mono text-[#5A1832] font-bold focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. captain"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                                Expanded Subject Phrase:
                              </label>
                              <input
                                type="text"
                                value={item.expandedSubject || ''}
                                onChange={(e) =>
                                  handleComp05SyntacticItemChange(idx, 'expandedSubject', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. The captain of the school cricket team"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-amber-900 uppercase font-mono">
                                Intervening Phrase / Trap:
                              </label>
                              <input
                                type="text"
                                value={item.interveningPhrase || ''}
                                onChange={(e) =>
                                  handleComp05SyntacticItemChange(idx, 'interveningPhrase', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-mono text-amber-900 focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. of the school cricket team"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                                Finite Verb / Auxiliary:
                              </label>
                              <input
                                type="text"
                                value={item.verbPhrase}
                                onChange={(e) =>
                                  handleComp05SyntacticItemChange(idx, 'verbPhrase', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-mono text-[#5A1832] font-bold focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. has scored"
                              />
                            </div>
                          </div>

                          {/* Secondary Row: Number, Person, Concord Tie */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                                Grammatical Number:
                              </label>
                              <select
                                value={item.grammaticalNumber || 'singular'}
                                onChange={(e) =>
                                  handleComp05SyntacticItemChange(
                                    idx,
                                    'grammaticalNumber',
                                    e.target.value as 'singular' | 'plural'
                                  )
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-mono text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              >
                                <option value="singular">Singular (e.g. has / plays)</option>
                                <option value="plural">Plural (e.g. have / play)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                                Grammatical Person:
                              </label>
                              <input
                                type="text"
                                value={item.person || '3rd person'}
                                onChange={(e) =>
                                  handleComp05SyntacticItemChange(idx, 'person', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-mono text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. 3rd person"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                                Concord Tie / Agreement Formula:
                              </label>
                              <input
                                type="text"
                                value={item.agreementRelationship || ''}
                                onChange={(e) =>
                                  handleComp05SyntacticItemChange(idx, 'agreementRelationship', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-mono text-[#5A1832] font-semibold focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. captain (singular) → has scored (singular)"
                              />
                            </div>
                          </div>

                          {/* Syntactic Explanation */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                              Syntactic Explanation (Why verb agrees with head noun):
                            </label>
                            <input
                              type="text"
                              value={item.explanation || ''}
                              onChange={(e) =>
                                handleComp05SyntacticItemChange(idx, 'explanation', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. The head noun 'captain' governs the singular auxiliary 'has', ignoring the intervening plural noun 'team/centuries'."
                            />
                          </div>

                          {/* Pedagogical Notes / Linguistic Trap */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                              Pedagogical Notes / Linguistic Trap:
                            </label>
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) =>
                                handleComp05SyntacticItemChange(idx, 'notes', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-serif text-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. Proximity trap: students look at 'team' rather than 'captain'."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Pause & Think — Concept Checks */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <label className="text-xs font-bold text-[#5A1832] font-mono uppercase tracking-wide">
                        3. Pause &amp; Think — Concept Checks:
                      </label>
                      <p className="text-[11px] text-[#71685E] mt-0.5">
                        Short conceptual questions embedded within the explanation to stimulate reflection. (Not mechanical drill exercises).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddConceptCheck}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC] hover:bg-[#E2D6C3] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Reflection Check</span>
                    </button>
                  </div>

                  {currentChecks.length === 0 ? (
                    <div className="p-4 border border-dashed border-[#CBBEAC] rounded-xl bg-[#FAF6F0] text-center">
                      <p className="text-xs text-[#71685E]">
                        No concept checks added yet. Click &quot;Add Reflection Check&quot; to prompt student inquiry.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentChecks.map((check, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#EDE4D6] text-[#5A1832] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#CBBEAC]">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={check}
                            onChange={(e) => handleConceptCheckChange(idx, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                            placeholder="e.g. When a subject has a long prepositional phrase, how do you isolate the true head noun?"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveConceptCheck(idx)}
                            className="text-stone-400 hover:text-rose-600 p-1.5 rounded-md cursor-pointer transition-colors"
                            title="Remove this check"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-[#71685E] italic">
                    Tip: 2–4 short, thought-provoking prompts that encourage students to notice structural patterns and resist auditory proximity traps.
                  </p>
                </div>

                {/* 4. Language Insight Callout */}
                <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#C29A52]" />
                    <label className="text-xs font-bold text-[#5A1832] font-mono uppercase tracking-wide">
                      4. Language Insight Callout:
                    </label>
                  </div>
                  <p className="text-[11px] text-[#71685E]">
                    One concise, memorable insight callout highlighting the underlying linguistic pattern or morphological principle.
                  </p>
                  <textarea
                    rows={3}
                    value={currentInsight}
                    onChange={(e) => handleLinguisticInsightChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                    placeholder="e.g. In English, finite verbs agree strictly with the structural head noun of the subject, completely unaffected by any intervening modifiers or prepositional phrases."
                  />
                  <p className="text-[11px] text-[#71685E] italic">
                    Tip: Keep it punchy (25–50 words). This serves as the key takeaway callout in both the Student and Teacher editions.
                  </p>
                </div>

                {/* 5. Teacher Edition Pedagogical Annotations */}
                {(() => {
                  const annotations = c05?.teacherAnnotations || {};
                  return (
                    <div className="bg-[#FFFDF8] border-2 border-dashed border-[#C29A52]/70 rounded-xl p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-[#5A1832]" />
                          <div>
                            <label className="text-xs font-bold text-[#5A1832] font-mono uppercase tracking-wide block">
                              5. Teacher Edition Pedagogical Annotations:
                            </label>
                            <p className="text-[11px] text-[#71685E]">
                              Specialist instructional notes rendered exclusively in the Teacher Edition for COMP-05.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                          TEACHER EDITION
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        {/* Teaching Focus */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#5A1832] font-mono uppercase">
                            Teaching Focus &amp; Objective:
                          </label>
                          <textarea
                            rows={2}
                            value={annotations.teachingFocus || ''}
                            onChange={(e) => handleTeacherAnnotationChange('teachingFocus', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                            placeholder="e.g. Guide pupils to isolate the true head noun in subjects expanded by prepositional phrases, overcoming the 'attraction to proximity' fallacy."
                          />
                        </div>

                        {/* Terminology Guidance */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#71685E] font-mono uppercase">
                            Terminology Guidance:
                          </label>
                          <input
                            type="text"
                            value={annotations.terminologyGuidance || ''}
                            onChange={(e) => handleTeacherAnnotationChange('terminologyGuidance', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-serif focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                            placeholder="e.g. Clearly distinguish 'head noun' from 'intervening phrase' and 'concord' from 'inflection'."
                          />
                        </div>

                        {/* Common Misconceptions */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-amber-900 font-mono uppercase flex items-center justify-between">
                            <span>Likely Learner Misconceptions:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = Array.isArray(annotations.commonMisconceptions) ? [...annotations.commonMisconceptions] : [];
                                current.push('');
                                handleTeacherAnnotationChange('commonMisconceptions', current);
                              }}
                              className="text-[10px] text-[#5A1832] font-bold hover:underline cursor-pointer"
                            >
                              + Add Misconception
                            </button>
                          </label>
                          <div className="space-y-1.5">
                            {(annotations.commonMisconceptions || [
                              "Attraction to proximity: matching the verb to the noun immediately preceding it.",
                              "Confusing plural noun endings (-s) with singular verb endings (-s)."
                            ]).map((mis, mIdx) => (
                              <div key={mIdx} className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] flex items-center justify-center shrink-0">
                                  {mIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={mis}
                                  onChange={(e) => {
                                    const current = Array.isArray(annotations.commonMisconceptions) ? [...annotations.commonMisconceptions] : [];
                                    current[mIdx] = e.target.value;
                                    handleTeacherAnnotationChange('commonMisconceptions', current);
                                  }}
                                  className="flex-1 px-2.5 py-1 rounded border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = Array.isArray(annotations.commonMisconceptions) ? [...annotations.commonMisconceptions] : [];
                                    current.splice(mIdx, 1);
                                    handleTeacherAnnotationChange('commonMisconceptions', current);
                                  }}
                                  className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Suggested Board Explanation */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#5A1832] font-mono uppercase">
                            Suggested Blackboard Demonstration:
                          </label>
                          <textarea
                            rows={2}
                            value={annotations.suggestedBoardExplanation || ''}
                            onChange={(e) => handleTeacherAnnotationChange('suggestedBoardExplanation', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-serif focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                            placeholder="e.g. Write: '[The captain] (of the cricket team) [has scored].' Draw brackets around head noun and finite verb, connecting them with a bridging arrow."
                          />
                        </div>

                        {/* Questioning Strategies & Diagnostic Observations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-[#71685E] font-mono uppercase">
                              Diagnostic Notebook Observations:
                            </label>
                            <textarea
                              rows={2}
                              value={annotations.diagnosticObservations || ''}
                              onChange={(e) => handleTeacherAnnotationChange('diagnosticObservations', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-serif focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. Check if pupils underline the true head noun or accidentally circle the noun nearest the verb."
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-[#71685E] font-mono uppercase">
                              Extension Suggestions:
                            </label>
                            <textarea
                              rows={2}
                              value={annotations.extensionSuggestions || ''}
                              onChange={(e) => handleTeacherAnnotationChange('extensionSuggestions', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-serif focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. Challenge advanced pupils with inverted sentences or correlative conjunction subjects."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}

        {/* Component 6: Grammar Rules & Structural Form Boxes View */}
        {activeArchitectureItemId === 'comp-6' && (
          <Component06RulesAuthoring
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            isDarkMode={false}
          />
        )}

        {/* Section & Generic Content View */}
        {effectiveView === 'section' && activeArchitectureItemId !== 'comp-5' && activeArchitectureItemId !== 'comp-6' && !activeSection && (
          <div className="p-8 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] text-center space-y-4 shadow-xs text-[#292521]">
            <BookOpen className="w-8 h-8 mx-auto text-[#C29A52]" />
            <h3 className="font-bold text-base font-serif">No Content Sections Created Yet</h3>
            <p className="text-xs text-[#71685E] max-w-md mx-auto">
              This chapter does not have any active content sections. Create a section in the structure navigator or switch to Chapter Opener to begin writing.
            </p>
          </div>
        )}

        {effectiveView === 'section' && activeArchitectureItemId !== 'comp-5' && activeArchitectureItemId !== 'comp-6' && activeSection && (
          <div className="space-y-4">
            {/* Section Header */}
            <div
              className="p-4 rounded-2xl border border-[#CBBEAC] flex items-center justify-between bg-[#FFFDF8] shadow-xs text-[#292521]"
            >
              <div className="flex items-center space-x-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-[#EDE4D6] font-mono font-bold text-[#5A1832] border border-[#CBBEAC]">
                  {activeSection.numberLabel || `${chapter.chapterNumber}.1`}
                </span>
                <h2 className="font-bold text-sm text-[#292521]">
                  {cleanHeadingTitle(activeSection.title)}
                </h2>
              </div>
              <span className="text-[11px] text-[#71685E] font-semibold">
                {activeSection.blocks.length} content blocks
              </span>
            </div>

            {/* Modular Blocks List */}
            <div className="space-y-4">
              {activeSection.blocks.map((block, bIdx) => (
                <div
                  key={block.id}
                  className="p-5 rounded-2xl border border-[#CBBEAC] transition-all bg-[#FFFDF8] shadow-xs text-[#292521]"
                >
                  {/* Block Meta Header */}
                  <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                        {block.type.replace('_', ' ')}
                      </span>
                      {block.title && (
                        <span className="font-bold text-xs text-[#292521]">
                          {cleanHeadingTitle(block.title)}
                        </span>
                      )}
                      {block.visibility !== 'student' && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                          {block.visibility === 'teacher_only' ? 'Teacher Only' : 'Author Only'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onMoveBlock(block.id, 'up')}
                        disabled={bIdx === 0}
                        className="p-1.5 rounded-lg bg-[#EDE4D6] text-[#292521] hover:bg-[#CBBEAC]/40 hover:text-[#5A1832] border border-[#CBBEAC] disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveBlock(block.id, 'down')}
                        disabled={bIdx === activeSection.blocks.length - 1}
                        className="p-1.5 rounded-lg bg-[#EDE4D6] text-[#292521] hover:bg-[#CBBEAC]/40 hover:text-[#5A1832] border border-[#CBBEAC] disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditBlock(block)}
                        className="px-2.5 py-1 rounded-lg bg-[#EDE4D6] text-[#292521] hover:bg-[#CBBEAC]/40 hover:text-[#5A1832] border border-[#CBBEAC] font-semibold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Edit block"
                      >
                        <Edit3 className="w-3 h-3 text-[#5A1832]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlockToDelete(block.id)}
                        className="p-1.5 rounded-lg bg-[#EDE4D6] text-rose-700 hover:bg-rose-100 border border-[#CBBEAC] transition-colors cursor-pointer"
                        title="Delete block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content Display for All Types */}
                  {(block.type === 'heading' || block.type === 'subheading') && (
                    <h3 className="font-serif font-bold text-base text-[#35101F] leading-snug">
                      {cleanHeadingTitle(block.title || block.textContent || '')}
                    </h3>
                  )}

                  {block.type === 'text' && (
                    <div className="text-[#292521] text-xs leading-relaxed font-serif">
                      <TextbookMarkdown content={block.textContent || ''} />
                    </div>
                  )}

                  {block.type === 'definition' && (
                    <div className="p-3.5 rounded-xl border border-[#C29A52]/60 bg-[#F6F0E7] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] uppercase text-[#5A1832] tracking-wider">
                          DEFINITION: {cleanHeadingTitle(block.definition?.term || block.title || 'KEY TERM')}
                        </span>
                        {(block.definition?.partOfSpeechOrCategory || (block.definition as any)?.partOfSpeech) && (
                          <span className="font-mono italic text-[10px] text-[#71685E]">
                            {cleanMarkdownSyntax(block.definition.partOfSpeechOrCategory || (block.definition as any)?.partOfSpeech)}
                          </span>
                        )}
                      </div>
                      <div className="font-serif text-[#292521] text-xs leading-relaxed">
                        <TextbookMarkdown
                          content={
                            block.definition?.ageAppropriateExplanation ||
                            (block.definition as any)?.definition ||
                            block.calloutText ||
                            block.textContent ||
                            ''
                          }
                        />
                      </div>
                      {block.definition?.examples && block.definition.examples.length > 0 && (
                        <div className="pt-1.5 border-t border-[#CBBEAC]/50 space-y-0.5">
                          <span className="text-[10px] font-bold text-[#71685E]">Examples:</span>
                          {block.definition.examples.map((ex, i) => (
                            <p key={i} className="text-[11px] text-[#292521] italic">
                              • {cleanMarkdownSyntax(ex.sentence || (typeof ex === 'string' ? ex : ''))}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {(block.type === 'grammar_rule' || block.type === 'key_concept') && (
                    <div className="p-3.5 rounded-xl border border-[#C29A52]/60 bg-[#F6F0E7] space-y-1.5">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        {cleanHeadingTitle(block.calloutTitle || 'GRAMMAR RULE')}
                      </span>
                      <div className="font-medium text-[#292521] text-xs leading-relaxed font-serif">
                        <TextbookMarkdown content={block.calloutText || block.textContent || ''} />
                      </div>
                    </div>
                  )}

                  {block.type === 'example_set' && block.exampleData && (
                    <div className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-2">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        {block.title || 'ILLUSTRATIVE EXAMPLES'}
                      </span>
                      <div className="space-y-1.5">
                        {block.exampleData.items?.map((item, i) => (
                          <div key={item.id || i} className="p-2 rounded-lg bg-[#FFFDF8] border border-[#CBBEAC] text-xs">
                            <p className="font-serif text-[#292521] leading-snug">
                              {item.highlightWord ? (
                                <>
                                  {item.sentence.split(new RegExp(`(${item.highlightWord})`, 'gi')).map((part, pIdx) =>
                                    part.toLowerCase() === item.highlightWord?.toLowerCase() ? (
                                      <strong key={pIdx} className="text-[#5A1832] underline decoration-[#C29A52] font-bold">
                                        {part}
                                      </strong>
                                    ) : (
                                      part
                                    )
                                  )}
                                </>
                              ) : (
                                item.sentence
                              )}
                            </p>
                            {(item.authorNote || item.explanation || (item as any).note) && (
                              <p className="text-[11px] text-[#71685E] mt-1 font-medium italic">
                                Note: {item.authorNote || item.explanation || (item as any).note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(block.type === 'example_pair' || (block.type === 'example' && block.examplePair)) && (
                    <div className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-2">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        CONTRASTIVE EXAMPLE PAIR
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                          <span className="font-bold text-rose-900 text-[10px] block mb-0.5">
                            ✗ INCORRECT
                          </span>
                          <p className="text-rose-950 line-through font-serif">
                            {cleanMarkdownSyntax(block.examplePair?.incorrect || '')}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                          <span className="font-bold text-emerald-900 text-[10px] block mb-0.5">
                            ✓ CORRECT
                          </span>
                          <p className="text-emerald-950 font-serif font-bold">
                            {cleanMarkdownSyntax(block.examplePair?.correct || '')}
                          </p>
                        </div>
                      </div>
                      {block.examplePair?.why && (
                        <p className="text-[11px] text-[#71685E] font-medium pt-1">
                          Explanation: {cleanMarkdownSyntax(block.examplePair.why)}
                        </p>
                      )}
                    </div>
                  )}

                  {block.type === 'example' && !block.examplePair && (
                    <div className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-1.5">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        EXAMPLE
                      </span>
                      <div className="font-serif text-[#292521] text-xs leading-relaxed">
                        <TextbookMarkdown content={block.calloutText || block.textContent || ''} />
                      </div>
                    </div>
                  )}

                  {block.type === 'worked_example' && block.workedExample && (
                    <div className="p-4 rounded-xl border-2 border-[#C29A52]/60 bg-[#F6F0E7] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] uppercase text-[#5A1832] tracking-wider">
                          Worked Example ({block.workedExample.difficulty})
                        </span>
                        <span className="text-[11px] text-[#71685E] font-medium">
                          {block.workedExample.ruleApplied}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-[#292521] font-serif">
                        &ldquo;{block.workedExample.problem}&rdquo;
                      </p>

                      <div className="space-y-2">
                        {block.workedExample.steps.map((st) => (
                          <div
                            key={st.stepNumber}
                            className="p-2.5 rounded-lg bg-[#FFFDF8] border border-[#CBBEAC] text-xs"
                          >
                            <span className="font-bold text-[#5A1832] block text-[10px]">
                              {st.title}
                            </span>
                            <p className="text-[#292521] text-[11px] mt-0.5">{st.instruction}</p>
                            {st.sampleWork && (
                              <p className="font-mono text-[11px] text-[#5A1832] mt-1 font-semibold">
                                {st.sampleWork}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs">
                        <span className="font-bold text-emerald-900 block text-[10px]">
                          Final Answer:
                        </span>
                        <p className="font-bold text-emerald-950 mt-0.5">
                          {block.workedExample.finalAnswer}
                        </p>
                        <p className="text-[11px] text-[#292521] mt-1 font-medium">
                          Why: {block.workedExample.whyRationale}
                        </p>
                      </div>
                    </div>
                  )}

                  {(block.type === 'common_error' || block.type === 'warning_trap' || block.type === 'watch_out') && (
                    <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/70 space-y-1.5">
                      <span className="font-bold text-[10px] uppercase text-rose-900 block tracking-wider">
                        COMMON ERROR / EXAM TRAP
                      </span>
                      {block.commonError?.incorrectSentence && (
                        <p className="text-rose-950 line-through text-xs font-serif font-medium">
                          ✗ {block.commonError.incorrectSentence}
                        </p>
                      )}
                      {block.commonError?.correctSentence && (
                        <p className="text-emerald-950 font-bold text-xs font-serif">
                          ✓ {block.commonError.correctSentence}
                        </p>
                      )}
                      <p className="text-[11px] text-[#71685E] font-medium leading-relaxed">
                        {block.commonError?.explanation || block.calloutText || block.textContent}
                      </p>
                    </div>
                  )}

                  {(block.type === 'tip' || block.type === 'exam_tip' || block.type === 'grammar_tip') && (
                    <div className="p-3.5 rounded-xl border border-[#C29A52]/60 bg-[#F6F0E7] space-y-1">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        {block.calloutTitle || 'EXPERT TIP'}
                      </span>
                      <p className="text-[#292521] text-xs leading-relaxed font-medium">
                        {block.calloutText || block.textContent}
                      </p>
                    </div>
                  )}

                  {(block.type === 'remember' || block.type === 'important_note') && (
                    <div className="p-3.5 rounded-xl border border-[#C29A52]/50 bg-[#F6F0E7] space-y-1">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        {block.calloutTitle || 'REMEMBER'}
                      </span>
                      <p className="text-[#292521] text-xs leading-relaxed font-medium">
                        {block.calloutText || block.textContent}
                      </p>
                    </div>
                  )}

                  {block.type === 'vocabulary' && (
                    <div className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-1.5">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        VOCABULARY BUILDER
                      </span>
                      <p className="font-serif text-[#292521] text-xs leading-relaxed">
                        {block.calloutText || block.textContent}
                      </p>
                    </div>
                  )}

                  {(block.type === 'table' || block.type === 'comparison_table') && block.visualData?.tableData && (
                    <div className="overflow-x-auto rounded-xl border border-[#CBBEAC]">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#EDE4D6]">
                            {block.visualData.tableData.headers.map((h, i) => (
                              <th
                                key={i}
                                className="border-b border-[#CBBEAC] p-2.5 text-left font-bold text-[#35101F]"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#CBBEAC]/50">
                          {block.visualData.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#F6F0E7]">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="p-2.5 text-[#292521]"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {(block.type === 'visual' || block.type === 'diagram' || block.type === 'illustration' || block.type === 'image_caption' || block.type === 'figure' || block.type === 'flowchart' || block.type === 'sentence_diagram') && (
                    <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-2xs space-y-3">
                      {/* Visual Header in Block */}
                      <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                            {block.figureNumber || block.visualData?.figureNumber || 'Figure'}
                          </span>
                          <span className="text-xs font-bold text-[#292521]">
                            {block.visualData?.title || block.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenVisualStudio(block.metadata?.visualRecordId)}
                          className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/60 text-[11px] font-semibold text-[#5A1832] inline-flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Open this visual in the Visual & Illustration Studio"
                        >
                          <Sparkles className="w-3 h-3 text-[#C29A52]" />
                          <span>Open in Visual Studio</span>
                        </button>
                      </div>

                      {/* Visual Canvas Artwork or Placeholder */}
                      <div className="rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] p-3 flex flex-col items-center justify-center min-h-[140px]">
                        {block.visualData?.imageUrl ? (
                          <img
                            src={block.visualData.imageUrl}
                            alt={block.visualData.altText || block.title}
                            className="max-h-72 w-auto max-w-full rounded-md shadow-2xs object-contain"
                          />
                        ) : (
                          <div className="text-center py-4 px-3 space-y-1">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] tracking-widest block">
                              [ARTWORK PENDING]
                            </span>
                            <p className="text-xs text-[#71685E] max-w-sm mx-auto italic">
                              {block.visualData?.svgIllustrationBrief || block.textContent || 'Commissioned textbook artwork brief in progress.'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Caption & Alt Text */}
                      <div className="pt-1 text-center font-serif">
                        <p className="text-xs font-semibold text-[#292521]">
                          {block.visualData?.caption || `${block.figureNumber || 'Figure'}: ${block.visualData?.title || block.title}`}
                        </p>
                        {block.visualData?.altText && (
                          <p className="text-[10px] text-[#71685E] mt-0.5 italic">
                            Alt-Text: {block.visualData.altText}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(block.type === 'activity' || block.type === 'discussion' || block.type === 'exercise' || block.type === 'practice' || block.type === 'challenge') && (
                    <div className="p-3.5 rounded-xl border border-[#C29A52]/60 bg-[#F6F0E7] space-y-1.5">
                      <span className="font-bold text-[10px] uppercase text-[#5A1832] block tracking-wider">
                        {block.calloutTitle || block.title || 'STUDENT ACTIVITY & PRACTICE'}
                      </span>
                      <p className="text-[#292521] text-xs leading-relaxed font-serif font-medium">
                        {block.calloutText || block.textContent}
                      </p>
                    </div>
                  )}

                  {(block.type === 'revision_box' || block.type === 'did_you_know') && (
                    <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 space-y-1.5">
                      <span className="font-bold text-[10px] uppercase text-emerald-900 block tracking-wider">
                        {block.calloutTitle || 'CHAPTER REVISION SUMMARY'}
                      </span>
                      <p className="text-[#292521] text-xs leading-relaxed font-serif font-medium">
                        {block.calloutText || block.textContent}
                      </p>
                    </div>
                  )}

                  {/* Private author notes attachment if present */}
                  {block.authorNotes && (
                    <div className="mt-2.5 pt-2 border-t border-dashed border-[#CBBEAC] text-[11px] text-[#71685E] italic font-medium">
                      Author Note: {block.authorNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises View */}
        {effectiveView === 'exercises' && (
          <div className="w-full min-h-[750px] flex flex-col rounded-xl overflow-hidden border border-[#CBBEAC] shadow-xs">
            <ExerciseStudioView
              exercises={chapter.exercises}
              onUpdateExercises={(updated) =>
                onUpdateChapter({
                  ...chapter,
                  exercises: updated,
                  lastSaved: new Date().toISOString(),
                })
              }
              chapter={chapter}
              onUpdateChapter={onUpdateChapter}
              seriesProject={seriesProject}
              onSaveToQuestionBank={onSaveToQuestionBank}
              isDarkMode={false}
              onOpenVisualStudio={onOpenVisualStudio}
              activeComponentId={activeArchitectureItemId || undefined}
            />
          </div>
        )}

        {/* Chapter Ending & Summary View */}
        {(effectiveView === 'ending' || effectiveView === 'summary') && (
          <div
            className="p-6 rounded-2xl border border-[#CBBEAC] space-y-6 bg-[#FFFDF8] shadow-xs text-[#292521]"
          >
            <div className="border-b border-[#CBBEAC]/50 pb-2 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#35101F]">
                Chapter Summary &amp; Review Architecture
              </h3>
            </div>

            {/* What you learned */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#5A1832]">
                What You Learned (Key Takeaways)
              </label>
              <textarea
                rows={4}
                value={chapter.ending.whatYouLearned.join('\n')}
                onChange={(e) =>
                  onUpdateChapter({
                    ...chapter,
                    ending: {
                      ...chapter.ending,
                      whatYouLearned: e.target.value.split('\n').filter(Boolean),
                    },
                  })
                }
                className="w-full p-3 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>

            {/* Rules at a Glance */}
            <div className="space-y-2">
              <span className="font-bold text-xs block text-[#5A1832]">
                Rules at a Glance Table
              </span>
              <div className="space-y-2">
                {chapter.ending.rulesAtAGlance.map((rag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] grid grid-cols-2 gap-3"
                  >
                    <div>
                      <span className="font-bold text-[10px] uppercase text-[#71685E] block mb-1">
                        Rule
                      </span>
                      <p className="font-semibold text-[#292521] text-xs font-serif">
                        {rag.rule}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-[10px] uppercase text-[#71685E] block mb-1">
                        Specimen Example
                      </span>
                      <p className="font-mono text-xs text-[#5A1832] font-bold">
                        {rag.example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 5: Concepts & Rules Studio View (COMP-06 Canonical View) */}
        {(effectiveView === 'rules' || effectiveView === 'concepts') && (
          <div className="space-y-6">
            <Component06RulesAuthoring
              chapter={chapter}
              onUpdateChapter={onUpdateChapter}
              isDarkMode={false}
            />

            {/* Collapsible Extended Rule Database & Inventory */}
            <div className="pt-4 border-t border-[#CBBEAC]/70">
              <details className="group">
                <summary className="cursor-pointer font-serif font-bold text-xs sm:text-sm text-[#5A1832] flex items-center justify-between p-3.5 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] hover:bg-[#EDE4D6] transition-colors select-none">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C29A52]" />
                    <span>Rule Database &amp; Multi-Rule Inventory (Extended Library)</span>
                  </span>
                  <span className="text-xs font-sans font-normal text-[#71685E] group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="pt-4">
                  <RuleStudioView
                    chapter={chapter}
                    onUpdateChapter={onUpdateChapter}
                    onNavigateToStage={(stage) => onSelectView && onSelectView(stage)}
                    isDarkMode={false}
                  />
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Stage 5: Examples Studio View */}
        {effectiveView === 'examples' && (
          <ExamplesStudioView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            onConvertExampleToExerciseQuestion={handleConvertExampleToQuestion}
            isDarkMode={false}
          />
        )}

        {/* Stage 6: Visuals & Diagrams Studio View */}
        {effectiveView === 'visuals' && (
          <VisualsStudioView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            onOpenVisualBriefModal={onOpenVisualStudio}
            isDarkMode={false}
          />
        )}

        {/* Stage 7 / COMP-09: Worked Examples Studio View */}
        {effectiveView === 'worked_examples' && (
          <ReusableComponentView
            componentId="comp-9"
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Stage 8 / COMP-10: Common Errors & Pitfalls Studio View */}
        {effectiveView === 'common_errors' && (
          <ReusableComponentView
            componentId="comp-10"
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Component 11 / COMP-11: Remember & Quick Tip Boxes View */}
        {(effectiveView === 'tips' || activeArchitectureItemId === 'comp-11') && (
          <ReusableComponentView
            componentId="comp-11"
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Component 12 / COMP-12: Guided Practice Drills View */}
        {(effectiveView === 'guided_practice' || activeArchitectureItemId === 'comp-12') && (
          <ReusableComponentView
            componentId="comp-12"
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Component 19: Application & Challenge Problems View */}
        {effectiveView === 'challenge' && (
          <ChapterChallengeDrillView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Component 21: Chapter Assessment Test Studio View */}
        {(effectiveView === 'assessment' || effectiveView === 'test') && (
          <ChapterAssessmentView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            onNavigateToStage={(stage) => onSelectView && onSelectView(stage)}
            isDarkMode={false}
          />
        )}

        {/* Component 22: Answer Key & Rubrics Studio View */}
        {effectiveView === 'answer_key' && (
          <AnswerKeyStudioView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Component 20: Chapter Summary / Revision Studio View */}
        {effectiveView === 'summary' && (
          <ChapterSummaryRevisionView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Component 23: Teacher & Author Notes Studio View */}
        {(effectiveView === 'teacher_notes' || effectiveView === 'teacher_guide') && (
          <TeacherAuthorNotesView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            seriesProject={seriesProject}
            isDarkMode={false}
          />
        )}

        {/* Stage 15 & 16: Reading Preview (Student & Teacher Edition) In-Canvas */}
        {(effectiveView === 'preview' || effectiveView === 'student_preview' || effectiveView === 'teacher_preview') && (
          <div className="p-8 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center shadow-xs">
              <Eye className="w-6 h-6 text-[#C29A52]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-[#5A1832]">
                {effectiveView === 'teacher_preview' ? 'Teacher Annotated Master Edition' : 'Student Textbook Reader Edition'}
              </div>
              <h3 className="font-bold text-lg font-serif text-[#292521]">
                Publisher Press-Ready Preview
              </h3>
              <p className="text-xs text-[#71685E]">
                {effectiveView === 'teacher_preview'
                  ? 'Examine the complete chapter layout with marginal teaching prompts, answer keys highlighted in green, and lesson plans.'
                  : 'Experience the realistic student textbook reading view with crisp typography, balanced margins, and exercise answer blanks.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPreview}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] shadow-md inline-flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#C29A52]" />
              <span>Launch Fullscreen Textbook Reader ({effectiveView === 'teacher_preview' ? 'Teacher Edition' : 'Student Edition'})</span>
            </button>
          </div>
        )}

        {/* Stage 17: Quality & Board Audit In-Canvas */}
        {effectiveView === 'audit' && (
          <ChapterAuditStudioView
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            onNavigateToStage={(stage) => onSelectView && onSelectView(stage)}
            isDarkMode={false}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {blockToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div
            className="w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-[#CBBEAC] space-y-3 bg-[#FFFDF8] text-[#292521]"
          >
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-sm">Delete Content Block?</h4>
            </div>
            <p className="text-xs text-[#71685E]">
              Are you sure you want to remove this content block from the chapter manuscript?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setBlockToDelete(null)}
                className="px-3 py-1.5 rounded-xl text-xs border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/40 text-[#292521] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBlock(blockToDelete);
                  setBlockToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-700 text-white hover:bg-rose-800 transition-colors cursor-pointer"
              >
                Delete Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
