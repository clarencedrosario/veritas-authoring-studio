import React, { useState } from 'react';
import {
  Layers,
  X,
  Check,
  RotateCcw,
  Sliders,
  AlertCircle,
  FileText,
  BookOpen,
  Info,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  StudioChapter,
  ArchitectureComponentStatus,
  ChapterComponentCustomization,
} from '../../../types';
import {
  BookArchitectureConfig,
  ChapterComponentAnatomy,
} from '../../book-planner/architecture/types';
import {
  getArchitectureCompletionStats,
  calculateComponentStatus,
} from './chapterArchitectureBridge';

interface ChapterArchitectureCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  architecture: BookArchitectureConfig;
  onUpdateChapter: (updated: StudioChapter) => void;
  isDarkMode: boolean;
}

export const ChapterArchitectureCustomizerModal: React.FC<ChapterArchitectureCustomizerModalProps> = ({
  isOpen,
  onClose,
  chapter,
  architecture,
  onUpdateChapter,
  isDarkMode,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>(
    architecture.chapterArchitecture?.components?.[0]?.id || 'comp-1'
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Local snapshot of customizations
  const [customizations, setCustomizations] = useState<
    Record<string, ChapterComponentCustomization>
  >(chapter.architectureState?.customizations || {});

  if (!isOpen) return null;

  const components = architecture.chapterArchitecture?.components || [];
  const selectedComponent =
    components.find((c) => c.id === selectedCompId) || components[0];

  const currentCustom = customizations[selectedCompId] || {
    componentId: selectedCompId,
    name: selectedComponent?.name,
    status: calculateComponentStatus(chapter, selectedComponent, 0),
    isCustomized: false,
    allocatedPages: selectedComponent?.defaultEstimatedPages,
    notes: '',
  };

  const stats = getArchitectureCompletionStats(chapter, architecture);

  const handleUpdateCurrentCustom = (
    field: keyof ChapterComponentCustomization,
    value: any
  ) => {
    const updated: ChapterComponentCustomization = {
      ...currentCustom,
      [field]: value,
      isCustomized: true,
    };
    const nextCustoms = {
      ...customizations,
      [selectedCompId]: updated,
    };
    setCustomizations(nextCustoms);
    setHasUnsavedChanges(true);
  };

  const handleRestoreDefault = (compId: string) => {
    const targetComp = components.find((c) => c.id === compId);
    if (!targetComp) return;

    const nextCustoms = { ...customizations };
    delete nextCustoms[compId];
    setCustomizations(nextCustoms);
    setHasUnsavedChanges(true);
  };

  const handleApplyAllChanges = () => {
    const isAnyCustomized = Object.values(customizations).some((c) => c.isCustomized);
    onUpdateChapter({
      ...chapter,
      architectureState: {
        ...chapter.architectureState,
        inheritedFromBookId:
          chapter.architectureState?.inheritedFromBookId ||
          architecture.purposePositioning?.targetLearner?.classOrStage ||
          'CBSE-6',
        architectureVersion: architecture.version || '1.0.0',
        hasPendingUpdate: false,
        isCustomized: isAnyCustomized,
        customizations,
      },
      lastSaved: new Date().toISOString(),
      saveStatus: 'saved',
    });
    setHasUnsavedChanges(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
          isDarkMode
            ? 'bg-[#1C1719] border-[#5A1832] text-[#F6F0E7]'
            : 'bg-[#FDFBF7] border-[#CBBEAC] text-[#292521]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between shrink-0 ${
            isDarkMode
              ? 'bg-[#2A1620] border-[#5A1832]'
              : 'bg-[#EDE4D6] border-[#CBBEAC]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#5A1832] text-[#C29A52]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif font-bold text-base text-[#5A1832] dark:text-[#C29A52]">
                  Chapter Architecture Governance
                </h2>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#5A1832]/10 dark:bg-[#5A1832]/40 text-[#5A1832] dark:text-[#C29A52] border border-[#5A1832]/30">
                  Inherited from Book Architecture
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                Govern chapter components against the master specification. Chapter customizations never alter the global Book Architecture.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] dark:hover:text-[#F6F0E7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completion Bar Summary */}
        <div className="px-5 py-3 bg-[#F6F0E7] dark:bg-[#23151D] border-b border-[#CBBEAC]/60 dark:border-[#5A1832]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-[#5A1832] dark:text-[#C29A52]">
              Completion: {stats.completedRequired} / {stats.totalRequired} Required Components Complete ({stats.requiredPercent}%)
            </span>
            <div className="w-36 h-2 bg-[#CBBEAC]/50 dark:bg-[#35101F] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5A1832] dark:bg-[#C29A52] transition-all"
                style={{ width: `${stats.requiredPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#71685E] dark:text-[#D8CCBC]">
            <span>Content: {stats.breakdown.content.complete}/{stats.breakdown.content.total}</span>
            <span>&bull;</span>
            <span>Practice: {stats.breakdown.practice.complete}/{stats.breakdown.practice.total}</span>
            <span>&bull;</span>
            <span>Assess: {stats.breakdown.assessment.complete}/{stats.breakdown.assessment.total}</span>
            <span>&bull;</span>
            <span>Visuals: {stats.breakdown.visuals.complete}/{stats.breakdown.visuals.total}</span>
            <span>&bull;</span>
            <span>Teacher: {stats.breakdown.teacher.complete}/{stats.breakdown.teacher.total}</span>
          </div>
        </div>

        {/* Split Body: Left Components List, Right Customization Pane */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Column: 23 Components */}
          <div className="w-80 border-r border-[#CBBEAC]/60 dark:border-[#5A1832]/60 overflow-y-auto p-3 space-y-1.5 shrink-0">
            <div className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#D8CCBC] px-2 mb-1">
              Standard Components ({components.length})
            </div>
            {components.map((comp, idx) => {
              const isSelected = comp.id === selectedCompId;
              const isCustom = !!customizations[comp.id]?.isCustomized;
              const status =
                customizations[comp.id]?.status ||
                calculateComponentStatus(chapter, comp, idx);

              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#5A1832] text-[#F6F0E7] border-[#5A1832] shadow-xs'
                      : 'bg-white/60 dark:bg-[#251520] hover:bg-white dark:hover:bg-[#35101F] border-[#CBBEAC]/50 dark:border-[#5A1832]/50 text-[#292521] dark:text-[#F6F0E7]'
                  }`}
                >
                  <div className="flex items-start space-x-2 min-w-0 pr-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isSelected
                          ? 'bg-[#C29A52] text-[#292521]'
                          : 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs truncate">{comp.name}</p>
                      <div className="flex items-center space-x-1.5 text-[10px] opacity-80 mt-0.5">
                        <span className="capitalize">{comp.category}</span>
                        <span>&bull;</span>
                        <span>{comp.defaultEstimatedPages} pp</span>
                        {comp.isRequired && (
                          <span className="text-[9px] font-bold uppercase text-amber-500">Req</span>
                        )}
                        {isCustom && (
                          <span className="text-[9px] font-bold uppercase text-emerald-400">Custom</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      status === 'complete'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : status === 'drafting'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : status === 'needs_review'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : status === 'not_applicable'
                        ? 'bg-stone-500/20 text-stone-400 border border-stone-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
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
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Customization Panel for Selected Component */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {selectedComponent ? (
              <div className="space-y-6">
                {/* Header for Component */}
                <div className="flex items-start justify-between border-b border-[#CBBEAC]/60 dark:border-[#5A1832]/60 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#C29A52]">
                        Component #{components.indexOf(selectedComponent) + 1}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#5A1832] dark:text-[#F6F0E7]">
                        {selectedComponent.name}
                      </h3>
                      {selectedComponent.isRequired ? (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold">
                          Mandatory Component
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-500/20 text-stone-400 border border-stone-500/30 font-bold">
                          Optional Component
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-1">
                      {selectedComponent.description || 'Core anatomical textbook block prescribed in book architecture.'}
                    </p>
                  </div>

                  {currentCustom.isCustomized && (
                    <button
                      onClick={() => handleRestoreDefault(selectedComponent.id)}
                      className="px-3 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#C29A52] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Default</span>
                    </button>
                  )}
                </div>

                {/* Status and Edition Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#251520] border border-[#CBBEAC]/60 dark:border-[#5A1832]/60 space-y-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#D8CCBC] block">
                      Chapter Completion Status
                    </label>
                    <select
                      value={currentCustom.status}
                      onChange={(e) =>
                        handleUpdateCurrentCustom(
                          'status',
                          e.target.value as ArchitectureComponentStatus
                        )
                      }
                      className="w-full bg-white dark:bg-[#1C1719] text-xs font-semibold p-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832]"
                    >
                      <option value="not_started">Not Started (Pending Authoring)</option>
                      <option value="drafting">Drafting (In Progress)</option>
                      <option value="complete">Complete (Meets Architecture Specification)</option>
                      <option value="needs_review">Needs Review (Editorial Attention Required)</option>
                      <option value="not_applicable">Not Applicable (Omitted for this Chapter)</option>
                    </select>
                    <p className="text-[10px] text-[#71685E] dark:text-[#D8CCBC] italic">
                      Setting to &quot;Not Applicable&quot; removes this component from the chapter&apos;s required denominator.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#251520] border border-[#CBBEAC]/60 dark:border-[#5A1832]/60 space-y-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#D8CCBC] block">
                      Estimated Page Allocation
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.25"
                        min="0.25"
                        max="5"
                        value={currentCustom.allocatedPages ?? selectedComponent.defaultEstimatedPages}
                        onChange={(e) =>
                          handleUpdateCurrentCustom(
                            'allocatedPages',
                            parseFloat(e.target.value) || 0.5
                          )
                        }
                        className="w-24 bg-white dark:bg-[#1C1719] text-xs font-bold font-mono p-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832]"
                      />
                      <span className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
                        Pages (Book default: {selectedComponent.defaultEstimatedPages} pp)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chapter-Specific Customization Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#D8CCBC] block mb-1">
                      Custom Component Name / Title for this Chapter
                    </label>
                    <input
                      type="text"
                      value={currentCustom.name || selectedComponent.name}
                      onChange={(e) => handleUpdateCurrentCustom('name', e.target.value)}
                      className="w-full bg-white dark:bg-[#1C1719] text-xs font-medium p-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832]"
                      placeholder={selectedComponent.name}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#D8CCBC] block mb-1">
                      Author &amp; Editorial Pedagogical Notes for this Component
                    </label>
                    <textarea
                      rows={3}
                      value={currentCustom.notes || ''}
                      onChange={(e) => handleUpdateCurrentCustom('notes', e.target.value)}
                      className="w-full bg-white dark:bg-[#1C1719] text-xs p-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832]"
                      placeholder="e.g. Focus specifically on collective nouns acting as single units versus distinct members."
                    />
                  </div>
                </div>

                {/* Inheritance Safety Callout */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Non-Destructive Guarantee:</strong> Customising this component modifies the local chapter governance overlay only. It will never overwrite the book-level architectural blueprint or affect other chapters in the series.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between shrink-0 ${
            isDarkMode
              ? 'bg-[#2A1620] border-[#5A1832]'
              : 'bg-[#EDE4D6] border-[#CBBEAC]'
          }`}
        >
          <div className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
            {hasUnsavedChanges ? (
              <span className="text-amber-500 font-semibold">Unsaved chapter customizations</span>
            ) : (
              <span>Synchronized with Chapter Studio</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-[#71685E] hover:text-[#292521] dark:hover:text-[#F6F0E7]"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyAllChanges}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#5A1832] text-[#F6F0E7] hover:bg-[#431225] transition-colors shadow-xs"
            >
              Apply to Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
