import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Save,
  Tag,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  BookProject,
  BookProjectStatus,
  BookEditionType,
  CurriculumSystemId,
} from '../../types';
import {
  PRODUCTION_STATUS_ORDER,
  getDefaultProductionMilestones,
  deriveProductionStatus,
} from '../../utils/bookProjectUtils';
import { validateISBN } from '../../utils/isbnUtils';

interface BookProjectDetailModalProps {
  project: BookProject;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: BookProject) => void;
  onOpenChapterStudio?: () => void;
  onOpenBookPlanner?: (projId: string) => void;
  onOpenTextbookPreview?: () => void;
  onOpenLayoutExport?: () => void;
}

export const BookProjectDetailModal: React.FC<BookProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  onOpenChapterStudio,
  onOpenBookPlanner,
  onOpenTextbookPreview,
  onOpenLayoutExport,
}) => {
  const [formData, setFormData] = useState<BookProject>({ ...project });

  if (!isOpen) return null;

  // Real-time ISBN validation
  const isbnValidation = validateISBN(formData.isbnPlaceholder);

  // Derived status calculation
  const calculatedDerivedStatus =
    project.derivedStatus ||
    deriveProductionStatus(
      project.readiness?.bookReadinessScore || 22,
      Math.round(((project.readiness?.calculationExplanation?.authoredChapters || 1) / (project.readiness?.calculationExplanation?.plannedChapters || 12)) * 100),
      project.readiness?.calculationExplanation?.authoredChapters || 1
    );

  const handleStatusChange = (newStatus: BookProjectStatus) => {
    const updatedMilestones = getDefaultProductionMilestones(newStatus);
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      isManualStatus: newStatus !== calculatedDerivedStatus,
      milestones: updatedMilestones,
    }));
  };

  const handleResetToDerivedStatus = () => {
    const updatedMilestones = getDefaultProductionMilestones(calculatedDerivedStatus);
    setFormData((prev) => ({
      ...prev,
      status: calculatedDerivedStatus,
      isManualStatus: false,
      milestones: updatedMilestones,
    }));
  };

  const handleIsbnChange = (rawIsbn: string) => {
    const validation = validateISBN(rawIsbn);
    setFormData((prev) => ({
      ...prev,
      isbnPlaceholder: rawIsbn,
      isbnStatus: validation.status,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastEdited: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#F6F0E7] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#2b1622]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#E6C994] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Book Project Metadata & Publishing Spec
              </h2>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                Internal Project Code: <span className="font-mono font-medium">{formData.internalProjectCode || '—'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] rounded-lg hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-[#292521] dark:text-[#F6F0E7]">
          {/* Status Workflow Progress Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider">
                Production Stage Workflow
              </label>
              <div className="flex items-center space-x-2 text-xs">
                {formData.isManualStatus ? (
                  <span className="text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded font-mono font-medium">
                    Manual Status Override Active
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-mono font-medium">
                    Auto-Derived from Manuscript ({calculatedDerivedStatus})
                  </span>
                )}
                {formData.isManualStatus && (
                  <button
                    type="button"
                    onClick={handleResetToDerivedStatus}
                    className="flex items-center space-x-1 text-xs text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Derived</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#EDE4D6] dark:bg-[#35101F] rounded-xl border border-[#CBBEAC]/60 dark:border-[#4f2c3d]">
              {PRODUCTION_STATUS_ORDER.map((s, idx) => {
                const isCurrent = formData.status === s;
                const pastCurrent = PRODUCTION_STATUS_ORDER.indexOf(formData.status) > idx;

                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s as BookProjectStatus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                      isCurrent
                        ? 'bg-[#5A1832] text-[#E6C994] shadow-xs ring-2 ring-[#C29A52]/50 font-bold'
                        : pastCurrent
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200/60'
                        : 'bg-white dark:bg-[#2b1622] text-[#71685E] dark:text-[#c9b9a6] border border-[#CBBEAC]/50 dark:border-[#4f2c3d] hover:bg-black/5'
                    }`}
                  >
                    {pastCurrent && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Identification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={formData.bookTitle}
                onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] focus:ring-2 focus:ring-[#5A1832]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] focus:ring-2 focus:ring-[#5A1832]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Series Title
              </label>
              <input
                type="text"
                value={formData.seriesTitle || ''}
                onChange={(e) => setFormData({ ...formData, seriesTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Internal Project Code
              </label>
              <input
                type="text"
                value={formData.internalProjectCode || ''}
                onChange={(e) => setFormData({ ...formData, internalProjectCode: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Board, Stage & Edition */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Board / Programme
              </label>
              <select
                value={formData.board}
                onChange={(e) => setFormData({ ...formData, board: e.target.value as CurriculumSystemId })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              >
                <option value="CBSE">CBSE (Central Board)</option>
                <option value="CISCE">CISCE / ICSE</option>
                <option value="Cambridge">Cambridge International (CAIE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Class / Stage
              </label>
              <input
                type="text"
                value={formData.classOrStage}
                onChange={(e) => setFormData({ ...formData, classOrStage: e.target.value })}
                placeholder="e.g. Class 6 or Cambridge Lower Secondary"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Edition Type
              </label>
              <select
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value as BookEditionType })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              >
                <option value="Student Edition">Student Edition</option>
                <option value="Teacher Edition">Teacher Edition</option>
                <option value="Workbook">Workbook</option>
                <option value="Digital Edition">Digital Edition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* People & Editorial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Author(s)
              </label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Not entered (leave blank if not yet entered)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Commissioning Editor
              </label>
              <input
                type="text"
                value={formData.editor || ''}
                onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
                placeholder="Not assigned (leave blank if not yet assigned)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Physical & Technical Specs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Trim Size
              </label>
              <select
                value={formData.trimSize}
                onChange={(e) => setFormData({ ...formData, trimSize: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              >
                <option value="Crown Quarto (189 × 246 mm)">Crown Quarto (189 × 246 mm)</option>
                <option value="Royal Octavo (156 × 234 mm)">Royal Octavo (156 × 234 mm)</option>
                <option value="Standard A4 (210 × 297 mm)">Standard A4 (210 × 297 mm)</option>
                <option value="US Letter (8.5 × 11 in)">US Letter (8.5 × 11 in)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Target Page Count
              </label>
              <input
                type="number"
                value={formData.targetPageCount || 192}
                onChange={(e) =>
                  setFormData({ ...formData, targetPageCount: parseInt(e.target.value) || 192 })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Estimated Word Count
              </label>
              <input
                type="number"
                value={formData.estimatedWordCount || 42000}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedWordCount: parseInt(e.target.value) || 42000 })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Target Age
              </label>
              <input
                type="text"
                value={formData.targetAge || ''}
                onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Legal, Cataloging & ISBN with Truth Layer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6]">
                  ISBN
                </label>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isbnValidation.status === 'Validated Format'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : isbnValidation.status === 'Entered by Author/Publisher'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {isbnValidation.status}
                </span>
              </div>
              <input
                type="text"
                value={formData.isbnPlaceholder || ''}
                onChange={(e) => handleIsbnChange(e.target.value)}
                placeholder="Not Assigned (or 978-...)"
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
              <p className="text-[10px] text-slate-500 mt-0.5" title={isbnValidation.message}>
                {isbnValidation.message}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Academic / Edition Year
              </label>
              <input
                type="text"
                value={formData.academicYear || ''}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Publisher
              </label>
              <input
                type="text"
                value={formData.publisher || ''}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="To be confirmed (leave blank if pending)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Language Standard
              </label>
              <input
                type="text"
                value={formData.language || 'English (UK / Commonwealth Standard)'}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Editorial Notes */}
          <div>
            <label className="block text-xs font-medium text-[#71685E] dark:text-[#c9b9a6] mb-1">
              Editorial Notes & Production Brief
            </label>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] leading-relaxed"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#2b1622]">
          <div className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
            All updates save directly to central project repository without false metadata.
          </div>
          <div className="flex items-center space-x-2">
            {onOpenBookPlanner && (
              <button
                type="button"
                onClick={() => onOpenBookPlanner(project.id)}
                className="px-3.5 py-2 text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832] hover:bg-black/5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Open directly in Book Planner"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open in Book Planner</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#292521] dark:text-[#F6F0E7] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#35101F] rounded-lg shadow-xs flex items-center space-x-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Book Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
