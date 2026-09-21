import React, { useState, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileSpreadsheet,
  SlidersHorizontal,
  RefreshCw,
  Download,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Info,
  ExternalLink,
  ShieldCheck,
  Scale,
  Maximize2,
  Minimize2,
  Filter,
  FileCheck,
} from 'lucide-react';
import {
  BoardQuestionBlueprint,
  BlueprintConceptWeightage,
  BlueprintQuestionSlot,
  BlueprintAuditReport,
  ConceptAuditResult,
  CognitiveLevel,
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarQuestion,
  GrammarTestSeries,
  QuestionType,
  BoardStandardCode,
  CurriculumSystemId,
} from '../types';
import {
  PRECONFIGURED_BOARD_BLUEPRINTS,
  auditTestPaperAgainstBlueprint,
  generateRebalancingAdvisories,
  createDraftTestFromBlueprint,
  exportBlueprintToText,
  detectQuestionConcept,
} from '../utils/boardBlueprintEngine';
import {
  EXTENDED_BOARD_BLUEPRINTS,
  createEmptyBlueprintPlaceholder,
  createEditorialTemplateForClass,
  PUBLISHING_CURRICULUM_HIERARCHY,
} from '../utils/boardBlueprintDirectory';
import {
  DEMO_CBSE_CLASS6_BLUEPRINT,
  EDUCATION_SYSTEMS,
  SYSTEM_ASSESSMENT_PROFILES,
} from '../utils/boardBlueprintIntelligenceData';
import { SystemLandingView } from './blueprint-studio/SystemLandingView';
import { BlueprintDesignerTree } from './blueprint-studio/BlueprintDesignerTree';
import { AssessmentProfileView } from './blueprint-studio/AssessmentProfileView';
import { BlueprintCoverageMatrixView } from './blueprint-studio/BlueprintCoverageMatrixView';
import { QuestionBankGapAnalysisView } from './blueprint-studio/QuestionBankGapAnalysisView';
import { ThreeSystemComparisonView } from './blueprint-studio/ThreeSystemComparisonView';
import { SystemPolicyProfilesView } from './blueprint-studio/SystemPolicyProfilesView';
import { BlueprintAuditModal } from './blueprint-studio/BlueprintAuditModal';
import { HierarchicalBlueprintSelectorModal } from './blueprint-studio/HierarchicalBlueprintSelectorModal';
import { DirectoryErrorBoundary } from './blueprint-studio/DirectoryErrorBoundary';
import { CrossAssemblyWarningModal } from './blueprint-studio/CrossAssemblyWarningModal';

interface BoardBlueprintMatrixViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onNavigateToCoursebook?: (classLevel?: GrammarClassLevel) => void;
  isSecondaryExpanded?: boolean;
  onToggleSecondary?: (expanded: boolean) => void;
}

export type BlueprintSubTab =
  | 'systems'
  | 'designer'
  | 'coverage'
  | 'gap_analysis'
  | 'matrix'
  | 'workbench'
  | 'comparison'
  | 'profiles'
  | 'policies'
  | 'audit_report';

