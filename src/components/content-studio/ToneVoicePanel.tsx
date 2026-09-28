import React from 'react';
import {
  Sliders,
  Sparkles,
  BookOpen,
  Volume2,
  Check,
  CheckCircle2,
  Type,
  Eye,
} from 'lucide-react';
import { ContentToneConfig } from '../../types';

interface ToneVoicePanelProps {
  config?: ContentToneConfig;
  onUpdateConfig: (updated: ContentToneConfig) => void;
  onCalibrateDraftWithTone: () => void;
  isGenerating: boolean;
  isDarkMode: boolean;
}

export const ToneVoicePanel: React.FC<ToneVoicePanelProps> = ({
  config,
  onUpdateConfig,
  onCalibrateDraftWithTone,
  isGenerating,
  isDarkMode,
}) => {
  const currentConfig: ContentToneConfig = config || {
    tone: 'Professional & Authoritative',
    formalityLevel: 4,
    readingLevel: 'High School',
    perspective: 'Third Person Objective (He/She/They)',
    emotionalCadence: 'Restrained & Factual',
  };

  const handleUpdate = (updates: Partial<ContentToneConfig>) => {
    onUpdateConfig({ ...currentConfig, ...updates });
  };

  const TONE_OPTIONS = [
    'Journalistic Newsroom (Factual & Inverted Pyramid)',
    'Professional & Authoritative (Executive)',
    'Conversational & Accessible (Warm)',
    'Persuasive Commercial (High-Impact)',
    'Scholarly & Analytical (Academic)',
    'Empathetic & Community-Oriented',
    'Urgent & Compelling (Public Advisory)',
    'Literary & Reflective Essay',
  ];

  return (
    <div className="w-full max-w-[780px] mx-auto p-5 sm:p-6 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-6 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 dark:border-[#4d1e2e] pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-bold shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
              Acoustic & Rhetorical Calibration
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#35101F] dark:text-[#F6F0E7]">
              Tone & Voice Architecture
            </h3>
          </div>
        </div>

        <button
          onClick={onCalibrateDraftWithTone}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calibrate Draft to Tone</span>
        </button>
      </div>

      {/* Tone Preset Select */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
          Primary Editorial Tone
        </label>
        <select
          value={currentConfig.tone}
          onChange={(e) => handleUpdate({ tone: e.target.value })}
          className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] outline-none cursor-pointer"
        >
          {TONE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Formality Slider */}
      <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
            Degree of Formality
          </span>
          <span className="font-mono font-bold text-xs text-[#35101F] dark:text-[#F6F0E7]">
            Level {currentConfig.formalityLevel} / 5
            {currentConfig.formalityLevel === 1 && ' (Casual / Conversational)'}
            {currentConfig.formalityLevel === 2 && ' (Engaged Informal)'}
            {currentConfig.formalityLevel === 3 && ' (Standard Professional)'}
            {currentConfig.formalityLevel === 4 && ' (Elevated & Authoritative)'}
            {currentConfig.formalityLevel === 5 && ' (Strict Institutional / Legal)'}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={currentConfig.formalityLevel}
          onChange={(e) => handleUpdate({ formalityLevel: Number(e.target.value) })}
          className="w-full accent-[#5A1832] dark:accent-[#C29A52]"
        />
        <div className="flex justify-between text-[10px] text-[#71685E] font-mono">
          <span>1. Casual</span>
          <span>3. Professional</span>
          <span>5. Institutional</span>
        </div>
      </div>

      {/* Reading Level & Perspective Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reading Level */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
            Target Reading Level
          </label>
          <select
            value={currentConfig.readingLevel}
            onChange={(e) => handleUpdate({ readingLevel: e.target.value as any })}
            className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold cursor-pointer"
          >
            <option value="Middle School">Middle School (Ages 11–14 / Grade 6–8)</option>
            <option value="High School">High School (Ages 14–18 / Grade 9–12)</option>
            <option value="Undergraduate">Undergraduate / College</option>
            <option value="Executive / Professional">Executive / Domain Specialist</option>
            <option value="General Public">General Public (Universal Accessibility)</option>
          </select>
        </div>

        {/* Narrative Perspective */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
            Narrative Perspective
          </label>
          <select
            value={currentConfig.perspective}
            onChange={(e) => handleUpdate({ perspective: e.target.value as any })}
            className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold cursor-pointer"
          >
            <option value="First Person (I/We)">First Person (I / We — Essay & Column)</option>
            <option value="Second Person (You)">Second Person (You — Direct Ad & Brochure)</option>
            <option value="Third Person Objective (He/She/They)">Third Person Objective (He/She/They — News & Report)</option>
          </select>
        </div>
      </div>

      {/* Emotional Cadence */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
          Emotional Cadence
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'Restrained & Factual', label: 'Restrained & Factual', desc: 'No emotional bias' },
            { id: 'Warm & Engaging', label: 'Warm & Engaging', desc: 'Community warmth' },
            { id: 'Urgent & Compelling', label: 'Urgent & Compelling', desc: 'Action-oriented' },
            { id: 'Inspirational', label: 'Inspirational', desc: 'Vision & uplift' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleUpdate({ emotionalCadence: item.id as any })}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                currentConfig.emotionalCadence === item.id
                  ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#EDE4D6] dark:bg-[#2b101c] ring-1 ring-[#5A1832]'
                  : 'border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#1a0812] hover:bg-[#EDE4D6]/50'
              }`}
            >
              <div className="font-serif font-bold text-xs text-[#35101F] dark:text-[#F6F0E7]">
                {item.label}
              </div>
              <div className="text-[10px] text-[#71685E] dark:text-[#a89989]">
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
