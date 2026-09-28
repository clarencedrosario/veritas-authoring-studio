import React, { useState, useRef } from 'react';
import { GrammarTopic, ClassCurriculumBook } from '../../../types';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
  BookOpen,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { insertChapterAt, reorderChaptersList } from './chapterReorderUtils';

interface ReorderChaptersModalProps {
  currentBook: ClassCurriculumBook;
  topics: GrammarTopic[];
  onApplyReorder: (newTopics: GrammarTopic[]) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ReorderChaptersModal: React.FC<ReorderChaptersModalProps> = ({
  currentBook,
  topics: initialTopics,
  onApplyReorder,
  onClose,
  isDarkMode,
}) => {
  const [localTopics, setLocalTopics] = useState<GrammarTopic[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('after');
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedId === targetId) {
      setDragOverId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';

    setDragOverId(targetId);
    setDropPosition(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the current target container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const reordered = insertChapterAt(localTopics, draggedId, targetId, dropPosition);
    setLocalTopics(reordered);
    setHasChanges(true);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  // Keyboard / Click reorder actions
  const handleMove = (index: number, direction: 'up' | 'down' | 'top' | 'bottom') => {
    let targetIndex = index;
    if (direction === 'up') targetIndex = index - 1;
    else if (direction === 'down') targetIndex = index + 1;
    else if (direction === 'top') targetIndex = 0;
    else if (direction === 'bottom') targetIndex = localTopics.length - 1;

    if (targetIndex < 0 || targetIndex >= localTopics.length || targetIndex === index) return;

    const reordered = reorderChaptersList(localTopics, index, targetIndex);
    setLocalTopics(reordered);
    setHasChanges(true);
  };

  const handleReset = () => {
    setLocalTopics(initialTopics);
    setHasChanges(false);
  };

  const handleSaveAndApply = () => {
    onApplyReorder(localTopics);
    onClose();
  };

  // Filtered list for search, but drag works in full context
  const filteredTopics = localTopics.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.overview && t.overview.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#FAF8F2] dark:bg-[#151C2C] text-[#292521] dark:text-[#F6F0E7] rounded-2xl shadow-2xl border border-[#CBBEAC] dark:border-slate-700 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#CBBEAC]/70 dark:border-slate-800 bg-[#F6F0E7] dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                  Textbook Curriculum Architecture
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A1832]/10 text-[#5A1832] dark:text-[#C29A52]">
                  {localTopics.length} Chapters
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-[#292521] dark:text-slate-100">
                Reorder Chapters — {currentBook.title || currentBook.classLevel}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71685E] hover:text-[#5A1832] dark:hover:text-white hover:bg-[#EDE4D6] dark:hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guidance Banner */}
        <div className="px-5 py-3 bg-[#EDE4D6]/70 dark:bg-slate-800/60 border-b border-[#CBBEAC]/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-2 text-[#71685E] dark:text-slate-300">
            <Info className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52] shrink-0" />
            <span>
              Drag chapters using the grip handles <GripVertical className="w-3.5 h-3.5 inline text-[#9A7438]" /> or use the arrow buttons. Pagination, table of contents, and running headers will recalculate upon applying.
            </span>
          </div>
          {hasChanges && (
            <span className="shrink-0 px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
              Unsaved Order Changes
            </span>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 border-b border-[#CBBEAC]/40 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Filter chapters by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-[#CBBEAC]/70 dark:border-slate-700 rounded-lg text-xs text-[#292521] dark:text-slate-200 outline-none focus:border-[#5A1832]"
            />
            <Search className="w-3.5 h-3.5 text-[#71685E] absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center space-x-2">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-slate-700 text-[#71685E] dark:text-slate-300 hover:bg-[#EDE4D6] text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Reset to original order"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Chapters Draggable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredTopics.length === 0 ? (
            <div className="py-12 text-center text-[#71685E] dark:text-slate-400 italic text-xs">
              No chapters match "{searchQuery}"
            </div>
          ) : (
            filteredTopics.map((topic, fIdx) => {
              // Find index in master localTopics
              const masterIndex = localTopics.findIndex((t) => t.id === topic.id);
              const isDragged = draggedId === topic.id;
              const isDragOver = dragOverId === topic.id;
              const questionsCount = topic.exercises?.reduce(
                (sum, ex) => sum + (ex.questions?.length || 0),
                0
              ) || 0;

              return (
                <div key={topic.id} className="relative">
                  {/* Drop Indicator Bar Above */}
                  {isDragOver && dropPosition === 'before' && (
                    <div className="h-1 bg-[#5A1832] dark:bg-[#C29A52] rounded-full my-1 shadow-sm transition-all animate-pulse" />
                  )}

                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, topic.id)}
                    onDragOver={(e) => handleDragOver(e, topic.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, topic.id)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                      isDragged
                        ? 'opacity-40 border-dashed border-[#5A1832] bg-[#EDE4D6]/50 dark:bg-slate-800/50 scale-[0.99]'
                        : 'border-[#CBBEAC]/70 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-[#9A7438] hover:shadow-xs'
                    }`}
                  >
                    {/* Left: Drag Handle, Number Badge, Title */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {/* Drag Handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing p-1 text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#C29A52] rounded transition-colors"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Chapter Number Badge */}
                      <div className="shrink-0 w-12 text-center">
                        <span className="font-mono font-bold text-xs px-2 py-1 rounded-md bg-[#EDE4D6] dark:bg-slate-700 text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC]/40 dark:border-slate-600 block">
                          Ch {masterIndex + 1}
                        </span>
                      </div>

                      {/* Chapter Title & Category */}
                      <div className="min-w-0 flex-1">
                        <div className="font-serif font-bold text-sm text-[#292521] dark:text-slate-100 truncate">
                          {topic.title}
                        </div>
                        <div className="text-[11px] text-[#71685E] dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                          <span className="font-mono text-[#9A7438] dark:text-[#C29A52]">
                            {topic.category || 'Curriculum Domain'}
                          </span>
                          <span>&bull;</span>
                          <span>{topic.exercises?.length || 0} exercises</span>
                          <span>&bull;</span>
                          <span>{questionsCount} questions</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Move Action Buttons */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleMove(masterIndex, 'top')}
                        disabled={masterIndex === 0}
                        className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-slate-700 disabled:opacity-20 transition-colors"
                        title="Move to First Chapter"
                      >
                        <ChevronsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(masterIndex, 'up')}
                        disabled={masterIndex === 0}
                        className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-slate-700 disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(masterIndex, 'down')}
                        disabled={masterIndex === localTopics.length - 1}
                        className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-slate-700 disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(masterIndex, 'bottom')}
                        disabled={masterIndex === localTopics.length - 1}
                        className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-slate-700 disabled:opacity-20 transition-colors"
                        title="Move to Last Chapter"
                      >
                        <ChevronsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Drop Indicator Bar Below */}
                  {isDragOver && dropPosition === 'after' && (
                    <div className="h-1 bg-[#5A1832] dark:bg-[#C29A52] rounded-full my-1 shadow-sm transition-all animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#CBBEAC]/70 dark:border-slate-800 bg-[#F6F0E7] dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="text-xs text-[#71685E] dark:text-slate-400 font-mono">
            {hasChanges ? (
              <span className="text-[#5A1832] dark:text-[#C29A52] font-semibold">
                &bull; Ready to repaginate book with updated sequence
              </span>
            ) : (
              <span>Current chapter sequence matches canonical syllabus</span>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#292521] dark:text-slate-200 text-xs font-semibold hover:bg-[#EDE4D6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C29A52]" />
              <span>Apply &amp; Repaginate Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
