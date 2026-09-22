import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  FileText,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Award,
  Layers,
  Search,
  Key,
  GraduationCap,
  MessageSquare,
  AlertTriangle,
  Settings,
  Image as ImageIcon,
  Eye,
  ShieldCheck,
  Check,
  Circle,
  AlertCircle,
  Split,
  MoreVertical,
  Sliders,
  RotateCcw,
  CheckSquare,
  Target,
  BookCheck,
  UserCheck,
  PanelLeftClose,
} from 'lucide-react';
import {
  StudioChapter,
  ChapterSection,
  ChapterProductionStageId,
  StageCompletionStatus,
  ArchitectureComponentStatus,
} from '../../types';
import {
  BookArchitectureConfig,
  ChapterComponentAnatomy,
} from '../book-planner/architecture/types';
import {
  calculateComponentStatus,
  getArchitectureCompletionStats,
  detectPedagogicalFlowStages,
  mapComponentToStudioView,
} from './architecture/chapterArchitectureBridge';

export interface ChapterStructureNavigatorProps {
  chapter: StudioChapter;
  architecture?: BookArchitectureConfig;
  activeArchitectureItemId?: string;
  onSelectArchitectureItem?: (itemId: string, viewId: string) => void;
  onUpdateChapter?: (updated: StudioChapter) => void;
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  activeView: string;
  onSelectView: (view: any) => void;
  onSelectSpecialView?: (view: any) => void;
  onAddSection: () => void;
  onAddSubsection?: (parentSectionId: string) => void;
  onRenameSection?: (sectionId: string, newTitle: string) => void;
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDuplicateSection?: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddExercise?: () => void;
  onOpenArchitectureCustomizer?: () => void;
  onOpenUpdateReview?: () => void;
  onToggleCollapse?: () => void;
  chapters?: { id: string; order: number; title: string }[];
  activeTopicId?: string;
  onSelectChapter?: (topicId: string) => void;
  onAddChapter?: () => void;
  isDarkMode: boolean;
}

