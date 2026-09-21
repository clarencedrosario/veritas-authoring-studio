import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  Edit3,
  Lightbulb,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Layers,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { BookProject } from '../../../types';
import { BookArchitectureConfig, ArchitectureSuggestion } from './types';

interface AiArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: BookProject;
  architecture: BookArchitectureConfig;
  onApplySuggestion: (suggestion: ArchitectureSuggestion, customPayload?: any) => void;
  isDarkMode: boolean;
}

export const AiArchitectureModal: React.FC<AiArchitectureModalProps> = ({
  isOpen,
  onClose,
  project,
  architecture,
  onApplySuggestion,
  isDarkMode,
}) => {
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null);
  const [editedPayloadText, setEditedPayloadText] = useState<string>('');
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});
  const [rejectedIds, setRejectedIds] = useState<Record<string, boolean>>({});

  // Generate contextual pedagogical recommendations based on current architecture and project
  const suggestions: ArchitectureSuggestion[] = [
    {
      id: 'sugg-1',
      category: 'strand',
      title: 'Introduce Explicit "Morphology & Word Formation" Strand',
      rationale: `For ${project.classLevel || 'Class 6'} learners under ${project.board || 'CBSE'}, morphological awareness (prefixes like un-, dis-, re- and suffixes like -tion, -ment, -ly) strongly accelerates lexical precision and reduces spelling concord errors.`,
      proposedAction: 'Add a dedicated learning strand with "High" relative emphasis linking root morphology to parts of speech.',
      targetSection: 'Learning Architecture',
      targetField: 'coreStrands',
      payload: {
        id: `strand-morphology-${Date.now()}`,
        title: 'Morphology & Word Formation',
        description: 'Analyzing derivational affixes, inflectional morphemes, compound words, and lexical word-class transformations.',
        relativeEmphasis: 'High',
        curriculumLinks: ['Morphology.Affixes.6', 'LexicalFormation.6'],
        contributingChapters: ['Unit 2 Chapters', 'Back Matter Morphology Charts'],
      },
      status: appliedIds['sugg-1'] ? 'accepted' : rejectedIds['sugg-1'] ? 'rejected' : 'pending',
    },
    {
      id: 'sugg-2',
      category: 'prerequisite',
      title: 'Strengthen Prerequisite Verification for Irregular Past Participles',
      rationale: 'Students entering Unit 3 (Tenses & Aspects) often confuse simple past V2 with past participle V3 forms (e.g. wrote vs written, saw vs seen).',
      proposedAction: 'Include a diagnostic warm-up requirement on irregular verb principal parts in the Entry Competencies checklist.',
      targetSection: 'Learning Architecture',
      targetField: 'entryCompetencies',
      payload: 'Verify recognition of common irregular verb principal parts (base, past, past participle) prior to perfect aspect units.',
      status: appliedIds['sugg-2'] ? 'accepted' : rejectedIds['sugg-2'] ? 'rejected' : 'pending',
    },
    {
      id: 'sugg-3',
      category: 'exercise_balance',
      title: 'Calibrate Controlled Practice vs Application Ratio',
      rationale: 'Foundational grammar retention improves when 35% of exercises provide structured scaffolding before unassisted paragraph writing.',
      proposedAction: 'Ensure Tier 3 (Controlled Practice) maintains at least 12 items per chapter to solidify structural confidence.',
      targetSection: 'Exercise Architecture',
      targetField: 'typicalQuestionCount',
      payload: { tierIndex: 2, typicalQuestionCount: 12 },
      status: appliedIds['sugg-3'] ? 'accepted' : rejectedIds['sugg-3'] ? 'rejected' : 'pending',
    },
    {
      id: 'sugg-4',
      category: 'visual_opportunity',
      title: 'Incorporate Branching Syntax Diagrams for Inverted Sentences',
      rationale: 'Inverted sentences beginning with "Here", "There", or negative adverbials ("Seldom", "Hardly") are prime sources of subject-verb concord errors.',
      proposedAction: 'Tag Sentence Diagrams as "Preferred" for syntactic inversion in the Visual Architecture specification.',
      targetSection: 'Visual Architecture',
      targetField: 'assetTypes',
      payload: { assetId: 'asset-2', status: 'Preferred' },
      status: appliedIds['sugg-4'] ? 'accepted' : rejectedIds['sugg-4'] ? 'rejected' : 'pending',
    },
    {
      id: 'sugg-5',
      category: 'age_appropriateness',
      title: 'Contextualize Example Sentences in Relatable Real-World Domains',
      rationale: 'Students aged 11–12 engage more effectively when grammar drills reference middle-school science fairs, nature, coding clubs, and collaborative school projects rather than abstract adult scenarios.',
      proposedAction: 'Update Editorial Style Guidance to emphasize student-centered thematic domains in example sentences.',
      targetSection: 'Language & Editorial Style',
      targetField: 'exampleSentenceStyle',
      payload: 'Middle school classroom life, athletics, scientific curiosity, Indian wildlife conservation, and relatable daily dialogues.',
      status: appliedIds['sugg-5'] ? 'accepted' : rejectedIds['sugg-5'] ? 'rejected' : 'pending',
    },
    {
      id: 'sugg-6',
      category: 'page_budget',
      title: 'Verify 16-Page Signature Alignment for 192-Page Volume',
      rationale: `Target of ${project.targetPageCount || 192} pages cleanly divides into 12 sixteen-page printer signatures (192 / 16 = 12 signatures), ensuring zero wasteful blank leaf costs during press production.`,
      proposedAction: 'Lock chapter page budget targets to fit within the 192-page signature plan.',
      targetSection: 'Standard Chapter Architecture',
      targetField: 'notes',
      payload: 'Page budget calibrated strictly to 12 sixteen-page signatures (192 pages total).',
      status: appliedIds['sugg-6'] ? 'accepted' : rejectedIds['sugg-6'] ? 'rejected' : 'pending',
    },
  ];

  if (!isOpen) return null;

  const handleAccept = (sugg: ArchitectureSuggestion) => {
    onApplySuggestion(sugg);
    setAppliedIds((prev) => ({ ...prev, [sugg.id]: true }));
  };

  const handleReject = (suggId: string) => {
    setRejectedIds((prev) => ({ ...prev, [suggId]: true }));
  };

  const handleStartEdit = (sugg: ArchitectureSuggestion) => {
    setEditingSuggestionId(sugg.id);
    setEditedPayloadText(
      typeof sugg.payload === 'string'
        ? sugg.payload
        : JSON.stringify(sugg.payload, null, 2)
    );
  };

  const handleSaveEditAndApply = (sugg: ArchitectureSuggestion) => {
    let finalPayload: any = editedPayloadText;
    try {
      if (editedPayloadText.startsWith('{') || editedPayloadText.startsWith('[')) {
        finalPayload = JSON.parse(editedPayloadText);
      }
    } catch {
      // Keep as string if not JSON
    }
    onApplySuggestion(sugg, finalPayload);
    setAppliedIds((prev) => ({ ...prev, [sugg.id]: true }));
    setEditingSuggestionId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-2xl text-[#292521] dark:text-[#F6F0E7] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#CBBEAC] dark:border-[#5A1832] bg-[#EDE4D6]/70 dark:bg-[#35101F]/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#5A1832] text-[#F6F0E7]">
              <Sparkles className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-base text-[#292521] dark:text-[#F6F0E7]">
                  AI Architecture Assistant
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#9A7438]/15 text-[#9A7438] dark:text-[#C29A52] font-semibold">
                  Restrained Pedagogical Audit
                </span>
              </div>
              <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                Analyzing curriculum alignment, Bloom progression, and page budgets for {project.bookTitle}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#71685E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisory Banner */}
        <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60 flex items-center space-x-2.5 text-xs text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Human Editorial Authority:</strong> AI suggestions never silently modify your book project. Inspect, edit, or reject each recommendation below.
          </span>
        </div>

        {/* Suggestions List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {suggestions.map((sugg) => {
            const isApplied = appliedIds[sugg.id];
            const isRejected = rejectedIds[sugg.id];
            const isEditing = editingSuggestionId === sugg.id;

            return (
              <div
                key={sugg.id}
                className={`p-4 rounded-xl border transition-all ${
                  isApplied
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 opacity-85'
                    : isRejected
                    ? 'bg-slate-100/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-50'
                    : 'bg-[#FDFBF7] dark:bg-[#1E1919] border-[#CBBEAC] dark:border-[#5A1832] shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]">
                        {sugg.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-[#71685E] font-mono">
                        Target: {sugg.targetSection}
                      </span>
                      {isApplied && (
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Applied to Draft</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-[10px] font-semibold text-slate-500">
                          Dismissed
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                      {sugg.title}
                    </h4>

                    <p className="text-[#71685E] dark:text-[#D8CCBC] leading-relaxed">
                      {sugg.rationale}
                    </p>

                    <div className="p-2.5 rounded-lg bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 flex items-start space-x-2 text-[11px]">
                      <ArrowRight className="w-3.5 h-3.5 text-[#9A7438] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                          Action:
                        </span>{' '}
                        <span className="text-[#71685E] dark:text-[#D8CCBC]">
                          {sugg.proposedAction}
                        </span>
                      </div>
                    </div>

                    {/* Inline Edit Form */}
                    {isEditing && (
                      <div className="mt-3 p-3 rounded-lg bg-white dark:bg-[#12070e] border border-[#9A7438] space-y-2">
                        <label className="block text-[11px] font-mono font-bold text-[#9A7438]">
                          Edit Proposal Payload Before Applying:
                        </label>
                        <textarea
                          rows={3}
                          value={editedPayloadText}
                          onChange={(e) => setEditedPayloadText(e.target.value)}
                          className="w-full text-xs font-mono p-2 rounded border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] text-[#292521] dark:text-[#F6F0E7] focus:outline-hidden"
                        />
                        <div className="flex items-center space-x-2 justify-end">
                          <button
                            onClick={() => setEditingSuggestionId(null)}
                            className="px-2.5 py-1 rounded text-xs text-[#71685E] hover:bg-black/5"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEditAndApply(sugg)}
                            className="px-3 py-1 rounded bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                          >
                            Save &amp; Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!isApplied && !isRejected && !isEditing && (
                    <div className="flex sm:flex-col gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => handleAccept(sugg)}
                        className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] font-semibold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-[#C29A52]" />
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() => handleStartEdit(sugg)}
                        className="px-3 py-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#35101F] hover:bg-[#CBBEAC] text-[#5A1832] dark:text-[#C29A52] font-semibold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit First</span>
                      </button>

                      <button
                        onClick={() => handleReject(sugg.id)}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-[#71685E] hover:text-red-700 font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#CBBEAC] dark:border-[#5A1832] bg-[#EDE4D6]/50 dark:bg-[#35101F]/40 flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#71685E] dark:text-[#D8CCBC]">
            Applied {Object.keys(appliedIds).length} of {suggestions.length} recommendations
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold hover:bg-[#431225] transition-colors"
          >
            Done &amp; Return to Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
