import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileCode,
  FileType,
  Database,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { NovelProject, ExportFormat, ExportOptions } from '../types';
import { exportProject } from '../utils/export';

interface ExportModalProps {
  project: NovelProject;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  onClose,
  isDarkMode,
}) => {
  const [format, setFormat] = useState<ExportFormat>('docx');
  const [includeFrontMatter, setIncludeFrontMatter] = useState(true);
  const [includeCharacterDossiers, setIncludeCharacterDossiers] = useState(true);
  const [includePlotOutlines, setIncludePlotOutlines] = useState(true);
  const [includeEditorialNotes, setIncludeEditorialNotes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExecuteExport = async () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format,
        includeFrontMatter,
        includeCharacterDossiers,
        includePlotOutlines,
        includeEditorialNotes,
      };
      await exportProject(project, options);
      onClose();
    } catch (e: any) {
      alert(`Export failed: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const formats = [
    {
      id: 'docx',
      name: 'Microsoft Word (.docx)',
      desc: 'Standard manuscript submission format with custom typography & chapter page breaks',
      icon: FileType,
    },
    {
      id: 'markdown',
      name: 'Markdown (.md)',
      desc: 'Clean, portable, version-control friendly plain text with semantic headings',
      icon: FileCode,
    },
    {
      id: 'text',
      name: 'Plain Text (.txt)',
      desc: 'Distraction-free raw text format compatible with any typewriter or editor',
      icon: FileText,
    },
    {
      id: 'json',
      name: 'Full Studio Project Backup (.json)',
      desc: 'Complete encrypted archive including all characters, beats, audit logs, and settings',
      icon: Database,
    },
  ];

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="export-modal-dialog"
        className={`max-w-lg w-full rounded-2xl border shadow-2xl p-6 space-y-5 transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-serif font-bold">Export Novel Manuscript</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
            Export Format
          </label>
          <div className="grid grid-cols-1 gap-2">
            {formats.map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = format === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id as ExportFormat)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center space-x-3 transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                      : 'border-stone-200 dark:border-slate-800 hover:border-amber-400/40'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-xs font-semibold">{fmt.name}</div>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400">{fmt.desc}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Options Checklist */}
        <div className="space-y-2.5 pt-1 text-xs">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
            Manuscript Inclusions
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeFrontMatter}
              onChange={(e) => setIncludeFrontMatter(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Include Title Page, Logline, and Author Front-Matter</span>
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCharacterDossiers}
              onChange={(e) => setIncludeCharacterDossiers(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Append Character Dossiers &amp; Voice Profiles appendix</span>
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includePlotOutlines}
              onChange={(e) => setIncludePlotOutlines(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Append 3-Act Plot Architecture &amp; Dramatic Beats</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-export"
            onClick={handleExecuteExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-2 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Compiling File...' : `Export ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