interface StageDefinition {
  id: ChapterProductionStageId;
  number: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const PRODUCTION_STAGES: StageDefinition[] = [
  { id: 'setup', number: 1, label: 'Chapter Setup', icon: Settings, description: 'Metadata, Board & Scope' },
  { id: 'opener', number: 2, label: 'Chapter Opener', icon: Sparkles, description: 'Hook, Orientation & Visual' },
  { id: 'objectives', number: 3, label: 'Learning Objectives', icon: Target, description: 'Bloom Competencies & Outcomes' },
  { id: 'explanation', number: 4, label: 'Explanation Studio', icon: BookOpen, description: 'Manuscript Theory & Sections' },
  { id: 'rules', number: 5, label: 'Rule & Concept Studio', icon: Award, description: '7 Structured Concord Rules' },
  { id: 'examples', number: 6, label: 'Examples Studio', icon: Split, description: 'Contrast Pairs & Variations' },
  { id: 'visuals', number: 7, label: 'Visuals & Diagrams', icon: ImageIcon, description: 'Briefs, Schematics & Artwork' },
  { id: 'worked_examples', number: 8, label: 'Worked Examples', icon: HelpCircle, description: 'Step-by-step Problem Models' },
  { id: 'common_errors', number: 9, label: 'Common Errors & Tips', icon: AlertTriangle, description: 'Exam Traps & Traps' },
  { id: 'exercises', number: 10, label: 'Exercise Studio', icon: FileText, description: 'Exercises A through G' },
  { id: 'assessment', number: 11, label: 'Chapter Assessment Test', icon: GraduationCap, description: 'Summative Mastery Test' },
  { id: 'answer_key', number: 12, label: 'Answer Key & Rubrics', icon: Key, description: 'Canonical Answers & Guidance' },
  { id: 'summary', number: 13, label: 'Summary & Revision', icon: Layers, description: 'Rules at a Glance & Wrap-up' },
  { id: 'teacher_notes', number: 14, label: 'Teacher & Author Notes', icon: MessageSquare, description: 'Lesson Plans & Insights' },
  { id: 'student_preview', number: 15, label: 'Student Book Preview', icon: BookCheck, description: 'Realistic Textbook View' },
  { id: 'teacher_preview', number: 16, label: 'Teacher Edition Preview', icon: UserCheck, description: 'Annotated Master Edition' },
  { id: 'audit', number: 17, label: 'Academic & Publisher Audit', icon: ShieldCheck, description: '22-Point Compliance Audit' },
];

export const ChapterStructureNavigator: React.FC<ChapterStructureNavigatorProps> = ({
  chapter,
  architecture,
  activeArchitectureItemId,
  onSelectArchitectureItem,
  onUpdateChapter,
  activeSectionId,
  onSelectSection,
  activeView,
  onSelectView,
  onSelectSpecialView,
  onAddSection,
  onAddSubsection,
  onRenameSection,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onOpenArchitectureCustomizer,
  onOpenUpdateReview,
  onToggleCollapse,
  chapters = [],
  activeTopicId,
  onSelectChapter,
  onAddChapter,
  isDarkMode,
}) => {
  const [navigatorMode, setNavigatorMode] = useState<'architecture' | 'stages'>('architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSectionsExpanded, setIsSectionsExpanded] = useState(true);
  const [showPedagogicalFlow, setShowPedagogicalFlow] = useState(false);
  const [statusMenuComponentId, setStatusMenuComponentId] = useState<string | null>(null);

  const handleSelect = (stageId: any) => {
    if (onSelectView) {
      onSelectView(stageId);
    } else if (onSelectSpecialView) {
      onSelectSpecialView(stageId);
    }
  };

  // Resolve components from Book Architecture
  const components = architecture?.chapterArchitecture?.components || [];

  // Calculate completion and stats
  const archStats = useMemo(() => {
    if (!architecture) return null;
    return getArchitectureCompletionStats(chapter, architecture);
  }, [chapter, architecture]);

  // Pedagogical flow report
  const pedagogicalReport = useMemo(() => {
    return detectPedagogicalFlowStages(chapter);
  }, [chapter]);

  // Helper to map architecture component to Chapter Studio view
  const mapComponentToView = (comp: ChapterComponentAnatomy): { viewId: string; sectionId?: string } => {
    return mapComponentToStudioView(comp, architecture, chapter.sections?.[0]?.id);
  };

  // Group architecture components into the 4 standard production categories
  const groupedComponents = useMemo(() => {
    const groups: {
      content: Array<{ comp: ChapterComponentAnatomy; index: number }>;
      practice: Array<{ comp: ChapterComponentAnatomy; index: number }>;
      assessment: Array<{ comp: ChapterComponentAnatomy; index: number }>;
      teacher: Array<{ comp: ChapterComponentAnatomy; index: number }>;
    } = {
      content: [],
      practice: [],
      assessment: [],
      teacher: [],
    };

    components.forEach((comp, idx) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          comp.name.toLowerCase().includes(q) ||
          comp.category.toLowerCase().includes(q) ||
          comp.description?.toLowerCase().includes(q);
        if (!matches) return;
      }

      const cat = comp.category;
      if (cat === 'opener' || cat === 'instruction') {
        groups.content.push({ comp, index: idx });
      } else if (cat === 'practice') {
        groups.practice.push({ comp, index: idx });
      } else if (cat === 'assessment' || cat === 'review') {
        groups.assessment.push({ comp, index: idx });
      } else {
        groups.teacher.push({ comp, index: idx });
      }
    });

    return groups;
  }, [components, searchQuery]);

  const handleCycleComponentStatus = (compId: string, currentStatus: ArchitectureComponentStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateChapter) return;

    const sequence: ArchitectureComponentStatus[] = [
      'not_started',
      'drafting',
      'complete',
      'needs_review',
      'not_applicable',
    ];
    const nextIdx = (sequence.indexOf(currentStatus) + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];

    const currentCustoms = chapter.architectureState?.customizations || {};
    const updatedCustom = {
      ...(currentCustoms[compId] || { componentId: compId }),
      status: nextStatus,
      isCustomized: true,
    };

