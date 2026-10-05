import React, { useState } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  Sliders,
  Check,
  RefreshCw,
  BookOpen,
  Shield,
  Layers,
} from 'lucide-react';
import { ContentAuthorVoiceProfile } from '../../types';

interface AuthorVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceProfile?: ContentAuthorVoiceProfile;
  onUpdateVoiceProfile: (updated: ContentAuthorVoiceProfile) => void;
  isDarkMode: boolean;
}

export const AuthorVoiceModal: React.FC<AuthorVoiceModalProps> = ({
  isOpen,
  onClose,
  voiceProfile,
  onUpdateVoiceProfile,
  isDarkMode,
}) => {
  const [enabled, setEnabled] = useState(voiceProfile?.preserveVoiceEnabled ?? true);
  const [sampleText, setSampleText] = useState(voiceProfile?.sampleWritingSnippet ?? '');
  const [profileName, setProfileName] = useState(voiceProfile?.profileName ?? 'My Signature Editorial Voice');
  const [sentenceRhythm, setSentenceRhythm] = useState(voiceProfile?.sentenceRhythm ?? 'Dynamic variation (alternating crisp clauses with rolling compound sentences)');
  const [vocabularyLevel, setVocabularyLevel] = useState(voiceProfile?.vocabularyLevel ?? 'Elevated & precise without academic pedantry');
  const [preferredParagraphLength, setPreferredParagraphLength] = useState(voiceProfile?.preferredParagraphLength ?? 'Medium (3–4 sentences per paragraph)');
  const [degreeOfFormality, setDegreeOfFormality] = useState(voiceProfile?.degreeOfFormality ?? 4);
  const [punctuationHabits, setPunctuationHabits] = useState(voiceProfile?.punctuationHabits ?? 'Frequent em-dashes and occasional parentheticals');
  const [narrativeDistance, setNarrativeDistance] = useState(voiceProfile?.narrativeDistance ?? 'Close Objective / Engaged Observer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [characteristics, setCharacteristics] = useState<string[]>(voiceProfile?.learnedCharacteristics ?? []);
  const [requestError, setRequestError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyzeSample = async () => {
    if (!sampleText.trim()) return;
    setIsAnalyzing(true);
    setRequestError(null);

    try {
      const res = await fetch('/api/gemini/content-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'learn_author_voice_from_sample',
          selectedText: sampleText,
          currentText: sampleText,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Provider request failed with HTTP ${res.status}.`);
      if (!data.data) throw new Error('The provider returned no voice profile.');
      const profile = data.data;
      if (profile.sentenceRhythm) setSentenceRhythm(profile.sentenceRhythm);
      if (profile.vocabularyLevel) setVocabularyLevel(profile.vocabularyLevel);
      if (profile.preferredParagraphLength) setPreferredParagraphLength(profile.preferredParagraphLength);
      if (profile.degreeOfFormality) setDegreeOfFormality(profile.degreeOfFormality);
      if (profile.punctuationHabits) setPunctuationHabits(profile.punctuationHabits);
      if (profile.narrativeDistance) setNarrativeDistance(profile.narrativeDistance);
      if (profile.learnedCharacteristics) setCharacteristics(profile.learnedCharacteristics);
      setEnabled(true);
    } catch (err) {
      console.error(err);
      setRequestError(err instanceof Error ? err.message : 'Voice analysis request failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    const updated: ContentAuthorVoiceProfile = {
      preserveVoiceEnabled: enabled,
      sampleWritingSnippet: sampleText,
      profileName,
      sentenceRhythm,
      vocabularyLevel,
      preferredParagraphLength,
      degreeOfFormality,
      punctuationHabits,
      narrativeDistance,
      bannedFormulaicPhrases: ['testament to', 'rich tapestry', 'delve into', 'moreover', 'it is important to remember'],
      learnedCharacteristics: characteristics,
    };
    onUpdateVoiceProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#292521] dark:text-[#F6F0E7]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-base shadow-xs">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                Voice Guard & Profile Engine
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Preserve My Voice & Learn Style from Sample
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Master Enable Toggle */}
          <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                Preserve My Voice in All AI Drafting
              </div>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                When enabled, AI adapts all generated drafts and rewrites to mirror your established prose traits.
              </p>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                enabled ? 'bg-[#5A1832] dark:bg-[#C29A52]' : 'bg-[#CBBEAC] dark:bg-[#4d1e2e]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Learn Style from Sample */}
          <div className="p-4 rounded-2xl bg-[#EDE4D6]/70 dark:bg-[#200b14]/70 border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Learn Style from Sample</span>
              </label>
              <span className="text-[10.5px] text-[#71685E]">Paste 150–500 words of your writing</span>
            </div>
            <textarea
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              rows={4}
              placeholder="Paste an excerpt of your best writing here. The AI will analyze your sentence rhythm, vocabulary, and punctuation habits to derive a personalized voice guard for this project..."
              className="w-full p-3 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs leading-relaxed outline-none text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAnalyzeSample}
                disabled={isAnalyzing || !sampleText.trim()}
                className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>Extract Voice Characteristics</span>
              </button>
            </div>
            {requestError && <div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">Voice analysis failed: {requestError}</div>}
          </div>

          {/* Extracted Characteristics */}
          {characteristics.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                Derived Voice Signatures
              </label>
              <div className="p-3 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-1">
                {characteristics.map((c, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-[#35101F] dark:text-[#F6F0E7]">
                    <span className="text-[#9A7438] font-bold">&bull;</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calibrated Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Sentence Rhythm
              </label>
              <input
                type="text"
                value={sentenceRhythm}
                onChange={(e) => setSentenceRhythm(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Vocabulary Register
              </label>
              <input
                type="text"
                value={vocabularyLevel}
                onChange={(e) => setVocabularyLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Formality Level (1 = Casual, 5 = Highly Formal)
              </label>
              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={degreeOfFormality}
                  onChange={(e) => setDegreeOfFormality(Number(e.target.value))}
                  className="flex-1 accent-[#5A1832] dark:accent-[#C29A52]"
                />
                <span className="font-mono font-bold text-xs w-6 text-center">
                  {degreeOfFormality}/5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Punctuation Habits
              </label>
              <input
                type="text"
                value={punctuationHabits}
                onChange={(e) => setPunctuationHabits(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold hover:bg-[#F6F0E7]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Apply Voice Guard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
