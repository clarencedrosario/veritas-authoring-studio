import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Layers,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  Check,
  X,
  Edit3,
  GitBranch,
  Copy,
  Download,
  Award,
  Maximize2,
  ChevronDown,
  ChevronRight,
  ListOrdered,
  HelpCircle,
} from 'lucide-react';
import {
  VisualRecord,
  VisualOpportunityRecommendation,
  VisualQualityReviewReport,
  BriefComparisonRow,
  ArtworkVariationType,
  VisualType,
  VisualPedagogicalPurpose,
  VisualProductionStatus,
} from '../../../types/visualStudio';
import { StudioChapter, StudioExercise } from '../../../types';
import {
  EDUCATIONAL_DIAGRAM_OPTIONS,
  analyzeChapterVisualOpportunities,
  suggestVisualForContent,
  generateVisualBriefFromContext,
  generateEducationalArtworkSvg,
  reviewVisualQuality,
  compareBriefToArtwork,
  generateAlternativeArtwork,
  createExerciseFromVisual,
  adaptVisualForBoardOrClass,
} from '../../../utils/visualIntelligenceService';

interface VisualIntelligenceStudioProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  activeVisual: VisualRecord;
  onUpdateVisual: (updated: VisualRecord) => void;
  visuals: VisualRecord[];
  onSelectVisual: (visualId: string) => void;
  onAddVisual: (newVisual: VisualRecord) => void;
  onSwitchTab: (tab: 'preview' | 'brief' | 'artwork' | 'intelligence' | 'insert') => void;
  isDarkMode: boolean;
}

type IntelligenceSubView =
  | 'opportunities'
  | 'suggest_content'
  | 'artwork_generator'
  | 'diagram_studio'
  | 'review_audit'
  | 'compare_brief'
  | 'exercise_generator'
  | 'board_adaptation';