export const BoardBlueprintMatrixView: React.FC<BoardBlueprintMatrixViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onNavigateToCoursebook,
  isSecondaryExpanded = true,
  onToggleSecondary,
}) => {
  // Available blueprints (Extended multi-tier directory + custom saved blueprints)
  const allBlueprints: BoardQuestionBlueprint[] = useMemo(() => {
    const saved = seriesProject.savedBlueprints || [];
    const savedIds = new Set(saved.map((b) => b.id));
    const presets = EXTENDED_BOARD_BLUEPRINTS;
    return [...saved, ...presets.filter((b) => !savedIds.has(b.id))];
  }, [seriesProject.savedBlueprints]);

  // Helper for matching blueprint records to canonical levels
  const matchesClassCanonical = (bClass: string, targetId: string, targetLabel?: string): boolean => {
    const normBp = (bClass || '').trim().toLowerCase();
    const normId = (targetId || '').trim().toLowerCase();
    const normLabel = (targetLabel || '').trim().toLowerCase();
    if (normBp === normId || (normLabel && normBp === normLabel)) return true;
    const escaped = normId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(normBp);
  };

  // Canonical destinations mapping over PUBLISHING_CURRICULUM_HIERARCHY
  const canonicalDestinations = useMemo(() => {
    const destinations: Array<{
      id: string;
      system: CurriculumSystemId;
      systemFilterGroup: 'CBSE' | 'CISCE' | 'CAMBRIDGE' | 'CUSTOM';
      programme: string;
      classId: string;
      classLabel: string;
      displayLabel: string;
      hasBlueprint: boolean;
      blueprint: BoardQuestionBlueprint;
    }> = [];

    const systems: CurriculumSystemId[] = ['CBSE', 'CISCE', 'Cambridge'];

    systems.forEach((sys) => {
      const filterGroup: 'CBSE' | 'CISCE' | 'CAMBRIDGE' =
        sys === 'CBSE' ? 'CBSE' : sys === 'CISCE' ? 'CISCE' : 'CAMBRIDGE';

      const progs = PUBLISHING_CURRICULUM_HIERARCHY[sys] || [];
      progs.forEach((prog) => {
        prog.classes.forEach((cls) => {
          // Find if there is an existing blueprint record for this destination
          const match = allBlueprints.find((b) => {
            const bSys =
              b.systemId ||
              (b.board === 'ICSE' || b.board === 'CISCE' || b.board === 'ISC'
                ? 'CISCE'
                : b.board?.startsWith('Cambridge')
                ? 'Cambridge'
                : b.board);
            if (bSys !== sys) return false;

            const bStage = b.classOrStageOrQualification || '';
            const bTarget = b.targetClass || '';

            return (
              matchesClassCanonical(bStage, cls.id, cls.label) ||
              matchesClassCanonical(bTarget, cls.id, cls.label)
            );
          });

          const formattedClassLabel =
            sys === 'CISCE' ? cls.label.replace(/\s*—\s*/, ' / ') : cls.label;

          if (match) {
            let label = '';
            if (sys === 'CBSE') {
              label = `CBSE ${formattedClassLabel} — ${match.title} (${match.totalMarks}m)`;
            } else if (sys === 'CISCE') {
              label = `CISCE ${formattedClassLabel} — ${match.title} (${match.totalMarks}m)`;
            } else {
              label = `Cambridge ${formattedClassLabel} — ${match.title} (${match.totalMarks}m)`;
            }

            destinations.push({
              id: match.id,
              system: sys,
              systemFilterGroup: filterGroup,
              programme: prog.programme,
              classId: cls.id,
              classLabel: formattedClassLabel,
              displayLabel: label,
              hasBlueprint: true,
              blueprint: match,
            });
          } else {
            const placeholder = createEmptyBlueprintPlaceholder(sys, cls.id, prog.programme);
            let label = '';
            if (sys === 'CBSE') {
              label = `CBSE ${formattedClassLabel} (No blueprint created)`;
            } else if (sys === 'CISCE') {
              label = `CISCE ${formattedClassLabel} (No blueprint created)`;
            } else {
              label = `Cambridge ${formattedClassLabel} (No blueprint created)`;
            }

            destinations.push({
              id: placeholder.id,
              system: sys,
              systemFilterGroup: filterGroup,
              programme: prog.programme,
              classId: cls.id,
              classLabel: formattedClassLabel,
              displayLabel: label,
              hasBlueprint: false,
              blueprint: placeholder,
            });
          }
        });
      });
    });

    // Append custom blueprints
    allBlueprints.forEach((bp) => {
      const isCustom =
        bp.board === 'Custom' ||
        bp.id.startsWith('custom_') ||
        bp.id.startsWith('imported_') ||
        bp.verificationStatus === 'CUSTOM / AUTHOR MODEL';

      if (isCustom && !destinations.some((d) => d.blueprint.id === bp.id)) {
        destinations.push({
          id: bp.id,
          system: 'CBSE',
          systemFilterGroup: 'CUSTOM',
          programme: bp.programme || 'Custom Model',
          classId: bp.targetClass || 'Custom',
          classLabel: bp.targetClass || 'Custom',
          displayLabel: `Custom • ${bp.title} (${bp.totalMarks}m)`,
          hasBlueprint: true,
          blueprint: bp,
        });
      }
    });

    return destinations;
  }, [allBlueprints]);

  // Selected blueprint state (defaults to CBSE Class 6 demo model or first blueprint)
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(
    DEMO_CBSE_CLASS6_BLUEPRINT.id
  );

  // Active editable blueprint copy
  const [activeBlueprint, setActiveBlueprint] = useState<BoardQuestionBlueprint>(() => {
    const found = allBlueprints.find((b) => b.id === selectedBlueprintId) || allBlueprints[0];
    return JSON.parse(JSON.stringify(found));
  });

  // When selected blueprint changes
  const handleSelectBlueprint = (id: string, customBlueprint?: BoardQuestionBlueprint) => {
    setSelectedBlueprintId(id);
    const target =
      customBlueprint ||
      allBlueprints.find((b) => b.id === id) ||
      canonicalDestinations.find((d) => d.id === id)?.blueprint;
    if (target) {
      setActiveBlueprint(JSON.parse(JSON.stringify(target)));
      if (customBlueprint && !customBlueprint.id.startsWith('empty_')) {
        const updatedSaved = [
          ...(seriesProject.savedBlueprints || []).filter((b) => b.id !== customBlueprint.id),
          customBlueprint,
        ];
        onUpdateSeriesProject({
          ...seriesProject,
          savedBlueprints: updatedSaved,
          lastUpdated: new Date().toISOString(),
        });
      }
    }
  };

  // Two-state header and Focus Mode controls
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [showFullDiscrepancyPopover, setShowFullDiscrepancyPopover] = useState<boolean>(false);
  const [showHierarchicalSelectorModal, setShowHierarchicalSelectorModal] = useState<boolean>(false);
  const [showCrossAssemblyWarning, setShowCrossAssemblyWarning] = useState<boolean>(false);

  // Active authoring destination context (strictly separated from inspected blueprint)
  const activeBookBoard = seriesProject.targetBoard || 'CBSE';
  const activeBookClass = seriesProject.selectedClass || 'Class 6';
  const activeBookTitle = seriesProject.seriesTitle || 'VERITAS Grammar Series';

  // Derive source classification metadata for the inspected blueprint
  const inspectedSourceMeta = useMemo(() => {
    const rawStatus =
      activeBlueprint.verificationStatus ||
      (activeBlueprint.isEditorialModel
        ? 'VERITAS EDITORIAL MODEL'
        : 'VERIFIED BOARD SPECIFICATION');

    if (
      rawStatus === 'VERIFIED BOARD SPECIFICATION' ||
      (!activeBlueprint.isEditorialModel && rawStatus !== 'CUSTOM / AUTHOR MODEL')
    ) {
      return {
        label: 'VERIFIED BOARD SPECIFICATION',
        shortLabel: 'Verified Board Spec',
        badgeClass:
          'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        icon: ShieldCheck,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      };
    }
    if (rawStatus === 'CURRICULUM-ALIGNED EDITORIAL MODEL') {
      return {
        label: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
        shortLabel: 'Curriculum-Aligned Model',
        badgeClass:
          'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
        icon: FileCheck,
        iconColor: 'text-sky-600 dark:text-sky-400',
      };
    }
    if (rawStatus === 'CUSTOM / AUTHOR MODEL' || activeBlueprint.board === 'Custom') {
      return {
        label: 'CUSTOM / AUTHOR MODEL',
        shortLabel: 'Custom / Author Model',
        badgeClass:
          'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
        icon: SlidersHorizontal,
        iconColor: 'text-purple-600 dark:text-purple-400',
      };
    }
    return {
      label: rawStatus || 'VERITAS EDITORIAL MODEL',
      shortLabel: 'Veritas Editorial Model',
      badgeClass:
        'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: FileCheck,
      iconColor: 'text-amber-600 dark:text-amber-400',
    };
  }, [activeBlueprint]);

  const inspectedReferenceLine =
    activeBlueprint.officialSyllabusReference ||
    activeBlueprint.editorialReferenceNotes ||
    'VERITAS Editorial Progression Framework (Aligned to Stage Rigor)';

  // Toggle Focus Mode (collapses secondary contextual sidebar without hiding navigation rail)
  const handleToggleFocusMode = () => {
    const nextMode = !focusMode;
    setFocusMode(nextMode);
    if (nextMode) {
      onToggleSecondary?.(false);
      showNotification('Focus Mode active: secondary sidebar collapsed to maximize blueprint workspace.');
    } else {
      onToggleSecondary?.(true);
      showNotification('Focus Mode exited: secondary sidebar restored.');
    }
  };

  // Board Filter
  const [boardFilter, setBoardFilter] = useState<string>('ALL');

  // Audit Source: 'slots' | 'existing_tests' | 'topic_bank'
  const [auditSource, setAuditSource] = useState<'slots' | 'existing_tests'>('slots');
  const [selectedExistingTestId, setSelectedExistingTestId] = useState<string>('');

  // UI view tabs within the blueprint module
  const [activeSubTab, setActiveSubTab] = useState<BlueprintSubTab>('systems');

  // Active system selection
  const [selectedSystemId, setSelectedSystemId] = useState<CurriculumSystemId>('CBSE');
  const [activeProfileKey, setActiveProfileKey] = useState<string>('cbse-class6');
  const [showAcademicAuditModal, setShowAcademicAuditModal] = useState<boolean>(false);

  // Expanded concept notes state
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(null);

  // Custom Blueprint Creation Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBpTitle, setNewBpTitle] = useState('');
  const [newBpBoard, setNewBpBoard] = useState<BoardStandardCode>('CBSE');
  const [newBpClass, setNewBpClass] = useState<GrammarClassLevel>('Class 10');
  const [newBpTotalMarks, setNewBpTotalMarks] = useState(10);
  const [newBpDuration, setNewBpDuration] = useState(25);

  // Import Verified Specification Modal
  const [showImportSpecModal, setShowImportSpecModal] = useState(false);
  const [importBoard, setImportBoard] = useState<CurriculumSystemId>('CBSE');
  const [importClass, setImportClass] = useState('Class 2');
  const [importProgramme, setImportProgramme] = useState('Primary / Foundational');
  const [importTitle, setImportTitle] = useState('');
  const [importReference, setImportReference] = useState('');
  const [importMarks, setImportMarks] = useState(25);
  const [importDuration, setImportDuration] = useState(45);

  // Helper to strip redundant board prefixes like "CBSE " or "CISCE "
  const cleanClassLabel = (targetClass?: string) => {
    if (!targetClass) return '';
    return targetClass.replace(/^(CBSE|CISCE|ICSE|ISC|Cambridge)\s+/i, '').trim();
  };

  // Helper to format clean breadcrumb without duplicating system names
  const formatCleanBreadcrumb = (board: string, programme?: string, targetClass?: string) => {
    const cClass = cleanClassLabel(targetClass);
    const cleanBoard =
      board === 'ICSE' || board === 'ISC' || board === 'CISCE'
        ? 'CISCE'
        : board?.startsWith('Cambridge')
        ? 'Cambridge'
        : board || 'CBSE';

    if (programme && programme !== 'Standard' && !programme.toLowerCase().includes(cClass.toLowerCase())) {
      return `${cleanBoard} • ${programme} • ${cClass || targetClass}`;
    }
    return `${cleanBoard} • ${cClass || targetClass}`;
  };

  // Check if active blueprint is an empty placeholder for an uncreated class
  const isEmptyBlueprintActive = useMemo(() => {
    return (
      activeBlueprint.id.startsWith('empty_') ||
      (activeBlueprint.totalMarks === 0 && (!activeBlueprint.questionSlots || activeBlueprint.questionSlots.length === 0))
    );
  }, [activeBlueprint]);

  // Handle creating an editorial model directly for the current active empty class
  const handleCreateEditorialModelForCurrentClass = () => {
    const sys =
      activeBlueprint.systemId ||
      (activeBlueprint.board === 'ICSE' || activeBlueprint.board === 'ISC' || activeBlueprint.board === 'CISCE'
        ? 'CISCE'
        : activeBlueprint.board?.startsWith('Cambridge')
        ? 'Cambridge'
        : 'CBSE');

    const template = createEditorialTemplateForClass(
      sys as CurriculumSystemId,
      activeBlueprint.targetClass,
      activeBlueprint.programme
    );

    handleSelectBlueprint(template.id, template);
    showNotification(`Generated VERITAS Editorial Model for ${sys} ${activeBlueprint.targetClass}.`);
  };

  // Handle creating a verified specification from imported data
  const handleImportSpecification = () => {
    if (!importTitle.trim() || !importReference.trim()) return;

    const newId = `imported_${importBoard.toLowerCase()}_${importClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const importedBp: BoardQuestionBlueprint = {
      id: newId,
      title: importTitle.trim(),
      board: importBoard as any,
      boardCode: `${importBoard.toUpperCase()}-${importClass.toUpperCase().replace(/\s+/g, '-')}-SPEC`,
      targetClass: importClass as GrammarClassLevel,
      systemId: importBoard,
      programme: importProgramme || 'Standard Programme',
      classOrStageOrQualification: importClass,
      academicYear: '2025–26',
      syllabusVersion: `${importBoard} ${importClass} Official Assessment Framework`,
      assessmentVersion: 'v1.0-Verified',
      verificationStatus: 'VERIFIED BOARD SPECIFICATION',
      isEditorialModel: false,
      totalMarks: importMarks,
      totalDurationMinutes: importDuration,
      description: `Official statutory assessment framework transcribed from circular or syllabus specifications.`,
      officialSyllabusReference: importReference.trim(),
      markingSchemeGuidelines: [
        'Adhere strictly to official board marking scheme rubrics.',
        'Step-wise marking for multi-part questions.',
      ],
      conceptWeightages: [
        {
          id: `${newId}-cw-1`,
          conceptName: `${importClass} Core Grammar & Syntax`,
          strand: 'Grammar & Usage',
          targetMarks: Math.round(importMarks * 0.4),
          minMarks: Math.round(importMarks * 0.35),
          maxMarks: Math.round(importMarks * 0.45),
          preferredQuestionTypes: ['fill_in_blanks', 'mcq'],
          cognitiveLevel: 'Remembering',
          mandatory: true,
          pedagogicalNotes: 'Syntactic concord and tense forms.',
        },
        {
          id: `${newId}-cw-2`,
          conceptName: `${importClass} Composition & Applied Language`,
          strand: 'Writing & Composition',
          targetMarks: Math.round(importMarks * 0.6),
          minMarks: Math.round(importMarks * 0.55),
          maxMarks: Math.round(importMarks * 0.65),
          preferredQuestionTypes: ['short_answer'],
          cognitiveLevel: 'Applying',
          mandatory: true,
          pedagogicalNotes: 'Textual production and stylistic precision.',
        },
      ],
      questionSlots: [
        {
          id: `${newId}-qs-1`,
          slotCode: 'Sec A - Q1',
          sectionTitle: 'Section A: Grammar & Vocabulary',
          marks: 1,
          questionType: 'mcq',
          conceptTested: `${importClass} Core Grammar & Syntax`,
          cognitiveLevel: 'Remembering',
          internalChoiceAvailable: false,
        },
        {
          id: `${newId}-qs-2`,
          slotCode: 'Sec A - Q2',
          sectionTitle: 'Section A: Grammar & Vocabulary',
          marks: 1,
          questionType: 'fill_in_blanks',
          conceptTested: `${importClass} Core Grammar & Syntax`,
          cognitiveLevel: 'Understanding',
          internalChoiceAvailable: false,
        },
      ],
    };

    handleSelectBlueprint(importedBp.id, importedBp);
    setShowImportSpecModal(false);
    showNotification(`Imported and activated verified specification for ${importBoard} ${importClass}.`);
  };

  // Export Spec Modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportText, setExportText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Success feedback message
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Current book based on active blueprint class
  const currentBook = seriesProject.books[activeBlueprint.targetClass] || seriesProject.books['Class 10'];

  // All existing tests available in the current book for comparison
  const existingTestsInBook: GrammarTestSeries[] = useMemo(() => {
    if (!currentBook) return [];
    return currentBook.topics.flatMap((t) => t.testSeries);
  }, [currentBook]);

  // Derive questions to audit
  const questionsToAudit: GrammarQuestion[] = useMemo(() => {
    if (auditSource === 'existing_tests' && selectedExistingTestId) {
      const foundTest = existingTestsInBook.find((t) => t.id === selectedExistingTestId);
      if (foundTest) {
        return foundTest.sections.flatMap((s) => s.questions);
      }
    }

    // Default: assemble questions from the active blueprint's question slots
    return activeBlueprint.questionSlots.map((slot, idx) => ({
      id: slot.id,
      type: slot.questionType,
      prompt: slot.sampleQuestionPrompt || `[${slot.slotCode}] ${slot.conceptTested}`,
      difficulty: 'Medium',
      marks: slot.marks,
      correctAnswer: 'Board Marking Scheme Standard',
      explanation: `Tests ${slot.conceptTested} according to ${activeBlueprint.boardCode}`,
      conceptTested: slot.conceptTested,
      cognitiveLevel: slot.cognitiveLevel,
      boardSlotId: slot.id,
    }));
  }, [auditSource, selectedExistingTestId, existingTestsInBook, activeBlueprint.questionSlots]);

  // Real-time audit report calculation
  const auditReport: BlueprintAuditReport = useMemo(() => {
    return auditTestPaperAgainstBlueprint(activeBlueprint, questionsToAudit);
  }, [activeBlueprint, questionsToAudit]);

  // Advisories for rebalancing
  const rebalanceAdvisories = useMemo(() => {
    return generateRebalancingAdvisories(auditReport);
  }, [auditReport]);

  // Handle slot mark change
  const handleUpdateSlotMark = (slotId: string, delta: number) => {
    setActiveBlueprint((prev) => {
      const updatedSlots = prev.questionSlots.map((s) => {
        if (s.id === slotId) {
          const newMarks = Math.max(0.5, Math.min(10, s.marks + delta));
          return { ...s, marks: newMarks };
        }
        return s;
      });
      return { ...prev, questionSlots: updatedSlots };
    });
  };

  // Handle slot prompt edit
  const handleUpdateSlotPrompt = (slotId: string, promptText: string) => {
    setActiveBlueprint((prev) => {
      const updatedSlots = prev.questionSlots.map((s) =>
        s.id === slotId ? { ...s, sampleQuestionPrompt: promptText } : s
      );
      return { ...prev, questionSlots: updatedSlots };
    });
  };

  // Handle slot concept change
  const handleUpdateSlotConcept = (slotId: string, conceptName: string) => {
    setActiveBlueprint((prev) => {
      const updatedSlots = prev.questionSlots.map((s) =>
        s.id === slotId ? { ...s, conceptTested: conceptName } : s
      );
      return { ...prev, questionSlots: updatedSlots };
    });
  };

  // Add new slot
  const handleAddQuestionSlot = () => {
    const slotNumber = activeBlueprint.questionSlots.length + 1;
    const defaultConcept = activeBlueprint.conceptWeightages[0]?.conceptName || 'General Grammar';
    const newSlot: BlueprintQuestionSlot = {
      id: `slot_${Date.now()}`,
      slotCode: `Slot #${slotNumber}`,
      sectionTitle: 'Section B: Grammar',
      conceptTested: defaultConcept,
      questionType: 'transformation',
      marks: 1,
      cognitiveLevel: 'Applying',
      sampleQuestionPrompt: `Enter question prompt for ${defaultConcept}...`,
    };
    setActiveBlueprint((prev) => ({
      ...prev,
      questionSlots: [...prev.questionSlots, newSlot],
    }));
  };

  // Delete slot
  const handleDeleteSlot = (slotId: string) => {
    if (activeBlueprint.questionSlots.length <= 1) {
      alert('Blueprint must have at least one question slot.');
      return;
    }
    setActiveBlueprint((prev) => ({
      ...prev,
      questionSlots: prev.questionSlots.filter((s) => s.id !== slotId),
    }));
  };

  // Reset to default
  const handleResetToDefault = () => {
    const original = PRECONFIGURED_BOARD_BLUEPRINTS.find((b) => b.id === selectedBlueprintId);
    if (original) {
      setActiveBlueprint(JSON.parse(JSON.stringify(original)));
      showNotification(`Reset blueprint "${original.title}" to board default.`);
    }
  };

  // Auto-rebalance slots to match concept weightages
  const handleAutoRebalanceSlots = () => {
    // Generate an ideal distribution of slots matching the concept weightages exactly
    const rebalancedSlots: BlueprintQuestionSlot[] = [];
    let slotCount = 1;

    activeBlueprint.conceptWeightages.forEach((cw) => {
      let remainingMarks = cw.targetMarks;
      // allocate in 1 mark or 0.5 mark increments
      const unit = remainingMarks % 1 === 0 ? 1 : 0.5;

      while (remainingMarks > 0) {
        const markVal = Math.min(unit, remainingMarks);
        const qType = cw.preferredQuestionTypes[slotCount % cw.preferredQuestionTypes.length] || 'fill_in_blanks';

        rebalancedSlots.push({
          id: `slot_auto_${cw.id}_${slotCount}_${Date.now()}`,
          slotCode: `Slot #${slotCount} (${cw.conceptName.slice(0, 10)})`,
          sectionTitle: 'Section B: Grammar',
          conceptTested: cw.conceptName,
          questionType: qType,
          marks: markVal,
          cognitiveLevel: cw.cognitiveLevel,
          sampleQuestionPrompt: `Sample question testing ${cw.conceptName} according to ${activeBlueprint.board} marking scheme (${markVal} mark).`,
        });

        remainingMarks -= markVal;
        slotCount++;
      }
    });

    setActiveBlueprint((prev) => ({
      ...prev,
      questionSlots: rebalancedSlots,
    }));

    showNotification('Auto-rebalanced all slots to match board prescribed weightages (100% Target Alignment)!');
  };

  // Save blueprint as custom preset
  const handleSaveBlueprint = () => {
    const updatedSaved = [
      ...(seriesProject.savedBlueprints || []).filter((b) => b.id !== activeBlueprint.id),
      activeBlueprint,
    ];

    onUpdateSeriesProject({
      ...seriesProject,
      savedBlueprints: updatedSaved,
      lastUpdated: new Date().toISOString(),
    });

    showNotification(`Successfully saved blueprint "${activeBlueprint.title}" to project!`);
  };

  // Assemble and transfer this test paper with strict cross-system/cross-level safety checks
  const handleAssembleToCoursebook = () => {
    // Cross-system or cross-level safety check against active authoring destination
    const isCrossSystem =
      activeBlueprint.board !== activeBookBoard &&
      !(activeBookBoard === 'CBSE' && activeBlueprint.board === 'CBSE');
    const isCrossClass = activeBlueprint.targetClass !== activeBookClass;

    if (isCrossSystem || isCrossClass) {
      setShowCrossAssemblyWarning(true);
      return;
    }

    // Direct match: assemble to active book
    assembleDirectlyToClass(activeBookClass);
  };

  // Helper to assemble directly into a designated book
  const assembleDirectlyToClass = (targetClass: GrammarClassLevel) => {
    const draftTest = createDraftTestFromBlueprint(activeBlueprint);
    const book = seriesProject.books[targetClass];
    if (!book || book.topics.length === 0) {
      showNotification(`No curriculum topics found for ${targetClass}. Create a unit first.`);
      return;
    }

    const targetTopic = book.topics[0];
    const updatedTopic = {
      ...targetTopic,
      testSeries: [...targetTopic.testSeries, draftTest],
    };

    const updatedTopics = book.topics.map((t) => (t.id === targetTopic.id ? updatedTopic : t));
    const updatedBook = { ...book, topics: updatedTopics };

    onUpdateSeriesProject({
      ...seriesProject,
      books: { ...seriesProject.books, [targetClass]: updatedBook },
      lastUpdated: new Date().toISOString(),
    });

    showNotification(
      `Assembled test paper "${draftTest.title}" (${draftTest.totalMarks}m) transferred to ${targetClass} - "${targetTopic.title}"!`
    );

    if (onNavigateToCoursebook) {
      onNavigateToCoursebook(targetClass);
    }
  };

  // Adapt cross-system blueprint into active book's class level
  const handleAdaptAndAssemble = () => {
    const adaptedBlueprint: BoardQuestionBlueprint = {
      ...activeBlueprint,
      targetClass: activeBookClass,
      title: `${activeBlueprint.title} (Adapted for ${activeBookBoard} ${activeBookClass})`,
      description: `Pedagogically adapted from ${activeBlueprint.board} ${activeBlueprint.targetClass} to match ${activeBookBoard} ${activeBookClass} learning outcomes.`,
      isEditorialModel: true,
      verificationStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    };

    const draftTest = createDraftTestFromBlueprint(adaptedBlueprint);
    const book = seriesProject.books[activeBookClass];
    if (!book || book.topics.length === 0) {
      showNotification(`No curriculum topics found for ${activeBookClass}.`);
      return;
    }

    const targetTopic = book.topics[0];
    const updatedTopic = {
      ...targetTopic,
      testSeries: [...targetTopic.testSeries, draftTest],
    };

    const updatedTopics = book.topics.map((t) => (t.id === targetTopic.id ? updatedTopic : t));
    const updatedBook = { ...book, topics: updatedTopics };

    onUpdateSeriesProject({
      ...seriesProject,
      books: { ...seriesProject.books, [activeBookClass]: updatedBook },
      lastUpdated: new Date().toISOString(),
    });

    showNotification(
      `Adapted test paper "${draftTest.title}" calibrated and assembled into ${activeBookClass} - "${targetTopic.title}"!`
    );

    if (onNavigateToCoursebook) {
      onNavigateToCoursebook(activeBookClass);
    }
  };

  // Switch destination context to blueprint's class and assemble
  const handleSwitchContextAndAssemble = () => {
    const targetClass = activeBlueprint.targetClass;
    onUpdateSeriesProject({
      ...seriesProject,
      selectedClass: targetClass,
      lastUpdated: new Date().toISOString(),
    });
    assembleDirectlyToClass(targetClass);
  };

  // Save standalone assessment without modifying coursebook topics
  const handleSaveStandalone = () => {
    const updatedSaved = [
      ...(seriesProject.savedBlueprints || []).filter((b) => b.id !== activeBlueprint.id),
      activeBlueprint,
    ];
    onUpdateSeriesProject({
      ...seriesProject,
      savedBlueprints: updatedSaved,
      lastUpdated: new Date().toISOString(),
    });
    showNotification(`Saved standalone assessment paper "${activeBlueprint.title}" to project assessment library.`);
  };

  // Open Export Modal
  const handleOpenExportModal = () => {
    const text = exportBlueprintToText(activeBlueprint, auditReport);
    setExportText(text);
    setShowExportModal(true);
    setCopySuccess(false);
  };

  const handleCopyExportText = () => {
    navigator.clipboard.writeText(exportText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleDownloadExportFile = () => {
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeBlueprint.boardCode}_Blueprint_Matrix.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Create Custom Blueprint
  const handleCreateCustomBlueprint = () => {
    if (!newBpTitle.trim()) return;

    const newBp: BoardQuestionBlueprint = {
      id: `custom_bp_${Date.now()}`,
      title: newBpTitle.trim(),
      board: newBpBoard,
      boardCode: `${newBpBoard}-CUSTOM-${newBpClass.replace(/\s+/g, '').toUpperCase()}`,
      targetClass: newBpClass,
      totalMarks: newBpTotalMarks,
      totalDurationMinutes: newBpDuration,
      description: `Custom question blueprint for ${newBpClass} according to ${newBpBoard} curriculum standards.`,
      officialSyllabusReference: `${newBpBoard} English Language Framework`,
      markingSchemeGuidelines: [
        '1 mark per correct question.',
        'Strict syntactic and grammatical accuracy.',
      ],
      conceptWeightages: [
        {
          id: `cw_${Date.now()}_1`,
          conceptName: 'Tenses & Verb Forms',
          strand: 'Verbs & Morphology',
          targetMarks: Math.round(newBpTotalMarks * 0.3),
          minMarks: 2,
          maxMarks: 5,
          preferredQuestionTypes: ['fill_in_blanks', 'error_correction'],
          cognitiveLevel: 'Applying',
          mandatory: true,
        },
        {
          id: `cw_${Date.now()}_2`,
          conceptName: 'Subject-Verb Concord',
          strand: 'Syntax & Agreement',
          targetMarks: Math.round(newBpTotalMarks * 0.2),
          minMarks: 1,
          maxMarks: 3,
          preferredQuestionTypes: ['error_correction'],
          cognitiveLevel: 'Applying',
          mandatory: true,
        },
        {
          id: `cw_${Date.now()}_3`,
          conceptName: 'Reported Speech',
          strand: 'Syntax & Speech Shift',
          targetMarks: Math.round(newBpTotalMarks * 0.3),
          minMarks: 2,
          maxMarks: 4,
          preferredQuestionTypes: ['transformation'],
          cognitiveLevel: 'Applying',
          mandatory: true,
        },
        {
          id: `cw_${Date.now()}_4`,
          conceptName: 'Modals & Auxiliaries',
          strand: 'Verbs & Morphology',
          targetMarks: Math.round(newBpTotalMarks * 0.2),
          minMarks: 1,
          maxMarks: 3,
          preferredQuestionTypes: ['mcq', 'fill_in_blanks'],
          cognitiveLevel: 'Understanding',
          mandatory: false,
        },
      ],
      questionSlots: [
        {
          id: `qs_${Date.now()}_1`,
          slotCode: 'Q1',
          sectionTitle: 'Section B: Grammar',
          conceptTested: 'Tenses & Verb Forms',
          questionType: 'fill_in_blanks',
          marks: 1,
          cognitiveLevel: 'Applying',
          sampleQuestionPrompt: 'Complete the sentence with appropriate verb tense...',
        },
        {
          id: `qs_${Date.now()}_2`,
          slotCode: 'Q2',
          sectionTitle: 'Section B: Grammar',
          conceptTested: 'Subject-Verb Concord',
          questionType: 'error_correction',
          marks: 1,
          cognitiveLevel: 'Analysing',
          sampleQuestionPrompt: 'Identify and correct the error in agreement...',
        },
        {
          id: `qs_${Date.now()}_3`,
          slotCode: 'Q3',
          sectionTitle: 'Section B: Grammar',
          conceptTested: 'Reported Speech',
          questionType: 'transformation',
          marks: 1,
          cognitiveLevel: 'Applying',
          sampleQuestionPrompt: 'Report the dialogue given below...',
        },
      ],
    };

    const updatedSaved = [...(seriesProject.savedBlueprints || []), newBp];
    onUpdateSeriesProject({
      ...seriesProject,
      savedBlueprints: updatedSaved,
      lastUpdated: new Date().toISOString(),
    });

    setSelectedBlueprintId(newBp.id);
    setActiveBlueprint(newBp);
    setShowCreateModal(false);
    setNewBpTitle('');
    showNotification(`Created custom blueprint "${newBp.title}"!`);
  };

  // Filtered blueprints
  const filteredBlueprints = allBlueprints.filter((b) => {
    if (boardFilter === 'ALL') return true;
    if (boardFilter === 'CBSE') return b.board === 'CBSE';
    if (boardFilter === 'ICSE' || boardFilter === 'CISCE')
      return b.board === 'ICSE' || b.board === 'CISCE' || b.board === 'ISC';
    if (boardFilter === 'CAMBRIDGE')
      return (
        b.board === 'Cambridge' ||
        b.board === 'Cambridge_Checkpoint' ||
        b.board === 'Cambridge_IGCSE'
      );
    if (boardFilter === 'CUSTOM') return b.board === 'Custom' || b.board === 'State_Board';
    return true;
  });

  // Filtered canonical destinations by active board filter
  const filteredCanonicalDestinations = useMemo(() => {
    if (boardFilter === 'ALL') return canonicalDestinations;
    if (boardFilter === 'CBSE')
      return canonicalDestinations.filter((d) => d.systemFilterGroup === 'CBSE');
    if (boardFilter === 'CISCE' || boardFilter === 'ICSE')
      return canonicalDestinations.filter((d) => d.systemFilterGroup === 'CISCE');
    if (boardFilter === 'CAMBRIDGE')
      return canonicalDestinations.filter((d) => d.systemFilterGroup === 'CAMBRIDGE');
    if (boardFilter === 'CUSTOM')
      return canonicalDestinations.filter((d) => d.systemFilterGroup === 'CUSTOM');
    return canonicalDestinations;
  }, [canonicalDestinations, boardFilter]);

  const isCompactHeader = isScrolled || isHeaderCollapsed;

  return (
    <div
      id="board-blueprint-matrix-view"
      className="flex-1 flex flex-col overflow-hidden bg-stone-50/50 dark:bg-slate-950/50 select-none"
    >
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-md transition-all shrink-0 z-30">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notificationMsg}</span>
          </div>
          <button
            onClick={() => setNotificationMsg(null)}
            className="text-white/80 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* STATE 2: COMPACT STICKY HEADER (Active when scrolled or manually collapsed) */}
      {isCompactHeader ? (
        <div className="border-b border-stone-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-2xs z-20 transition-all">
          {/* Left: Compact Module Title + Dual Context Tags */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#5A1832]/10 text-[#5A1832] dark:bg-[#C29A52]/20 dark:text-[#C29A52] border border-[#5A1832]/20 font-mono shrink-0">
              BLUEPRINTS
            </span>

            {/* Active Destination Tag */}
            <span className="hidden sm:inline-flex text-[11px] text-stone-500 dark:text-slate-400 shrink-0 font-mono">
              Active: <strong className="text-stone-800 dark:text-slate-200 ml-1">{activeBookBoard} {activeBookClass}</strong>
            </span>

            <span className="text-stone-300 dark:text-slate-700 hidden sm:inline">•</span>

            {/* Inspected Blueprint Tag */}
            <span className="text-[11px] font-semibold text-stone-900 dark:text-slate-100 truncate max-w-[200px] md:max-w-xs" title={activeBlueprint.title}>
              Inspected: {formatCleanBreadcrumb(activeBlueprint.board, undefined, activeBlueprint.targetClass)} - {activeBlueprint.title}
            </span>

            {/* Source Type Badge Mini */}
            <span className={`hidden md:inline-flex text-[10px] font-bold px-2 py-0.2 rounded-full border items-center space-x-1 shrink-0 ${inspectedSourceMeta.badgeClass}`}>
              <inspectedSourceMeta.icon className={`w-3 h-3 ${inspectedSourceMeta.iconColor}`} />
              <span>{inspectedSourceMeta.shortLabel}</span>
            </span>
          </div>

          {/* Center: Compact Discrepancy Pill with Popover Toggle */}
          <div className="relative flex items-center">
            <button
              onClick={() => setShowFullDiscrepancyPopover(!showFullDiscrepancyPopover)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                auditReport.status === 'compliant'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : auditReport.status === 'minor_discrepancy'
                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
              }`}
              title="Click to view discrepancy audit breakdown"
            >
              <span className="font-bold">{auditReport.compliancePercentage}%</span>
              <span>•</span>
              <span className="hidden sm:inline">
                {activeBlueprint.isEditorialModel
                  ? auditReport.status === 'compliant'
                    ? 'Model Aligned'
                    : 'Editorial Variance'
                  : auditReport.status === 'compliant'
                  ? 'Board Compliant'
                  : 'Board Discrepancy'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Floating Popover Breakdown */}
            {showFullDiscrepancyPopover && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-80 p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1E141B] border-2 border-[#8C6D3B]/40 shadow-2xl space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-slate-100 uppercase tracking-wider font-mono">
                    Real-Time Audit Breakdown
                  </span>
                  <button
                    onClick={() => setShowFullDiscrepancyPopover(false)}
                    className="text-xs text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Allocated / Target:</span>
                    <strong>
                      {auditReport.assignedTotalMarks} / {auditReport.targetTotalMarks} Marks
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Under-tested Concepts:</span>
                    <strong className="text-sky-600">{auditReport.underTestedConcepts.length}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Over-tested Concepts:</span>
                    <strong className="text-amber-600">{auditReport.overTestedConcepts.length}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Missing Mandatory:</span>
                    <strong className="text-rose-600">{auditReport.missingMandatoryConcepts.length}</strong>
                  </div>
                </div>

                {auditReport.status !== 'compliant' && (
                  <button
                    onClick={() => {
                      handleAutoRebalanceSlots();
                      setShowFullDiscrepancyPopover(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Auto-Rebalance Slots Now</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions, Focus Mode, Assemble, Expand */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Structured Directory Button */}
            <button
              onClick={() => setShowHierarchicalSelectorModal(true)}
              className="h-7 px-2.5 rounded-lg border-2 border-[#8C6D3B]/40 hover:border-[#8C6D3B] bg-[#FAF7F2] dark:bg-[#20141D] text-[#5A1832] dark:text-[#C29A52] font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="Open Hierarchical Blueprint Directory"
            >
              <Layers className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />
              <span className="hidden sm:inline">Directory</span>
            </button>

            {/* Quick Dropdown */}
            <select
              value={selectedBlueprintId}
              onChange={(e) => handleSelectBlueprint(e.target.value)}
              className="h-7 text-xs font-medium px-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200 cursor-pointer max-w-[140px] truncate"
            >
              {filteredCanonicalDestinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.displayLabel}
                </option>
              ))}
            </select>

            {/* Focus Mode Toggle */}
            <button
              onClick={handleToggleFocusMode}
              className={`h-7 px-2 rounded-lg border font-semibold text-xs flex items-center space-x-1 transition-colors ${
                focusMode
                  ? 'bg-[#5A1832] text-white border-[#5A1832] dark:bg-[#C29A52] dark:text-[#1e0f18]'
                  : 'border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
              }`}
              title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            >
              {focusMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{focusMode ? 'Exit' : 'Focus'}</span>
            </button>

            {/* Assemble Button */}
            <button
              onClick={handleAssembleToCoursebook}
              className="h-7 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1 shadow-2xs transition-colors"
              title={`Assemble to Active Book (${activeBookBoard} ${activeBookClass})`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Assemble</span>
            </button>

            {/* Expand Header Toggle */}
            <button
              onClick={() => {
                setIsHeaderCollapsed(false);
                setIsScrolled(false);
              }}
              className="p-1 rounded-md border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 hover:text-stone-800 dark:text-slate-400 transition-colors"
              title="Expand full header view"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* STATE 1: EXPANDED FULL HEADER AT TOP */
        <div className="shrink-0 transition-all border-b border-stone-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          {/* Row 1: Page-Level Heading + Blueprint Selectors + Primary Actions */}
          <div className="px-5 py-2.5 border-b border-stone-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            {/* Left: Standard Page-Level Heading */}
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#5A1832]/10 dark:bg-[#C29A52]/20 border border-[#5A1832]/20 dark:border-[#C29A52]/30 text-[#5A1832] dark:text-[#C29A52] flex items-center justify-center font-bold shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-stone-900 dark:text-slate-100 tracking-tight font-serif uppercase">
                  BOARD BLUEPRINTS & ASSESSMENT INTELLIGENCE
                </h1>
                <p className="text-[11px] text-stone-500 dark:text-slate-400 leading-tight">
                  Official statutory standards & rigorous curriculum assessment models
                </p>
              </div>
            </div>

            {/* Right: Browse Directory + Filter + Select + Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Browse Directory Trigger */}
              <button
                id="blueprint-browse-directory-btn"
                onClick={() => setShowHierarchicalSelectorModal(true)}
                className="h-8 px-3 rounded-lg border-2 border-[#8C6D3B]/50 hover:border-[#8C6D3B] bg-[#FAF7F2] dark:bg-[#20141D] text-[#5A1832] dark:text-[#C29A52] font-bold text-xs flex items-center space-x-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-98"
                title="Browse Full Hierarchical Blueprint Directory (CBSE, CISCE, Cambridge Stages 1-12)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Browse Directory</span>
              </button>

              {/* Board Category Quick Filter */}
              <div className="hidden sm:flex items-center bg-stone-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-medium border border-stone-200/80 dark:border-slate-700/80">
                {['ALL', 'CBSE', 'CISCE', 'CAMBRIDGE', 'CUSTOM'].map((bf) => (
                  <button
                    key={bf}
                    onClick={() => setBoardFilter(bf)}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      boardFilter === bf || (bf === 'CISCE' && boardFilter === 'ICSE')
                        ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 font-bold shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {bf}
                  </button>
                ))}
              </div>

              {/* Blueprint Dropdown Selector */}
              <select
                id="blueprint-preset-select"
                value={selectedBlueprintId}
                onChange={(e) => handleSelectBlueprint(e.target.value)}
                className="h-8 text-xs font-semibold px-2.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500/30 cursor-pointer max-w-[240px] truncate"
                title="Select from loaded blueprints and canonical grade destinations"
              >
                {boardFilter === 'ALL' ? (
                  <>
                    <optgroup label="CBSE (Classes 1–12)">
                      {canonicalDestinations
                        .filter((d) => d.systemFilterGroup === 'CBSE')
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.displayLabel}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="CISCE (Classes 1–12)">
                      {canonicalDestinations
                        .filter((d) => d.systemFilterGroup === 'CISCE')
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.displayLabel}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Cambridge International">
                      {canonicalDestinations
                        .filter((d) => d.systemFilterGroup === 'CAMBRIDGE')
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.displayLabel}
                          </option>
                        ))}
                    </optgroup>
                    {canonicalDestinations.some((d) => d.systemFilterGroup === 'CUSTOM') && (
                      <optgroup label="Custom / Author Models">
                        {canonicalDestinations
                          .filter((d) => d.systemFilterGroup === 'CUSTOM')
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.displayLabel}
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </>
                ) : (
                  filteredCanonicalDestinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.displayLabel}
                    </option>
                  ))
                )}
              </select>

              {/* New Custom Blueprint Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="h-8 w-8 rounded-lg border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 flex items-center justify-center transition-colors"
                title="Create Custom Blueprint Model"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Export Spec */}
              <button
                onClick={handleOpenExportModal}
                className="h-8 px-2.5 rounded-lg border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 font-semibold text-xs hidden md:flex items-center space-x-1.5 transition-colors"
                title="Export Blueprint Specification as Markdown/Text"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Export</span>
              </button>

              {/* Focus Mode */}
              <button
                onClick={handleToggleFocusMode}
                className={`h-8 px-2.5 rounded-lg border font-semibold text-xs flex items-center space-x-1.5 transition-colors ${
                  focusMode
                    ? 'bg-[#5A1832] text-white border-[#5A1832] dark:bg-[#C29A52] dark:text-[#1e0f18]'
                    : 'border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
                }`}
                title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
              >
                {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden lg:inline">{focusMode ? 'Exit Focus' : 'Focus'}</span>
              </button>

              {/* Assemble Button */}
              <button
                onClick={handleAssembleToCoursebook}
                className="h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-colors"
                title={`Assemble this test paper into Active Book (${activeBookBoard} ${activeBookClass})`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assemble to {activeBookClass}</span>
              </button>

              {/* Collapse Header Button */}
              <button
                onClick={() => setIsHeaderCollapsed(true)}
                className="h-8 w-8 rounded-lg border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 hover:text-stone-800 dark:text-slate-400 flex items-center justify-center transition-colors"
                title="Collapse header to compact strip"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 2: Distinct Context Strips (Active Destination vs Inspected Blueprint) */}
          <div className="bg-[#FAF7F2] dark:bg-[#1E141B] px-5 py-2 border-b border-[#8C6D3B]/20 grid grid-cols-1 lg:grid-cols-12 gap-2 text-xs">
            {/* Left strip: Active Book Destination (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#8C6D3B]/20 pb-1.5 lg:pb-0 lg:pr-3">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm bg-[#5A1832]/15 text-[#5A1832] dark:bg-[#C29A52]/20 dark:text-[#C29A52] font-mono">
                  Active Book Destination
                </span>
                <span className="text-[10px] text-stone-400">Target for assembly</span>
              </div>
              <div className="font-semibold text-stone-900 dark:text-stone-100 truncate text-[11px]">
                {activeBookBoard} • {activeBookClass} • <span className="font-normal text-stone-600 dark:text-stone-300">{activeBookTitle}</span>
              </div>
            </div>

            {/* Right strip: Inspected Blueprint (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-center lg:pl-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300 font-mono">
                  Inspected Blueprint
                </span>
                <strong className="text-stone-900 dark:text-stone-100 font-mono text-[11px]">
                  {formatCleanBreadcrumb(activeBlueprint.board, activeBlueprint.programme, activeBlueprint.targetClass)}
                </strong>
                <span className="text-stone-400">•</span>
                <span className="font-bold text-stone-900 dark:text-slate-100 text-[11px] truncate max-w-xs">
                  {activeBlueprint.title}
                </span>

                {/* Source Type Badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 shrink-0 ${inspectedSourceMeta.badgeClass}`}>
                  <inspectedSourceMeta.icon className={`w-3 h-3 ${inspectedSourceMeta.iconColor}`} />
                  <span>{inspectedSourceMeta.label}</span>
                </span>
              </div>

              {/* Reference line */}
              <div className="text-[10px] text-stone-500 dark:text-slate-400 font-mono truncate">
                <span className="font-semibold text-stone-600 dark:text-slate-300">Reference:</span> {inspectedReferenceLine}
              </div>
            </div>
          </div>

          {/* Row 3: Compact Audit & Discrepancy Bar */}
          <div
            id="blueprint-realtime-audit-banner"
            className={`px-5 py-2 transition-colors flex flex-wrap items-center justify-between gap-3 text-xs ${
              auditReport.status === 'compliant'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
                : auditReport.status === 'minor_discrepancy'
                ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200'
                : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
            }`}
          >
            {/* Left: Score Gauge & Status */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${
                  auditReport.status === 'compliant'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                    : auditReport.status === 'minor_discrepancy'
                    ? 'bg-amber-500 text-white border-amber-400'
                    : 'bg-rose-600 text-white border-rose-500'
                }`}
              >
                {auditReport.compliancePercentage}%
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-bold">
                  {activeBlueprint.isEditorialModel
                    ? auditReport.status === 'compliant'
                      ? '100% Model Aligned'
                      : auditReport.status === 'minor_discrepancy'
                      ? 'Minor Model Variance'
                      : 'Editorial Discrepancy'
                    : auditReport.status === 'compliant'
                    ? '100% Board Compliant'
                    : auditReport.status === 'minor_discrepancy'
                    ? 'Minor Board Variance'
                    : 'Board Discrepancy'}
                </span>
                <span className="text-stone-400 dark:text-slate-500">•</span>
                <span>
                  Allocated: <strong className="font-semibold">{auditReport.assignedTotalMarks}</strong> /{' '}
                  <strong className="font-semibold">{auditReport.targetTotalMarks}m</strong>
                </span>
                {auditReport.totalMarksDifference !== 0 && (
                  <span className={`font-bold ${auditReport.totalMarksDifference > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    ({auditReport.totalMarksDifference > 0 ? '+' : ''}{auditReport.totalMarksDifference.toFixed(1)}m)
                  </span>
                )}
              </div>

              {/* Metrics Badges */}
              <div className="hidden sm:flex items-center space-x-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
                  Over: <strong className={auditReport.overTestedConcepts.length > 0 ? 'text-amber-600 font-bold' : ''}>{auditReport.overTestedConcepts.length}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
                  Under: <strong className={auditReport.underTestedConcepts.length > 0 ? 'text-sky-600 font-bold' : ''}>{auditReport.underTestedConcepts.length}</strong>
                </span>
                {auditReport.missingMandatoryConcepts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold">
                    Missing Mandatory: {auditReport.missingMandatoryConcepts.length}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Audit Source & Auto-Rebalance */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/80 dark:bg-slate-800/80 rounded-lg border border-stone-200 dark:border-slate-700 p-0.5 text-[11px]">
                <button
                  onClick={() => setAuditSource('slots')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    auditSource === 'slots' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600 dark:text-slate-400'
                  }`}
                >
                  Workbench Slots ({(activeBlueprint.questionSlots || []).length})
                </button>
                {existingTestsInBook.length > 0 && (
                  <button
                    onClick={() => {
                      setAuditSource('existing_tests');
                      if (!selectedExistingTestId && existingTestsInBook[0]) {
                        setSelectedExistingTestId(existingTestsInBook[0].id);
                      }
                    }}
                    className={`px-2 py-0.5 rounded font-medium transition-all ${
                      auditSource === 'existing_tests' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600 dark:text-slate-400'
                    }`}
                  >
                    Unit Tests ({existingTestsInBook.length})
                  </button>
                )}
              </div>

              {auditReport.status !== 'compliant' && (
                <button
                  onClick={handleAutoRebalanceSlots}
                  className="h-7 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center space-x-1 shadow-2xs transition-colors"
                  title="Auto-align question slots to target marks"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Auto-Rebalance</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STICKY SECTION NAVIGATION ROW (Always sits directly below header as ONE row) */}
      <div className="border-b border-stone-200/80 dark:border-slate-800 bg-[#FAF7F2]/90 dark:bg-[#1C121A]/90 backdrop-blur-md px-6 py-1.5 flex items-center justify-between shrink-0 overflow-x-auto gap-3 z-10">
        <div className="flex items-center space-x-1 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('systems')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'systems'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Systems Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('designer')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'designer'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Blueprint Designer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('coverage')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'coverage'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Coverage Matrix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gap_analysis')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'gap_analysis'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Question Bank Gaps</span>
          </button>

          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'matrix'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Weightage Grid</span>
          </button>

          <button
            onClick={() => setActiveSubTab('workbench')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'workbench'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Question Slots ({activeBlueprint.questionSlots.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'comparison'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3-System Comparison</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profiles')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'profiles'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Policy Profiles</span>
          </button>

          <button
            onClick={() => setActiveSubTab('policies')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'policies'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Statutory Rules</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit_report')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeSubTab === 'audit_report'
                ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Log ({rebalanceAdvisories.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowAcademicAuditModal(true)}
            className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors shrink-0"
            title="Perform comprehensive academic audit against evidence standards"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Academic Audit</span>
          </button>
        </div>

        {/* Existing Test Selector if in existing_tests audit mode */}
        {auditSource === 'existing_tests' && (
          <div className="flex items-center space-x-2 text-xs shrink-0">
            <span className="text-stone-500">Auditing Test:</span>
            <select
              value={selectedExistingTestId}
              onChange={(e) => setSelectedExistingTestId(e.target.value)}
              className="text-xs font-medium px-2 py-1 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              {existingTestsInBook.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.totalMarks} Marks)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* MAIN CONTENT WORKSPACE STAGE */}
      <div
        onScroll={(e) => {
          const st = e.currentTarget.scrollTop;
          if (st > 60 && !isScrolled) {
            setIsScrolled(true);
          } else if (st <= 60 && isScrolled) {
            setIsScrolled(false);
          }
        }}
        className={`flex-1 overflow-y-auto ${
          focusMode ? 'p-3 sm:p-5 max-w-full' : 'p-6'
        } space-y-6 transition-all`}
      >
        {/* SUB-TAB: SYSTEMS LANDING VIEW */}
        {activeSubTab === 'systems' && (
          <SystemLandingView
            selectedSystemId={selectedSystemId}
            onSelectSystem={(sys) => {
              setSelectedSystemId(sys);
              if (sys === 'CBSE') {
                handleSelectBlueprint(DEMO_CBSE_CLASS6_BLUEPRINT.id);
              } else if (sys === 'CISCE') {
                const cisceBp = allBlueprints.find((b) => b.board === 'ICSE');
                if (cisceBp) handleSelectBlueprint(cisceBp.id);
              } else if (sys === 'Cambridge') {
                const caieBp = allBlueprints.find((b) => b.board === 'Cambridge_Checkpoint');
                if (caieBp) handleSelectBlueprint(caieBp.id);
              }
            }}
            onSelectBlueprint={(bpId) => {
              handleSelectBlueprint(bpId);
              setActiveSubTab('designer');
            }}
            onSelectSystemLevel={(sys, levelId, levelLabel) => {
              setSelectedSystemId(sys);
              // Find matching blueprint
              const found = allBlueprints.find((b) => {
                const bSys =
                  b.systemId ||
                  (b.board === 'ICSE' || b.board === 'CISCE' || b.board === 'ISC'
                    ? 'CISCE'
                    : b.board?.startsWith('Cambridge')
                    ? 'Cambridge'
                    : b.board);
                return (
                  bSys === sys &&
                  (b.targetClass === levelId ||
                    b.targetClass === levelLabel ||
                    b.classOrStageOrQualification === levelId ||
                    b.targetClass?.toLowerCase().includes(levelId.toLowerCase()))
                );
              });

              if (found) {
                handleSelectBlueprint(found.id);
              } else {
                const emptyBp = createEmptyBlueprintPlaceholder(sys, levelId);
                handleSelectBlueprint(emptyBp.id, emptyBp);
              }
              setActiveSubTab('designer');
            }}
            allBlueprints={allBlueprints}
            onOpenDesigner={() => setActiveSubTab('designer')}
            onOpenComparison={() => setActiveSubTab('comparison')}
          />
        )}

        {/* LEGITIMATE EMPTY-STATE / EDITORIAL SETUP VIEW FOR UNCREATED CLASS DESTINATIONS */}
        {isEmptyBlueprintActive &&
        activeSubTab !== 'systems' &&
        activeSubTab !== 'comparison' &&
        activeSubTab !== 'profiles' &&
        activeSubTab !== 'policies' ? (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Empty State Banner */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                        {activeBlueprint.board || activeBlueprint.systemId}
                      </span>
                      <span className="text-xs font-mono text-stone-500">
                        {formatCleanBreadcrumb(activeBlueprint.board, activeBlueprint.programme, activeBlueprint.targetClass)}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-slate-700">
                        No Blueprint Created
                      </span>
                    </div>
                    <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-slate-100 mt-1">
                      No assessment blueprint has been created for this level yet.
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Destination: {formatCleanBreadcrumb(activeBlueprint.board, activeBlueprint.programme, activeBlueprint.targetClass)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHierarchicalSelectorModal(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-center transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-[#8C6D3B]" />
                  <span>Browse Directory</span>
                </button>
              </div>

              <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-[#FAF7F2] dark:bg-[#1E141B] p-4 rounded-xl border border-[#8C6D3B]/20">
                <strong className="text-stone-900 dark:text-stone-100">Curriculum Reality & Statutory Status: </strong>
                Neither CBSE nor CISCE conducts formal external board examinations at this grade level. School curricula and foundational stage guidelines govern classroom assessments. You can generate a publishing-grade VERITAS editorial assessment framework, import an official syllabus scheme, or author a custom blueprint below.
              </div>
            </div>

            {/* Three Action Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Create VERITAS Editorial Model */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 hover:border-amber-500/60 dark:border-amber-500/20 dark:hover:border-amber-500/50 shadow-sm flex flex-col justify-between space-y-4 group transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    Create VERITAS Editorial Model
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Generate a balanced, curriculum-aligned editorial assessment blueprint for this grade level with pedagogical weighting, sections, and exemplar question slots.
                  </p>
                </div>

                <button
                  onClick={handleCreateEditorialModelForCurrentClass}
                  className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#C29A52]" />
                  <span>+ Generate Editorial Model</span>
                </button>
              </div>

              {/* Option 2: Import Verified Specification */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 hover:border-emerald-500/60 dark:border-emerald-500/20 dark:hover:border-emerald-500/50 shadow-sm flex flex-col justify-between space-y-4 group transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    Import Verified Specification
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Import or transcribe an official school board circular, syllabus framework, or gazetted assessment scheme with statutory citations.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const sys = activeBlueprint.systemId || (activeBlueprint.board as CurriculumSystemId) || 'CBSE';
                    setImportBoard(sys);
                    setImportClass(activeBlueprint.targetClass);
                    setImportProgramme(activeBlueprint.programme || 'Primary / Foundational');
                    setImportTitle(`${sys} ${activeBlueprint.targetClass} Official Specification`);
                    setImportReference(`${sys} Statutory Curriculum Circular`);
                    setShowImportSpecModal(true);
                  }}
                  className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>+ Import Specification</span>
                </button>
              </div>

              {/* Option 3: Create Custom Blueprint */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-500/30 hover:border-purple-500/60 dark:border-purple-500/20 dark:hover:border-purple-500/50 shadow-sm flex flex-col justify-between space-y-4 group transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 dark:text-amber-400 flex items-center justify-center font-bold">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                    Create Custom Blueprint
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Design a bespoke assessment scheme from scratch with custom sections, question types, and weightage.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewBpBoard(activeBlueprint.systemId || (activeBlueprint.board as any) || 'CBSE');
                    setNewBpClass(activeBlueprint.targetClass as any);
                    setNewBpTitle(`${activeBlueprint.board} ${activeBlueprint.targetClass} Custom Blueprint`);
                    setShowCreateModal(true);
                  }}
                  className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-100 text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>+ Custom Designer</span>
                </button>
              </div>
            </div>

            {/* Helpful Fallback Links */}
            <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => setActiveSubTab('systems')}
                className="text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white font-medium flex items-center space-x-1"
              >
                <span>← Return to Systems Overview</span>
              </button>

              <button
                onClick={() => handleSelectBlueprint(DEMO_CBSE_CLASS6_BLUEPRINT.id)}
                className="text-[#5A1832] dark:text-[#C29A52] hover:underline font-bold flex items-center space-x-1"
              >
                <span>Switch to CBSE Class 6 Reference Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>

        {/* SUB-TAB: VISUAL BLUEPRINT DESIGNER (HIERARCHY TREE) */}
        {activeSubTab === 'designer' && (
          <BlueprintDesignerTree
            blueprint={activeBlueprint}
            onUpdateBlueprint={(updated) => setActiveBlueprint(updated)}
            isDarkMode={isDarkMode}
          />
        )}

        {/* SUB-TAB: BLUEPRINT COVERAGE MATRIX */}
        {activeSubTab === 'coverage' && (
          <BlueprintCoverageMatrixView
            blueprint={activeBlueprint}
            seriesProject={seriesProject}
            onNavigateToCoursebook={onNavigateToCoursebook}
            isDarkMode={isDarkMode}
          />
        )}

        {/* SUB-TAB: QUESTION BANK GAP ANALYSIS & DRAFT STUDIO */}
        {activeSubTab === 'gap_analysis' && (
          <QuestionBankGapAnalysisView
            blueprint={activeBlueprint}
            seriesProject={seriesProject}
            onUpdateSeriesProject={onUpdateSeriesProject}
            isDarkMode={isDarkMode}
          />
        )}

        {/* SUB-TAB: THREE-SYSTEM ASSESSMENT COMPARISON */}
        {activeSubTab === 'comparison' && (
          <ThreeSystemComparisonView />
        )}

        {/* SUB-TAB: REGULATORY POLICY & ASSESSMENT PROFILES */}
        {activeSubTab === 'profiles' && (
          <AssessmentProfileView
            activeProfileKey={activeProfileKey}
            onSelectProfileKey={setActiveProfileKey}
            isDarkMode={isDarkMode}
          />
        )}

        {/* SUB-TAB: SYSTEM POLICY PROFILES */}
        {activeSubTab === 'policies' && (
          <SystemPolicyProfilesView />
        )}

        {/* SUB-TAB 1: 2D WEIGHTAGE MATRIX GRID */}
        {activeSubTab === 'matrix' && (
          <div className="space-y-6">
            {/* Board Official Scope Header Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Official Board Syllabus Framework Reference
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                    {activeBlueprint.officialSyllabusReference}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-slate-400 font-medium">
                  <span>Target Class: <strong>{activeBlueprint.targetClass}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong>{activeBlueprint.totalDurationMinutes} Mins</strong></span>
                  <span>•</span>
                  <span>Prescribed Marks: <strong>{activeBlueprint.totalMarks}m</strong></span>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                {activeBlueprint.description}
              </p>

              {/* Marking Scheme Guidelines Chips */}
              <div className="pt-2 border-t border-stone-100 dark:border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
                <span className="font-bold text-stone-700 dark:text-slate-300">Marking Rules:</span>
                {activeBlueprint.markingSchemeGuidelines.map((rule, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 border border-stone-200/60 dark:border-slate-700/60"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-stone-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                    Concept Weightage vs. Drafted Question Distribution
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400">
                    Real-time delta tracking between board prescribed marks and drafted items.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetToDefault}
                    className="h-8 px-2.5 rounded-lg border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-400 text-xs font-medium flex items-center space-x-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    onClick={handleSaveBlueprint}
                    className="h-8 px-3 rounded-lg bg-stone-900 dark:bg-slate-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Blueprint</span>
                  </button>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50/80 dark:bg-slate-800/60 text-stone-600 dark:text-slate-300 uppercase tracking-wider font-bold text-[10px] border-b border-stone-200/80 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Concept &amp; Syllabus Strand</th>
                      <th className="py-3.5 px-3 text-center">Board Target</th>
                      <th className="py-3.5 px-3 text-center">Draft Assigned</th>
                      <th className="py-3.5 px-4 text-center">Discrepancy Audit</th>
                      <th className="py-3.5 px-4">Prescribed Question Formats</th>
                      <th className="py-3.5 px-3 text-center">Cognitive Domain</th>
                      <th className="py-3.5 px-3 text-center">Syllabus Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/60 dark:divide-slate-800">
                    {auditReport.conceptsAudit.map((conceptAudit) => {
                      const cw = activeBlueprint.conceptWeightages.find(
                        (c) => c.conceptName === conceptAudit.conceptName
                      );
                      const isExpanded = expandedConceptId === conceptAudit.conceptName;

                      return (
                        <React.Fragment key={conceptAudit.conceptName}>
                          <tr
                            className={`transition-colors hover:bg-stone-50/60 dark:hover:bg-slate-800/40 ${
                              conceptAudit.status === 'over_tested'
                                ? 'bg-amber-50/20 dark:bg-amber-950/10'
                                : conceptAudit.status === 'under_tested'
                                ? 'bg-sky-50/20 dark:bg-sky-950/10'
                                : conceptAudit.status === 'missing'
                                ? 'bg-rose-50/30 dark:bg-rose-950/20'
                                : ''
                            }`}
                          >
                            {/* Concept & Strand */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    conceptAudit.status === 'balanced'
                                      ? 'bg-emerald-500'
                                      : conceptAudit.status === 'over_tested'
                                      ? 'bg-amber-500'
                                      : conceptAudit.status === 'under_tested'
                                      ? 'bg-sky-500'
                                      : 'bg-rose-500 animate-ping'
                                  }`}
                                />
                                <div>
                                  <div className="font-bold text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                                    <span>{conceptAudit.conceptName}</span>
                                    {conceptAudit.mandatory && (
                                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                                        Mandatory
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-stone-400 font-medium">
                                    {conceptAudit.strand}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Board Target Marks */}
                            <td className="py-3.5 px-3 text-center">
                              <span className="font-bold text-stone-800 dark:text-slate-200 text-sm">
                                {conceptAudit.targetMarks}m
                              </span>
                            </td>

                            {/* Assigned Marks */}
                            <td className="py-3.5 px-3 text-center">
                              <div className="inline-flex items-center space-x-1.5">
                                <span className="font-bold text-stone-900 dark:text-slate-100 text-sm">
                                  {conceptAudit.assignedMarks}m
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  ({conceptAudit.questionCount} Qs)
                                </span>
                              </div>
                            </td>

                            {/* Discrepancy Status Badge */}
                            <td className="py-3.5 px-4 text-center">
                              {conceptAudit.status === 'balanced' ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 font-bold text-[11px]">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Balanced (0m diff)</span>
                                </span>
                              ) : conceptAudit.status === 'over_tested' ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 font-bold text-[11px]">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  <span>+{conceptAudit.difference.toFixed(1)}m Over-tested</span>
                                </span>
                              ) : conceptAudit.status === 'under_tested' ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-900 dark:text-sky-200 border border-sky-500/30 font-bold text-[11px]">
                                  <AlertTriangle className="w-3 h-3 text-sky-600" />
                                  <span>{conceptAudit.difference.toFixed(1)}m Under-tested</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-900 dark:text-rose-200 border border-rose-500/30 font-bold text-[11px]">
                                  <AlertOctagon className="w-3 h-3 text-rose-600" />
                                  <span>Missing ({conceptAudit.targetMarks}m Deficit)</span>
                                </span>
                              )}
                            </td>

                            {/* Preferred Question Formats */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {cw?.preferredQuestionTypes.map((qt) => (
                                  <span
                                    key={qt}
                                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 text-[10px] font-medium uppercase tracking-wider"
                                  >
                                    {qt.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Cognitive Level */}
                            <td className="py-3.5 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  cw?.cognitiveLevel === 'Analysing'
                                    ? 'bg-purple-500/15 text-purple-800 dark:text-purple-300'
                                    : cw?.cognitiveLevel === 'Applying'
                                    ? 'bg-blue-500/15 text-blue-800 dark:text-blue-300'
                                    : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                }`}
                              >
                                {cw?.cognitiveLevel || 'Applying'}
                              </span>
                            </td>

                            {/* Expandable Notes Action */}
                            <td className="py-3.5 px-3 text-center">
                              <button
                                onClick={() =>
                                  setExpandedConceptId(isExpanded ? null : conceptAudit.conceptName)
                                }
                                className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 transition-colors"
                                title="View Syllabus Scope & Marking Trap Notes"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-amber-600" />
                                ) : (
                                  <Info className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Details Row */}
                          {isExpanded && cw && (
                            <tr className="bg-amber-500/5 dark:bg-slate-800/80 border-y border-amber-500/20">
                              <td colSpan={7} className="p-4 space-y-2 text-xs">
                                <div className="flex items-start space-x-2">
                                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div className="space-y-1">
                                    <div className="font-bold text-stone-900 dark:text-slate-100">
                                      Board Syllabus Scope Ref:
                                    </div>
                                    <p className="text-stone-600 dark:text-slate-400 italic">
                                      {cw.syllabusScopeRef || 'Standard continuous usage within authentic passages.'}
                                    </p>
                                  </div>
                                </div>

                                {cw.pedagogicalNotes && (
                                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                                    <strong>Author / Examiner Guidance:</strong> {cw.pedagogicalNotes}
                                  </div>
                                )}

                                <div className="text-stone-600 dark:text-slate-400">
                                  <strong>Audit Feedback:</strong> {conceptAudit.recommendation}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cognitive & Question Format Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question Type Distribution Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                  Question Format Breakdown
                </h4>
                <div className="space-y-2">
                  {Object.entries(auditReport.questionTypeDistribution).map(([qType, stat]) => (
                    <div key={qType} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize text-stone-700 dark:text-slate-300">
                          {qType.replace(/_/g, ' ')}
                        </span>
                        <span className="font-bold text-stone-900 dark:text-slate-100">
                          {stat.marks}m ({stat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cognitive Taxonomy Distribution Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                  Cognitive Domain Distribution (Bloom's Taxonomy)
                </h4>
                <div className="space-y-2">
                  {(Object.keys(auditReport.cognitiveDistribution) as CognitiveLevel[])
                    .filter((cog) => auditReport.cognitiveDistribution[cog].marks > 0)
                    .map((cog) => {
                      const stat = auditReport.cognitiveDistribution[cog];
                      return (
                        <div key={cog} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-700 dark:text-slate-300">{cog}</span>
                            <span className="font-bold text-stone-900 dark:text-slate-100">
                              {stat.marks}m ({stat.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${stat.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: QUESTION SLOTS WORKBENCH */}
        {activeSubTab === 'workbench' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                  Slot-by-Slot Question Blueprint Assembler ({activeBlueprint.questionSlots.length} Slots)
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Customize slot mark values, concepts, and draft prompts matching {activeBlueprint.board} specs.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddQuestionSlot}
                  className="h-8 px-3 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add Question Slot</span>
                </button>
                <button
                  onClick={handleAutoRebalanceSlots}
                  className="h-8 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rebalance Slots to Blueprint</span>
                </button>
              </div>
            </div>

            {/* Slots Grid */}
            <div className="space-y-3">
              {activeBlueprint.questionSlots.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-all hover:border-amber-500/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border border-stone-200/60 dark:border-slate-700">
                        {slot.slotCode}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">
                        Slot #{idx + 1}
                      </span>
                      {slot.internalChoiceAvailable && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                          {slot.choiceNote || 'Choice Option'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Marks Controls */}
                      <div className="flex items-center space-x-1 bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-xs">
                        <button
                          onClick={() => handleUpdateSlotMark(slot.id, -0.5)}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-400 font-bold"
                          title="Decrease Marks"
                        >
                          -
                        </button>
                        <span className="font-bold text-stone-900 dark:text-slate-100 min-w-[28px] text-center">
                          {slot.marks}m
                        </span>
                        <button
                          onClick={() => handleUpdateSlotMark(slot.id, 0.5)}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-400 font-bold"
                          title="Increase Marks"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                        title="Delete Question Slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Slot Configuration Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {/* Concept Selector */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        Concept Tested
                      </label>
                      <select
                        value={slot.conceptTested}
                        onChange={(e) => handleUpdateSlotConcept(slot.id, e.target.value)}
                        className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200"
                      >
                        {activeBlueprint.conceptWeightages.map((cw) => (
                          <option key={cw.id} value={cw.conceptName}>
                            {cw.conceptName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Question Type Selector */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        Format
                      </label>
                      <select
                        value={slot.questionType}
                        onChange={(e) => {
                          const val = e.target.value as QuestionType;
                          setActiveBlueprint((prev) => ({
                            ...prev,
                            questionSlots: prev.questionSlots.map((s) =>
                              s.id === slot.id ? { ...s, questionType: val } : s
                            ),
                          }));
                        }}
                        className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200 uppercase"
                      >
                        <option value="fill_in_blanks">Fill in Blanks / Cloze</option>
                        <option value="transformation">Transformation of Sentences</option>
                        <option value="error_correction">Error Editing &amp; Correction</option>
                        <option value="mcq">Multiple Choice (MCQ)</option>
                        <option value="match_column">Match Columns</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                    </div>

                    {/* Cognitive Level */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        Cognitive Level
                      </label>
                      <select
                        value={slot.cognitiveLevel}
                        onChange={(e) => {
                          const val = e.target.value as CognitiveLevel;
                          setActiveBlueprint((prev) => ({
                            ...prev,
                            questionSlots: prev.questionSlots.map((s) =>
                              s.id === slot.id ? { ...s, cognitiveLevel: val } : s
                            ),
                          }));
                        }}
                        className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200"
                      >
                        <option value="Remembering">Remembering (Recall)</option>
                        <option value="Understanding">Understanding (Comprehension)</option>
                        <option value="Applying">Applying (Execution)</option>
                        <option value="Analysing">Analysing (Error Detection)</option>
                        <option value="Evaluating">Evaluating (Appraisal)</option>
                      </select>
                    </div>
                  </div>

                  {/* Sample Question Prompt Input */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                      Draft Question Prompt / Exemplar
                    </label>
                    <textarea
                      value={slot.sampleQuestionPrompt || ''}
                      onChange={(e) => handleUpdateSlotPrompt(slot.id, e.target.value)}
                      rows={2}
                      placeholder="Enter question text or board sample..."
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800/50 text-stone-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: AUDIT REPORT & DISCREPANCY LOG */}
        {activeSubTab === 'audit_report' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                    Real-time Audit Discrepancy &amp; Rebalancing Log
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400">
                    Automated checks ensuring test papers fulfill official syllabus weights without over- or under-testing.
                  </p>
                </div>
                <button
                  onClick={handleAutoRebalanceSlots}
                  className="h-8 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execute Auto-Rebalance</span>
                </button>
              </div>

              {/* Advisories list */}
              {rebalanceAdvisories.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                    Zero Discrepancies Found!
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400 max-w-md mx-auto">
                    Every concept strictly matches its prescribed mark allocation. The test paper complies with {activeBlueprint.board} testing regulations.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {rebalanceAdvisories.map((adv, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
                        adv.action === 'reduce'
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                          : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      {adv.action === 'reduce' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 space-y-1">
                        <div className="font-bold flex items-center space-x-2">
                          <span>
                            {adv.action === 'reduce' ? 'OVER-TESTED CONCEPT' : 'UNDER-TESTED / DEFICIT'}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-white/70 dark:bg-black/40">
                            {adv.conceptName} ({adv.action === 'reduce' ? '-' : '+'}{adv.marksDelta.toFixed(1)}m)
                          </span>
                        </div>
                        <p className="leading-relaxed">{adv.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Concept Audit Log */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                Full Concept Marks &amp; Question Traceability
              </h4>
              <div className="space-y-2">
                {auditReport.conceptsAudit.map((c) => (
                  <div
                    key={c.conceptName}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-700/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-slate-100">
                        {c.conceptName}
                      </div>
                      <div className="text-[11px] text-stone-400">{c.recommendation}</div>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="font-medium text-stone-500">
                        Target: <strong>{c.targetMarks}m</strong>
                      </span>
                      <span className="font-medium text-stone-500">
                        Assigned: <strong>{c.assignedMarks}m</strong>
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          c.status === 'balanced'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : c.status === 'over_tested'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* MODAL 1: CREATE CUSTOM BLUEPRINT */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                  New Custom Question Blueprint
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Blueprint Title
                </label>
                <input
                  type="text"
                  value={newBpTitle}
                  onChange={(e) => setNewBpTitle(e.target.value)}
                  placeholder="e.g. CBSE Class 8 Term Exam Blueprint"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Target Board
                  </label>
                  <select
                    value={newBpBoard}
                    onChange={(e) => setNewBpBoard(e.target.value as BoardStandardCode)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="Cambridge_Checkpoint">Cambridge Checkpoint</option>
                    <option value="Cambridge_IGCSE">Cambridge IGCSE</option>
                    <option value="State_Board">State Board / SSC</option>
                    <option value="Custom">Custom / School Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Target Class Level
                  </label>
                  <select
                    value={newBpClass}
                    onChange={(e) => setNewBpClass(e.target.value as GrammarClassLevel)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  >
                    {[
                      'Class 3',
                      'Class 4',
                      'Class 5',
                      'Class 6',
                      'Class 7',
                      'Class 8',
                      'Class 9',
                      'Class 10',
                      'Class 11',
                      'Class 12',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={newBpTotalMarks}
                    onChange={(e) => setNewBpTotalMarks(Number(e.target.value))}
                    min={5}
                    max={100}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={newBpDuration}
                    onChange={(e) => setNewBpDuration(Number(e.target.value))}
                    min={10}
                    max={180}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200 dark:border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomBlueprint}
                disabled={!newBpTitle.trim()}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                Create Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EXPORT SPECIFICATION SHEET */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full p-6 space-y-4 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                  Official Blueprint &amp; Audit Specification Sheet
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
                {exportText}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-slate-800 shrink-0">
              <button
                onClick={handleCopyExportText}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4 text-stone-500" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleDownloadExportFile}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Spec File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ACADEMIC EVIDENCE & BLUEPRINT AUDIT MODAL */}
      <BlueprintAuditModal
        blueprint={activeBlueprint}
        seriesProject={seriesProject}
        isOpen={showAcademicAuditModal}
        onClose={() => setShowAcademicAuditModal(false)}
      />

      {/* MODAL 4: HIERARCHICAL BLUEPRINT SELECTOR MODAL */}
      <DirectoryErrorBoundary onClose={() => setShowHierarchicalSelectorModal(false)}>
        <HierarchicalBlueprintSelectorModal
          isOpen={showHierarchicalSelectorModal}
          onClose={() => setShowHierarchicalSelectorModal(false)}
          allBlueprints={allBlueprints}
          selectedBlueprintId={selectedBlueprintId}
          onSelectBlueprint={(id, customBp) => handleSelectBlueprint(id, customBp)}
          activeBookBoard={activeBookBoard}
          activeBookClass={activeBookClass}
          onCreateEditorialBlueprint={(newBp) => {
            handleSelectBlueprint(newBp.id, newBp);
            showNotification(`Created and loaded editorial model: "${newBp.title}"`);
          }}
          onOpenCustomCreator={(system, targetClass) => {
            setNewBpBoard(system as any);
            setNewBpClass(targetClass as any);
            setNewBpTitle(`${system} ${targetClass} Custom Blueprint`);
            setShowCreateModal(true);
          }}
        />
      </DirectoryErrorBoundary>

      {/* MODAL 5: CONTEXT-SAFE CROSS-SYSTEM / CROSS-LEVEL ASSEMBLY WARNING MODAL */}
      <CrossAssemblyWarningModal
        isOpen={showCrossAssemblyWarning}
        onClose={() => setShowCrossAssemblyWarning(false)}
        inspectedBlueprint={activeBlueprint}
        activeBookBoard={activeBookBoard}
        activeBookClass={activeBookClass}
        activeBookTitle={activeBookTitle}
        onAdaptAndAssemble={handleAdaptAndAssemble}
        onSwitchContextAndAssemble={handleSwitchContextAndAssemble}
        onSaveStandalone={handleSaveStandalone}
      />

      {/* MODAL 6: IMPORT VERIFIED STATUTORY SPECIFICATION MODAL */}
      {showImportSpecModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 font-serif">
                    Import Verified Board Specification
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Transcribe or import an official statutory circular or syllabus framework
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImportSpecModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    System / Board
                  </label>
                  <select
                    value={importBoard}
                    onChange={(e) => setImportBoard(e.target.value as CurriculumSystemId)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100 font-medium"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="CISCE">CISCE</option>
                    <option value="Cambridge">Cambridge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Target Class / Stage
                  </label>
                  <input
                    type="text"
                    value={importClass}
                    onChange={(e) => setImportClass(e.target.value)}
                    placeholder="e.g. Class 2, Stage 1"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Specification Title
                </label>
                <input
                  type="text"
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  placeholder="e.g. CBSE Class 2 Foundational Language Scheme"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Official Statutory Reference / Circular
                </label>
                <input
                  type="text"
                  value={importReference}
                  onChange={(e) => setImportReference(e.target.value)}
                  placeholder="e.g. Circular Acad-42/2024 / NCF-FS Foundational Assessment Guidelines"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={importMarks}
                    onChange={(e) => setImportMarks(Number(e.target.value))}
                    min={5}
                    max={100}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={importDuration}
                    onChange={(e) => setImportDuration(Number(e.target.value))}
                    min={10}
                    max={180}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                This will create an inspected blueprint tagged as <strong className="font-semibold">VERIFIED BOARD SPECIFICATION</strong>, initialized with the provided circular credentials and balanced default strands.
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowImportSpecModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-400 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSpecification}
                disabled={!importTitle.trim() || !importReference.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Import & Activate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
