// =============================================================
// VERITAS Editorial Platform — Renumber Figures Modal
// Phase 4E-1: Visual Production Foundation
// =============================================================

import React from 'react';
import { AlertTriangle, Hash, Check, X } from 'lucide-react';
import { VisualRecord } from '../../../types/visualStudio';

interface RenumberFiguresModalProps {
  isOpen: boolean;
  onClose: () => void;
  visuals: VisualRecord[];
  chapterNumber: number;
  onConfirmRenumber: () => void;
}

export const RenumberFiguresModal: React.FC<RenumberFiguresModalProps> = ({
  isOpen,
  onClose,
  visuals,
  chapterNumber,
  onConfirmRenumber,
}) => {
  if (!isOpen) return null;

  const previewList = visuals.map((v, idx) => ({
    title: v.title,
    currentFig: v.figureNumber,
    newFig: `Figure ${chapterNumber}.${idx + 1}`,
  }));

  const hasChanges = previewList.some((p) => p.currentFig !== p.newFig);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-2xl p-6 space-y-5 text-[#292521]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5A1832] flex items-center justify-center text-[#C29A52]">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#292521]">Renumber Chapter Figures</h3>
              <p className="text-xs text-[#71685E]">
                Sequential numbering for Chapter {chapterNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#292521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">Important Publishing Precaution:</strong>
            <p className="leading-relaxed">
              Renumbering updates all visual figure numbers and their captions in the chapter. If
              you have written manual in-text references (such as &ldquo;as seen in Figure 1.2&rdquo;),
              verify that your manuscript text matches the updated numbers.
            </p>
          </div>
        </div>

        {/* Preview Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A1832]">
            Figure Numbering Preview ({visuals.length} Visuals)
          </h4>
          <div className="max-h-60 overflow-y-auto rounded-xl border border-[#CBBEAC] bg-[#F6F0E7]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EDE4D6] border-b border-[#CBBEAC] text-[10px] uppercase font-bold text-[#5A1832]">
                <tr>
                  <th className="px-3 py-2">Visual Title</th>
                  <th className="px-3 py-2">Current</th>
                  <th className="px-3 py-2">New Sequence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBBEAC]/50 font-medium">
                {previewList.map((p, i) => (
                  <tr key={i} className="hover:bg-[#FFFDF8]/60 transition-colors">
                    <td className="px-3 py-2 text-[#292521] truncate max-w-[160px] font-sans">
                      {p.title}
                    </td>
                    <td className="px-3 py-2 font-mono text-[#71685E]">{p.currentFig}</td>
                    <td className="px-3 py-2 font-mono font-bold text-[#5A1832]">
                      {p.newFig}
                      {p.currentFig !== p.newFig && (
                        <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-[#C29A52]/20 text-[#5A1832]">
                          changed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#CBBEAC]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-xs font-semibold text-[#292521] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmRenumber();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-xs font-bold text-[#FFFDF8] inline-flex items-center space-x-1.5 shadow-md transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#C29A52]" />
            <span>Apply Sequential Numbering</span>
          </button>
        </div>
      </div>
    </div>
  );
};
