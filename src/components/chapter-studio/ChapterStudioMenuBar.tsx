import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  BookOpen,
  Layers,
  Target,
  Settings,
  Award,
  ListOrdered,
  Activity,
  History,
  Plus,
  Heading,
  FileText,
  HelpCircle,
  Table,
  Image,
  Split,
  MessageSquare,
  Bookmark,
  AlertCircle,
  Scissors,
  CheckCircle2,
  FileCheck,
  Eye,
  Check,
  ShieldCheck,
  ScanSearch,
  Edit3,
  Bot,
  Wand2,
  Maximize,
  ArrowUpRight,
  BookMarked,
  Printer,
  Download,
  Share2,
  Loader2,
} from 'lucide-react';
import { ContentBlockType } from '../../types';

export interface ChapterStudioMenuBarProps {
  onWriteChapter: () => void;
  isWritingChapter?: boolean;
  // Chapter menu actions
  onAddChapter?: () => void;
  onOpenChapterInfo: () => void;
  onOpenChapterArchitecture: () => void;
  onOpenLearningObjectives: () => void;
  onOpenChapterSettings: () => void;
  onOpenCurriculumMapping: () => void;
  onOpenScopeSequence: () => void;
  onOpenChapterStatus: () => void;
  onOpenSnapshots: () => void;
  // Insert menu actions
  onInsertBlock: (type: ContentBlockType) => void;
  onInsertImage: () => void;
  onInsertDiagram: () => void;
  // Review menu actions
  onOpenQualityAudit: () => void;
  onOpenClarityAudit?: () => void;
  onOpenAccuracyAudit?: () => void;
  onOpenCurriculumAlignment: () => void;
  onOpenTraceabilityMatrix: () => void;
  onOpenReadingPreview: () => void;
  onOpenSpellingGrammar: () => void;
  onOpenAccessibilityCheck: () => void;
  onOpenEditorialNotes: () => void;
  // AI Tools actions
  onOpenAiWritingAssistant: () => void;
  onTriggerAiAction: (actionPrompt: string) => void;
  onGenerateVisualBrief: () => void;
  // Publish menu actions
  onOpenTextbookView: () => void;
  onOpenStudentEditionPreview: () => void;
  onOpenTeacherEditionPreview: () => void;
  onOpenVisualStudio: () => void;
  onOpenExerciseStudio: () => void;
  onExportChapter: () => void;
  onExportBook: () => void;
  onPreflightCheck: () => void;
  onPublishingStatus: () => void;
}

