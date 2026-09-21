import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  User,
  AlertCircle,
  FileCheck,
  Edit2,
  Sparkles,
} from 'lucide-react';
import {
  BookProject,
  ProductionMilestone,
} from '../../types';

interface ProductionMilestonesViewProps {
  project: BookProject;
  onUpdateMilestones: (milestones: ProductionMilestone[]) => void;
}

export const ProductionMilestonesView: React.FC<ProductionMilestonesViewProps> = ({
  project,
  onUpdateMilestones,
}) => {
  const milestones = project.milestones || [];
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPerson, setEditPerson] = useState('');

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const inProgressCount = milestones.filter((m) => m.status === 'in_progress').length;

  const handleStatusChange = (milestoneId: string, status: ProductionMilestone['status']) => {
    const updated = milestones.map((m) => {
      if (m.id === milestoneId) {
        return {
          ...m,
          status,
          completionDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return m;
    });
    onUpdateMilestones(updated);
  };

  const handleSaveDetails = (milestoneId: string) => {
    const updated = milestones.map((m) => {
      if (m.id === milestoneId) {
        return {
          ...m,
          notes: editNotes,
          targetDate: editDate || m.targetDate,
          responsiblePerson: editPerson || m.responsiblePerson,
        };
      }
      return m;
    });
    onUpdateMilestones(updated);
    setEditingMilestoneId(null);
  };

  const getStatusPill = (status: ProductionMilestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'in_progress':
        return 'bg-[#C29A52]/20 text-[#5A1832] dark:text-[#E6C994] border-[#C29A52]/50 font-bold';
      case 'scheduled':
        return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200';
      case 'delayed':
        return 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300';
      case 'pending':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200';
    }
  };

  return (
    <div id="production-milestones-view" className="space-y-4">
      {/* Milestone Progress Ribbon */}
      <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#5A1832] text-[#E6C994]">
              Production Lifecycle Tracker
            </span>
            <span className="text-xs text-slate-500">
              {completedCount} of {milestones.length} milestones signed off
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Publishing Milestone Schedule
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            13-stage verification pipeline tracking manuscript commissioning to school distribution.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300">
            {completedCount} Completed
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C29A52]/20 text-[#5A1832] dark:text-[#E6C994] border border-[#C29A52]/40">
            {inProgressCount} Active
          </span>
        </div>
      </div>

      {/* Sequenced Milestones Timeline */}
      <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {milestones.map((m, idx) => {
            const isEditing = editingMilestoneId === m.id;

            return (
              <div
                key={m.id}
                className={`p-4 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  m.status === 'in_progress'
                    ? 'bg-amber-50/40 dark:bg-amber-950/20'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* Left: Step number & Name */}
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      m.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : m.status === 'in_progress'
                        ? 'bg-[#5A1832] text-[#E6C994] ring-2 ring-[#C29A52]/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {m.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
                        {m.label}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusPill(
                          m.status
                        )}`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 pt-2">
                        <input
                          type="text"
                          value={editNotes}
                          placeholder="Notes..."
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editPerson}
                            placeholder="Responsible..."
                            onChange={(e) => setEditPerson(e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                          <button
                            onClick={() => handleSaveDetails(m.id)}
                            className="px-3 py-1 bg-[#5A1832] text-white rounded text-xs font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMilestoneId(null)}
                            className="px-2 py-1 text-slate-500 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {m.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{m.responsiblePerson}</span>
                      </span>
                      {(m.completionDate || m.targetDate) && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {m.completionDate
                              ? `Completed: ${m.completionDate}`
                              : `Target: ${m.targetDate}`}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status Dropdown & Edit */}
                <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                  <select
                    value={m.status}
                    onChange={(e) =>
                      handleStatusChange(m.id, e.target.value as ProductionMilestone['status'])
                    }
                    className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                  </select>

                  <button
                    onClick={() => {
                      setEditingMilestoneId(m.id);
                      setEditNotes(m.notes);
                      setEditDate(m.targetDate || '');
                      setEditPerson(m.responsiblePerson);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    title="Edit milestone details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
