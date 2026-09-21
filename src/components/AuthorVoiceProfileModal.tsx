import React, { useState } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  Check,
  RefreshCw,
  BookOpen,
  Volume2,
  Feather,
  Compass,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';
import { AuthorVoiceProfile, NovelProject } from '../types';

interface AuthorVoiceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: NovelProject;
  onSaveVoiceProfile: (profile: AuthorVoiceProfile) => void;
  isDarkMode: boolean;
}

const PRESET_VOICES: Array<{
  name: string;
  description: string;
  profile: AuthorVoiceProfile;
}> = [
  {
    name: 'Grounded Atmospheric Realism',
    description: 'High burstiness, tactile sensory grounding, psychological interiority, and measured narrative pacing.',
    profile: {
      proseDensity: 'Dense',
      sentenceRhythm: 'Varied & Syncopated',
      dialogueStyle: 'Naturalistic & Indirect',
      descriptionLevel: 'Rich & Atmospheric',
      vocabularyLevel: 'Elevated & Nuanced',
      narrativeDistance: 'Deep Close POV',
      preferredPov: 'Third Person Limited',
      tone: 'Haunting, tactile, precise, psychologically alert',
      pacing: 'Measured & Deliberate',
      recurringPreferences: [
        'Sensory mineral, weather, and acoustic anchors',
        'Abrupt short sentences following rolling descriptive clauses',
        'Subtextual dialogue with physical micro-actions',
        'Concrete architectural or mechanical metaphors',
      ],
      customVoiceNotes: 'Preserve specific material vocabulary and avoid unearned emotional adjectives.',
    },
  },
  {
    name: 'Hardboiled Noir & Psychological Crime',
    description: 'Staccato fragments, cynical observational wit, sensory grit, and relentless narrative momentum.',
    profile: {
      proseDensity: 'Sparse',
      sentenceRhythm: 'Staccato & Punchy',
      dialogueStyle: 'Sharp & Witty',
      descriptionLevel: 'Selective Anchors',
      vocabularyLevel: 'Accessible & Direct',
      narrativeDistance: 'Deep Close POV',
      preferredPov: 'First Person',
      tone: 'Taut, wry, cynical, urgent, observational',
      pacing: 'Brisk & Urgent',
      recurringPreferences: [
        'Short punchy clauses with sharp verbs',
        'Cynical commentary on human motives',
        'Dialogue like verbal fencing with sharp subtext',
        'Atmospheric neon, cigarette, rain, and diesel cues',
      ],
      customVoiceNotes: 'Strip away passive constructions and informational dialogue.',
    },
  },
  {
    name: 'Lyrical Speculative & Mythic Realism',
    description: 'Rolling clause rhythms, metaphorical weight grounded in tangible physics, and profound existential depth.',
    profile: {
      proseDensity: 'Ornate & Layered',
      sentenceRhythm: 'Rolling & Lyrical',
      dialogueStyle: 'Poetic & Subtextual',
      descriptionLevel: 'Immersive Tapestry',
      vocabularyLevel: 'Elevated & Nuanced',
      narrativeDistance: 'Moderate Intimate',
      preferredPov: 'Third Person Limited',
      tone: 'Evocative, luminous, melancholic, wondrous',
      pacing: 'Slow-Burn Tension',
      recurringPreferences: [
        'Musical cadence with syntactic parallelism',
        'Metaphors drawn from geology, astronomy, and folklore',
        'Contemplative pauses between dramatic beats',
        'Deep psychological interiority',
      ],
      customVoiceNotes: 'Favor rhythm and cadence over clinical efficiency.',
    },
  },
  {
    name: 'Fast-Paced Contemporary Thriller',
    description: 'Urgent pacing, lean syntax, visceral action choreography, and high-stakes forward momentum.',
    profile: {
      proseDensity: 'Balanced',
      sentenceRhythm: 'Staccato & Punchy',
      dialogueStyle: 'Sharp & Witty',
      descriptionLevel: 'Selective Anchors',
      vocabularyLevel: 'Contemporary Literary',
      narrativeDistance: 'Deep Close POV',
      preferredPov: 'Third Person Limited',
      tone: 'Heart-pounding, breathless, immediate, tactical',
      pacing: 'Brisk & Urgent',
      recurringPreferences: [
        'Time-stamped urgency and ticking-clock stakes',
        'Physical adrenaline cues (heartbeat, breath, balance)',
        'Zero expositional bloat',
        'Cliffhanger beat transitions',
      ],
      customVoiceNotes: 'Every paragraph must propel the narrative forward or raise the stakes.',
    },
  },
];

