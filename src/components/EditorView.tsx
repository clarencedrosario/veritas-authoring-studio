import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Eye,
  MessageSquare,
  Maximize2,
  Sliders,
  Type,
  Check,
  Undo2,
  Redo2,
  X,
  BookOpen,
  Users,
  ChevronDown,
  RefreshCw,
  Search,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { NovelProject, Chapter, Scene, EditorialComment } from '../types';
import { analyzeProseLocally } from '../utils/detectorHeuristics';
import { EditorialToolbar } from './EditorialToolbar';
import { SceneDossierDrawer } from './SceneDossierDrawer';
import { CharacterContextDrawer } from './CharacterContextDrawer';
import { EditorialIntelligencePanel } from './EditorialIntelligencePanel';

interface EditorViewProps {
  project: NovelProject;
  activeChapter: Chapter;
  activeScene: Scene;
  onUpdateSceneContent: (newContent: string) => void;
  onUpdateSceneMeta: (updates: Partial<Scene>) => void;
  onOpenFocusMode: () => void;
  onOpenHumanizerPanel: () => void;
  isDarkMode: boolean;
  onAddComment: (commentText: string, quote?: string) => void;
  onNavigateToCharacters?: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  project,
  activeChapter,
  activeScene,
  onUpdateSceneContent,
  onUpdateSceneMeta,
  onOpenFocusMode,
  onOpenHumanizerPanel,
  isDarkMode,
  onAddComment,
  onNavigateToCharacters,
}) => {
  // Typography options
  const [fontFamily, setFontFamily] = useState<'Literata' | 'Source Serif 4' | 'EB Garamond' | 'Lora' | 'Plus Jakarta Sans'>('Literata');
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [columnWidth, setColumnWidth] = useState<'standard' | 'wide'>('standard');
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);

  // Contextual drawers & intelligence panel
  const [showSceneDossier, setShowSceneDossier] = useState(false);
  const [showCharacterContext, setShowCharacterContext] = useState(false);
  const [showIntelligencePanel, setShowIntelligencePanel] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);

  // History stack for undo / redo
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Generation & AI craft action review modal
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiActionMessage, setAiActionMessage] = useState<string | null>(null);
  const [pendingDraftReview, setPendingDraftReview] = useState<{
    mode: string;
    text: string;
    rationale?: string;
  } | null>(null);

  // Comments input
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typoMenuRef = useRef<HTMLDivElement>(null);

  // Local real-time cadence and burstiness analysis
  const localAnalysis = analyzeProseLocally(activeScene.content);
  const wordCount = activeScene.content.trim() ? activeScene.content.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 225));

  // Close typography menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typoMenuRef.current && !typoMenuRef.current.contains(e.target as Node)) {
        setShowTypographyMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    setUndoStack((prev) => [...prev.slice(-25), activeScene.content]);
    setRedoStack([]);
    onUpdateSceneContent(nextVal);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, activeScene.content]);
    onUpdateSceneContent(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, activeScene.content]);
    onUpdateSceneContent(next);
  };

  // Text Selection for Notes or Quick Formatting
  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      if (end > start) {
        const text = activeScene.content.substring(start, end);
        setSelectedSnippet(text);
      }
    }
  };

  // Minimal formatting toolbar action
  const handleFormat = (action: 'bold' | 'italic' | 'heading' | 'quote' | 'break') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = activeScene.content;
    const selected = content.substring(start, end);

    let newContent = content;
    let newCursorPos = start;

    setUndoStack((prev) => [...prev.slice(-25), content]);
    setRedoStack([]);

    switch (action) {
      case 'bold': {
        const replacement = selected ? `**${selected}**` : '****';
        newContent = content.substring(0, start) + replacement + content.substring(end);
        newCursorPos = selected ? start + replacement.length : start + 2;
        break;
      }
      case 'italic': {
        const replacement = selected ? `*${selected}*` : '**';
        newContent = content.substring(0, start) + replacement + content.substring(end);
        newCursorPos = selected ? start + replacement.length : start + 1;
        break;
      }
      case 'heading': {
        // Add ## at the start of current line
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;
        newContent = content.substring(0, lineStart) + '## ' + content.substring(lineStart);
        newCursorPos = start + 3;
        break;
      }
      case 'quote': {
        // Add > at start of line
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;
        newContent = content.substring(0, lineStart) + '> ' + content.substring(lineStart);
        newCursorPos = start + 2;
        break;
      }
      case 'break': {
        const sceneBreak = '\n\n* * *\n\n';
        newContent = content.substring(0, start) + sceneBreak + content.substring(end);
        newCursorPos = start + sceneBreak.length;
        break;
      }
    }

    onUpdateSceneContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Humanized Editorial Drafting via Server API
  const handleRunDraftAction = async (
    mode: 'humanize' | 'vary_pacing' | 'deepen_sensory' | 'dialogue_polish' | 'continue' | 'critique' | 'continuity' | 'research',
    customPrompt?: string
  ) => {
    setIsGenerating(true);
    setAiActionMessage(`Editorial analysis in progress (${mode.replace('_', ' ')})...`);

    try {
      const activePOV = project.characters.find((c) => c.id === activeScene.povCharacterId);
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode === 'critique' || mode === 'continuity' || mode === 'research' ? 'critique' : mode,
          currentText: activeScene.content,
          chapterTitle: activeChapter.title,
          sceneGoal: activeScene.sceneGoal,
          characters: project.characters,
          pov: activePOV ? `${activePOV.name} (${activePOV.archetype})` : 'Third Person Limited',
          styleProfile: project.stylePersona,
          customPrompt: customPrompt || '',
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Draft generation failed');
      }

      const data = await res.json();
      if (data.result) {
        // Author in control: Instead of overwriting, present proposed improvement for review!
        setPendingDraftReview({
          mode,
          text: data.result.trim(),
          rationale: `Crafted according to ${project.stylePersona.name} guidelines with human cadence variance.`,
        });
      }
      setAiActionMessage(null);
    } catch (err: any) {
      console.error('AI drafting error:', err);
      alert(err.message || 'Failed to complete editorial request. Verify your Gemini API Key in Settings.');
      setAiActionMessage(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // Author applies proposed draft modification
  const handleApplyPendingDraft = () => {
    if (!pendingDraftReview) return;
    setUndoStack((prev) => [...prev.slice(-25), activeScene.content]);
    setRedoStack([]);

    if (pendingDraftReview.mode === 'continue') {
      const combined = activeScene.content
        ? `${activeScene.content.trim()}\n\n${pendingDraftReview.text}`
        : pendingDraftReview.text;
      onUpdateSceneContent(combined);
    } else {
      onUpdateSceneContent(pendingDraftReview.text);
    }
    setPendingDraftReview(null);
  };

  // Replace flagged phrase from suggestion
  const handleApplyImprovement = (original: string | undefined, replacement: string) => {
    if (!original) return;
    setUndoStack((prev) => [...prev.slice(-25), activeScene.content]);
    setRedoStack([]);
    const updated = activeScene.content.replace(new RegExp(original, 'gi'), replacement);
    onUpdateSceneContent(updated);
  };

  const sceneComments = project.comments.filter(
    (c) => c.chapterId === activeChapter.id && c.sceneId === activeScene.id
  );

  return (
    <div id="novel-studio-editor-view" className="flex-1 flex flex-col h-full overflow-hidden relative select-none">
      {/* 1. TOP MANUSCRIPT BAR: Restrained contextual header */}
      <header
        id="editor-contextual-bar"
        className="min-h-[50px] px-4 sm:px-6 border-b border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] flex items-center justify-between z-10 shrink-0"
      >
        {/* Left: Restrained Breadcrumb & Chapter Indicator */}
        <div className="flex items-center space-x-2 min-w-0">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] shrink-0">
            Novel Studio
          </span>
          <span className="text-[#CBBEAC] dark:text-[#4f2c3d] text-xs">/</span>
          <span className="text-[13px] text-[#71685E] dark:text-[#c9b9a6] truncate max-w-[140px] sm:max-w-none font-medium">
            {project.title}
          </span>
          <span className="text-[#CBBEAC] dark:text-[#4f2c3d] text-xs">/</span>
          <span className="text-[13.5px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] truncate max-w-[180px] sm:max-w-none">
            Chapter {activeChapter.number} &middot; {activeScene.title || 'Scene 01'}
          </span>
        </div>

        {/* Center: Subtle stats info */}
        <div className="hidden lg:flex items-center space-x-2 text-[13px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
          <span>{wordCount.toLocaleString()} words</span>
          <span>&bull;</span>
          <span>{readingTimeMinutes}m read</span>
          <span>&bull;</span>
          <span className="flex items-center space-x-1 text-[#9A7438] dark:text-[#C29A52] font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </span>
        </div>

        {/* Right: Contextual Triggers (Scene, Characters, Voice, Continuity, Typography, Focus, Intelligence) */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Secondary Contextual Drawer Triggers */}
          <div className="flex items-center space-x-1 text-xs">
            {/* Scene Dossier Trigger */}
            <button
              id="btn-trigger-scene-dossier"
              onClick={() => setShowSceneDossier(true)}
              className={`min-h-[42px] px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-colors ${
                showSceneDossier
                  ? 'text-[#F6F0E7] bg-[#5A1832] dark:bg-[#C29A52] dark:text-[#35101F]'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
              title="Open Scene Dossier (POV, Goal, Obstacle, Location)"
            >
              Scene
            </button>

            {/* Characters Context Trigger */}
            <button
              id="btn-trigger-characters"
              onClick={() => setShowCharacterContext(true)}
              className={`min-h-[42px] px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-colors ${
                showCharacterContext
                  ? 'text-[#F6F0E7] bg-[#5A1832] dark:bg-[#C29A52] dark:text-[#35101F]'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
              title="View Characters in this scene and codex voice notes"
            >
              Characters
            </button>

            {/* Voice Trigger */}
            <button
              id="btn-trigger-voice"
              onClick={() => {
                setShowIntelligencePanel(true);
              }}
              className="min-h-[42px] px-3 py-1.5 rounded-xl text-[13px] font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors"
              title="Open Human Voice analysis in Intelligence panel"
            >
              Voice
            </button>

            {/* Continuity Trigger */}
            <button
              id="btn-trigger-continuity"
              onClick={() => {
                setShowIntelligencePanel(true);
              }}
              className="hidden md:inline-flex min-h-[42px] px-3 py-1.5 rounded-xl text-[13px] font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors"
              title="Verify timeline and geographical continuity"
            >
              Continuity
            </button>
          </div>

          <div className="h-4 w-px bg-[#CBBEAC] dark:bg-[#4f2c3d] mx-0.5" />

          {/* Typography Menu */}
          <div className="relative" ref={typoMenuRef}>
            <button
              id="btn-typography-menu"
              onClick={() => setShowTypographyMenu(!showTypographyMenu)}
              className="min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors"
              title="Manuscript typography and margins"
            >
              <Type className="w-4 h-4" />
            </button>

            {showTypographyMenu && (
              <div className="absolute right-0 mt-2 w-68 rounded-2xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95 space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
                  Manuscript Typography
                </div>

                {/* Typeface selection */}
                <div className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-[#71685E] dark:text-[#c9b9a6]">Editorial Serif</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Literata', 'Source Serif 4', 'EB Garamond', 'Lora', 'Plus Jakarta Sans'] as const).map(
                      (f) => (
                        <button
                          key={f}
                          onClick={() => setFontFamily(f)}
                          className={`min-h-[38px] px-2.5 py-1 rounded-xl text-left text-xs transition-colors ${
                            fontFamily === f
                              ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-semibold'
                              : 'hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7]'
                          }`}
                        >
                          {f === 'Source Serif 4'
                            ? 'Source Serif'
                            : f === 'Plus Jakarta Sans'
                            ? 'Modern Sans'
                            : f}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                    <span>Point Size</span>
                    <span className="font-mono text-[#35101F] dark:text-[#F6F0E7]">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="22"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#CBBEAC] dark:bg-[#4f2c3d] rounded-lg appearance-none cursor-pointer accent-[#5A1832] dark:accent-[#C29A52]"
                  />
                </div>

                {/* Line Spacing */}
                <div className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-[#71685E] dark:text-[#c9b9a6]">Line Leading</span>
                  <div className="flex space-x-1.5">
                    {(['normal', 'relaxed', 'loose'] as const).map((lh) => (
                      <button
                        key={lh}
                        onClick={() => setLineHeight(lh)}
                        className={`flex-1 min-h-[36px] py-1 rounded-xl text-center text-xs transition-colors capitalize ${
                          lineHeight === lh
                            ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-semibold'
                            : 'hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] border border-[#CBBEAC]/50 dark:border-[#4f2c3d]'
                        }`}
                      >
                        {lh}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column Reading Width */}
                <div className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-[#71685E] dark:text-[#c9b9a6]">Reading Width</span>
                  <div className="flex space-x-1.5">
                    {(['standard', 'wide'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setColumnWidth(w)}
                        className={`flex-1 min-h-[36px] py-1 rounded-xl text-center text-xs transition-colors capitalize ${
                          columnWidth === w
                            ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-semibold'
                            : 'hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] border border-[#CBBEAC]/50 dark:border-[#4f2c3d]'
                        }`}
                      >
                        {w === 'standard' ? 'Book (740px)' : 'Expansive (840px)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Editorial Notes Trigger */}
          <button
            id="btn-trigger-comments"
            onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
            className={`min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl text-xs transition-colors relative ${
              showCommentsDrawer
                ? 'text-[#F6F0E7] bg-[#5A1832] dark:bg-[#C29A52] dark:text-[#35101F]'
                : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
            }`}
            title="Editorial margin notes"
          >
            <MessageSquare className="w-4 h-4" />
            {sceneComments.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#5A1832] dark:bg-[#C29A52]" />
            )}
          </button>

          {/* Focus Mode Trigger */}
          <button
            id="btn-trigger-focus"
            onClick={onOpenFocusMode}
            className="min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors"
            title="Distraction-Free Focus Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#CBBEAC] dark:bg-[#4f2c3d] mx-0.5" />

          {/* Intelligence Panel Trigger */}
          <button
            id="btn-toggle-intelligence-panel"
            onClick={() => setShowIntelligencePanel(!showIntelligencePanel)}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-[13px] font-semibold flex items-center space-x-2 transition-colors ${
              showIntelligencePanel
                ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F]'
                : 'border border-[#CBBEAC] dark:border-[#4f2c3d] text-[#5A1832] dark:text-[#C29A52] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
            }`}
            title="Toggle Right-Side Intelligence Panel"
          >
            <Sparkles className="w-4 h-4 text-[#C29A52] dark:text-[#EDE4D6]" />
            <span className="hidden sm:inline">Intelligence</span>
          </button>
        </div>
      </header>

      {/* 2. THREE-ZONE WORKSPACE: Center Manuscript (65-75%) + Right Intelligence Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* CENTER: Dedicated Manuscript Stage (Warm book paper background, generous padding) */}
        <main
          id="manuscript-stage"
          role="main"
          className="flex-1 flex flex-col relative overflow-y-auto bg-[#EDE4D6] dark:bg-[#1e0f18] select-text"
        >
          {/* Subtle minimal formatting toolbar */}
          <div className="sticky top-0 z-20 pt-3 px-4 pb-1">
            <EditorialToolbar
              onFormat={handleFormat}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onOpenComment={() => setShowCommentsDrawer(true)}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
              selectedText={selectedSnippet}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Manuscript Canvas: Not a generic card, an authentic reading book sheet */}
          <div
            id="manuscript-canvas-container"
            className={`w-full mx-auto my-4 sm:my-8 py-8 sm:py-14 px-8 sm:px-16 flex-1 flex flex-col rounded-2xl bg-[#F6F0E7] dark:bg-[#25131e] border border-[#CBBEAC]/70 dark:border-[#4f2c3d] shadow-sm ${
              columnWidth === 'wide' ? 'max-w-[840px]' : 'max-w-[740px]'
            }`}
          >
            {/* Scene Header Preview in Canvas */}
            <div className="mb-6 pb-4 border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#9A7438] dark:text-[#C29A52]">
                Chapter {activeChapter.number} &bull; Scene {activeScene.title || 'Untitled'}
              </div>
              {activeScene.location && (
                <div className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-1 italic font-serif">
                  {activeScene.location} &mdash; {activeScene.timePeriod || 'Present'}
                </div>
              )}
            </div>

            {/* Core Textarea: Serif, generous line-height, zero border distractions */}
            <textarea
              id="manuscript-editor-textarea"
              ref={textareaRef}
              value={activeScene.content}
              onChange={handleContentChange}
              onSelect={handleTextSelection}
              placeholder="Begin typing your manuscript here... The page is entirely yours."
              style={{
                fontFamily: `"${fontFamily}", "Literata", Georgia, serif`,
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight === 'loose' ? '2.0' : lineHeight === 'relaxed' ? '1.75' : '1.6',
              }}
              className="w-full flex-1 resize-none bg-transparent outline-none border-none p-0 tracking-normal text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989] transition-colors leading-relaxed"
            />
          </div>
        </main>

        {/* RIGHT: Collapsible Editorial Intelligence Panel (~350px) */}
        <EditorialIntelligencePanel
          isOpen={showIntelligencePanel}
          onClose={() => setShowIntelligencePanel(false)}
          project={project}
          activeChapter={activeChapter}
          activeScene={activeScene}
          localAnalysis={localAnalysis}
          onApplyImprovement={handleApplyImprovement}
          onRunDraftAction={handleRunDraftAction}
          isGenerating={isGenerating}
          aiActionMessage={aiActionMessage}
          onOpenDetailedHumanizer={onOpenHumanizerPanel}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* 3. CONTEXTUAL DRAWERS */}

      {/* Scene Dossier Drawer */}
      <SceneDossierDrawer
        isOpen={showSceneDossier}
        onClose={() => setShowSceneDossier(false)}
        project={project}
        activeChapter={activeChapter}
        activeScene={activeScene}
        onUpdateSceneMeta={onUpdateSceneMeta}
        isDarkMode={isDarkMode}
      />

      {/* Character Context Drawer */}
      <CharacterContextDrawer
        isOpen={showCharacterContext}
        onClose={() => setShowCharacterContext(false)}
        project={project}
        activeChapter={activeChapter}
        activeScene={activeScene}
        onNavigateToCharacters={onNavigateToCharacters}
        isDarkMode={isDarkMode}
      />

      {/* Comments / Editorial Margin Notes Drawer */}
      {showCommentsDrawer && (
        <aside
          id="editor-comments-flyout"
          className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-[#F6F0E7] dark:bg-[#2b1622] border-l border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        >
          <div className="min-h-[50px] px-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#35101F]">
            <span className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
              Editorial Notes ({sceneComments.length})
            </span>
            <button
              onClick={() => setShowCommentsDrawer(false)}
              className="p-1.5 rounded-lg text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* New Comment Input */}
            <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#1e0f18] space-y-2.5">
              {selectedSnippet && (
                <div className="p-2.5 rounded-lg bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] text-[12px] font-serif italic text-[#71685E] dark:text-[#c9b9a6]">
                  &ldquo;{selectedSnippet}&rdquo;
                </div>
              )}
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Leave an editorial note or critique..."
                rows={3}
                className="w-full bg-transparent border-none outline-none resize-none text-[13px] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989]"
              />
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    if (newCommentText.trim()) {
                      onAddComment(newCommentText.trim(), selectedSnippet || undefined);
                      setNewCommentText('');
                      setSelectedSnippet('');
                    }
                  }}
                  disabled={!newCommentText.trim()}
                  className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-[13px] font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  Post Note
                </button>
              </div>
            </div>

            {/* List of existing comments */}
            {sceneComments.length === 0 ? (
              <p className="text-center text-[#71685E] dark:text-[#c9b9a6] text-[12px] py-4 italic font-serif">
                No margin notes yet. Select text in the manuscript to anchor a note.
              </p>
            ) : (
              sceneComments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#1e0f18] space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold text-[13px] text-[#35101F] dark:text-[#F6F0E7]">
                    <span>{comm.author}</span>
                    <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] font-normal">{comm.timestamp}</span>
                  </div>
                  {comm.quoteText && (
                    <div className="text-[12px] font-serif italic text-[#71685E] dark:text-[#c9b9a6] border-l-2 border-[#9A7438] dark:border-[#C29A52] pl-2.5 py-0.5">
                      &ldquo;{comm.quoteText}&rdquo;
                    </div>
                  )}
                  <p className="text-[#292521] dark:text-[#F6F0E7] text-[13px] leading-relaxed">{comm.comment}</p>
                </div>
              ))
            )}
          </div>
        </aside>
      )}

      {/* 4. AUTHOR REVIEW MODAL FOR PROPOSED AI EDITS */}
      {pendingDraftReview && (
        <div
          id="author-draft-review-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#35101F]/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPendingDraftReview(null)}
        >
          <div
            className="max-w-2xl w-full bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="min-h-[50px] px-5 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#35101F]">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
                <span className="font-serif font-bold text-[14px] text-[#35101F] dark:text-[#F6F0E7] capitalize">
                  Editorial Draft Preview &middot; {pendingDraftReview.mode.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => setPendingDraftReview(null)}
                className="p-1.5 rounded-lg text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rationale & Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#4f2c3d] text-[#35101F] dark:text-[#F6F0E7]">
                <span className="font-bold text-[12px] uppercase tracking-wider font-mono text-[#9A7438] dark:text-[#C29A52] block mb-1">
                  Author in Control:
                </span>
                <span className="text-[13px] leading-relaxed">
                  {pendingDraftReview.rationale || 'Review this draft sequence before deciding whether to apply it to your manuscript.'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] block mb-1.5">
                  Proposed Text
                </span>
                <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] font-serif text-[15px] leading-relaxed text-[#292521] dark:text-[#F6F0E7] whitespace-pre-wrap max-h-[45vh] overflow-y-auto">
                  {pendingDraftReview.text}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#35101F] flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pendingDraftReview.text);
                  alert('Copied proposed excerpt to clipboard.');
                }}
                className="min-h-[42px] px-3.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] text-[13px] font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] flex items-center space-x-1.5 hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622]"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Text</span>
              </button>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setPendingDraftReview(null)}
                  className="min-h-[42px] px-4 py-1.5 rounded-xl text-[13px] font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7]"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleApplyPendingDraft}
                  className="min-h-[42px] px-5 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-[13px] font-semibold hover:bg-[#35101F] flex items-center space-x-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply to Manuscript</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
