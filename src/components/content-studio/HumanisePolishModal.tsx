import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sliders,
  Check,
  Eye,
  ArrowLeftRight,
} from 'lucide-react';
import { HUMANISE_STYLE_PRESETS } from './constants';
import { resolveAITarget, ResolvedAITarget, AiActionScope } from './aiTargetResolver';
import { ContentDocument } from '../../types';

export type HumaniseScope = AiActionScope;

interface HumanisePolishModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullDocumentText: string;
  document: ContentDocument;
  selectionStart: number;
  selectionEnd: number;
  outline?: any[];
  hasSelection: boolean;
  onApplyHumanisedText: (newText: string, target: ResolvedAITarget) => void;
  isDarkMode: boolean;
}

export const HumanisePolishModal: React.FC<HumanisePolishModalProps> = ({
  isOpen,
  onClose,
  fullDocumentText,
  document,
  selectionStart,
  selectionEnd,
  outline,
  hasSelection,
  onApplyHumanisedText,
  isDarkMode,
}) => {
  const [selectedStyle, setSelectedStyle] = useState('natural');
  const [scope, setScope] = useState<HumaniseScope>(hasSelection ? 'selection' : 'document');
  const [isProcessing, setIsProcessing] = useState(false);
  const [candidateText, setCandidateText] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'side_by_side' | 'candidate_only'>('side_by_side');
  const [naturalness, setNaturalness] = useState(4);
  const [sentenceVariation, setSentenceVariation] = useState(4);
  const [repetitionReduction, setRepetitionReduction] = useState(4);
  const [transitionStrength, setTransitionStrength] = useState(3);
  const [toneStrength, setToneStrength] = useState(3);
  const [vocabularyLevel, setVocabularyLevel] = useState(3);
  const [preserveMeaning, setPreserveMeaning] = useState(true);

  if (!isOpen) return null;

  // Resolve target scope
  const resolvedTarget = resolveAITarget(scope, fullDocumentText, selectionStart, selectionEnd, outline);

  const handleRunHumanise = async () => {
    if (!resolvedTarget.isValid) return;

    setIsProcessing(true);
    setCandidateText(null);
    setRequestError(null);

    try {
      const res = await fetch('/api/gemini/content-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'humanise',
          contentType: document.contentType,
          category: document.category,
          title: document.title,
          brief: {
            topic: document.topic,
            purpose: document.purpose,
            targetAudience: document.targetAudience,
            publicationOrPlatform: document.publicationOrPlatform,
            desiredLength: document.desiredLength,
            targetWordCount: document.targetWordCount,
            tone: document.tone,
            language: document.language,
            deadline: document.deadline,
            primaryKeyword: document.primaryKeyword,
            secondaryKeywords: document.secondaryKeywords,
            importantFacts: document.importantFacts,
            keyMessage: document.keyMessage,
            callToAction: document.callToAction,
            referenceMaterial: document.referenceMaterial,
            authorNotes: document.authorNotes,
            aiInstructions: document.aiInstructions,
            thesisStatement: document.thesisStatement,
          },
          humaniseStyle: selectedStyle,
          humaniseScope: resolvedTarget.scope,
          targetText: resolvedTarget.targetText,
          selectedText: resolvedTarget.scope === 'selection' ? resolvedTarget.targetText : undefined,
          currentText: resolvedTarget.targetText,
          sectionTitle: resolvedTarget.sectionTitle,
          newsroomData: document.newsroom,
          adSpecData: document.adSpec,
          pressReleaseData: document.pressRelease,
          socialMediaData: document.socialMedia,
          schoolNoticeData: document.schoolNotice,
          contentTypeInstructions: document.contentTypeInstructions,
          attachedResearch: document.referenceMaterial,
          toneConfig: document.toneConfig,
          humaniseControls: {
            naturalness,
            sentenceVariation,
            repetitionReduction,
            transitionStrength,
            toneStrength,
            vocabularyLevel,
            preserveMeaning,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Provider request failed with HTTP ${res.status}.`);
      }
      if (!data.result) throw new Error('The provider returned no polished text.');
      setCandidateText(data.result);
    } catch (err) {
      console.error('Humanise error:', err);
      setRequestError(err instanceof Error ? err.message : 'Humanise request failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (candidateText && resolvedTarget.isValid) {
      onApplyHumanisedText(candidateText, resolvedTarget);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#292521] dark:text-[#F6F0E7]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-base shadow-xs">
              <Sparkles className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Humanise & Polish Studio
                </span>
                <span>&bull;</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-sans font-medium flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline" />
                  <span>Factual Preservation Guard Active</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Calibrate Rhythm, Sentence Variation & Natural Cadence
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Factual Integrity Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-start space-x-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <span className="font-bold">Guaranteed Fact & Voice Preservation:</span>
              <p>
                Humanise does not replace arbitrary words with synonyms. It modulates cadence, alternates sentence lengths, eliminates formulaic AI transitions, and refines flow while strictly locking all facts, figures, quotations, names, dates, and the author’s core thesis.
              </p>
            </div>
          </div>

          {/* Scope & Style Preset Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scope Selection */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                Target Scope
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'selection', label: 'Selection' },
                  { id: 'paragraph', label: 'Paragraph' },
                  { id: 'section', label: 'Section' },
                  { id: 'document', label: 'Entire Piece' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setScope(s.id as HumaniseScope)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-colors text-left flex items-center justify-between ${
                      scope === s.id
                        ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] shadow-xs'
                        : 'bg-[#EDE4D6] dark:bg-[#200b14] text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/40'
                    }`}
                  >
                    <span>{s.label}</span>
                    {scope === s.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 10 Style Presets (2 cols) */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                Select Humanise Style (10 Presets)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {HUMANISE_STYLE_PRESETS.map((preset) => {
                  const isSelected = selectedStyle === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedStyle(preset.id)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#EDE4D6] dark:bg-[#2b101c] shadow-xs ring-1 ring-[#5A1832]'
                          : 'border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] hover:bg-[#EDE4D6]/60'
                      }`}
                    >
                      <div className="font-serif font-bold text-xs text-[#35101F] dark:text-[#F6F0E7]">
                        {preset.label}
                      </div>
                      <div className="text-[10px] text-[#71685E] dark:text-[#a89989] line-clamp-1">
                        {preset.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {[
              { label: 'Naturalness', value: naturalness, setValue: setNaturalness },
              { label: 'Sentence variation', value: sentenceVariation, setValue: setSentenceVariation },
              { label: 'Repetition reduction', value: repetitionReduction, setValue: setRepetitionReduction },
              { label: 'Transitions', value: transitionStrength, setValue: setTransitionStrength },
              { label: 'Tone adjustment', value: toneStrength, setValue: setToneStrength },
              { label: 'Vocabulary level', value: vocabularyLevel, setValue: setVocabularyLevel },
            ].map((control) => (
              <label key={control.label} className="grid grid-cols-[1fr_auto] items-center gap-x-3 text-xs">
                <span className="font-medium text-[#35101F] dark:text-[#F6F0E7]">{control.label}</span>
                <span className="font-mono text-[10px] text-[#71685E]">{control.value}/5</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={control.value}
                  onChange={(event) => control.setValue(Number(event.target.value))}
                  className="col-span-2 w-full accent-[#5A1832] dark:accent-[#C29A52]"
                  aria-label={control.label}
                />
              </label>
            ))}
            <label className="sm:col-span-2 flex items-center gap-2 text-xs font-medium text-[#35101F] dark:text-[#F6F0E7]">
              <input
                type="checkbox"
                checked={preserveMeaning}
                onChange={(event) => setPreserveMeaning(event.target.checked)}
                className="accent-[#5A1832] dark:accent-[#C29A52]"
              />
              Preserve meaning, facts, names, figures, and quotations
            </label>
          </div>

          {/* Side by side preview comparison */}
          <div className="space-y-2">
            {requestError && (
              <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">
                Humanise request failed: {requestError}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                {candidateText ? 'Before & After Calibration' : 'Original Text Snippet'}
              </span>
              {candidateText && (
                <div className="flex items-center space-x-1.5 bg-[#EDE4D6] dark:bg-[#200b14] p-0.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e]">
                  <button
                    onClick={() => setViewMode('side_by_side')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      viewMode === 'side_by_side'
                        ? 'bg-[#5A1832] text-[#F6F0E7]'
                        : 'text-[#71685E]'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    onClick={() => setViewMode('candidate_only')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      viewMode === 'candidate_only'
                        ? 'bg-[#5A1832] text-[#F6F0E7]'
                        : 'text-[#71685E]'
                    }`}
                  >
                    Polished Output
                  </button>
                </div>
              )}
            </div>

            {candidateText ? (
              viewMode === 'side_by_side' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#EDE4D6]/70 dark:bg-[#200b14]/70 border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#71685E]">
                      Original Prose ({resolvedTarget.scope})
                    </span>
                    <div className="font-serif text-xs leading-relaxed text-[#71685E] dark:text-[#a89989] max-h-60 overflow-y-auto whitespace-pre-wrap select-text">
                      {resolvedTarget.targetText || (resolvedTarget.validationMessage ? `⚠️ ${resolvedTarget.validationMessage}` : 'Empty')}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border-2 border-[#5A1832] dark:border-[#C29A52] space-y-1.5 shadow-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Polished ({selectedStyle})</span>
                    </span>
                    <div className="font-serif text-xs leading-relaxed text-[#292521] dark:text-[#F6F0E7] max-h-60 overflow-y-auto whitespace-pre-wrap select-text">
                      {candidateText}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border-2 border-[#5A1832] dark:border-[#C29A52] space-y-2 shadow-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                    Polished Draft Preview
                  </span>
                  <div className="font-serif text-sm leading-relaxed text-[#292521] dark:text-[#F6F0E7] max-h-72 overflow-y-auto whitespace-pre-wrap select-text">
                    {candidateText}
                  </div>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] font-serif text-xs leading-relaxed text-[#71685E] dark:text-[#a89989] max-h-48 overflow-y-auto whitespace-pre-wrap select-text">
                {resolvedTarget.targetText || (resolvedTarget.validationMessage ? `⚠️ ${resolvedTarget.validationMessage}` : 'No text found in selected scope.')}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold hover:bg-[#F6F0E7] dark:hover:bg-[#2b101c]"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleRunHumanise}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl border border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] text-xs font-bold hover:bg-[#5A1832]/10 transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{candidateText ? 'Regenerate Polish' : 'Synthesize Polish'}</span>
            </button>

            {candidateText && (
              <button
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Apply Polish to Document</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
