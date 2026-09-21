import React from 'react';
import {
  AlertTriangle,
  X,
  Check,
  ShieldCheck,
  ArrowRight,
  Layers,
  FileText,
} from 'lucide-react';
import { StudioChapter } from '../../../types';
import { BookArchitectureConfig } from '../../book-planner/architecture/types';

interface ArchitectureUpdateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  architecture: BookArchitectureConfig;
  onAcceptUpdate?: () => void;
  onDismissUpdate?: () => void;
  onApplySync?: (updatedChapter: StudioChapter) => void;
  isDarkMode: boolean;
}

export const ArchitectureUpdateReviewModal: React.FC<ArchitectureUpdateReviewModalProps> = ({
  isOpen,
  onClose,
  chapter,
  architecture,
  onAcceptUpdate,
  onDismissUpdate,
  onApplySync,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const currentVersion = chapter.architectureState?.architectureVersion || '1.0.0';
  const newVersion = architecture.version || '1.1.0';
  const components = architecture.chapterArchitecture?.components || [];

  const handleAccept = () => {
    if (onAcceptUpdate) {
      onAcceptUpdate();
    }
    if (onApplySync) {
      onApplySync({
        ...chapter,
        architectureState: {
          ...chapter.architectureState,
          architectureVersion: architecture.version || '1.1.0',
          lastSyncedAt: new Date().toISOString(),
          hasPendingUpdate: false,
        },
      });
    }
    onClose();
  };

  const handleDismiss = () => {
    if (onDismissUpdate) {
      onDismissUpdate();
    }
    if (onApplySync) {
      onApplySync({
        ...chapter,
        architectureState: {
          ...chapter.architectureState,
          hasPendingUpdate: false,
        },
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[85vh] overflow-hidden ${
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
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#5A1832] dark:text-[#C29A52]">
                Book Architecture Update Available
              </h2>
              <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                The master book blueprint was modified. Review before updating this chapter.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
            <p className="font-bold mb-1">Non-Destructive Guarantee</p>
            <p>
              Applying this update will synchronize component definitions, page allocations, and sequence numbers. Your authored paragraphs, exercises, questions, and custom notes will <strong>NEVER</strong> be overwritten or deleted.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/60 dark:bg-[#251520] border border-[#CBBEAC]/60 dark:border-[#5A1832]/60">
              <span className="font-mono text-[10px] uppercase text-[#71685E] block">
                Current Chapter Baseline
              </span>
              <p className="font-bold text-sm text-[#5A1832] dark:text-[#C29A52] mt-0.5">
                Version {currentVersion}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-[#251520] border border-[#CBBEAC]/60 dark:border-[#5A1832]/60">
              <span className="font-mono text-[10px] uppercase text-[#71685E] block">
                Master Book Architecture
              </span>
              <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                Version {newVersion} ({components.length} Components)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">
              Components in Master Architecture:
            </h4>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-[#CBBEAC]/60 dark:border-[#5A1832]/60 p-2 space-y-1 bg-white/40 dark:bg-[#20131B]">
              {components.map((comp, idx) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-1.5 rounded-lg text-[11px]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-[#71685E]">{idx + 1}.</span>
                    <span className="font-medium">{comp.name}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] text-[#71685E]">
                    <span className="capitalize">{comp.category}</span>
                    <span>&bull;</span>
                    <span>{comp.defaultEstimatedPages} pp</span>
                  </div>
                </div>
              ))}
            </div>
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
          <button
            onClick={handleDismiss}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-[#71685E] hover:text-[#292521] dark:hover:text-[#F6F0E7]"
          >
            Dismiss (Keep Current Chapter Baseline)
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-[#71685E]"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#5A1832] text-[#F6F0E7] hover:bg-[#431225] transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4 text-[#C29A52]" />
              <span>Apply Master Architecture Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
