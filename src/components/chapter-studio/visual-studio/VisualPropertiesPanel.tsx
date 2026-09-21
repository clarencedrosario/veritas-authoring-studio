// =============================================================
// VERITAS Editorial Platform — Visual Properties Panel (Right Column)
// Phase 4E-1: Visual Production Foundation
// =============================================================

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  BookOpen,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  VisualRecord,
  VisualProductionStatus,
  VisualPublishingMetadata,
  VisualReviewChecks,
} from '../../../types/visualStudio';
import { StudioChapter } from '../../../types';

interface VisualPropertiesPanelProps {
  visual: VisualRecord;
  chapter: StudioChapter;
  onUpdateVisual: (updated: VisualRecord) => void;
}

export const VisualPropertiesPanel: React.FC<VisualPropertiesPanelProps> = ({
  visual,
  chapter,
  onUpdateVisual,
}) => {
  // Collapsible section state
  const [openSection, setOpenSection] = useState<{
    status: boolean;
    metadata: boolean;
    exercise: boolean;
    review: boolean;
    audit: boolean;
  }>({
    status: true,
    metadata: true,
    exercise: true,
    review: false,
    audit: true,
  });

  const toggleSection = (key: keyof typeof openSection) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Status progression
  const handleStatusChange = (newStatus: VisualProductionStatus) => {
    const historyItem = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: `Status updated to ${newStatus}`,
      author: 'Editorial Desk',
    };

    onUpdateVisual({
      ...visual,
      status: newStatus,
      statusHistory: [...visual.statusHistory, historyItem],
    });
  };

  // Metadata updates
  const handleMetadataChange = (field: keyof VisualPublishingMetadata, val: string) => {
    onUpdateVisual({
      ...visual,
      metadata: {
        ...visual.metadata,
        [field]: val,
      },
      // Keep top-level figureNumber in sync
      ...(field === 'figureNumber' ? { figureNumber: val } : {}),
    });
  };

  // Review check toggle
  const handleCheckToggle = (checkKey: keyof VisualReviewChecks) => {
    const currentVal = visual.review.reviewChecks[checkKey];
    onUpdateVisual({
      ...visual,
      review: {
        ...visual.review,
        reviewChecks: {
          ...visual.review.reviewChecks,
          [checkKey]: !currentVal,
        },
      },
    });
  };

  // Calculate quick visual health for the audit box
  const hasBrief = !!visual.brief?.description && visual.brief.description.trim().length > 30;
  const hasArtwork = !!visual.currentAsset?.artworkUrl;
  const hasCaption = !!visual.metadata?.caption && visual.metadata.caption.trim().length > 5;
  const hasAltText = !!visual.metadata?.altText && visual.metadata.altText.trim().length > 8;
  const hasCopyright = !!visual.metadata?.copyrightStatus && !!visual.metadata?.creditSource;
  const isApproved = visual.status === 'Approved' || visual.status === 'Publication Ready';

  return (
    <aside className="w-96 border-l border-[#CBBEAC] bg-[#F6F0E7] flex flex-col min-h-0 flex-shrink-0">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[#CBBEAC] bg-[#FFFDF8] flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
          Properties &amp; Production
        </span>
        <span className="font-mono text-xs font-bold text-[#5A1832]">
          {visual.figureNumber}
        </span>
      </div>

      {/* Properties Scroll Body (Independent vertical scroll) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3.5">
        {/* ========================================================= */}
        {/* 1. PRODUCTION STATUS & WORKFLOW                           */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('status')}
            className="w-full px-3.5 py-2.5 bg-[#EDE4D6] text-left flex items-center justify-between font-bold text-xs text-[#5A1832] cursor-pointer"
          >
            <span>Production Workflow Status</span>
            {openSection.status ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection.status && (
            <div className="p-3.5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#292521] mb-1">
                  Current Lifecycle Status:
                </label>
                <select
                  value={visual.status}
                  onChange={(e) => handleStatusChange(e.target.value as VisualProductionStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] font-semibold text-[#5A1832] focus:outline-none focus:border-[#5A1832]"
                >
                  <option value="Brief Required">Brief Required</option>
                  <option value="Brief Ready">Brief Ready</option>
                  <option value="Placeholder">Placeholder</option>
                  <option value="Artwork Requested">Artwork Requested</option>
                  <option value="Draft Artwork">Draft Artwork</option>
                  <option value="Editorial Review">Editorial Review</option>
                  <option value="Revision Required">Revision Required</option>
                  <option value="Approved">Approved</option>
                  <option value="Publication Ready">Publication Ready</option>
                </select>
              </div>

              {/* Status History */}
              <div>
                <span className="font-bold text-[11px] text-[#71685E] block mb-1">
                  Status History ({visual.statusHistory?.length || 0})
                </span>
                <div className="max-h-28 overflow-y-auto space-y-1.5 p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[11px]">
                  {visual.statusHistory?.map((sh, idx) => (
                    <div key={idx} className="border-b border-[#CBBEAC]/40 pb-1 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between text-[#5A1832] font-semibold">
                        <span>{sh.status}</span>
                        <span className="font-mono text-[9px] text-[#71685E]">
                          {new Date(sh.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#292521]">{sh.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 2. TEXTBOOK PUBLISHING METADATA                           */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('metadata')}
            className="w-full px-3.5 py-2.5 bg-[#EDE4D6] text-left flex items-center justify-between font-bold text-xs text-[#5A1832] cursor-pointer"
          >
            <span>Publishing &amp; Citation Metadata</span>
            {openSection.metadata ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection.metadata && (
            <div className="p-3.5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#292521] mb-1">
                  Figure Number (Manual Override)
                </label>
                <input
                  type="text"
                  value={visual.metadata.figureNumber}
                  onChange={(e) => handleMetadataChange('figureNumber', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] font-mono text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#292521] mb-1">
                  Reader-Facing Caption *
                </label>
                <textarea
                  rows={2}
                  value={visual.metadata.caption}
                  onChange={(e) => handleMetadataChange('caption', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
                <span className="text-[10px] text-[#71685E]">
                  Printed directly below visual in textbook student &amp; teacher editions.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#292521]">
                    Accessibility Alt-Text *
                  </label>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#EDE4D6] text-[#5A1832]">
                    Screen Readers
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={visual.metadata.altText}
                  onChange={(e) => handleMetadataChange('altText', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
                <span className="text-[10px] text-[#71685E]">
                  Describes visual meaning for visually impaired learners. Kept strictly distinct from caption.
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#292521] mb-1">
                  Credit / Attribution Source
                </label>
                <input
                  type="text"
                  value={visual.metadata.creditSource}
                  onChange={(e) => handleMetadataChange('creditSource', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#292521] mb-1">
                    Copyright Status
                  </label>
                  <select
                    value={visual.metadata.copyrightStatus}
                    onChange={(e) => handleMetadataChange('copyrightStatus', e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  >
                    <option value="Original Commission">Original Commission</option>
                    <option value="In-House Editorial">In-House Editorial</option>
                    <option value="Licensed">Licensed</option>
                    <option value="Public Domain">Public Domain</option>
                    <option value="Creative Commons">Creative Commons</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#292521] mb-1">
                    Creator / Illustrator
                  </label>
                  <input
                    type="text"
                    value={visual.metadata.creatorIllustrator}
                    onChange={(e) => handleMetadataChange('creatorIllustrator', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#292521] mb-1">
                  Final Production Filename
                </label>
                <input
                  type="text"
                  value={visual.metadata.finalAssetFilename || ''}
                  onChange={(e) => handleMetadataChange('finalAssetFilename', e.target.value)}
                  placeholder="e.g. cbse_c3_u1_fig1_1.png"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] font-mono text-[11px] text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 3. PICTURE-BASED EXERCISE STIMULUS                        */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('exercise')}
            className="w-full px-3.5 py-2.5 bg-[#EDE4D6] text-left flex items-center justify-between font-bold text-xs text-[#5A1832] cursor-pointer"
          >
            <span>Picture-Based Exercise Stimulus</span>
            {openSection.exercise ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection.exercise && (
            <div className="p-3.5 space-y-3 text-xs">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="stimulusToggle"
                  checked={visual.isExerciseStimulus || false}
                  onChange={(e) => onUpdateVisual({ ...visual, isExerciseStimulus: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5A1832] accent-[#5A1832]"
                />
                <label htmlFor="stimulusToggle" className="font-bold text-[#292521] cursor-pointer">
                  Link Visual as Exercise Stimulus
                </label>
              </div>

              {visual.isExerciseStimulus && (
                <div className="space-y-2 pt-1 border-t border-[#CBBEAC]/50">
                  <div>
                    <label className="block text-[11px] font-bold text-[#71685E] mb-1">
                      Linked Chapter Exercise:
                    </label>
                    <select
                      value={visual.linkedExerciseId || ''}
                      onChange={(e) => onUpdateVisual({ ...visual, linkedExerciseId: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                    >
                      <option value="">-- Select Chapter Exercise --</option>
                      {chapter.exercises?.map((ex, idx) => (
                        <option key={ex.id} value={ex.id}>
                          Exercise {idx + 1}: {ex.title || ex.instructions?.slice(0, 30)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#71685E] mb-1">
                      Student Stimulus Prompt:
                    </label>
                    <textarea
                      rows={2}
                      value={visual.stimulusPrompt || ''}
                      onChange={(e) => onUpdateVisual({ ...visual, stimulusPrompt: e.target.value })}
                      placeholder="e.g. Look at Figure 1.1 and write down four common nouns you see..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 4. EDITORIAL REVIEW & SIGN-OFF                            */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('review')}
            className="w-full px-3.5 py-2.5 bg-[#EDE4D6] text-left flex items-center justify-between font-bold text-xs text-[#5A1832] cursor-pointer"
          >
            <span>Editorial Review Checklist (9 Criteria)</span>
            {openSection.review ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection.review && (
            <div className="p-3.5 space-y-3 text-xs">
              <div className="space-y-1.5">
                {(
                  [
                    ['educationalAccuracy', 'Educational Accuracy & Pedagogy'],
                    ['grammarAccuracy', 'Grammar Concept Correctness'],
                    ['ageAppropriateness', 'Age-Appropriateness (Class 3)'],
                    ['visualClarity', 'Visual Clarity & Graphic Hierarchy'],
                    ['captionAccuracy', 'Caption Accuracy'],
                    ['labelAccuracy', 'Artwork Labels & Spelling'],
                    ['accessibility', 'Accessibility & Alt-Text Quality'],
                    ['boardRelevance', 'Curriculum & Board Relevance'],
                    ['publicationSuitability', 'Print & Publication Suitability'],
                  ] as [keyof VisualReviewChecks, string][]
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 py-0.5 cursor-pointer text-[#292521]"
                  >
                    <input
                      type="checkbox"
                      checked={visual.review.reviewChecks[key] || false}
                      onChange={() => handleCheckToggle(key)}
                      className="w-3.5 h-3.5 rounded text-[#5A1832] accent-[#5A1832]"
                    />
                    <span className="text-[11px]">{label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2 border-t border-[#CBBEAC]/50">
                <label className="block font-bold text-[#292521] mb-1">Review Notes</label>
                <textarea
                  rows={2}
                  value={visual.review.reviewNotes}
                  onChange={(e) =>
                    onUpdateVisual({
                      ...visual,
                      review: { ...visual.review, reviewNotes: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 5. VISUAL QUALITY AUDIT DIAGNOSTICS                       */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('audit')}
            className="w-full px-3.5 py-2.5 bg-[#EDE4D6] text-left flex items-center justify-between font-bold text-xs text-[#5A1832] cursor-pointer"
          >
            <span>Visual Quality Audit Diagnosis</span>
            {openSection.audit ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection.audit && (
            <div className="p-3.5 space-y-2 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Visual Brief Complete:</span>
                  <span className={hasBrief ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {hasBrief ? 'Pass' : 'Incomplete'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Artwork Asset Status:</span>
                  <span className={hasArtwork ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {hasArtwork ? 'Artwork Ready' : 'Pending / Placeholder'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Reader Caption Present:</span>
                  <span className={hasCaption ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                    {hasCaption ? 'Pass' : 'Missing'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Accessibility Alt-Text:</span>
                  <span className={hasAltText ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {hasAltText ? 'Pass' : 'Missing Alt-Text'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Copyright &amp; Attribution:</span>
                  <span className={hasCopyright ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {hasCopyright ? 'Resolved' : 'Needs Attribution'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Publication Approval:</span>
                  <span className={isApproved ? 'text-emerald-700 font-bold' : 'text-stone-600 font-bold'}>
                    {isApproved ? 'Approved' : 'Pending Sign-Off'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