export const VisualIntelligenceStudio: React.FC<VisualIntelligenceStudioProps> = ({
  chapter,
  onUpdateChapter,
  activeVisual,
  onUpdateVisual,
  visuals,
  onSelectVisual,
  onAddVisual,
  onSwitchTab,
  isDarkMode,
}) => {
  const [subView, setSubView] = useState<IntelligenceSubView>('opportunities');

  // Chapter Opportunities state
  const [opportunities, setOpportunities] = useState<VisualOpportunityRecommendation[]>(() =>
    analyzeChapterVisualOpportunities(chapter)
  );
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Essential' | 'Recommended' | 'Optional'>('All');
  const [selectedRecommendation, setSelectedRecommendation] = useState<VisualOpportunityRecommendation | null>(
    opportunities[0] || null
  );

  // Content suggestion state
  const [contentToAnalyze, setContentToAnalyze] = useState(
    chapter.sections[0]?.blocks?.map((b) => b.textContent || b.title || '').filter(Boolean).join('\n') ||
      'Naming words are words that name a person, place, animal, or thing. In the classroom, a teacher guides students with books at their wooden desks.'
  );
  const [customSuggestion, setCustomSuggestion] = useState<VisualOpportunityRecommendation | null>(null);

  // Artwork generation state
  const [selectedVariation, setSelectedVariation] = useState<ArtworkVariationType>('Composition Variation');
  const [isGeneratingArtwork, setIsGeneratingArtwork] = useState(false);
  const [artworkFeedbackMsg, setArtworkFeedbackMsg] = useState<string | null>(null);
  const [showConfirmSummary, setShowConfirmSummary] = useState(false);

  // Diagram Studio state
  const [selectedDiagramCategory, setSelectedDiagramCategory] = useState<string>(
    EDUCATIONAL_DIAGRAM_OPTIONS[0].id
  );
  const [customDiagramTitle, setCustomDiagramTitle] = useState('Classification of Naming Words');
  const [diagramPreviewSvg, setDiagramPreviewSvg] = useState<string | null>(null);

  // Review & Audit state
  const [reviewReport, setReviewReport] = useState<VisualQualityReviewReport | null>(() =>
    reviewVisualQuality(activeVisual, chapter)
  );
  const [comparisonRows, setComparisonRows] = useState<BriefComparisonRow[]>(() =>
    compareBriefToArtwork(activeVisual.brief, activeVisual)
  );
  const [revisionNotes, setRevisionNotes] = useState('');
  const [selectedRevisionTags, setSelectedRevisionTags] = useState<string[]>([
    'Increase clarity',
    'Improve print readability',
  ]);

  // Exercise Generator state
  const [exerciseType, setExerciseType] = useState<'identification' | 'classification' | 'replacement'>(
    'identification'
  );
  const [generatedExerciseSuccess, setGeneratedExerciseSuccess] = useState<string | null>(null);

  // Board Adaptation state
  const [targetBoard, setTargetBoard] = useState<'CBSE' | 'CISCE' | 'Cambridge'>('CISCE');
  const [targetClass, setTargetClass] = useState('Class 3');
  const [targetStage, setTargetStage] = useState('Primary Stage 3');
  const [adaptationSuccess, setAdaptationSuccess] = useState<string | null>(null);

  // Handlers
  const handleRefreshOpportunities = () => {
    const opps = analyzeChapterVisualOpportunities(chapter);
    setOpportunities(opps);
    if (opps.length > 0) setSelectedRecommendation(opps[0]);
  };

  const handleAcceptRecommendation = (rec: VisualOpportunityRecommendation) => {
    setOpportunities((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'accepted' } : r))
    );
  };

  const handleRejectRecommendation = (recId: string) => {
    setOpportunities((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'rejected' } : r))
    );
    if (selectedRecommendation?.id === recId) {
      setSelectedRecommendation(null);
    }
  };

  const handleCreateBriefFromRecommendation = (rec: VisualOpportunityRecommendation) => {
    const nextFigNum = `Figure ${chapter.chapterNumber || 1}.${visuals.length + 1}`;
    const { brief, metadata } = generateVisualBriefFromContext({
      chapter,
      concept: rec.concept,
      visualType: rec.recommendedVisualType,
      purpose: rec.pedagogicalPurpose,
      figureNumber: nextFigNum,
      title: rec.suggestedTitle,
    });

    const newRecord: VisualRecord = {
      id: `vis-${chapter.id}-${Date.now()}`,
      figureNumber: nextFigNum,
      title: rec.suggestedTitle,
      visualType: rec.recommendedVisualType,
      purpose: rec.pedagogicalPurpose,
      learningObjectiveSupported: rec.learningObjective,
      conceptSupported: rec.concept,
      status: 'Brief Ready',
      statusHistory: [
        {
          status: 'Brief Ready',
          timestamp: new Date().toISOString(),
          note: `Visual Brief generated from Chapter Opportunity recommendation (${rec.pedagogicalPurpose}).`,
          author: 'AI Visual Intelligence',
        },
      ],
      board: chapter.systemId || 'CBSE',
      classLevel: (chapter.equivalentClass as string) || 'Class 3',
      unit: chapter.unitTitle || 'Unit 1',
      chapterNumber: chapter.chapterNumber || 1,
      chapterTitle: chapter.title,
      associatedSectionId: rec.sectionId,
      associatedSectionTitle: rec.sectionTitle,
      brief,
      metadata,
      sourceType: 'Visual Brief Only',
      versions: [],
      review: {
        reviewStatus: 'Pending',
        reviewer: 'Editorial Review Board',
        reviewNotes: 'Auto-generated brief awaiting initial artist or AI draft.',
        revisionRequested: '',
        reviewChecks: {
          educationalAccuracy: true,
          grammarAccuracy: true,
          ageAppropriateness: true,
          visualClarity: true,
          captionAccuracy: true,
          labelAccuracy: true,
          accessibility: true,
          boardRelevance: true,
          publicationSuitability: false,
        },
      },
    };

    onAddVisual(newRecord);
    setOpportunities((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'brief_created' } : r))
    );
    onSwitchTab('brief');
  };

  const handleAnalyzeContent = () => {
    const sug = suggestVisualForContent(contentToAnalyze, chapter);
    setCustomSuggestion(sug);
  };

  const handleGenerateArtwork = async () => {
    setIsGeneratingArtwork(true);
    setArtworkFeedbackMsg(null);

    try {
      // 1. Attempt generation from server educational art endpoint
      let assetUrl: string | null = null;
      try {
        const res = await fetch('/api/gemini/generate-educational-art', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brief: activeVisual.brief,
            title: activeVisual.title,
            concept: activeVisual.conceptSupported,
            style: activeVisual.brief.styleGuidance,
            aspectRatio: '16:9',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) assetUrl = data.imageUrl;
        }
      } catch (err) {
        console.warn('Backend image generation fallback to vector engine:', err);
      }

      // 2. If no server image, generate high-fidelity scalable educational SVG
      if (!assetUrl) {
        const svgData = generateEducationalArtworkSvg(
          activeVisual.brief,
          activeVisual.metadata,
          activeVisual.title,
          activeVisual.visualType
        );
        assetUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`;
      }

      const nextVersionNum = (activeVisual.versions?.length || 0) + 1;
      const newAsset = {
        versionNumber: nextVersionNum,
        filename: `${activeVisual.metadata.finalAssetFilename || 'fig_asset'}_v${nextVersionNum}.svg`,
        fileType: 'image/svg+xml',
        fileSize: '48 KB',
        dimensions: { width: 800, height: 480 },
        artworkUrl: assetUrl,
        uploadedAt: new Date().toISOString(),
        notes: `AI-Generated Educational Artwork from approved brief. Status: AI Draft.`,
        isApproved: false,
      };

      const updated: VisualRecord = {
        ...activeVisual,
        sourceType: 'AI Generated Artwork',
        status: 'AI Draft',
        currentAsset: newAsset,
        versions: [...(activeVisual.versions || []), newAsset],
        statusHistory: [
          ...(activeVisual.statusHistory || []),
          {
            status: 'AI Draft',
            timestamp: new Date().toISOString(),
            note: 'Educational artwork generated from Visual Brief. Initial status set to AI Draft (Awaiting human editorial review).',
            author: 'AI Educational Visual Intelligence',
          },
        ],
        metadata: {
          ...activeVisual.metadata,
          generationMethod: 'AI-Generated',
          aiAssisted: true,
          reviewStatus: 'Pending',
        },
      };

      onUpdateVisual(updated);
      setShowConfirmSummary(false);
      setArtworkFeedbackMsg(
        'Educational Artwork generated successfully and marked as "AI Draft". Please review quality before approving.'
      );
    } catch (error: any) {
      console.error('Artwork generation error:', error);
      setArtworkFeedbackMsg('Failed to generate artwork: ' + error.message);
    } finally {
      setIsGeneratingArtwork(false);
    }
  };

  const handleGenerateVariation = (varType: ArtworkVariationType) => {
    const newVariant = generateAlternativeArtwork(activeVisual, varType);
    const updated: VisualRecord = {
      ...activeVisual,
      currentAsset: newVariant,
      versions: [...(activeVisual.versions || []), newVariant],
      status: 'AI Draft',
      statusHistory: [
        ...(activeVisual.statusHistory || []),
        {
          status: 'AI Draft',
          timestamp: new Date().toISOString(),
          note: `Generated variant version ${newVariant.versionNumber}: "${varType}". Preserved previous versions in history.`,
          author: 'AI Visual Intelligence (Variations Engine)',
        },
      ],
    };
    onUpdateVisual(updated);
    setArtworkFeedbackMsg(`Generated variant: "${varType}" (Version ${newVariant.versionNumber}).`);
  };

  const handleRunQualityReview = () => {
    const report = reviewVisualQuality(activeVisual, chapter);
    setReviewReport(report);
    const comp = compareBriefToArtwork(activeVisual.brief, activeVisual);
    setComparisonRows(comp);
  };

  const handleRequestRevision = () => {
    if (!revisionNotes && selectedRevisionTags.length === 0) return;
    const noteText = `Requested Revisions: [${selectedRevisionTags.join(', ')}] — ${revisionNotes || 'Adhere to updated editorial clarity.'}`;

    const updated: VisualRecord = {
      ...activeVisual,
      status: 'Revision Requested',
      review: {
        ...activeVisual.review,
        reviewStatus: 'Needs Changes',
        revisionRequested: noteText,
      },
      statusHistory: [
        ...(activeVisual.statusHistory || []),
        {
          status: 'Revision Requested',
          timestamp: new Date().toISOString(),
          note: noteText,
          author: 'Academic Commissioning Editor',
        },
      ],
    };
    onUpdateVisual(updated);
    setRevisionNotes('');
    setArtworkFeedbackMsg('Revision requested recorded. Author/Illustrator can generate or revise.');
  };

  const handleApproveVisual = () => {
    const updated: VisualRecord = {
      ...activeVisual,
      status: 'Approved',
      review: {
        ...activeVisual.review,
        reviewStatus: 'Approved for Publication',
        approvalDate: new Date().toISOString().split('T')[0],
      },
      metadata: {
        ...activeVisual.metadata,
        approvalDate: new Date().toISOString().split('T')[0],
        approvedBy: 'Senior Academic Editor (ELT)',
        reviewStatus: 'Approved for Publication',
      },
      statusHistory: [
        ...(activeVisual.statusHistory || []),
        {
          status: 'Approved',
          timestamp: new Date().toISOString(),
          note: 'Visual approved for publication after editorial review checks passed.',
          author: 'Senior Academic Editor (ELT)',
        },
      ],
    };
    onUpdateVisual(updated);
    setArtworkFeedbackMsg('Visual marked as Approved for Publication.');
  };

  const handleCreateExercise = () => {
    const { exercise, updatedChapter } = createExerciseFromVisual(activeVisual, chapter, exerciseType);
    onUpdateChapter(updatedChapter);

    // Link visual to exercise
    const updatedVisual: VisualRecord = {
      ...activeVisual,
      isExerciseStimulus: true,
      linkedExerciseId: exercise.id,
      stimulusPrompt: exercise.instructions,
    };
    onUpdateVisual(updatedVisual);

    setGeneratedExerciseSuccess(
      `Created "${exercise.title}" with ${exercise.questions.length} questions and linked directly to ${activeVisual.metadata.figureNumber}. Saved into Chapter Exercises!`
    );
  };

  const handleAdaptVisual = () => {
    const adapted = adaptVisualForBoardOrClass(activeVisual, targetBoard, targetClass, targetStage);
    onAddVisual(adapted);
    setAdaptationSuccess(
      `Created derivative adaptation: ${adapted.figureNumber} for ${targetBoard} ${targetClass}. Preserved original ${activeVisual.figureNumber}.`
    );
  };

  const filteredOpportunities = opportunities.filter((r) => {
    if (priorityFilter === 'All') return true;
    return r.priority === priorityFilter;
  });

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#F6F0E7] text-[#292521] overflow-hidden">
      {/* Top Intelligence Context Bar */}
      <div className="px-5 py-3 border-b border-[#CBBEAC] bg-[#EDE4D6] shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-[#35101F]">Educational Visual Intelligence</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C29A52]/20 text-[#5A1832] border border-[#C29A52]/40">
                Phase 4E-2
              </span>
            </div>
            <p className="text-[11px] text-[#71685E]">
              Curriculum Context: <span className="font-semibold text-[#5A1832]">{activeVisual.board}</span> &bull;{' '}
              <span className="font-semibold text-[#5A1832]">{activeVisual.classLevel}</span> &bull; Chapter {activeVisual.chapterNumber}:{' '}
              <span className="italic">{activeVisual.chapterTitle}</span>
            </p>
          </div>
        </div>

        {/* Sub-view Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#CBBEAC]/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubView('opportunities')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subView === 'opportunities'
                ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-white/40'
            }`}
          >
            Chapter Opportunities ({opportunities.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView('suggest_content')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subView === 'suggest_content'
                ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-white/40'
            }`}
          >
            Suggest from Content
          </button>
          <button
            type="button"
            onClick={() => setSubView('artwork_generator')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subView === 'artwork_generator'
                ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-white/40'
            }`}
          >
            Artwork &amp; Variations
          </button>
          <button
            type="button"
            onClick={() => setSubView('diagram_studio')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subView === 'diagram_studio'
                ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-white/40'
            }`}
          >
            Diagram Studio
          </button>
          <button
            type="button"
            onClick={() => setSubView('review_audit')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subView === 'review_audit'
                ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-white/40'
            }`}
          >
            Review &amp; Safety
          </button>
          <button
            type="button"
            onClick={() => setSubView('exercise_generator')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subView === 'exercise_generator'
                ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-white/40'
            }`}
          >
            Create Exercise
          </button>
          <button
            type="button"
            onClick={() => setSubView('board_adaptation')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              subView === 'board_adaptation'
                ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-white/40'
            }`}
          >
            Adapt Visual
          </button>
        </div>
      </div>

      {/* Main Working Stage */}
      <div className="flex-1 overflow-y-auto p-5 min-h-0">
        {/* ========================================================================= */}
        {/* SUBVIEW 1: Chapter Visual Opportunities */}
        {/* ========================================================================= */}
        {subView === 'opportunities' && (
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#35101F]">
                  Pedagogical Visual Opportunities in Chapter {chapter.chapterNumber || 1}
                </h3>
                <p className="text-xs text-[#71685E]">
                  VERITAS inspects your chapter sections, grammar rules, and learning objectives to identify where visuals dramatically improve retention.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-[#EDE4D6] p-1 rounded-lg text-xs">
                  <span className="text-[10px] font-bold text-[#71685E] px-2 uppercase">Priority:</span>
                  {(['All', 'Essential', 'Recommended', 'Optional'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriorityFilter(p)}
                      className={`px-2 py-1 rounded text-xs cursor-pointer font-medium ${
                        priorityFilter === p
                          ? 'bg-[#5A1832] text-[#F6F0E7]'
                          : 'text-[#71685E] hover:text-[#292521]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleRefreshOpportunities}
                  className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] hover:bg-[#EDE4D6] text-xs font-semibold text-[#5A1832] flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-Analyse</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Opportunities List */}
              <div className="lg:col-span-7 space-y-3">
                {filteredOpportunities.map((rec, idx) => {
                  const isSelected = selectedRecommendation?.id === rec.id;
                  const isPriorityEssential = rec.priority === 'Essential';
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecommendation(rec)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C29A52] bg-[#FFFDF8] shadow-sm ring-1 ring-[#C29A52]'
                          : 'border-[#CBBEAC] bg-white/70 hover:bg-[#FFFDF8]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                isPriorityEssential
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {rec.priority}
                            </span>
                            <span className="text-[11px] font-mono text-[#9A7438]">
                              {rec.sectionTitle}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#35101F]">{rec.suggestedTitle}</h4>
                        </div>
                        <span className="px-2 py-1 rounded bg-[#EDE4D6] text-[#5A1832] text-[11px] font-semibold shrink-0">
                          {rec.recommendedVisualType}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 mt-2 leading-relaxed line-clamp-2">
                        {rec.reasonWhyUseful}
                      </p>

                      <div className="mt-3 pt-3 border-t border-[#EDE4D6] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-3 text-[11px] text-[#71685E]">
                          <span>Purpose: <strong className="text-[#35101F]">{rec.pedagogicalPurpose}</strong></span>
                          <span>Complexity: <strong className="text-[#35101F]">{rec.estimatedComplexity}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {rec.status === 'brief_created' ? (
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Brief Created</span>
                            </span>
                          ) : rec.status === 'accepted' ? (
                            <span className="text-[11px] font-bold text-[#5A1832]">Accepted</span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptRecommendation(rec);
                              }}
                              className="px-2.5 py-1 rounded text-xs font-semibold text-[#5A1832] hover:bg-[#EDE4D6]"
                            >
                              Accept
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendation Details Panel */}
              <div className="lg:col-span-5">
                {selectedRecommendation ? (
                  <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4 sticky top-4">
                    <div className="border-b border-[#CBBEAC] pb-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438]">
                        Recommendation Details
                      </span>
                      <h3 className="text-base font-bold text-[#35101F] mt-1">
                        {selectedRecommendation.suggestedTitle}
                      </h3>
                      <p className="text-xs text-[#71685E] mt-0.5">
                        Target Section: {selectedRecommendation.sectionTitle}
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-[#71685E] uppercase text-[10px] block">
                          Grammar Concept
                        </span>
                        <p className="font-medium text-[#292521] mt-0.5">
                          {selectedRecommendation.concept}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-[#71685E] uppercase text-[10px] block">
                          Learning Objective
                        </span>
                        <p className="text-stone-700 mt-0.5">
                          {selectedRecommendation.learningObjective}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-[#71685E] uppercase text-[10px] block">
                          Pedagogical Rationale
                        </span>
                        <p className="text-stone-700 mt-0.5 leading-relaxed bg-[#F6F0E7] p-2.5 rounded-lg border border-[#CBBEAC]">
                          {selectedRecommendation.reasonWhyUseful}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-[#71685E] uppercase text-[10px] block mb-1">
                          Suggested Grammatical Labels ({selectedRecommendation.suggestedLabels.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedRecommendation.suggestedLabels.map((lbl, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-semibold text-[11px]"
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#CBBEAC] text-[11px]">
                        <div>
                          <span className="text-[#71685E]">Format:</span>{' '}
                          <strong>{selectedRecommendation.recommendedVisualType}</strong>
                        </div>
                        <div>
                          <span className="text-[#71685E]">Placement:</span>{' '}
                          <strong>{selectedRecommendation.suggestedPlacement}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#CBBEAC] space-y-2">
                      <button
                        type="button"
                        onClick={() => handleCreateBriefFromRecommendation(selectedRecommendation)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#5A1832] text-[#F6F0E7] font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[#431225] shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#C29A52]" />
                        <span>Create Visual Brief from Recommendation</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAcceptRecommendation(selectedRecommendation)}
                          className="py-1.5 rounded-lg border border-[#CBBEAC] hover:bg-[#EDE4D6] text-xs font-semibold text-[#5A1832]"
                        >
                          Mark Accepted
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectRecommendation(selectedRecommendation.id)}
                          className="py-1.5 rounded-lg border border-[#CBBEAC] hover:bg-rose-50 text-xs font-semibold text-rose-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-[#CBBEAC] text-center text-xs text-[#71685E]">
                    Select a recommendation to view full pedagogical details.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 2: Suggest Visual from Selected Content */}
        {/* ========================================================================= */}
        {subView === 'suggest_content' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#35101F]">
                Suggest Visual from Chapter Content
              </h3>
              <p className="text-xs text-[#71685E]">
                Highlight or paste any grammatical definition, rule explanation, or student passage to let VERITAS formulate a targeted visual brief.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#71685E] mb-1.5">
                  Content Block / Passage for Visual Analysis:
                </label>
                <textarea
                  rows={4}
                  value={contentToAnalyze}
                  onChange={(e) => setContentToAnalyze(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-sans text-[#292521] focus:ring-2 focus:ring-[#C29A52] focus:outline-none"
                  placeholder="Paste excerpt from manuscript..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#71685E]">Quick Samples:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setContentToAnalyze(
                        'A Common Noun names general people, places, animals, or things. For example: girl, school, dog, pencil.'
                      )
                    }
                    className="text-xs text-[#5A1832] hover:underline font-medium cursor-pointer"
                  >
                    Common Nouns
                  </button>
                  <span className="text-[#CBBEAC]">&bull;</span>
                  <button
                    type="button"
                    onClick={() =>
                      setContentToAnalyze(
                        'A Proper Noun is the special name of a particular person, place, or thing. Proper nouns always begin with a capital letter (e.g., Priya, Mumbai, Ganga).'
                      )
                    }
                    className="text-xs text-[#5A1832] hover:underline font-medium cursor-pointer"
                  >
                    Proper Nouns
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAnalyzeContent}
                  className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] font-bold text-xs flex items-center space-x-2 hover:bg-[#431225] cursor-pointer shadow-xs"
                >
                  <Brain className="w-4 h-4 text-[#C29A52]" />
                  <span>Analyse &amp; Formulate Visual Suggestion</span>
                </button>
              </div>
            </div>

            {customSuggestion && (
              <div className="p-5 rounded-2xl border border-[#C29A52] bg-[#FFFDF8] shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438]">
                      AI Visual Intelligence Suggestion
                    </span>
                    <h4 className="text-base font-bold text-[#35101F] mt-0.5">
                      {customSuggestion.suggestedTitle}
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EDE4D6] text-[#5A1832] font-bold text-xs">
                    {customSuggestion.recommendedVisualType}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <p className="text-stone-800 leading-relaxed">
                    <strong>Pedagogical Purpose:</strong> {customSuggestion.pedagogicalPurpose} &bull;{' '}
                    <strong>Priority:</strong> {customSuggestion.priority}
                  </p>
                  <p className="text-stone-700 leading-relaxed bg-[#F6F0E7] p-3 rounded-xl border border-[#CBBEAC]">
                    {customSuggestion.reasonWhyUseful}
                  </p>
                  <div>
                    <span className="font-bold text-[#71685E] uppercase text-[10px] block mb-1">
                      Required Grammatical Labels:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {customSuggestion.suggestedLabels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-semibold text-xs"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#CBBEAC] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setCustomSuggestion(null)}
                    className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] text-xs font-semibold text-[#71685E] hover:bg-[#EDE4D6]"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateBriefFromRecommendation(customSuggestion)}
                    className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] font-bold text-xs flex items-center space-x-2 hover:bg-[#431225] cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C29A52]" />
                    <span>Create Visual Brief from this Suggestion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 3: Educational Artwork & Variations */}
        {/* ========================================================================= */}
        {subView === 'artwork_generator' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#35101F]">
                Educational Artwork Generation &amp; Variations
              </h3>
              <p className="text-xs text-[#71685E]">
                Artwork is generated strictly from the approved Visual Brief specifications (never generic prompts). Generated assets receive initial status &quot;AI Draft&quot; requiring editorial signoff.
              </p>
            </div>

            {artworkFeedbackMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{artworkFeedbackMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setArtworkFeedbackMsg(null)}
                  className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Active Visual Brief Target Card */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CBBEAC] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-bold text-xs font-mono">
                    {activeVisual.figureNumber.replace(/\D/g, '') || '1'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#35101F]">{activeVisual.title}</h4>
                    <span className="text-[11px] font-mono text-[#9A7438]">
                      {activeVisual.figureNumber} &bull; {activeVisual.visualType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EDE4D6] text-[#5A1832]">
                    Status: {activeVisual.status}
                  </span>
                </div>
              </div>

              {/* Brief Confirmation Summary Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#F6F0E7] p-4 rounded-xl border border-[#CBBEAC]">
                <div>
                  <span className="font-bold text-[#71685E] uppercase text-[10px] block">
                    Target Concept &amp; Class
                  </span>
                  <p className="font-medium text-[#292521] mt-0.5">
                    {activeVisual.conceptSupported} ({activeVisual.board} {activeVisual.classLevel})
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#71685E] uppercase text-[10px] block">
                    Pedagogical Purpose &amp; Style
                  </span>
                  <p className="text-stone-700 mt-0.5">
                    {activeVisual.purpose} &bull; {activeVisual.brief.styleGuidance.substring(0, 45)}...
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-bold text-[#71685E] uppercase text-[10px] block">
                    Mandatory Required Elements ({activeVisual.brief.requiredElements.length})
                  </span>
                  <p className="text-stone-700 mt-0.5">
                    {activeVisual.brief.requiredElements.join('; ')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-bold text-[#71685E] uppercase text-[10px] block">
                    Required Grammatical Labels
                  </span>
                  <p className="text-stone-700 mt-0.5">
                    {activeVisual.brief.labelsRequired.join(', ')}
                  </p>
                </div>
              </div>

              {/* Primary Generation Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#71685E]">
                  Produces publication-grade vector artwork conforming to 80 GSM print limits.
                </span>
                <button
                  type="button"
                  disabled={isGeneratingArtwork}
                  onClick={handleGenerateArtwork}
                  className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] font-bold text-xs flex items-center space-x-2 hover:bg-[#431225] cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#C29A52]" />
                  <span>{isGeneratingArtwork ? 'Synthesizing Educational Artwork...' : 'Generate Educational Artwork'}</span>
                </button>
              </div>
            </div>

            {/* Artwork Variations Section */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              <div className="border-b border-[#CBBEAC] pb-3">
                <h4 className="text-sm font-bold text-[#35101F]">
                  Generate Artwork Alternatives (Non-Destructive Variations)
                </h4>
                <p className="text-xs text-[#71685E]">
                  Create variations for different developmental tiers or printing constraints without replacing earlier versions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    'Composition Variation',
                    'Simpler Version',
                    'More Detailed Version',
                    'Younger Learner Version',
                    'Older Learner Version',
                    'Diagram Version',
                    'Illustration Version',
                    'Black-and-White Version',
                    'Print-Friendly Version',
                  ] as ArtworkVariationType[]
                ).map((varType) => (
                  <button
                    key={varType}
                    type="button"
                    onClick={() => handleGenerateVariation(varType)}
                    className="p-3 rounded-xl border border-[#CBBEAC] hover:border-[#C29A52] bg-[#F6F0E7] hover:bg-[#EDE4D6] text-left text-xs font-semibold text-[#35101F] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                  >
                    <span>{varType}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C29A52]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Current Asset Version Stack */}
            {activeVisual.versions && activeVisual.versions.length > 0 && (
              <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-[#35101F]">
                  Version Stack ({activeVisual.versions.length} versions recorded)
                </h4>
                <div className="space-y-2">
                  {activeVisual.versions.map((ver) => (
                    <div
                      key={ver.versionNumber}
                      className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-0.5 rounded bg-[#5A1832] text-[#F6F0E7] font-bold text-[11px] font-mono">
                          v{ver.versionNumber}
                        </span>
                        <div>
                          <span className="font-semibold text-[#292521]">{ver.filename}</span>
                          <p className="text-[10px] text-[#71685E]">{ver.notes || 'Editorial Asset'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#71685E]">
                        {ver.uploadedAt.split('T')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 4: Educational Diagram Studio */}
        {/* ========================================================================= */}
        {subView === 'diagram_studio' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#35101F]">
                Specialized Educational Diagram Studio
              </h3>
              <p className="text-xs text-[#71685E]">
                Generate structured, pedagogically sound grammar diagrams (Reed-Kellogg structures, classification trees, dependency flowcharts, and comparison bridges).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {EDUCATIONAL_DIAGRAM_OPTIONS.map((opt) => {
                const isSelected = selectedDiagramCategory === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedDiagramCategory(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C29A52] bg-[#FFFDF8] shadow-sm ring-1 ring-[#C29A52]'
                        : 'border-[#CBBEAC] bg-white/70 hover:bg-[#FFFDF8]'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-[#9A7438] uppercase">
                      {opt.category}
                    </span>
                    <h5 className="text-xs font-bold text-[#35101F] mt-0.5">{opt.label}</h5>
                    <p className="text-[11px] text-[#71685E] mt-1 line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Selected Diagram Configuration & Action */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CBBEAC] pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#35101F]">
                    Synthesize Diagram for {activeVisual.conceptSupported}
                  </h4>
                  <p className="text-xs text-[#71685E]">
                    Conforms to {activeVisual.board} {activeVisual.classLevel} linguistic standards.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    // Generate comparison diagram SVG
                    const svg = generateEducationalArtworkSvg(
                      activeVisual.brief,
                      activeVisual.metadata,
                      activeVisual.title,
                      'Comparison Chart',
                      'Diagram Version'
                    );
                    setDiagramPreviewSvg(svg);
                    handleGenerateVariation('Diagram Version');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] font-bold text-xs flex items-center space-x-2 hover:bg-[#431225] cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#C29A52]" />
                  <span>Generate Diagram Vector Asset</span>
                </button>
              </div>

              {diagramPreviewSvg && (
                <div className="p-4 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] space-y-2">
                  <span className="text-xs font-bold text-[#5A1832]">Diagram Vector Output Preview:</span>
                  <div
                    className="w-full h-80 rounded-lg overflow-hidden border border-[#CBBEAC] bg-white flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: diagramPreviewSvg }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 5: Review & Safety Audit */}
        {/* ========================================================================= */}
        {subView === 'review_audit' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#35101F]">
                  Visual Quality Audit &amp; Educational Safety
                </h3>
                <p className="text-xs text-[#71685E]">
                  Evaluates artwork against the approved brief across 18 criteria. Does NOT claim false official board endorsement.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleRunQualityReview}
                  className="px-3.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] hover:bg-[#EDE4D6] text-xs font-semibold text-[#5A1832] flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Run Audit Checks</span>
                </button>
                <button
                  type="button"
                  onClick={handleApproveVisual}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Artwork for Publication</span>
                </button>
              </div>
            </div>

            {/* Audit Summary Banner */}
            {reviewReport && (
              <div className="p-4 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                      reviewReport.overallStatus === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {reviewReport.overallStatus}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#35101F]">
                      Compliance Rating: {reviewReport.passPercentage}% Pass Rate
                    </h4>
                    <p className="text-xs text-[#71685E] mt-0.5">{reviewReport.summaryNote}</p>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-[#71685E]">
                  <span>Audited by: {reviewReport.reviewerOrAgent}</span>
                </div>
              </div>
            )}

            {/* Brief vs Artwork Comparison Table */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#35101F]">
                Artwork vs Approved Brief Comparison
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#CBBEAC] text-[10px] font-mono uppercase text-[#71685E]">
                      <th className="pb-2 font-bold">Requirement</th>
                      <th className="pb-2 font-bold">Expected (Brief)</th>
                      <th className="pb-2 font-bold">Represented (Artwork)</th>
                      <th className="pb-2 font-bold">Status</th>
                      <th className="pb-2 font-bold">Editorial Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE4D6]">
                    {comparisonRows.map((row) => (
                      <tr key={row.id} className="py-2.5">
                        <td className="py-2 font-bold text-[#35101F]">{row.requiredItem}</td>
                        <td className="py-2 text-stone-700">{row.expected}</td>
                        <td className="py-2 text-stone-900 font-medium">{row.detected}</td>
                        <td className="py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 text-stone-600 italic">{row.editorialComment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 18 Audit Checks Detailed Checklist */}
            {reviewReport && (
              <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-[#35101F]">
                  18-Point Educational &amp; Print Audit Checklist
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {reviewReport.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#9A7438] font-bold uppercase">
                          {chk.category}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            chk.status === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {chk.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-[#292521]">{chk.criterion}</h5>
                      <p className="text-[11px] text-stone-700">{chk.finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Revision Form */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-[#35101F]">
                Request Editorial Artwork Revision
              </h4>
              <p className="text-xs text-[#71685E]">
                Select required adjustments. Revisions generate a new version, maintaining full audit and production history.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Remove object',
                  'Add object',
                  'Correct label',
                  'Change wording',
                  'Simplify scene',
                  'Increase clarity',
                  'Reduce clutter',
                  'Change age representation',
                  'Change composition',
                  'Correct concept',
                  'Improve print readability',
                ].map((tag) => {
                  const isChecked = selectedRevisionTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setSelectedRevisionTags((prev) =>
                          isChecked ? prev.filter((t) => t !== tag) : [...prev, tag]
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#5A1832] text-[#F6F0E7]'
                          : 'bg-[#EDE4D6] text-[#71685E] hover:text-[#292521]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <textarea
                rows={2}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-sans text-[#292521] focus:ring-2 focus:ring-[#C29A52] focus:outline-none"
                placeholder="Specific guidance for the illustrator or AI generation engine..."
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRequestRevision}
                  className="px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 cursor-pointer shadow-2xs"
                >
                  Submit Revision Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 6: Picture-Based Exercise Generator */}
        {/* ========================================================================= */}
        {subView === 'exercise_generator' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#35101F]">
                Create Formative Exercise from {activeVisual.metadata.figureNumber}
              </h3>
              <p className="text-xs text-[#71685E]">
                Connect this visual directly to chapter exercises and question banks. Questions generated enter the normal editorial workflow.
              </p>
            </div>

            {generatedExerciseSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{generatedExerciseSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGeneratedExerciseSuccess(null)}
                  className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#71685E]">
                  Select Exercise Question Type:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setExerciseType('identification')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                      exerciseType === 'identification'
                        ? 'border-[#C29A52] bg-[#EDE4D6] text-[#35101F] font-bold ring-1 ring-[#C29A52]'
                        : 'border-[#CBBEAC] bg-[#F6F0E7] text-[#71685E] hover:text-[#292521]'
                    }`}
                  >
                    <span className="text-xs block">1. Picture Identification</span>
                    <span className="text-[10px] font-normal text-stone-600 mt-1 block">
                      Identify 4-5 common nouns seen in the visual scene.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExerciseType('classification')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                      exerciseType === 'classification'
                        ? 'border-[#C29A52] bg-[#EDE4D6] text-[#35101F] font-bold ring-1 ring-[#C29A52]'
                        : 'border-[#CBBEAC] bg-[#F6F0E7] text-[#71685E] hover:text-[#292521]'
                    }`}
                  >
                    <span className="text-xs block">2. Category Sorting</span>
                    <span className="text-[10px] font-normal text-stone-600 mt-1 block">
                      Sort depicted items into Person, Place, or Thing.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExerciseType('replacement')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                      exerciseType === 'replacement'
                        ? 'border-[#C29A52] bg-[#EDE4D6] text-[#35101F] font-bold ring-1 ring-[#C29A52]'
                        : 'border-[#CBBEAC] bg-[#F6F0E7] text-[#71685E] hover:text-[#292521]'
                    }`}
                  >
                    <span className="text-xs block">3. Proper Noun Replacement</span>
                    <span className="text-[10px] font-normal text-stone-600 mt-1 block">
                      Provide specific proper names for common nouns.
                    </span>
                  </button>
                </div>
              </div>

              {/* Traceability Indicator */}
              <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-xs space-y-1">
                <span className="font-bold text-[#5A1832] uppercase text-[10px] block">
                  Curricular Traceability Pipeline
                </span>
                <p className="text-stone-700 text-[11px] font-mono">
                  {activeVisual.metadata.figureNumber} &rarr; Chapter {activeVisual.chapterNumber} &rarr;{' '}
                  {activeVisual.conceptSupported} &rarr; Formative Practice &rarr; Question Bank &rarr; Answer Key
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCreateExercise}
                  className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] font-bold text-xs flex items-center space-x-2 hover:bg-[#431225] cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#C29A52]" />
                  <span>Generate &amp; Inject Exercise into Chapter</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBVIEW 7: Three-Board & Class Adaptation */}
        {/* ========================================================================= */}
        {subView === 'board_adaptation' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#35101F]">
                Adapt Visual for Different Boards &amp; Class Levels
              </h3>
              <p className="text-xs text-[#71685E]">
                VERITAS applies three-board intelligence (CBSE, CISCE, Cambridge) to create a derivative visual tailored to specific regional or curriculum expectations without mutating the original.
              </p>
            </div>

            {adaptationSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{adaptationSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdaptationSuccess(null)}
                  className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#71685E] mb-1">
                    Target Programme / Board:
                  </label>
                  <select
                    value={targetBoard}
                    onChange={(e) => setTargetBoard(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-semibold text-[#292521]"
                  >
                    <option value="CBSE">CBSE (NCERT Activity &amp; Experiential Focus)</option>
                    <option value="CISCE">CISCE / ICSE (Comprehensive Formal Syntax)</option>
                    <option value="Cambridge">Cambridge Primary (Communicative Enquiry Focus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#71685E] mb-1">
                    Target Class / Stage:
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-semibold text-[#292521]"
                  >
                    <option value="Class 1">Class 1 / Stage 1</option>
                    <option value="Class 2">Class 2 / Stage 2</option>
                    <option value="Class 3">Class 3 / Stage 3</option>
                    <option value="Class 4">Class 4 / Stage 4</option>
                    <option value="Class 5">Class 5 / Stage 5</option>
                    <option value="Class 6">Class 6 / Stage 6</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-xs space-y-1.5">
                <span className="font-bold text-[#5A1832] uppercase text-[10px] block">
                  Three-Board Intelligence Benchmark
                </span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {targetBoard === 'CBSE' &&
                    'CBSE: Focus on relatable everyday Indian contexts, friendly character interactions, and experiential naming word discovery.'}
                  {targetBoard === 'CISCE' &&
                    'CISCE / ICSE: Higher linguistic rigor, formal syntactic word-class categories, parsing precision, and classical layout aesthetics.'}
                  {targetBoard === 'Cambridge' &&
                    'Cambridge Primary: Communicative enquiry layout, international learner representation, and task-based discovery questions.'}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleAdaptVisual}
                  className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] font-bold text-xs flex items-center space-x-2 hover:bg-[#431225] cursor-pointer shadow-xs"
                >
                  <GitBranch className="w-4 h-4 text-[#C29A52]" />
                  <span>Create Derivative Adapted Visual</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
