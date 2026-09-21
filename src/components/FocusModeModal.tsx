import React, { useState, useEffect, useRef } from 'react';
import {
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  Type,
  ShieldCheck,
} from 'lucide-react';
import { playAmbientTrack, stopAmbientTrack, AmbientSoundType } from '../utils/ambientAudio';

interface FocusModeModalProps {
  content: string;
  onUpdateContent: (newContent: string) => void;
  onClose: () => void;
  chapterTitle: string;
  sceneTitle: string;
  isDarkMode: boolean;
}

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  content,
  onUpdateContent,
  onClose,
  chapterTitle,
  sceneTitle,
  isDarkMode: initialDarkMode,
}) => {
  const [modeTheme, setModeTheme] = useState<'dark' | 'sepia' | 'light'>(
    initialDarkMode ? 'dark' : 'sepia'
  );
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState<'EB Garamond' | 'Lora' | 'Plus Jakarta Sans'>('EB Garamond');
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');
  const [soundVolume, setSoundVolume] = useState(0.5);

  // Sprint Timer (25 min default)
  const [sprintSeconds, setSprintSeconds] = useState(25 * 60);
  const [isSprintActive, setIsSprintActive] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: Escape to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Sprint Timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isSprintActive && sprintSeconds > 0) {
      interval = setInterval(() => {
        setSprintSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (sprintSeconds === 0 && isSprintActive) {
      setIsSprintActive(false);
      alert('Writing sprint completed! Excellent progress.');
    }
    return () => clearInterval(interval);
  }, [isSprintActive, sprintSeconds]);

  // Ambient sound controller
  const handleToggleSound = (type: AmbientSoundType) => {
    if (activeSound === type) {
      stopAmbientTrack();
      setActiveSound('none');
    } else {
      playAmbientTrack(type, soundVolume);
      setActiveSound(type);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientTrack();
    };
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Theme styling definitions
  const themeClasses = {
    dark: 'bg-[#0f1117] text-[#e2e8f0] selection:bg-amber-900/60',
    sepia: 'bg-[#fbf7ee] text-[#2c251e] selection:bg-amber-200',
    light: 'bg-[#ffffff] text-[#1e293b] selection:bg-amber-100',
  }[modeTheme];

  const toolbarTheme = {
    dark: 'bg-slate-900/80 border-slate-800 text-slate-300',
    sepia: 'bg-stone-100/90 border-amber-200/80 text-stone-700',
    light: 'bg-white/90 border-stone-200 text-stone-700',
  }[modeTheme];

  return (
    <div
      id="focus-mode-overlay"
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${themeClasses}`}
    >
      {/* Floating Top Controls (Fade out when typing) */}
      <header className="px-8 py-4 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-3 text-xs font-serif">
          <span className="font-semibold">{chapterTitle}</span>
          <span>•</span>
          <span className="italic">{sceneTitle}</span>
        </div>

        {/* Ambient & Sprint Controls */}
        <div className="flex items-center space-x-4">
          {/* Sprint Timer */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span>{formatTimer(sprintSeconds)}</span>
            <button
              onClick={() => setIsSprintActive(!isSprintActive)}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
              title={isSprintActive ? 'Pause Sprint' : 'Start 25m Sprint'}
            >
              {isSprintActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setIsSprintActive(false);
                setSprintSeconds(25 * 60);
              }}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
              title="Reset Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Ambient Soundscape selector */}
          <div className="flex items-center space-x-1 text-xs">
            {(['rain', 'fireplace', 'crickets', 'white_noise'] as const).map((soundKey) => (
              <button
                key={soundKey}
                onClick={() => handleToggleSound(soundKey)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeSound === soundKey
                    ? 'bg-amber-600 text-white'
                    : 'hover:bg-black/10 dark:hover:bg-white/10 text-stone-500'
                }`}
              >
                {soundKey === 'rain' ? 'Rain' : soundKey === 'fireplace' ? 'Fire' : soundKey === 'crickets' ? 'Night' : 'Noise'}
              </button>
            ))}
            {activeSound !== 'none' && (
              <button
                onClick={() => handleToggleSound('none')}
                className="p-1 rounded text-red-500 hover:bg-black/10"
                title="Mute Sound"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center space-x-1 p-0.5 rounded border border-current/20 text-xs">
            <button
              onClick={() => setModeTheme('dark')}
              className={`px-2 py-0.5 rounded text-[10px] ${modeTheme === 'dark' ? 'bg-amber-600 text-white' : ''}`}
            >
              Dark
            </button>
            <button
              onClick={() => setModeTheme('sepia')}
              className={`px-2 py-0.5 rounded text-[10px] ${modeTheme === 'sepia' ? 'bg-amber-600 text-white' : ''}`}
            >
              Sepia
            </button>
            <button
              onClick={() => setModeTheme('light')}
              className={`px-2 py-0.5 rounded text-[10px] ${modeTheme === 'light' ? 'bg-amber-600 text-white' : ''}`}
            >
              Light
            </button>
          </div>

          {/* Exit Focus Mode */}
          <button
            id="btn-exit-focus-mode"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center space-x-1 text-xs"
            title="Exit Focus Mode (Esc)"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Distraction-Free Canvas */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-8 py-6 flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onUpdateContent(e.target.value)}
          placeholder="Unleash your prose without distraction..."
          autoFocus
          style={{
            fontFamily: `"${fontFamily}", Georgia, serif`,
            fontSize: `${fontSize}px`,
            lineHeight: '1.9',
          }}
          className="w-full flex-1 bg-transparent border-none outline-none resize-none p-0 tracking-normal"
        />
      </div>

      {/* Bottom Floating Word Count & Aesthetics pill */}
      <footer className="py-3 px-8 flex items-center justify-between text-xs opacity-25 hover:opacity-100 transition-opacity">
        <span className="font-mono">{wordCount.toLocaleString()} words</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFontSize(Math.max(16, fontSize - 2))}
            className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize(Math.min(28, fontSize + 2))}
            className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
          >
            A+
          </button>
        </div>
      </footer>
    </div>
  );
};
