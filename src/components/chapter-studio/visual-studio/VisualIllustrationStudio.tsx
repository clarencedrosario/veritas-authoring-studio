// =============================================================
// VERITAS Editorial Platform — Visual & Illustration Studio
// Phase 4E-1: Academic Publishing Visual Production Foundation
// =============================================================

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Hash,
  Plus,
  ShieldCheck,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { StudioChapter, TextbookContentBlock } from '../../../types';
import { VisualRecord } from '../../../types/visualStudio';
import {
  getOrCreateChapterVisuals,
  renumberChapterVisuals,
  synchronizeVisualWithChapter,
  evaluateVisualQualityAudit,
} from '../../../utils/visualStudioDefaults';
import { VisualNavigatorPanel } from './VisualNavigatorPanel';
import { VisualWorkspaceCentre } from './VisualWorkspaceCentre';
import { VisualPropertiesPanel } from './VisualPropertiesPanel';
import { NewVisualModal } from './NewVisualModal';
import { RenumberFiguresModal } from './RenumberFiguresModal';

interface VisualIllustrationStudioProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  onClose: () => void;
  initialVisualId?: string;
}

export const VisualIllustrationStudio: React.FC<VisualIllustrationStudioProps> = ({
  chapter,
  onUpdateChapter,
  onClose,
  initialVisualId,
}) => {
  // Retrieve or seed chapter visuals
  const visuals: VisualRecord[] = useMemo(() => {
    return getOrCreateChapterVisuals(chapter);
  }, [chapter]);

  // Selected visual
  const [selectedVisualId, setSelectedVisualId] = useState<string>(() => {
    if (initialVisualId && visuals.some((v) => v.id === initialVisualId)) {
      return initialVisualId;
    }
    return visuals[0]?.id || '';
  });

  // Modals
  const [showNewVisualModal, setShowNewVisualModal] = useState(false);
  const [showRenumberModal, setShowRenumberModal] = useState(false);

  // Active visual record
  const selectedVisual = visuals.find((v) => v.id === selectedVisualId) || visuals[0];

  // Quick statistics
  const approvedCount = visuals.filter(
    (v) => v.status === 'Approved' || v.status === 'Publication Ready'
  ).length;
  const placeholderCount = visuals.filter((v) => v.status === 'Placeholder').length;
  const briefCount = visuals.filter(
    (v) => v.status === 'Brief Required' || v.status === 'Brief Ready'
  ).length;

  // Handler to update a visual
  const handleUpdateVisual = (updated: VisualRecord) => {
    const updatedList = visuals.map((v) => (v.id === updated.id ? updated : v));
    onUpdateChapter({
      ...chapter,
      visualRecords: updatedList,
    });
  };

  // Handler to add a new visual
  const handleAddVisual = (newRecord: VisualRecord) => {
    const updatedList = [...visuals, newRecord];
    onUpdateChapter({
      ...chapter,
      visualRecords: updatedList,
    });
    setSelectedVisualId(newRecord.id);
  };

  // Handler to delete a visual
  const handleDeleteVisual = (idToDelete: string) => {
    const updatedList = visuals.filter((v) => v.id !== idToDelete);
    onUpdateChapter({
      ...chapter,
      visualRecords: updatedList,
    });
    if (selectedVisualId === idToDelete && updatedList.length > 0) {
      setSelectedVisualId(updatedList[0].id);
    }
  };

  // Handler to renumber figures sequentially
  const handleConfirmRenumber = () => {
    const chNum = chapter.chapterNumber || 1;
    const renumbered = renumberChapterVisuals(visuals, chNum);
    onUpdateChapter({
      ...chapter,
      visualRecords: renumbered,
    });
  };

  // Handler to sync a visual into the chapter manuscript
  const handleSyncWithChapter = (
    targetSectionId: string,
    placement: 'before_block' | 'after_block' | 'inside_section' | 'end_of_section',
    targetBlockId?: string
  ) => {
    if (!selectedVisual) return;
    const { updatedChapter } = synchronizeVisualWithChapter(
      chapter,
      selectedVisual,
      targetSectionId,
      placement,
      targetBlockId
    );
    onUpdateChapter(updatedChapter);
  };

  // Audit issues count
  const auditResults = useMemo(
    () => evaluateVisualQualityAudit(visuals, chapter),
    [visuals, chapter]
  );
  const auditWarnings = auditResults.filter((r) => r.status !== 'pass').length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F6F0E7] text-[#292521] font-sans antialiased overflow-hidden select-none">
      {/* ========================================================= */}
      {/* TOP STUDIO HEADER BAR                                     */}
      {/* Inherits: Board, Class, Book, Unit, Chapter, Chapter Title */}
      {/* ========================================================= */}
      <header className="h-14 border-b border-[#CBBEAC] bg-[#FFFDF8] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
        {/* Left: Return to Chapter + Inherited Context */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 rounded-lg border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-xs font-semibold text-[#292521] inline-flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
            title="Return to Chapter Authoring Studio"
          >
            <ArrowLeft className="w-4 h-4 text-[#5A1832]" />
            <span className="hidden sm:inline">Return to Chapter</span>
          </button>

          <div className="h-4 w-px bg-[#CBBEAC] hidden sm:block shrink-0" />

          {/* Context Badges */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 truncate">
            <span className="px-2 py-0.5 rounded-md bg-[#5A1832] text-[#FFFDF8] font-bold text-[10px] uppercase tracking-wider shrink-0">
              {chapter.systemId || 'CBSE'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EDE4D6] text-[#5A1832] font-semibold text-[10px] shrink-0">
              {chapter.equivalentClass || 'Class 3'}
            </span>
            <span className="text-[#71685E] text-xs hidden md:inline shrink-0">
              {chapter.unitTitle || 'Unit 1'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#CBBEAC] hidden md:inline shrink-0" />
            <h2 className="font-bold text-xs sm:text-sm text-[#292521] truncate font-serif">
              Chapter {chapter.chapterNumber || 1}: {chapter.title}
            </h2>
          </div>
        </div>

        {/* Right: Studio Quick Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Renumber Figures Tool */}
          <button
            type="button"
            onClick={() => setShowRenumberModal(true)}
            className="h-8 px-2.5 rounded-lg border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-xs font-semibold text-[#292521] inline-flex items-center space-x-1 transition-colors cursor-pointer"
            title="Sequentially renumber figures (Figure 1.1, Figure 1.2...)"
          >
            <Hash className="w-3.5 h-3.5 text-[#5A1832]" />
            <span className="hidden lg:inline">Renumber Figures</span>
          </button>

          {/* New Visual Action */}
          <button
            type="button"
            onClick={() => setShowNewVisualModal(true)}
            className="h-8 px-3 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-semibold inline-flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Create new textbook visual brief"
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>New Visual</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3-COLUMN WORKSPACE BODY                                   */}
      {/* LEFT: Visual Navigator (w-80)                             */}
      {/* CENTRE: Visual Workspace (flex-1)                         */}
      {/* RIGHT: Visual Properties (w-96)                           */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
        {/* LEFT COLUMN: Visual Navigator */}
        <VisualNavigatorPanel
          visuals={visuals}
          selectedVisualId={selectedVisualId}
          onSelectVisual={(id) => setSelectedVisualId(id)}
          onOpenNewVisualModal={() => setShowNewVisualModal(true)}
          onDeleteVisual={handleDeleteVisual}
        />

        {/* CENTRE COLUMN: Visual Workspace */}
        {selectedVisual ? (
          <VisualWorkspaceCentre
            key={selectedVisual.id}
            visual={selectedVisual}
            chapter={chapter}
            onUpdateVisual={handleUpdateVisual}
            onSyncWithChapter={handleSyncWithChapter}
            visuals={visuals}
            onSelectVisual={(id) => setSelectedVisualId(id)}
            onAddVisual={handleAddVisual}
            onUpdateChapter={onUpdateChapter}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-[#71685E]">
            <div className="max-w-md space-y-3">
              <ImageIcon className="w-12 h-12 text-[#CBBEAC] mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#292521]">No Visual Selected</h3>
              <p className="text-xs">
                Select an existing visual from the navigator on the left, or create a new visual brief.
              </p>
              <button
                type="button"
                onClick={() => setShowNewVisualModal(true)}
                className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#FFFDF8] text-xs font-bold inline-flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4 text-[#C29A52]" />
                <span>Create First Visual</span>
              </button>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Visual Properties & Status */}
        {selectedVisual && (
          <VisualPropertiesPanel
            key={`props-${selectedVisual.id}`}
            visual={selectedVisual}
            chapter={chapter}
            onUpdateVisual={handleUpdateVisual}
          />
        )}
      </div>

      {/* ========================================================= */}
      {/* MODALS                                                    */}
      {/* ========================================================= */}
      <NewVisualModal
        isOpen={showNewVisualModal}
        onClose={() => setShowNewVisualModal(false)}
        chapter={chapter}
        existingCount={visuals.length}
        onAddVisual={handleAddVisual}
      />

      <RenumberFiguresModal
        isOpen={showRenumberModal}
        onClose={() => setShowRenumberModal(false)}
        visuals={visuals}
        chapterNumber={chapter.chapterNumber || 1}
        onConfirmRenumber={handleConfirmRenumber}
      />
    </div>
  );
};