    onUpdateChapter({
      ...chapter,
      architectureState: {
        ...chapter.architectureState,
        isCustomized: true,
        customizations: {
          ...currentCustoms,
          [compId]: updatedCustom,
        },
      },
      lastSaved: new Date().toISOString(),
      saveStatus: 'saved',
    });
  };

  const getStageStatus = (stageId: ChapterProductionStageId): StageCompletionStatus => {
    if (chapter.stageStatuses && chapter.stageStatuses[stageId]) {
      return chapter.stageStatuses[stageId];
    }
    switch (stageId) {
      case 'setup':
        return chapter.title && chapter.description ? 'complete' : 'in_progress';
      case 'opener':
        return chapter.opening?.shortIntroduction ? 'complete' : 'not_started';
      case 'explanation':
        return chapter.sections?.length > 0 ? 'complete' : 'not_started';
      case 'concepts':
        return 'complete';
      case 'examples':
        return 'complete';
      case 'visuals':
        return 'in_progress';
      case 'worked_examples':
        return 'complete';
      case 'common_errors':
        return 'complete';
      case 'exercises':
        return chapter.exercises?.length > 0 ? 'complete' : 'not_started';
      case 'test':
        return 'in_progress';
      case 'answer_key':
        return chapter.answerKey?.length ? 'complete' : 'not_started';
      case 'summary':
        return chapter.ending?.rulesAtAGlance?.length ? 'complete' : 'not_started';
      case 'teacher_notes':
        return chapter.teacherNotes ? 'complete' : 'in_progress';
      case 'preview':
        return 'in_progress';
      case 'audit':
        return chapter.qualityAudit ? 'complete' : 'needs_review';
      default:
        return 'not_started';
    }
  };

  const renderStatusBadge = (status: StageCompletionStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'in_progress':
        return <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
      case 'needs_review':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-stone-400 dark:text-stone-600 shrink-0" />;
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col border-r border-[#CBBEAC] select-none overflow-hidden min-h-0 bg-[#EDE4D6] text-[#292521]"
    >
      {/* 1. LeftHeader: flex: 0 0 auto */}
      <div className="p-2.5 border-b border-[#CBBEAC] space-y-1.5 shrink-0 bg-[#EDE4D6]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 min-w-0">
            <Layers className="w-4 h-4 text-[#5A1832] shrink-0" />
            <h2 className="text-xs font-serif font-bold text-[#35101F] truncate">
              Chapter Architecture
            </h2>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              type="button"
              onClick={onOpenArchitectureCustomizer}
              className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
              title="Configure Chapter Architecture & Overrides"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                title="Collapse Chapter Architecture"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Chapter Switcher & Add Chapter button */}
        {chapters && chapters.length > 0 && (
          <div className="flex items-center gap-1 pt-0.5 pb-1">
            <select
              value={activeTopicId || chapter.id}
              onChange={(e) => onSelectChapter?.(e.target.value)}
              className="flex-1 min-w-0 text-[11px] font-bold bg-[#FFFDF8] border border-[#CBBEAC] rounded-lg px-2 py-1 text-[#5A1832] truncate focus:outline-none cursor-pointer shadow-2xs"
            >
              {chapters.map((ch, idx) => (
                <option key={ch.id || idx} value={ch.id}>
                  Ch {ch.order || idx + 1}: {ch.title}
                </option>
              ))}
            </select>
            {onAddChapter && (
              <button
                type="button"
                onClick={onAddChapter}
                className="p-1 rounded-lg bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] shadow-2xs cursor-pointer shrink-0 transition-colors"
                title="Add Chapter to Book"
              >
                <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              </button>
            )}
          </div>
        )}

        {/* Inherited from Book Architecture Badge */}
        <div className="flex items-center justify-between text-[10px] font-mono">
          <button
            type="button"
            onClick={onOpenArchitectureCustomizer}
            className="flex items-center space-x-1 text-[#5A1832] hover:underline cursor-pointer truncate font-semibold"
            title="Click to view or customize chapter inheritance"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">
              {chapter.architectureState?.isCustomized
                ? 'Customised Overlay'
                : 'Inherited from Blueprint'}
            </span>
          </button>
          <span className="text-[#71685E] font-semibold shrink-0">
            {components.length} Components
          </span>
        </div>

        {/* Architecture Update Available Notification */}
        {chapter.architectureState?.hasPendingUpdate && (
          <button
            type="button"
            onClick={onOpenUpdateReview}
            className="w-full p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-950 text-[10px] font-bold flex items-center justify-between hover:bg-amber-500/25 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-1.5 truncate">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">Update Available</span>
            </div>
            <span className="underline shrink-0 font-bold">Review</span>
          </button>
        )}

        {/* Architecture Completion Meter */}
        {archStats && (
          <div className="space-y-0.5 pt-0.5 border-t border-[#CBBEAC]">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#71685E] font-semibold">
                Blueprint Completion
              </span>
              <span className="font-bold text-[#5A1832]" title={`${archStats.completedRequired} Complete, ${archStats.draftingRequired} Drafting of ${archStats.totalRequired} Required`}>
                {archStats.completedRequired}/{archStats.totalRequired} Req
                {archStats.draftingRequired > 0 ? ` (${archStats.draftingRequired} draft)` : ''} ({archStats.requiredPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#CBBEAC]/50 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#5A1832] transition-all duration-300"
                style={{ width: `${Math.round((archStats.completedRequired / (archStats.totalRequired || 1)) * 100)}%` }}
                title={`${archStats.completedRequired} Complete`}
              />
              <div
                className="h-full bg-[#C29A52] transition-all duration-300"
                style={{ width: `${Math.round(((archStats.draftingRequired * 0.5) / (archStats.totalRequired || 1)) * 100)}%` }}
                title={`${archStats.draftingRequired} Drafting`}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. LeftControls: flex: 0 0 auto */}
      <div className="p-2 border-b border-[#CBBEAC] space-y-1.5 shrink-0 bg-[#EDE4D6]/70">
        {/* View Switcher Tabs: Architecture vs Production Stages */}
        <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-[#CBBEAC]/40">
          <button
            type="button"
            onClick={() => setNavigatorMode('architecture')}
            className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              navigatorMode === 'architecture'
                ? 'bg-[#FFFDF8] text-[#5A1832] shadow-2xs'
                : 'text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Architecture ({components.length})
          </button>
          <button
            type="button"
            onClick={() => setNavigatorMode('stages')}
            className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              navigatorMode === 'stages'
                ? 'bg-[#FFFDF8] text-[#5A1832] shadow-2xs'
                : 'text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Stages (15)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#71685E]" />
          <input
            type="text"
            placeholder={
              navigatorMode === 'architecture'
                ? 'Filter components...'
                : 'Filter stages...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 rounded-md bg-[#FFFDF8] border border-[#CBBEAC] text-xs text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
          />
        </div>
      </div>

      {/* 3. ArchitectureList: flex: 1 1 auto, min-height: 0, overflow-y: auto, overscroll-contain, pb-[72px] */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 min-h-0 overscroll-contain pb-[72px]">
        {navigatorMode === 'architecture' ? (
          /* =======================================================
           * ARCHITECTURE COMPONENTS VIEW (Grouped by CONTENT,
           * PRACTICE, ASSESSMENT & REVIEW, TEACHER / PRODUCTION)
           * ======================================================= */
          <div className="space-y-4">
            {/* 1. CONTENT GROUP */}
            {groupedComponents.content.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-[#5A1832] flex items-center justify-between">
                  <span>Content ({groupedComponents.content.length})</span>
                  <span className="text-[9px] text-[#71685E] font-semibold">Instructional Core</span>
                </div>
                {groupedComponents.content.map(({ comp, index }) =>
                  renderArchitectureRow(comp, index)
                )}
              </div>
            )}

            {/* 2. PRACTICE GROUP */}
            {groupedComponents.practice.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-[#5A1832] flex items-center justify-between">
                  <span>Practice ({groupedComponents.practice.length})</span>
                  <span className="text-[9px] text-[#71685E] font-semibold">Exercises &amp; Drills</span>
                </div>
                {groupedComponents.practice.map(({ comp, index }) =>
                  renderArchitectureRow(comp, index)
                )}
              </div>
            )}

            {/* 3. ASSESSMENT & REVIEW GROUP */}
            {groupedComponents.assessment.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-[#5A1832] flex items-center justify-between">
                  <span>Assessment &amp; Review ({groupedComponents.assessment.length})</span>
                  <span className="text-[9px] text-[#71685E] font-semibold">Evaluation</span>
                </div>
                {groupedComponents.assessment.map(({ comp, index }) =>
                  renderArchitectureRow(comp, index)
                )}
              </div>
            )}

            {/* 4. TEACHER / PRODUCTION GROUP */}
            {groupedComponents.teacher.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-[#5A1832] flex items-center justify-between">
                  <span>Teacher &amp; Production ({groupedComponents.teacher.length})</span>
                  <span className="text-[9px] text-[#71685E] font-semibold">Back Matter</span>
                </div>
                {groupedComponents.teacher.map(({ comp, index }) =>
                  renderArchitectureRow(comp, index)
                )}
              </div>
            )}
          </div>
        ) : (
          /* =======================================================
           * PRODUCTION STAGES VIEW (15 Standard Stages)
           * ======================================================= */
          <div className="space-y-1">
            {PRODUCTION_STAGES.map((stage) => {
              const Icon = stage.icon;
              const isSelected = activeView === stage.id;
              const status = getStageStatus(stage.id);

              return (
                <div key={stage.id} className="space-y-0.5">
                  <div
                    onClick={() => handleSelect(stage.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-[#5A1832] text-[#F6F0E7] font-bold shadow-xs border border-[#C29A52]'
                        : 'hover:bg-[#F6F0E7] text-[#292521] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-1">
                      <span
                        className={`text-[10px] font-mono font-bold w-4 text-center shrink-0 ${
                          isSelected ? 'text-[#C29A52]' : 'text-[#71685E]'
                        }`}
                      >
                        {stage.number}.
                      </span>
                      <div
                        className={`p-1.5 rounded-md shrink-0 ${
                          isSelected
                            ? 'bg-[#35101F] text-[#C29A52]'
                            : 'bg-[#FFFDF8] text-[#5A1832] border border-[#CBBEAC]/50 group-hover:text-[#C29A52]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 truncate">
                        <span className={`text-xs font-semibold block truncate leading-tight ${
                          isSelected ? 'text-[#F6F0E7]' : 'text-[#292521]'
                        }`}>
                          {stage.label}
                        </span>
                        <span className={`text-[10px] block truncate leading-tight ${
                          isSelected ? 'text-[#E3D6C7]' : 'text-[#71685E]'
                        }`}>
                          {stage.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {renderStatusBadge(status)}
                    </div>
                  </div>

                  {/* Expandable Sections Tree directly under Topic Explanation */}
                  {stage.id === 'explanation' && (
                    <div className="pl-6 pr-1 py-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#71685E] px-1 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsSectionsExpanded(!isSectionsExpanded)}
                          className="flex items-center space-x-1 hover:text-[#5A1832] cursor-pointer"
                        >
                          {isSectionsExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span>Sections ({chapter.sections.length})</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddSection();
                          }}
                          className="text-[#5A1832] hover:text-[#C29A52] flex items-center space-x-0.5 cursor-pointer font-bold"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>

                      {isSectionsExpanded && (
                        <div className="space-y-1 pl-1 border-l-2 border-[#C29A52]/40 mt-1">
                          {chapter.sections.map((sec, idx) => {
                            const isSecActive =
                              activeView === 'section' && activeSectionId === sec.id;
                            return (
                              <div
                                key={sec.id}
                                onClick={() => {
                                  onSelectSection(sec.id);
                                  handleSelect('section');
                                }}
                                className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                  isSecActive
                                    ? 'bg-[#5A1832] text-[#F6F0E7] font-bold border border-[#C29A52]'
                                    : 'hover:bg-[#F6F0E7] text-[#292521]'
                                }`}
                              >
                                <div className="flex items-center space-x-1.5 truncate">
                                  <span className={`font-mono text-[10px] font-bold shrink-0 ${
                                    isSecActive ? 'text-[#C29A52]' : 'text-[#5A1832]'
                                  }`}>
                                    {sec.numberLabel || `6.${idx + 1}`}
                                  </span>
                                  <span className="truncate font-medium">{sec.title}</span>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 font-medium font-mono ${
                                  isSecActive
                                    ? 'bg-[#35101F] text-[#E6C687]'
                                    : 'bg-[#FFFDF8] text-[#5A1832] border border-[#CBBEAC]'
                                }`}>
                                  {sec.blocks.length} blk
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-[#CBBEAC] bg-[#EDE4D6] text-[10px] text-[#71685E] shrink-0 flex items-center justify-between">
        <span className="italic">Click status pill to cycle</span>
        <button
          onClick={onOpenArchitectureCustomizer}
          className="font-mono font-bold text-[#5A1832] hover:underline cursor-pointer"
        >
          Manage Blueprint &rarr;
        </button>
      </div>
    </div>
  );

  // Helper row renderer for an architecture component
  function renderArchitectureRow(comp: ChapterComponentAnatomy, index: number) {
    const status = calculateComponentStatus(chapter, comp, index);
    const target = mapComponentToView(comp);
    const isSelected = activeArchitectureItemId
      ? activeArchitectureItemId === comp.id
      : activeView === target.viewId;
    const isCustom = !!chapter.architectureState?.customizations?.[comp.id]?.isCustomized;

    return (
      <div
        key={comp.id}
        onClick={() => {
          if (target.sectionId) {
            onSelectSection(target.sectionId);
          }
          if (onSelectArchitectureItem) {
            onSelectArchitectureItem(comp.id, target.viewId);
          } else {
            handleSelect(target.viewId);
          }
        }}
        className={`group p-2 rounded-lg border transition-all cursor-pointer flex items-start justify-between ${
          isSelected
            ? 'bg-[#5A1832] text-[#F6F0E7] border-[#5A1832] shadow-sm ring-1 ring-[#C29A52]'
            : 'bg-[#FFFDF8] hover:bg-[#F6F0E7] border-[#CBBEAC] text-[#292521]'
        }`}
      >
        <div className="flex items-start space-x-2.5 min-w-0 pr-1.5">
          <span
            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
              isSelected
                ? 'bg-[#C29A52] text-[#292521]'
                : 'bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]'
            }`}
          >
            {index + 1}
          </span>
          <div className="min-w-0">
            <p
              className={`font-bold text-xs truncate leading-snug ${
                isSelected ? 'text-[#F6F0E7]' : 'text-[#292521]'
              }`}
            >
              {comp.name}
            </p>
            <div
              className={`flex items-center space-x-1.5 text-[10px] mt-0.5 truncate font-medium ${
                isSelected ? 'text-[#EDE4D6]' : 'text-[#71685E]'
              }`}
            >
              <span>{comp.defaultEstimatedPages} pp</span>
              <span>&bull;</span>
              <span className="capitalize">{comp.editionTarget}</span>
              {comp.isRequired && (
                <span
                  className={`font-bold uppercase px-1 py-0.2 rounded text-[9px] ${
                    isSelected
                      ? 'bg-[#C29A52] text-[#292521]'
                      : 'bg-amber-100 text-amber-950 border border-amber-300'
                  }`}
                >
                  Req
                </span>
              )}
              {isCustom && (
                <span
                  className={`font-bold uppercase px-1 py-0.2 rounded text-[9px] ${
                    isSelected
                      ? 'bg-emerald-300 text-emerald-950'
                      : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  }`}
                >
                  Custom
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Pill Button */}
        <button
          type="button"
          onClick={(e) => handleCycleComponentStatus(comp.id, status, e)}
          title="Click to cycle status: Not Started &rarr; Drafting &rarr; Complete &rarr; Needs Review &rarr; Not Applicable"
          className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-md shrink-0 transition-colors ${
            isSelected
              ? status === 'complete'
                ? 'bg-emerald-600 text-white border border-emerald-400'
                : status === 'drafting'
                ? 'bg-[#35101F] text-[#F6F0E7] border border-[#C29A52]'
                : status === 'needs_review'
                ? 'bg-amber-500 text-stone-950 border border-amber-300 font-bold'
                : status === 'not_applicable'
                ? 'bg-stone-700 text-stone-200 border border-stone-500'
                : 'bg-rose-900 text-[#F6F0E7] border border-rose-400'
              : status === 'complete'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : status === 'drafting'
              ? 'bg-rose-100 text-[#5A1832] border border-rose-200'
              : status === 'needs_review'
              ? 'bg-amber-100 text-amber-950 border border-amber-300'
              : status === 'not_applicable'
              ? 'bg-stone-100 text-stone-700 border border-stone-300'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {status === 'complete'
            ? 'Done'
            : status === 'drafting'
            ? 'Draft'
            : status === 'needs_review'
            ? 'Review'
            : status === 'not_applicable'
            ? 'N/A'
            : 'Not Started'}
        </button>
      </div>
    );
  }
};