export const ChapterStudioMenuBar: React.FC<ChapterStudioMenuBarProps> = ({
  onWriteChapter,
  isWritingChapter = false,
  onAddChapter,
  onOpenChapterInfo,
  onOpenChapterArchitecture,
  onOpenLearningObjectives,
  onOpenChapterSettings,
  onOpenCurriculumMapping,
  onOpenScopeSequence,
  onOpenChapterStatus,
  onOpenSnapshots,
  onInsertBlock,
  onInsertImage,
  onInsertDiagram,
  onOpenQualityAudit,
  onOpenClarityAudit,
  onOpenAccuracyAudit,
  onOpenCurriculumAlignment,
  onOpenTraceabilityMatrix,
  onOpenReadingPreview,
  onOpenSpellingGrammar,
  onOpenAccessibilityCheck,
  onOpenEditorialNotes,
  onOpenAiWritingAssistant,
  onTriggerAiAction,
  onGenerateVisualBrief,
  onOpenTextbookView,
  onOpenStudentEditionPreview,
  onOpenTeacherEditionPreview,
  onOpenVisualStudio,
  onOpenExerciseStudio,
  onExportChapter,
  onExportBook,
  onPreflightCheck,
  onPublishingStatus,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<
    'chapter' | 'insert' | 'review' | 'ai' | 'publish' | null
  >(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleDropdown = (
    menu: 'chapter' | 'insert' | 'review' | 'ai' | 'publish'
  ) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeMenu = () => setActiveDropdown(null);

  return (
    <div
      ref={menuRef}
      className="flex items-center space-x-1.5 px-3 py-1 bg-[#F6F0E7] border-b border-[#CBBEAC] select-none text-xs"
    >
      {/* Primary Write Action */}
      <button
        type="button"
        id="btn-write-chapter"
        onClick={onWriteChapter}
        disabled={isWritingChapter}
        className={`flex items-center space-x-1.5 px-3.5 py-1 rounded-md font-bold text-xs border border-[#5A1832] shadow-2xs transition-colors shrink-0 mr-1 ${
          isWritingChapter
            ? 'bg-[#35101F] text-[#EDE4D6] opacity-80 cursor-wait'
            : 'bg-[#5A1832] text-[#F6F0E7] hover:bg-[#35101F] cursor-pointer'
        }`}
        title="Start or continue writing the active chapter"
      >
        {isWritingChapter ? (
          <>
            <Loader2 className="w-3.5 h-3.5 text-[#C29A52] animate-spin" />
            <span className="tracking-wider uppercase font-mono text-[11px]">Authoring...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
            <span className="tracking-wider uppercase font-mono text-[11px]">Write Chapter</span>
          </>
        )}
      </button>

      {/* CHAPTER ▼ */}
      <div className="relative">
        <button
          type="button"
          id="menu-chapter-trigger"
          onClick={() => toggleDropdown('chapter')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
            activeDropdown === 'chapter'
              ? 'bg-[#EDE4D6] text-[#5A1832] ring-1 ring-[#C29A52]'
              : 'text-[#292521] hover:bg-[#EDE4D6] hover:text-[#5A1832]'
          }`}
        >
          <span>CHAPTER</span>
          <ChevronDown className="w-3 h-3 text-[#71685E]" />
        </button>

        {activeDropdown === 'chapter' && (
          <div className="absolute left-0 top-full mt-1 w-56 rounded-xl shadow-xl border border-[#CBBEAC] bg-[#FFFDF8] p-1.5 z-50 text-[#292521] animate-in fade-in zoom-in-95 duration-75">
            {onAddChapter && (
              <button
                type="button"
                onClick={() => {
                  onAddChapter();
                  closeMenu();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] flex items-center space-x-2 text-xs font-bold mb-1 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>+ Add Chapter to Book</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onOpenChapterInfo();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Chapter Information</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenChapterArchitecture();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Chapter Architecture</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenLearningObjectives();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Learning Objectives</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenChapterSettings();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Chapter Settings</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <button
              type="button"
              onClick={() => {
                onOpenCurriculumMapping();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Curriculum Mapping</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenScopeSequence();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Scope &amp; Sequence</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenChapterStatus();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              <span>Chapter Status</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenSnapshots();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Snapshots / Version History</span>
            </button>
          </div>
        )}
      </div>

      {/* INSERT ▼ */}
      <div className="relative">
        <button
          type="button"
          id="menu-insert-trigger"
          onClick={() => toggleDropdown('insert')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
            activeDropdown === 'insert'
              ? 'bg-[#EDE4D6] text-[#5A1832] ring-1 ring-[#C29A52]'
              : 'text-[#292521] hover:bg-[#EDE4D6] hover:text-[#5A1832]'
          }`}
        >
          <span>INSERT</span>
          <ChevronDown className="w-3 h-3 text-[#71685E]" />
        </button>

        {activeDropdown === 'insert' && (
          <div className="absolute left-0 top-full mt-1 w-56 max-h-96 overflow-y-auto rounded-xl shadow-xl border border-[#CBBEAC] bg-[#FFFDF8] p-1.5 z-50 text-[#292521] animate-in fade-in zoom-in-95 duration-75">
            <div className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold text-[#71685E]">
              Core Content
            </div>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('text');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Content Block</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('heading');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Heading className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Heading</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('text');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Text / Paragraph</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('example');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Example</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('grammar_rule');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Grammar Rule</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <div className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold text-[#71685E]">
              Activities &amp; Exercises
            </div>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('activity');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Activity</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('exercise');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
              <span>Exercise</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('comparison_table');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Table</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <div className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold text-[#71685E]">
              Visuals &amp; Notes
            </div>
            <button
              type="button"
              onClick={() => {
                onInsertImage();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Image className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Image / Illustration</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertDiagram();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Split className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('important_note');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Callout</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('teacher_note');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-700" />
              <span>Teacher Note</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('watch_out');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>Student Tip</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onInsertBlock('page_break');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Page Break</span>
            </button>
          </div>
        )}
      </div>

      {/* REVIEW ▼ */}
      <div className="relative">
        <button
          type="button"
          id="menu-review-trigger"
          onClick={() => toggleDropdown('review')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
            activeDropdown === 'review'
              ? 'bg-[#EDE4D6] text-[#5A1832] ring-1 ring-[#C29A52]'
              : 'text-[#292521] hover:bg-[#EDE4D6] hover:text-[#5A1832]'
          }`}
        >
          <span>REVIEW</span>
          <ChevronDown className="w-3 h-3 text-[#71685E]" />
        </button>

        {activeDropdown === 'review' && (
          <div className="absolute left-0 top-full mt-1 w-56 rounded-xl shadow-xl border border-[#CBBEAC] bg-[#FFFDF8] p-1.5 z-50 text-[#292521] animate-in fade-in zoom-in-95 duration-75">
            <button
              type="button"
              onClick={() => {
                onOpenQualityAudit();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Quality Audit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenClarityAudit) onOpenClarityAudit();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer font-medium text-[#5A1832]"
            >
              <ScanSearch className="w-3.5 h-3.5 text-[#8C2435]" />
              <span>Audit Clarity</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenAccuracyAudit) onOpenAccuracyAudit();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer font-medium text-[#5A1832]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C2435]" />
              <span>Audit Accuracy &amp; Answer Key</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenCurriculumAlignment();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Curriculum Alignment</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenTraceabilityMatrix();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Traceability Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenReadingPreview();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Reading Preview</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <button
              type="button"
              onClick={() => {
                onOpenSpellingGrammar();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Spelling &amp; Grammar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenAccessibilityCheck();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Accessibility Check</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenEditorialNotes();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Editorial Notes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenSnapshots();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Version History</span>
            </button>
          </div>
        )}
      </div>

      {/* AI TOOLS ▼ */}
      <div className="relative">
        <button
          type="button"
          id="menu-ai-tools-trigger"
          onClick={() => toggleDropdown('ai')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
            activeDropdown === 'ai'
              ? 'bg-[#EDE4D6] text-[#5A1832] ring-1 ring-[#C29A52]'
              : 'text-[#292521] hover:bg-[#EDE4D6] hover:text-[#5A1832]'
          }`}
        >
          <span>AI TOOLS</span>
          <ChevronDown className="w-3 h-3 text-[#71685E]" />
        </button>

        {activeDropdown === 'ai' && (
          <div className="absolute left-0 top-full mt-1 w-64 max-h-96 overflow-y-auto rounded-xl shadow-xl border border-[#CBBEAC] bg-[#FFFDF8] p-1.5 z-50 text-[#292521] animate-in fade-in zoom-in-95 duration-75">
            <button
              type="button"
              onClick={() => {
                onOpenAiWritingAssistant();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer font-bold text-[#5A1832]"
            >
              <Bot className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>AI Writing Assistant</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Explain the selected grammar concept more clearly with child-friendly phrasing');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Explain More Clearly</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Simplify vocabulary and syntactic density for the current grade level');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Simplify for Current Class</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Increase linguistic rigor and add advanced nuance to this concept');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-700" />
              <span>Make More Advanced</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Generate 3 contrasting contextual exemplar sentences highlighting target patterns');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Suggest Contextual Examples</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Identify common student confusion points, pitfalls, and exam traps for this topic');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>Suggest Common Errors &amp; Traps</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Generate 5 scaffolded practice questions matching board blueprints');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
              <span>AI Exercise Generator</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Suggest pedagogical visual infographics, diagrams, or memory anchors for this chapter');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Image className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Suggest Visual / Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onGenerateVisualBrief();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Generate Visual Brief</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Audit pedagogical voice, tone consistency, and student clarity');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Voice Check</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onTriggerAiAction('Verify inductive-to-deductive flow, scaffolding depth, and Bloom taxonomy balance');
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Pedagogy Check</span>
            </button>
          </div>
        )}
      </div>

      {/* PUBLISH ▼ */}
      <div className="relative">
        <button
          type="button"
          id="menu-publish-trigger"
          onClick={() => toggleDropdown('publish')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
            activeDropdown === 'publish'
              ? 'bg-[#EDE4D6] text-[#5A1832] ring-1 ring-[#C29A52]'
              : 'text-[#292521] hover:bg-[#EDE4D6] hover:text-[#5A1832]'
          }`}
        >
          <span>PUBLISH</span>
          <ChevronDown className="w-3 h-3 text-[#71685E]" />
        </button>

        {activeDropdown === 'publish' && (
          <div className="absolute left-0 top-full mt-1 w-56 rounded-xl shadow-xl border border-[#CBBEAC] bg-[#FFFDF8] p-1.5 z-50 text-[#292521] animate-in fade-in zoom-in-95 duration-75">
            <button
              type="button"
              onClick={() => {
                onOpenTextbookView();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Textbook View</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenStudentEditionPreview();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>Student Edition Preview</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenTeacherEditionPreview();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-700" />
              <span>Teacher Edition Preview</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <button
              type="button"
              onClick={() => {
                onOpenVisualStudio();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Visual Studio</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenExerciseStudio();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Exercise Studio</span>
            </button>
            <div className="my-1 border-t border-[#CBBEAC]/50" />
            <button
              type="button"
              onClick={() => {
                onExportChapter();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5A1832]" />
              <span>Export Chapter</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onExportBook();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#71685E]" />
              <span>Export Book</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onPreflightCheck();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Preflight Check</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onPublishingStatus();
                closeMenu();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Publishing Status</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
