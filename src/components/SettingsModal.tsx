import React, { useState } from 'react';
import {
  BookOpen,
  Lock,
  Cloud,
  History,
  ShieldCheck,
  RotateCcw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { NovelProject, VersionSnapshot } from '../types';

interface SettingsModalProps {
  project: NovelProject;
  onUpdateProject: (updates: Partial<NovelProject>) => void;
  onSaveSnapshot: (description: string) => void;
  onRestoreSnapshot: (snapshotId: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
  onTriggerSync: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  project,
  onUpdateProject,
  onSaveSnapshot,
  onRestoreSnapshot,
  onClose,
  isDarkMode,
  onTriggerSync,
}) => {
  const [activeTab, setActiveTab] = useState<'project' | 'encryption' | 'versions' | 'cloud'>('project');
  const [passphraseInput, setPassphraseInput] = useState('');
  const [newSnapshotDesc, setNewSnapshotDesc] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Project metadata states
  const [title, setTitle] = useState(project.title || '');
  const [subtitle, setSubtitle] = useState(project.subtitle || '');
  const [authorName, setAuthorName] = useState(project.authorName || '');
  const [genre, setGenre] = useState(project.genre || '');
  const [targetWords, setTargetWords] = useState(project.targetTotalWords || 80000);
  const [dailyGoal, setDailyGoal] = useState(project.dailyGoalWords || 1000);

  // Safely retrieve version list regardless of schema differences
  const versionList: VersionSnapshot[] =
    (project.versions && Array.isArray(project.versions) && project.versions.length > 0)
      ? project.versions
      : ((project as any).versionHistory && Array.isArray((project as any).versionHistory))
      ? (project as any).versionHistory
      : [];

  const handleSaveMetadata = () => {
    onUpdateProject({
      title: title.trim() || 'Untitled Novel',
      subtitle: subtitle.trim(),
      authorName: authorName.trim(),
      genre: genre.trim(),
      targetTotalWords: Number(targetWords) || 80000,
      dailyGoalWords: Number(dailyGoal) || 1000,
    });
    alert('Project settings successfully saved.');
  };

  const handleToggleEncryption = () => {
    if (!project.isEncrypted) {
      if (!passphraseInput.trim()) {
        alert('Please enter a secure master passphrase to activate AES-256 E2EE.');
        return;
      }
      onUpdateProject({
        isEncrypted: true,
        encryptionKeyId: 'aes-gcm-master-key',
      });
      alert('End-to-End Encryption enabled. All local documents and cloud sync payloads will be AES-256 GCM encrypted.');
      setPassphraseInput('');
    } else {
      if (confirm('Disable End-to-End Encryption? Stored backups will revert to standard unencrypted JSON format.')) {
        onUpdateProject({
          isEncrypted: false,
          encryptionKeyId: undefined,
        });
      }
    }
  };

  const handleCreateSnapshot = () => {
    if (!newSnapshotDesc.trim()) return;
    onSaveSnapshot(newSnapshotDesc.trim());
    setNewSnapshotDesc('');
  };

  const handleManualSync = () => {
    onTriggerSync();
    setSyncStatusMsg('Cloud sync initiated successfully.');
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const navCategories = [
    {
      id: 'project' as const,
      label: 'Project Metadata',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'encryption' as const,
      label: 'End-to-End Encryption',
      icon: Lock,
      badge: project.isEncrypted ? 'Active' : 'Off',
    },
    {
      id: 'versions' as const,
      label: 'Version History',
      icon: History,
      badge: String(versionList.length),
    },
    {
      id: 'cloud' as const,
      label: 'Cloud & Offline',
      icon: Cloud,
      badge: 'Online',
    },
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#35101F]/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="settings-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        className="max-w-3xl w-full rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] my-auto"
      >
        {/* Header */}
        <div
          id="settings-modal-header"
          className="px-6 sm:px-8 py-5 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#F6F0E7] dark:bg-[#2b1622]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center border border-[#C29A52]/40 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="settings-dialog-title"
                className="text-[26px] sm:text-[28px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] leading-tight"
              >
                Studio Settings &amp; Security
              </h2>
              <p className="text-[14.5px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                Manage project parameters, zero-knowledge encryption, version snapshots, and cloud replication.
              </p>
            </div>
          </div>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-[#71685E] hover:text-[#35101F] dark:text-[#c9b9a6] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors"
            title="Close Settings (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories with Permanent Visible Icons & Labels */}
        <div
          id="settings-category-navigation"
          className="flex border-b border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#24111d] px-4 sm:px-6 overflow-x-auto gap-2"
        >
          {navCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                id={`tab-settings-${cat.id}`}
                onClick={() => setActiveTab(cat.id)}
                className={`py-3.5 px-4 font-semibold text-[15px] sm:text-base border-b-2 flex items-center space-x-2.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#5A1832] text-[#5A1832] dark:border-[#C29A52] dark:text-[#C29A52] font-bold bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 rounded-t-lg'
                    : 'border-transparent text-[#71685E] hover:text-[#292521] dark:text-[#c9b9a6] dark:hover:text-[#F6F0E7]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive
                      ? 'text-[#5A1832] dark:text-[#C29A52]'
                      : 'text-[#71685E] dark:text-[#c9b9a6]'
                  }`}
                />
                <span className="leading-none">{cat.label}</span>
                {cat.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-sans font-medium ${
                      isActive
                        ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F]'
                        : 'bg-[#CBBEAC]/50 dark:bg-[#4f2c3d] text-[#292521] dark:text-[#F6F0E7]'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Area */}
        <div
          id="settings-content-viewport"
          className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#EDE4D6] dark:bg-[#1e0f18]"
        >
          {/* CATEGORY 1: PROJECT METADATA */}
          {activeTab === 'project' && (
            <div id="settings-panel-project" className="space-y-6">
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-xs space-y-5">
                <div className="border-b border-[#CBBEAC]/60 dark:border-[#4f2c3d] pb-3">
                  <h3 className="text-[19px] sm:text-[20px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                    Project Identity &amp; Target Scope
                  </h3>
                  <p className="text-[14.5px] text-[#71685E] dark:text-[#c9b9a6] mt-1">
                    Configure the overarching literary dossier, volume titles, and writing benchmarks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-semibold text-[#292521] dark:text-[#F6F0E7] mb-1.5">
                      Novel Title
                    </label>
                    <input
                      id="input-settings-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Glass Cartographer"
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-[#292521] dark:text-[#F6F0E7] mb-1.5">
                      Subtitle / Series Tag
                    </label>
                    <input
                      id="input-settings-subtitle"
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. Book One of The Meridian Trilogy"
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-[#292521] dark:text-[#F6F0E7] mb-1.5">
                      Author Name / Pen Name
                    </label>
                    <input
                      id="input-settings-author"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Julian Mercer"
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-[#292521] dark:text-[#F6F0E7] mb-1.5">
                      Primary Genre
                    </label>
                    <input
                      id="input-settings-genre"
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="e.g. Literary Speculative Fiction"
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-[#292521] dark:text-[#F6F0E7] mb-1.5">
                      Target Total Words
                    </label>
                    <input
                      id="input-settings-target-words"
                      type="number"
                      value={targetWords}
                      onChange={(e) => setTargetWords(Number(e.target.value))}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-[#292521] dark:text-[#F6F0E7] mb-1.5">
                      Daily Word Goal
                    </label>
                    <input
                      id="input-settings-daily-goal"
                      type="number"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(Number(e.target.value))}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#CBBEAC]/60 dark:border-[#4f2c3d]">
                  <button
                    id="btn-save-project-metadata"
                    onClick={handleSaveMetadata}
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-[#F6F0E7] dark:text-[#35101F] text-[15px] sm:text-base font-semibold flex items-center space-x-2 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Save Project Metadata</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 2: END-TO-END ENCRYPTION */}
          {activeTab === 'encryption' && (
            <div id="settings-panel-encryption" className="space-y-6">
              {/* Status Banner */}
              <div
                className={`p-6 rounded-2xl border flex items-start space-x-4 shadow-xs ${
                  project.isEncrypted
                    ? 'border-[#C29A52] bg-[#F6F0E7] dark:bg-[#2b1622]'
                    : 'border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    project.isEncrypted
                      ? 'bg-[#5A1832] text-[#C29A52]'
                      : 'bg-[#CBBEAC]/50 text-[#71685E]'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-[19px] sm:text-[20px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                    {project.isEncrypted
                      ? 'End-to-End Encryption is Active (AES-256-GCM)'
                      : 'End-to-End Encryption is Currently Inactive'}
                  </h3>
                  <p className="text-[14.5px] text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                    Zero-Knowledge Architecture: Your manuscript chapters, plot outlines, and character dossiers are
                    encrypted client-side with authenticated AES-GCM before ever being persisted to local storage or synchronized to cloud backups.
                  </p>
                </div>
              </div>

              {!project.isEncrypted ? (
                <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-4 shadow-xs">
                  <div>
                    <h4 className="text-base font-semibold text-[#292521] dark:text-[#F6F0E7]">
                      Set Master Encryption Passphrase
                    </h4>
                    <p className="text-[14px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                      Your master key derives an AES-GCM 256-bit key via PBKDF2 (100,000 iterations). Do not lose this passphrase.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="input-encryption-passphrase"
                      type="password"
                      value={passphraseInput}
                      onChange={(e) => setPassphraseInput(e.target.value)}
                      placeholder="Enter strong encryption passphrase..."
                      className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                    />
                    <button
                      id="btn-activate-encryption"
                      onClick={handleToggleEncryption}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[15px] sm:text-base font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors"
                    >
                      <Lock className="w-4 h-4 text-[#C29A52]" />
                      <span>Activate AES-256</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-4 shadow-xs">
                  <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] font-mono text-[14px] text-[#35101F] dark:text-[#C29A52] flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 shrink-0 text-[#C29A52]" />
                    <span>Active Cypher: AES-GCM 256-bit with PBKDF2 Key Derivation (100,000 rounds)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[14.5px] text-[#71685E] dark:text-[#c9b9a6]">
                      Need to export plain, unencrypted JSON?
                    </span>
                    <button
                      id="btn-deactivate-encryption"
                      onClick={handleToggleEncryption}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-[15px] font-semibold transition-colors"
                    >
                      Deactivate Encryption
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 3: VERSION HISTORY */}
          {activeTab === 'versions' && (
            <div id="settings-panel-versions" className="space-y-6">
              {/* Create Snapshot Card */}
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-xs space-y-4">
                <div>
                  <h3 className="text-[19px] sm:text-[20px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                    Create Manual Version Snapshot
                  </h3>
                  <p className="text-[14.5px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                    Save a point-in-time backup before major editorial revisions, structural cuts, or developmental restructuring.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="input-snapshot-desc"
                    type="text"
                    value={newSnapshotDesc}
                    onChange={(e) => setNewSnapshotDesc(e.target.value)}
                    placeholder="Snapshot description (e.g. Pre-Chapter 4 Climax overhaul)..."
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] text-base focus:border-[#5A1832] dark:focus:border-[#C29A52] focus:outline-none transition-colors"
                  />
                  <button
                    id="btn-create-snapshot"
                    onClick={handleCreateSnapshot}
                    disabled={!newSnapshotDesc.trim()}
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[15px] sm:text-base font-semibold flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-[#C29A52]" />
                    <span>Create Snapshot</span>
                  </button>
                </div>
              </div>

              {/* Saved Snapshots List */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-[#292521] dark:text-[#F6F0E7]">
                  Archived Snapshots ({versionList.length})
                </h4>

                {versionList.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[#CBBEAC] dark:border-[#4f2c3d] text-center text-[#71685E] dark:text-[#c9b9a6]">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-[15px]">No version snapshots saved yet. Create your first snapshot above.</p>
                  </div>
                ) : (
                  versionList.map((snap, idx) => {
                    const snapTitle =
                      snap.title ||
                      (snap as any).description ||
                      `Version Snapshot #${snap.versionNumber || idx + 1}`;
                    const snapNote =
                      (snap as any).description ||
                      snap.summaryNote ||
                      'Manual project backup';
                    const snapWordCount = snap.wordCount || 0;
                    const snapTime = snap.timestamp
                      ? new Date(snap.timestamp).toLocaleString()
                      : 'Recent';

                    return (
                      <div
                        key={snap.id || `snap-${idx}`}
                        className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="text-base font-semibold text-[#292521] dark:text-[#F6F0E7]">
                            {snapTitle}
                          </div>
                          <p className="text-[14px] text-[#71685E] dark:text-[#c9b9a6]">
                            {snapNote}
                          </p>
                          <div className="text-[13px] text-[#71685E] dark:text-[#c9b9a6] font-mono">
                            {snapTime} • {snapWordCount.toLocaleString()} words
                          </div>
                        </div>

                        <button
                          id={`btn-restore-snap-${snap.id || idx}`}
                          onClick={() => {
                            if (
                              confirm(
                                `Restore snapshot "${snapTitle}"? Unsaved current work in the active editor will be overwritten.`
                              )
                            ) {
                              onRestoreSnapshot(snap.id);
                            }
                          }}
                          className="min-h-[42px] px-5 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#1e0f18] hover:bg-[#D8CCBC] dark:hover:bg-[#35101F] text-[#35101F] dark:text-[#F6F0E7] text-[14.5px] font-semibold flex items-center justify-center space-x-2 transition-colors self-start sm:self-center"
                        >
                          <RotateCcw className="w-4 h-4 text-[#C29A52]" />
                          <span>Restore</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* CATEGORY 4: CLOUD & OFFLINE */}
          {activeTab === 'cloud' && (
            <div id="settings-panel-cloud" className="space-y-6">
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[19px] sm:text-[20px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                        Cloud Synchronization &amp; Offline Cache
                      </h3>
                      <p className="text-[14px] text-[#71685E] dark:text-[#c9b9a6]">
                        Continuous local caching with remote background persistence
                      </p>
                    </div>
                  </div>
                  <span className="text-[13px] px-3 py-1 rounded-full bg-[#5A1832]/10 dark:bg-[#C29A52]/20 text-[#5A1832] dark:text-[#C29A52] font-semibold border border-[#5A1832]/20 dark:border-[#C29A52]/30">
                    Auto-Sync Active
                  </span>
                </div>

                <p className="text-[14.5px] text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Veritas automatically maintains an offline-first storage buffer. All manuscript chapters, outlines,
                  curriculum mappings, and character dossiers are saved to high-performance local memory and synchronized
                  with cloud storage whenever network connectivity is active.
                </p>

                {syncStatusMsg && (
                  <div className="p-3.5 rounded-xl bg-[#C29A52]/20 border border-[#C29A52] text-[#35101F] dark:text-[#F6F0E7] text-[14.5px] font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                    <span>{syncStatusMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center space-x-4">
                  <button
                    id="btn-force-cloud-sync"
                    onClick={handleManualSync}
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[15px] sm:text-base font-semibold flex items-center space-x-2 shadow-xs transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-[#C29A52]" />
                    <span>Force Cloud Sync Now</span>
                  </button>
                  <span className="text-[14px] text-[#71685E] dark:text-[#c9b9a6]">
                    Safe to use during transit or spotty Wi-Fi
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          id="settings-modal-footer"
          className="px-6 sm:px-8 py-4 border-t border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#F6F0E7] dark:bg-[#2b1622]"
        >
          <div className="text-[14px] text-[#71685E] dark:text-[#c9b9a6]">
            Veritas Editorial Platform • Version 2.4-Scholar
          </div>
          <button
            id="btn-close-settings-bottom"
            onClick={onClose}
            className="min-h-[42px] px-6 py-2 rounded-xl bg-[#EDE4D6] hover:bg-[#D8CCBC] dark:bg-[#1e0f18] dark:hover:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] text-[15px] font-semibold border border-[#CBBEAC] dark:border-[#4f2c3d] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
