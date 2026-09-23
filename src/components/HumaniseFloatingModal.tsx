import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  X,
  RotateCcw,
  Sliders,
  Feather,
  ArrowRight,
  Eye,
  AlertCircle,
  Copy,
  RefreshCw,
} from 'lucide-react';

interface HumaniseFloatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceText: string;
  onApplyText: (newText: string) => void;
  authorVoiceName?: string;
  isDarkMode: boolean;
  workspaceContext?: string;
}

export const HumaniseFloatingModal: React.FC<HumaniseFloatingModalProps> = ({
  isOpen,
  onClose,
  sourceText,
  onApplyText,
  authorVoiceName = 'Julian Mercer (Literary Precision)',
  isDarkMode,
  workspaceContext = 'novel',
}) => {
  const [intensity, setIntensity] = useState<'Light' | 'Balanced' | 'Strong'>('Balanced');
  const [currentDraft, setCurrentDraft] = useState(sourceText);
  const [revisedText, setRevisedText] = useState<string | null>(null);
  const [previousText, setPreviousText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDraft(sourceText);
    setRevisedText(null);
    setPreviousText(null);
    setErrorMsg(null);
  }, [sourceText, isOpen]);

  if (!isOpen) return null;

  const handleRunHumanise = async () => {
    if (!currentDraft.trim()) {
      setErrorMsg('Please ensure there is text to humanize.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'humanize',
          currentText: currentDraft,
          intensity,
          authorVoice: authorVoiceName,
          workspace: workspaceContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.result) {
        setRevisedText(data.result);
      } else {
        throw new Error('Humanise could not be completed. Your original text is unchanged.');
      }
    } catch (err: any) {
      setRevisedText(null);
      setErrorMsg(
        err.message?.includes('Humanise')
          ? err.message
          : 'Humanise could not be completed. Your original text is unchanged.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccept = () => {
    if (revisedText) {
      setPreviousText(currentDraft);
      onApplyText(revisedText);
      onClose();
    }
  };

  const handleReject = () => {
    setRevisedText(null);
  };

  const handleUndo = () => {
    if (previousText) {
      onApplyText(previousText);
      setCurrentDraft(previousText);
      setRevisedText(null);
      setPreviousText(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] text-[#292521] dark:text-[#F6F0E7] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#2c1320] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-[#5A1832] text-[#C29A52]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Humanise &amp; Voice Calibration
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#5A1832]/10 dark:bg-[#5A1832]/40 text-[#5A1832] dark:text-[#C29A52]">
                  {authorVoiceName}
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] font-sans mt-0.5">
                Editorial rhythm optimization: injects organic cadence variation and dismantles repetitive phrasing.
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

        {/* Intensity Selection Toolbar */}
        <div className="px-6 py-2.5 border-b border-[#CBBEAC]/50 dark:border-[#4d1e2e]/50 bg-[#F6F0E7] dark:bg-[#200b14] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#71685E] dark:text-[#D8CCBC]">Intensity:</span>
            <div className="flex rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] p-0.5 bg-[#EDE4D6] dark:bg-[#35101F]">
              {(['Light', 'Balanced', 'Strong'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    intensity === level
                      ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                      : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#35101F] dark:hover:text-[#F6F0E7]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRunHumanise}
            disabled={isProcessing || !currentDraft.trim()}
            className="h-8 px-4 rounded-lg bg-[#5A1832] hover:bg-[#722040] disabled:opacity-50 text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            {isProcessing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C29A52]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
            )}
            <span>{isProcessing ? 'Calibrating Rhythm...' : 'Humanise Prose'}</span>
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRunHumanise}
                className="px-2.5 py-1 bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 text-amber-950 dark:text-amber-100 rounded font-semibold text-xs cursor-pointer transition-colors"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="px-2 py-1 text-amber-800 dark:text-amber-300 hover:text-amber-950 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Comparison Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Text Column */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#71685E] dark:text-[#D8CCBC]">
                Original Working Prose ({currentDraft.split(/\s+/).filter(Boolean).length} words)
              </span>
            </div>
            <textarea
              value={currentDraft}
              onChange={(e) => setCurrentDraft(e.target.value)}
              placeholder="Paste or type text to calibrate..."
              className="flex-1 min-h-[220px] p-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#25101d] text-xs font-serif leading-relaxed text-[#292521] dark:text-[#F6F0E7] outline-none focus:ring-2 focus:ring-[#C29A52] resize-none"
            />
          </div>

          {/* Revised Text Column */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                {revisedText ? `Calibrated Prose (${revisedText.split(/\s+/).filter(Boolean).length} words)` : 'Calibrated Output'}
              </span>
              {revisedText && (
                <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  &bull; Dynamic Cadence Injected
                </span>
              )}
            </div>

            <div className="flex-1 min-h-[220px] p-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#FAF8F5] dark:bg-[#1a0b14] text-xs font-serif leading-relaxed text-[#292521] dark:text-[#F6F0E7] overflow-y-auto whitespace-pre-wrap">
              {isProcessing ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#71685E] dark:text-[#D8CCBC] space-y-2 py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#C29A52]" />
                  <p className="text-xs">Applying burstiness and author voice calibration...</p>
                </div>
              ) : revisedText ? (
                revisedText
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#71685E]/60 dark:text-[#D8CCBC]/60 py-12">
                  <Feather className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">Select intensity and click "Humanise Prose" to inspect the revised rhythm.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#2c1320] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            {previousText && (
              <button
                onClick={handleUndo}
                className="h-7.5 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#71685E] dark:text-[#D8CCBC] hover:text-[#292521] flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo Last Applied</span>
              </button>
            )}
            <span className="text-[10.5px] italic text-[#71685E] dark:text-[#D8CCBC]">
              Editorial rewriting tool &bull; Organic cadence &amp; syntactic variety
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {revisedText && (
              <button
                onClick={handleReject}
                className="h-8 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-medium text-[#71685E] dark:text-[#D8CCBC] hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 cursor-pointer"
              >
                Reject
              </button>
            )}
            <button
              onClick={handleAccept}
              disabled={!revisedText}
              className="h-8 px-4 rounded-lg bg-[#5A1832] hover:bg-[#722040] disabled:opacity-40 text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Accept Revision</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
