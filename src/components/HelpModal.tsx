import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  Sparkles,
  GraduationCap,
  Feather,
  FileText,
  Film,
  X,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [activeSection, setActiveSection] = useState<'studios' | 'shortcuts' | 'humanise' | 'architecture'>('studios');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] text-[#292521] dark:text-[#F6F0E7] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#2c1320] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-[#5A1832] text-[#C29A52]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                Veritas Authoring Studio Guide &amp; Help
              </h2>
              <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] font-sans">
                Product architecture, authoring studios, and keyboard shortcuts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] dark:hover:text-[#F6F0E7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 border-b border-[#CBBEAC]/50 dark:border-[#4d1e2e]/50 bg-[#F6F0E7] dark:bg-[#200b14] flex items-center space-x-2 shrink-0">
          {[
            { id: 'studios', label: 'Four Studios', icon: Layers },
            { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
            { id: 'humanise', label: 'Humanise & Voice', icon: Sparkles },
            { id: 'architecture', label: 'Pedagogy & Architecture', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`h-7.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                    : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-[#C29A52]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {activeSection === 'studios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-1.5">
                <div className="flex items-center space-x-2 text-[#5A1832] dark:text-[#C29A52] font-bold text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>1. Academic Book Studio</span>
                </div>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  Comprehensive curriculum textbook authoring designed for Indian &amp; International boards (CISCE / ICSE, CBSE, Cambridge). Features multi-volume management across Classes 1–12, 23 pedagogical chapter component blocks (COMP-01 to COMP-23), spiral curriculum progression, and board blueprint matrices.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <Feather className="w-4 h-4" />
                  <span>2. Novel Writing Studio</span>
                </div>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  Full-length fiction authoring environment. Features chapter and scene manuscript compilation, rich character dossiers, worldbuilding lore codex, chronological timeline events, character relationship graph, and narrative pacing analysis.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-1.5">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>3. Content Writing Studio</span>
                </div>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  Structured nonfiction publishing for articles, essays, whitepapers, and thought leadership. Includes audience targeting, thesis statements, outline builder, reading time estimation, and SEO metadata.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-1.5">
                <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-bold text-sm">
                  <Film className="w-4 h-4" />
                  <span>4. Film &amp; Script Studio</span>
                </div>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  Industry-standard formatted screenplay authoring with automatic element classification: Scene Headings (Sluglines), Action Lines, Character Cues, Parentheticals, Dialogue, and Transitions.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'shortcuts' && (
            <div className="space-y-3">
              <div className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
                Use these hotkeys anywhere in the application to navigate rapidly:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                {[
                  { key: '⌘K / Ctrl+K', desc: 'Open Command Palette' },
                  { key: '[', desc: 'Toggle Navigation Sidebar' },
                  { key: '⌘S / Ctrl+S', desc: 'Save Project Snapshot' },
                  { key: '⌥H / Alt+H', desc: 'Open Humanise Assistant' },
                  { key: '⌘B / Ctrl+B', desc: 'Bold text in Editor' },
                  { key: '⌘I / Ctrl+I', desc: 'Italic text in Editor' },
                  { key: 'Esc', desc: 'Exit modal or Focus Mode' },
                  { key: 'Tab', desc: 'Next script element (Script Studio)' },
                ].map((s) => (
                  <div
                    key={s.key}
                    className="p-2.5 rounded-lg border border-[#CBBEAC]/60 dark:border-[#4d1e2e]/60 bg-[#EDE4D6]/30 dark:bg-[#35101F]/30 flex items-center justify-between"
                  >
                    <span className="font-bold text-[#5A1832] dark:text-[#C29A52]">{s.key}</span>
                    <span className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] font-sans">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'humanise' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-2">
                <div className="font-bold text-[#5A1832] dark:text-[#C29A52] text-sm flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Editorial Humanise &amp; Voice Calibration</span>
                </div>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  Veritas Humanise is an editorial rewriting and prose rhythm tool designed to remove stiff, formulaic phrasing and inject natural, organic cadence.
                </p>
                <div className="space-y-1 pt-1 font-mono text-[11px]">
                  <div>&bull; <strong>Light:</strong> Subtle sentence variation, preserves vocabulary.</div>
                  <div>&bull; <strong>Balanced:</strong> Deconstructs repetitive clauses, balances rhythm.</div>
                  <div>&bull; <strong>Strong:</strong> Complete syntactic restructuring with organic burstiness.</div>
                </div>
                <div className="pt-2 text-[11px] text-[#9A7438] dark:text-[#C29A52] italic border-t border-[#CBBEAC]/50">
                  Note: Humanise is an editorial craft instrument. It does not advertise deceptive AI-detector circumvention.
                </div>
              </div>
            </div>
          )}

          {activeSection === 'architecture' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-2">
                <div className="font-bold text-[#5A1832] dark:text-[#C29A52] text-sm">
                  Pedagogical Chapter Components (COMP-01 to COMP-23)
                </div>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  COMP-01 through COMP-23 are NOT chapter number limits. They represent 23 distinct pedagogical modular component types (e.g. Concept Definitions, Sentence Diagrammers, Differentiated Exercises, Board Exam Question Banks) that can be inserted into any chapter.
                </p>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  Veritas supports an unlimited number of chapters, topics, scenes, and books across all 4 studios.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#2c1320] flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-[#71685E] dark:text-[#D8CCBC]">
            Veritas Authoring Studio v3.2 &bull; Antigravity Agent
          </span>
          <button
            onClick={onClose}
            className="h-7.5 px-3.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold hover:bg-[#722040] cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
