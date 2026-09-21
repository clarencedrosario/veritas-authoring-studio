import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Trash2,
  CheckCircle,
  FileText,
  Clock,
  Download,
  AlertCircle,
} from 'lucide-react';
import { NovelProject, TeamMember, RoleType, AuditLogEntry } from '../types';

interface TeamCollabViewProps {
  project: NovelProject;
  onUpdateTeam: (team: TeamMember[]) => void;
  onAddAuditLog: (action: string, details: string) => void;
  isDarkMode: boolean;
}

export const TeamCollabView: React.FC<TeamCollabViewProps> = ({
  project,
  onUpdateTeam,
  onAddAuditLog,
  isDarkMode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'audit_logs'>('members');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<RoleType>('beta-reader');

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      role: newMemberRole,
      avatar: newMemberName.trim().slice(0, 2).toUpperCase(),
      online: true,
      lastActive: 'Just joined',
    };

    onUpdateTeam([...project.team, newMember]);
    onAddAuditLog(
      'MEMBER_INVITED',
      `Invited ${newMember.name} (${newMember.email}) with role "${newMember.role}"`
    );

    setIsAddingMember(false);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const handleRoleChange = (memberId: string, newRole: RoleType) => {
    const updated = project.team.map((m) =>
      m.id === memberId ? { ...m, role: newRole } : m
    );
    const target = project.team.find((m) => m.id === memberId);
    onUpdateTeam(updated);
    if (target) {
      onAddAuditLog('ROLE_UPDATED', `Changed role of ${target.name} to "${newRole}"`);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const target = project.team.find((m) => m.id === memberId);
    if (!target || target.role === 'owner') return;
    if (confirm(`Remove collaborator ${target.name}?`)) {
      onUpdateTeam(project.team.filter((m) => m.id !== memberId));
      onAddAuditLog('MEMBER_REMOVED', `Removed collaborator ${target.name}`);
    }
  };

  const handleExportAuditLogs = () => {
    const logContent = project.auditLogs
      .map((l) => `[${l.timestamp}] [${l.user}] ${l.action}: ${l.details}`)
      .join('\n');
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_Audit_Log.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="team-collab-view" className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-stone-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-slate-100">
              Team Collaboration &amp; Access Control (RBAC)
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Manage co-authors, editors, and beta readers with granular permissions and immutable enterprise audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start">
          <div className="flex items-center p-1 rounded-lg bg-stone-200/60 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setActiveSubTab('members')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'members'
                  ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 font-medium shadow-xs'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
              }`}
            >
              Team &amp; Roles ({project.team.length})
            </button>
            <button
              onClick={() => setActiveSubTab('audit_logs')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'audit_logs'
                  ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 font-medium shadow-xs'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
              }`}
            >
              Audit Trail ({project.auditLogs.length})
            </button>
          </div>

          {activeSubTab === 'members' ? (
            <button
              onClick={() => setIsAddingMember(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>
          ) : (
            <button
              onClick={handleExportAuditLogs}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Log</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'members' ? (
        <div className="space-y-6">
          {/* Add Member Form */}
          {isAddingMember && (
            <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-50/20 dark:bg-slate-900 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                  Invite New Collaborator
                </h3>
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="text-stone-400 hover:text-stone-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Full Name (e.g. Maya Chen)..."
                  className="p-2 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                />
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Collaborator Email..."
                  className="p-2 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as RoleType)}
                  className="p-2 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                >
                  <option value="co-author">Co-Author (Full Edit)</option>
                  <option value="editor">Editor (Draft &amp; Comments)</option>
                  <option value="beta-reader">Beta Reader (Comments Only)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="px-3 py-1.5 rounded text-xs font-medium text-stone-600 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim() || !newMemberEmail.trim()}
                  className="px-4 py-1.5 rounded text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
              Active Project Team
            </h3>

            <div className="divide-y divide-stone-100 dark:divide-slate-800">
              {project.team.map((member) => (
                <div
                  key={member.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                        {member.avatar}
                      </div>
                      {member.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-stone-900 dark:text-slate-100 flex items-center space-x-2">
                        <span>{member.name}</span>
                        {member.role === 'owner' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-normal">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400">{member.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-stone-400">
                      {member.online ? 'Active now' : `Last active ${member.lastActive}`}
                    </span>

                    {member.role !== 'owner' ? (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as RoleType)}
                          className="text-xs p-1 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                        >
                          <option value="co-author">Co-Author</option>
                          <option value="editor">Editor</option>
                          <option value="beta-reader">Beta Reader</option>
                        </select>

                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-medium text-stone-500 px-2 py-1 bg-stone-100 dark:bg-slate-800 rounded">
                        Full Admin Access
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role-Based Permissions Matrix Explanation */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/50 text-xs space-y-3">
            <h3 className="font-semibold text-stone-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-400">Co-Author</span>
                <p className="text-stone-600 dark:text-slate-400">
                  Full writing access. Can draft scenes, modulate burstiness, edit character dossiers, and trigger cloud sync.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-blue-600 dark:text-blue-400">Editor</span>
                <p className="text-stone-600 dark:text-slate-400">
                  Can propose edits, polish dialogue, annotate scenes, and leave editorial feedback.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Beta Reader</span>
                <p className="text-stone-600 dark:text-slate-400">
                  Read-only view of chapters with permission to highlight and leave feedback notes.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Audit Trail Subtab */
        <div className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
              System Audit Logs &amp; Integrity Record
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              {project.auditLogs.length} events logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-slate-800 text-stone-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2 px-2">Timestamp</th>
                  <th className="py-2 px-2">User</th>
                  <th className="py-2 px-2">Action</th>
                  <th className="py-2 px-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800/60 font-mono text-[11px]">
                {project.auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-2 text-stone-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-2 font-semibold text-stone-700 dark:text-slate-300">
                      {log.user}
                    </td>
                    <td className="py-2 px-2 text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2 px-2 text-stone-600 dark:text-slate-400 font-sans">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
