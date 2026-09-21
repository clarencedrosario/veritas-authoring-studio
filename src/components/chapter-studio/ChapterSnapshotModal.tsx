import React, { useState } from 'react';
import {
  X,
  History,
  Plus,
  RotateCcw,
  Check,
  GitCommit,
  ArrowRight,
  FileText,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { StudioChapter } from '../../types';

export interface ChapterSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onUpdateChapter?: (updated: StudioChapter) => void;
  onRestoreSnapshot?: (restored: StudioChapter) => void;
  isDarkMode: boolean;
}

interface SnapshotRecord {
  id: string;
  label: string;
  timestamp: string;
  wordCount: number;
  rulesCount: number;
  exercisesCount: number;
  visualsCount: number;
  notes: string;
}

export const ChapterSnapshotModal: React.FC<ChapterSnapshotModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onUpdateChapter,
  onRestoreSnapshot,
  isDarkMode,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>('snap-1');
  const [isRestored, setIsRestored] = useState(false);

  if (!isOpen) return null;

  // Canonical sample snapshots
  const snapshots: SnapshotRecord[] = [
    {
      id: 'snap-1',
      label: 'Master Production Baseline',
      timestamp: '2026-09-10 10:30',
      wordCount: 2840,
      rulesCount: 7,
      exercisesCount: 7,
      visualsCount: 6,
      notes: 'Initial canonical CISCE Class 6 Concord chapter baseline with all 7 rules and exercises A-G.',
    },
    {
      id: 'snap-2',
      label: 'Editorial Review Passed',
      timestamp: '2026-09-09 16:45',
      wordCount: 2650,
      rulesCount: 7,
      exercisesCount: 6,
      visualsCount: 4,
      notes: 'Passed initial board alignment and Bloom taxonomy taxonomy checks.',
    },
    {
      id: 'snap-3',
      label: 'Author First Draft',
      timestamp: '2026-09-08 11:20',
      wordCount: 2100,
      rulesCount: 5,
      exercisesCount: 4,
      visualsCount: 2,
      notes: 'Initial exposition text and high-contrast examples draft.',
    },
  ];

  const handleTakeSnapshot = () => {
    if (!newLabel.trim()) return;
    // In production this can persist to chapter.versionHistory
    setNewLabel('');
    setNewNote('');
    alert(`Snapshot "${newLabel}" recorded successfully.`);
  };

  const handleRestore = (snap: SnapshotRecord) => {
    setIsRestored(true);
    if (onRestoreSnapshot) {
      onRestoreSnapshot(chapter);
    } else if (onUpdateChapter) {
      onUpdateChapter(chapter);
    }
    setTimeout(() => {
      setIsRestored(false);
      onClose();
    }, 1200);
  };

  const selectedSnapshot = snapshots.find((s) => s.id === selectedSnapshotId) || snapshots[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#8B263E]/30 dark:border-amber-900/50 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#8B263E] text-[#FAF7F2] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2]/10 flex items-center justify-center text-[#D4AF37]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37]">
                  Editorial Version Control
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/90">
                  Time-Travel
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#FAF7F2]">
                Chapter Production Snapshots & Diff History
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Create Snapshot Bar */}
          <div className="p-4 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Create Version Checkpoint
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Milestone label (e.g. Post-Copyedit Final)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="text-xs p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
              />
              <input
                type="text"
                placeholder="Author / Editor notes..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="text-xs p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleTakeSnapshot}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8B263E] hover:bg-[#721E32] text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Capture Snapshot</span>
              </button>
            </div>
          </div>

          {/* Snapshots Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 px-1">
                Version Timeline ({snapshots.length})
              </div>
              <div className="space-y-2">
                {snapshots.map((snap) => (
                  <button
                    key={snap.id}
                    onClick={() => setSelectedSnapshotId(snap.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      selectedSnapshotId === snap.id
                        ? 'bg-[#FAF7F2] dark:bg-stone-800 border-[#8B263E] ring-1 ring-[#8B263E]/30 shadow-xs'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">
                        {snap.label}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {snap.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                      {snap.notes}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Snapshot Detail & Metrics Diff */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
                    Target Snapshot
                  </span>
                  <h4 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                    {selectedSnapshot.label}
                  </h4>
                </div>
                <button
                  onClick={() => handleRestore(selectedSnapshot)}
                  disabled={isRestored}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg border border-stone-300 dark:border-stone-700 transition-colors"
                >
                  {isRestored ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Restored!</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-[#8B263E]" />
                      <span>Revert to this Version</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <div className="text-[10px] text-stone-500 uppercase">Words</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {selectedSnapshot.wordCount}
                  </div>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <div className="text-[10px] text-stone-500 uppercase">Rules</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {selectedSnapshot.rulesCount}
                  </div>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <div className="text-[10px] text-stone-500 uppercase">Exercises</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {selectedSnapshot.exercisesCount}
                  </div>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <div className="text-[10px] text-stone-500 uppercase">Visuals</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {selectedSnapshot.visualsCount}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs font-serif text-stone-700 dark:text-stone-300">
                <span className="font-bold text-[#8B263E] dark:text-[#E6C687] block mb-1">
                  Revision Changelog:
                </span>
                {selectedSnapshot.notes}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#8B263E] text-white hover:bg-[#721E32] transition-colors"
          >
            Close Version Control
          </button>
        </div>
      </div>
    </div>
  );
};
