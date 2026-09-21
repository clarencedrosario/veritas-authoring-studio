// =============================================================
// VERITAS Editorial Platform — Visual Navigator Panel (Left Column)
// Phase 4E-1: Visual Production Foundation
// =============================================================

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Trash2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import {
  VisualRecord,
  VisualType,
  VisualProductionStatus,
} from '../../../types/visualStudio';

interface VisualNavigatorPanelProps {
  visuals: VisualRecord[];
  selectedVisualId: string;
  onSelectVisual: (id: string) => void;
  onOpenNewVisualModal: () => void;
  onDeleteVisual: (id: string) => void;
}

type FilterStatusGroup =
  | 'All'
  | 'Briefs'
  | 'Placeholders'
  | 'Drafts'
  | 'In Review'
  | 'Approved'
  | 'Publication Ready';

export const VisualNavigatorPanel: React.FC<VisualNavigatorPanelProps> = ({
  visuals,
  selectedVisualId,
  onSelectVisual,
  onOpenNewVisualModal,
  onDeleteVisual,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatusGroup>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Filtered visuals
  const filteredVisuals = visuals.filter((vis) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = vis.title.toLowerCase().includes(q);
      const matchFig = vis.figureNumber.toLowerCase().includes(q);
      const matchType = vis.visualType.toLowerCase().includes(q);
      const matchBrief = vis.brief?.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchFig && !matchType && !matchBrief) return false;
    }

    // Status filter
    if (statusFilter === 'Briefs') {
      if (vis.status !== 'Brief Required' && vis.status !== 'Brief Ready') return false;
    } else if (statusFilter === 'Placeholders') {
      if (vis.status !== 'Placeholder') return false;
    } else if (statusFilter === 'Drafts') {
      if (vis.status !== 'Artwork Requested' && vis.status !== 'Draft Artwork') return false;
    } else if (statusFilter === 'In Review') {
      if (vis.status !== 'Editorial Review' && vis.status !== 'Revision Required') return false;
    } else if (statusFilter === 'Approved') {
      if (vis.status !== 'Approved') return false;
    } else if (statusFilter === 'Publication Ready') {
      if (vis.status !== 'Publication Ready') return false;
    }

    // Type filter
    if (typeFilter !== 'All' && vis.visualType !== typeFilter) {
      return false;
    }

    return true;
  });

  // Helper for status badge style
  const getStatusBadge = (status: VisualProductionStatus) => {
    switch (status) {
      case 'Publication Ready':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Approved':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Editorial Review':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Revision Required':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Draft Artwork':
      case 'Artwork Requested':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Placeholder':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Brief Ready':
        return 'bg-[#EDE4D6] text-[#5A1832] border-[#CBBEAC] font-semibold';
      case 'Brief Required':
      default:
        return 'bg-stone-200 text-stone-700 border-stone-300';
    }
  };

  // Distinct visual types present in chapter
  const availableTypes = Array.from(new Set(visuals.map((v) => v.visualType)));

  return (
    <aside className="w-80 border-r border-[#CBBEAC] bg-[#F6F0E7] flex flex-col min-h-0 flex-shrink-0">
      {/* Header & New Action */}
      <div className="p-3.5 border-b border-[#CBBEAC] bg-[#FFFDF8] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#5A1832]" />
          <span className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
            Visual Library ({visuals.length})
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenNewVisualModal}
          className="h-7 px-2.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-semibold inline-flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
          title="Create New Chapter Visual Brief"
        >
          <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
          <span>New Visual</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-3 border-b border-[#CBBEAC] space-y-2 bg-[#FFFDF8]/70">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#71685E] absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search figures, titles, briefs..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] placeholder-[#71685E] focus:outline-none focus:border-[#5A1832]"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          {(
            [
              'All',
              'Briefs',
              'Placeholders',
              'Drafts',
              'In Review',
              'Approved',
              'Publication Ready',
            ] as FilterStatusGroup[]
          ).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#5A1832] text-[#FFFDF8] font-bold shadow-2xs'
                  : 'bg-[#EDE4D6] text-[#71685E] hover:text-[#292521] hover:bg-[#CBBEAC]/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Visual Type Dropdown Filter */}
        {availableTypes.length > 1 && (
          <div className="flex items-center space-x-1.5 text-xs">
            <Filter className="w-3 h-3 text-[#71685E] shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2 py-1 rounded-md border border-[#CBBEAC] bg-[#F6F0E7] text-[11px] text-[#292521] focus:outline-none focus:border-[#5A1832]"
            >
              <option value="All">All Visual Types ({visuals.length})</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {t} ({visuals.filter((v) => v.visualType === t).length})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Visual Cards List (Independent vertical scroll) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 divide-y-0">
        {filteredVisuals.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#71685E] space-y-2">
            <ImageIcon className="w-8 h-8 text-[#CBBEAC] mx-auto" />
            <p className="font-medium">No visuals match your filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setTypeFilter('All');
              }}
              className="text-[#5A1832] underline hover:text-[#35101F] text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredVisuals.map((vis) => {
            const isSelected = vis.id === selectedVisualId;
            return (
              <div
                key={vis.id}
                onClick={() => onSelectVisual(vis.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-[#5A1832] bg-[#FFFDF8] shadow-sm ring-1 ring-[#5A1832]'
                    : 'border-[#CBBEAC] bg-[#FFFDF8]/80 hover:bg-[#FFFDF8] hover:border-[#9A7438]'
                }`}
              >
                {/* Card Top Row: Figure Number + Status Pill */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className="font-mono font-bold text-xs text-[#5A1832]">
                    {vis.figureNumber}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusBadge(
                      vis.status
                    )}`}
                  >
                    {vis.status}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-xs text-[#292521] line-clamp-1 group-hover:text-[#5A1832] mb-1">
                  {vis.title}
                </h4>

                {/* Visual Type & Location */}
                <div className="flex flex-wrap items-center gap-1 text-[10px] text-[#71685E] mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-mono">
                    {vis.visualType}
                  </span>
                  {vis.associatedSectionTitle && (
                    <span className="truncate max-w-[120px]" title={vis.associatedSectionTitle}>
                      • {vis.associatedSectionTitle}
                    </span>
                  )}
                  {vis.isExerciseStimulus && (
                    <span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                      Exercise Stimulus
                    </span>
                  )}
                </div>

                {/* Thumbnail / Specimen Indicator */}
                <div className="flex items-center justify-between pt-1 border-t border-[#CBBEAC]/50 text-[10px] text-[#71685E]">
                  <div className="flex items-center space-x-1.5">
                    {vis.currentAsset?.artworkUrl ? (
                      <span className="text-emerald-700 font-semibold inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Artwork Present</span>
                      </span>
                    ) : vis.status === 'Placeholder' ? (
                      <span className="text-amber-700 font-semibold inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Placeholder</span>
                      </span>
                    ) : (
                      <span className="text-stone-500 font-medium inline-flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>Brief Stage</span>
                      </span>
                    )}
                  </div>

                  {/* Delete quick action (only if more than 1 visual) */}
                  {visuals.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove ${vis.figureNumber}: "${vis.title}" from this chapter?`)) {
                          onDeleteVisual(vis.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 transition-opacity cursor-pointer"
                      title="Remove Visual"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#CBBEAC] bg-[#EDE4D6] text-[11px] text-[#71685E] flex items-center justify-between">
        <span>{filteredVisuals.length} shown of {visuals.length} total</span>
        <span className="font-mono text-[#5A1832] font-semibold">
          {visuals.filter((v) => v.status === 'Approved' || v.status === 'Publication Ready').length} Approved
        </span>
      </div>
    </aside>
  );
};
