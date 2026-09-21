import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  Globe,
  Tag,
  Calendar,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import {
  BookProject,
  RightsAndEditionRecord,
  BookEditionType,
} from '../../types';

interface RightsAndEditionsViewProps {
  project: BookProject;
  onUpdateRightsAndEditions: (records: RightsAndEditionRecord[]) => void;
}

export const RightsAndEditionsView: React.FC<RightsAndEditionsViewProps> = ({
  project,
  onUpdateRightsAndEditions,
}) => {
  const records = project.rightsAndEditions || [];
  const [editingRecord, setEditingRecord] = useState<RightsAndEditionRecord | null>(null);

  const handleAddEdition = () => {
    const newRecord: RightsAndEditionRecord = {
      id: `right-${project.internalProjectCode}-${Date.now()}`,
      editionType: 'Workbook',
      editionNumber: records.length + 1,
      revision: '1.0',
      copyrightYear: 2026,
      isbnPlaceholder: 'Not Assigned',
      publicationStatus: 'Planning',
      publisher: project.publisher || 'To be confirmed',
      territory: 'India & South Asia',
      language: project.language || 'English (UK Standard)',
      notes: 'New companion volume for supplementary practice.',
    };
    onUpdateRightsAndEditions([...records, newRecord]);
    setEditingRecord(newRecord);
  };

  const handleSaveRecord = (updated: RightsAndEditionRecord) => {
    const exists = records.some((r) => r.id === updated.id);
    const list = exists
      ? records.map((r) => (r.id === updated.id ? updated : r))
      : [...records, updated];
    onUpdateRightsAndEditions(list);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to remove this edition rights record?')) {
      onUpdateRightsAndEditions(records.filter((r) => r.id !== id));
    }
  };

  const getStatusBadge = (status: RightsAndEditionRecord['publicationStatus']) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300';
      case 'In Production':
        return 'bg-[#C29A52]/20 text-[#5A1832] dark:text-[#E6C994] border-[#C29A52]/40';
      case 'Planning':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
      case 'Archived':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200';
    }
  };

  return (
    <div id="rights-and-editions-view" className="space-y-4">
      <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#5A1832] text-[#E6C994]">
              Rights, Editions & Territory Registry
            </span>
            <span className="text-xs text-slate-500">
              {records.length} registered editions
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Publishing Editions Architecture
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Track student, teacher, workbook, and digital editions without overwriting earlier historical releases.
          </p>
        </div>

        <button
          onClick={handleAddEdition}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#431225] rounded-lg shadow-xs flex items-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add New Edition</span>
        </button>
      </div>

      {/* Grid of Edition Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-serif font-bold text-[#5A1832] dark:text-[#E6C994]">
                    Edition {rec.editionNumber} (Rev {rec.revision})
                  </span>
                  <h4 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100">
                    {rec.editionType}
                  </h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                    rec.publicationStatus
                  )}`}
                >
                  {rec.publicationStatus}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60">
                <div className="flex justify-between">
                  <span className="text-slate-500">ISBN Placeholder:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {rec.isbnPlaceholder}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Publisher:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {rec.publisher}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Territory:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {rec.territory}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Copyright:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    © {rec.copyrightYear} Veritas Press
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed italic">
                "{rec.notes}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{rec.language}</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setEditingRecord(rec)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteRecord(rec.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
              Edit Edition Rights Record
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Edition Type
                  </label>
                  <select
                    value={editingRecord.editionType}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        editionType: e.target.value as BookEditionType,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Student Edition">Student Edition</option>
                    <option value="Teacher Edition">Teacher Edition</option>
                    <option value="Workbook">Workbook</option>
                    <option value="Digital Edition">Digital Edition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Status</label>
                  <select
                    value={editingRecord.publicationStatus}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        publicationStatus: e.target.value as any,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Production">In Production</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    ISBN Placeholder
                  </label>
                  <input
                    type="text"
                    value={editingRecord.isbnPlaceholder}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, isbnPlaceholder: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Territory</label>
                  <input
                    type="text"
                    value={editingRecord.territory}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, territory: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editingRecord.notes}
                  onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-3 py-1.5 rounded text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveRecord(editingRecord)}
                className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#431225]"
              >
                Save Edition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