export const AuthorVoiceProfileModal: React.FC<AuthorVoiceProfileModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveVoiceProfile,
}) => {
  const currentProfile: AuthorVoiceProfile = project.authorVoiceProfile || PRESET_VOICES[0].profile;

  const [form, setForm] = useState<AuthorVoiceProfile>({ ...currentProfile });
  const [newPreference, setNewPreference] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'presets'>('profile');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: AuthorVoiceProfile) => {
    setForm({ ...preset });
    setActiveTab('profile');
  };

  const handleAddPreference = () => {
    if (newPreference.trim()) {
      setForm((prev) => ({
        ...prev,
        recurringPreferences: [...(prev.recurringPreferences || []), newPreference.trim()],
      }));
      setNewPreference('');
    }
  };

  const handleRemovePreference = (index: number) => {
    setForm((prev) => ({
      ...prev,
      recurringPreferences: (prev.recurringPreferences || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSaveVoiceProfile(form);
    onClose();
  };

  return (
    <div
      id="author-voice-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#35101F]/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="min-h-[56px] px-6 border-b border-[#CBBEAC] dark:border-[#4d1e2e] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#2b101c] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center shadow-xs">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                Author Voice Profile
              </h2>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                Establish and preserve your individual prose voice across chapters
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-[#F6F0E7] dark:bg-[#1a0812] rounded-lg p-0.5 border border-[#CBBEAC] dark:border-[#4d1e2e]">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F]'
                }`}
              >
                Custom Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'presets'
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F]'
                }`}
              >
                Archetype Presets
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#292521] dark:text-[#F6F0E7]">
          {activeTab === 'presets' ? (
            <div className="space-y-4">
              <p className="text-[13px] text-[#71685E] dark:text-[#c9b9a6] font-serif">
                Select a crafted archetype preset to calibrate your prose cadence, sensory density, and dialogue style. You can customize any dimension afterwards.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {PRESET_VOICES.map((preset) => (
                  <div
                    key={preset.name}
                    className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/60 dark:bg-[#2b101c]/60 hover:border-[#5A1832] dark:hover:border-[#C29A52] transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                        <h4 className="font-serif font-bold text-[14px] text-[#35101F] dark:text-[#F6F0E7]">
                          {preset.name}
                        </h4>
                      </div>
                      <p className="text-[12px] text-[#71685E] dark:text-[#c9b9a6] mt-1.5 leading-relaxed">
                        {preset.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC]/50 dark:border-[#4d1e2e] text-[10.5px] font-mono">
                          {preset.profile.sentenceRhythm}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC]/50 dark:border-[#4d1e2e] text-[10.5px] font-mono">
                          {preset.profile.proseDensity}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC]/50 dark:border-[#4d1e2e] text-[10.5px] font-mono">
                          {preset.profile.dialogueStyle}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyPreset(preset.profile)}
                      className="w-full min-h-[36px] py-1.5 px-3 rounded-lg bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Preset</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Tone & Style summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Primary Tone & Atmosphere
                  </label>
                  <input
                    type="text"
                    value={form.tone}
                    onChange={(e) => setForm({ ...form, tone: e.target.value })}
                    placeholder="e.g. Haunting, tactile, precise, psychologically alert"
                    className="w-full min-h-[38px] px-3 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[13px] text-[#292521] dark:text-[#F6F0E7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Preferred Point of View (POV)
                  </label>
                  <select
                    value={form.preferredPov}
                    onChange={(e) => setForm({ ...form, preferredPov: e.target.value as any })}
                    className="w-full min-h-[38px] px-3 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[13px] text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
                  >
                    <option value="Third Person Limited">Third Person Limited (Deep Close)</option>
                    <option value="First Person">First Person (Protagonist Interiority)</option>
                    <option value="Third Person Omniscient">Third Person Omniscient (Panoramic)</option>
                    <option value="Second Person">Second Person (Uncommon / Direct)</option>
                  </select>
                </div>
              </div>

              {/* Rhythmic & Structural Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Sentence Rhythm
                  </label>
                  <select
                    value={form.sentenceRhythm}
                    onChange={(e) => setForm({ ...form, sentenceRhythm: e.target.value as any })}
                    className="w-full min-h-[38px] px-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
                  >
                    <option value="Varied & Syncopated">Varied & Syncopated (Organic Burstiness)</option>
                    <option value="Staccato & Punchy">Staccato & Punchy (Short Fragments)</option>
                    <option value="Rolling & Lyrical">Rolling & Lyrical (Expansive Clauses)</option>
                    <option value="Balanced Classical">Balanced Classical (Measured Cadence)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Prose Density
                  </label>
                  <select
                    value={form.proseDensity}
                    onChange={(e) => setForm({ ...form, proseDensity: e.target.value as any })}
                    className="w-full min-h-[38px] px-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
                  >
                    <option value="Sparse">Sparse (Lean, economical, white-space)</option>
                    <option value="Balanced">Balanced (Standard narrative flow)</option>
                    <option value="Dense">Dense (Rich textures & internal thought)</option>
                    <option value="Ornate & Layered">Ornate & Layered (Elaborate tapestry)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Narrative Pacing
                  </label>
                  <select
                    value={form.pacing}
                    onChange={(e) => setForm({ ...form, pacing: e.target.value as any })}
                    className="w-full min-h-[38px] px-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
                  >
                    <option value="Brisk & Urgent">Brisk & Urgent (Fast momentum)</option>
                    <option value="Measured & Deliberate">Measured & Deliberate (Atmospheric)</option>
                    <option value="Slow-Burn Tension">Slow-Burn Tension (Simmering suspense)</option>
                    <option value="Episodic Rhythms">Episodic Rhythms (Rhythmic breath)</option>
                  </select>
                </div>
              </div>

              {/* Dialogue & Vocabulary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Dialogue Style
                  </label>
                  <select
                    value={form.dialogueStyle}
                    onChange={(e) => setForm({ ...form, dialogueStyle: e.target.value as any })}
                    className="w-full min-h-[38px] px-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
                  >
                    <option value="Naturalistic & Indirect">Naturalistic & Indirect (Realistic subtext)</option>
                    <option value="Sharp & Witty">Sharp & Witty (Punchy exchanges)</option>
                    <option value="Poetic & Subtextual">Poetic & Subtextual (Deep ambiguity)</option>
                    <option value="Period / Formal">Period / Formal (Syntactic precision)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Description Level
                  </label>
                  <select
                    value={form.descriptionLevel}
                    onChange={(e) => setForm({ ...form, descriptionLevel: e.target.value as any })}
                    className="w-full min-h-[38px] px-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
                  >
                    <option value="Minimalist Focus">Minimalist Focus (Bare essential anchors)</option>
                    <option value="Selective Anchors">Selective Anchors (Vivid key details)</option>
                    <option value="Rich & Atmospheric">Rich & Atmospheric (Sensory immersion)</option>
                    <option value="Immersive Tapestry">Immersive Tapestry (Deep world texture)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Vocabulary Level
                  </label>
                  <select
                    value={form.vocabularyLevel}
                    onChange={(e) => setForm({ ...form, vocabularyLevel: e.target.value as any })}
                    className="w-full min-h-[38px] px-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
                  >
                    <option value="Accessible & Direct">Accessible & Direct</option>
                    <option value="Contemporary Literary">Contemporary Literary</option>
                    <option value="Elevated & Nuanced">Elevated & Nuanced</option>
                    <option value="Archaic / Stylized">Archaic / Stylized</option>
                  </select>
                </div>
              </div>

              {/* Recurring Stylistic Preferences */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1.5">
                  Recurring Stylistic Preferences & Craft Rules
                </label>
                <div className="flex space-x-2 mb-2.5">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPreference())}
                    placeholder="e.g. Anchor scenes in tactile mineral and salt smells..."
                    className="flex-1 min-h-[38px] px-3 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreference}
                    className="min-h-[38px] px-3.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-semibold text-xs hover:opacity-90 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(form.recurringPreferences || []).map((pref, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#EDE4D6]/70 dark:bg-[#2b101c]/70 border border-[#CBBEAC]/60 dark:border-[#4d1e2e] flex items-center justify-between text-xs"
                    >
                      <span className="text-[#292521] dark:text-[#F6F0E7]">{pref}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePreference(idx)}
                        className="text-[#71685E] hover:text-rose-600 dark:hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Voice Notes */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52] mb-1">
                  Custom Character & Voice Notes
                </label>
                <textarea
                  value={form.customVoiceNotes || ''}
                  onChange={(e) => setForm({ ...form, customVoiceNotes: e.target.value })}
                  placeholder="Notes for the AI Writing Assistant and Humanizer regarding idiosyncratic syntax, character viewpoints, or prohibited motifs..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="min-h-[56px] px-6 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#2b101c] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-4 rounded-xl text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="min-h-[40px] px-5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-semibold text-xs hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Voice Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
