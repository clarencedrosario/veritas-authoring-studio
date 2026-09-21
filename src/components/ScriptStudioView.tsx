import React, { useState, useMemo } from 'react';
import {
  Film,
  Plus,
  Trash2,
  Sparkles,
  Play,
  Layers,
  Clock,
  User,
  MapPin,
  ChevronRight,
  Sliders,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  FileText,
} from 'lucide-react';
import { ScriptProject, ScriptScene, ScriptElement, ScriptElementType } from '../types';

interface ScriptStudioViewProps {
  project: ScriptProject;
  onUpdateProject: (updated: ScriptProject) => void;
  isDarkMode: boolean;
}

const ELEMENT_LABELS: Record<ScriptElementType, { label: string; shortcut: string; color: string }> = {
  scene_heading: { label: 'Scene Heading', shortcut: 'S', color: 'bg-amber-800 text-white' },
  action: { label: 'Action', shortcut: 'A', color: 'bg-stone-700 text-white' },
  character: { label: 'Character', shortcut: 'C', color: 'bg-rose-900 text-white' },
  parenthetical: { label: 'Parenthetical', shortcut: 'P', color: 'bg-purple-900 text-white' },
  dialogue: { label: 'Dialogue', shortcut: 'D', color: 'bg-blue-900 text-white' },
  transition: { label: 'Transition', shortcut: 'T', color: 'bg-emerald-900 text-white' },
  shot: { label: 'Shot', shortcut: 'H', color: 'bg-indigo-900 text-white' },
};

export const ScriptStudioView: React.FC<ScriptStudioViewProps> = ({
  project,
  onUpdateProject,
  isDarkMode,
}) => {
  const activeScene = useMemo(() => {
    return project.scenes.find((s) => s.id === project.activeSceneId) || project.scenes[0];
  }, [project]);

  const [activeTab, setActiveTab] = useState<'script' | 'breakdown' | 'characters'>('script');
  const [isGenerating, setIsGenerating] = useState(false);

  // Update active scene
  const handleUpdateActiveScene = (updates: Partial<ScriptScene>) => {
    const updatedScenes = project.scenes.map((s) =>
      s.id === activeScene.id ? { ...s, ...updates } : s
    );
    onUpdateProject({
      ...project,
      scenes: updatedScenes,
    });
  };

  // Add element to active scene
  const handleAddElement = (type: ScriptElementType) => {
    const newEl: ScriptElement = {
      id: `el-${Date.now()}`,
      type,
      text: type === 'scene_heading' ? 'INT. LOCATION - DAY' : type === 'character' ? 'CHARACTER' : '',
    };
    handleUpdateActiveScene({
      elements: [...activeScene.elements, newEl],
    });
  };

  const handleUpdateElement = (elId: string, text: string) => {
    const updated = activeScene.elements.map((el) => (el.id === elId ? { ...el, text } : el));
    handleUpdateActiveScene({ elements: updated });
  };

  const handleChangeElementType = (elId: string, type: ScriptElementType) => {
    const updated = activeScene.elements.map((el) => (el.id === elId ? { ...el, type } : el));
    handleUpdateActiveScene({ elements: updated });
  };

  const handleDeleteElement = (elId: string) => {
    handleUpdateActiveScene({
      elements: activeScene.elements.filter((el) => el.id !== elId),
    });
  };

  // Add new scene
  const handleCreateScene = () => {
    const newSceneId = `sc-${Date.now()}`;
    const nextNum = project.scenes.length + 1;
    const newScene: ScriptScene = {
      id: newSceneId,
      sceneNumber: nextNum,
      heading: `INT. SCENE ${nextNum} - DAY`,
      intExt: 'INT.',
      setting: 'LOCATION',
      timeOfDay: 'DAY',
      synopsis: 'Scene synopsis and dramatic progression...',
      charactersPresent: [],
      pageLengthEstimated: 1.0,
      elements: [
        {
          id: `el-${Date.now()}-1`,
          type: 'scene_heading',
          text: `INT. SCENE ${nextNum} - DAY`,
        },
        {
          id: `el-${Date.now()}-2`,
          type: 'action',
          text: 'The scene begins with visceral physical atmosphere...',
        },
      ],
    };

    onUpdateProject({
      ...project,
      scenes: [...project.scenes, newScene],
      activeSceneId: newSceneId,
    });
  };

  // Screenplay AI helper
  const handleRunScriptAI = async (action: 'dialogue' | 'action_punch' | 'beat_continue') => {
    setIsGenerating(true);
    try {
      const scriptExcerpt = activeScene.elements.map((e) => `${e.type.toUpperCase()}: ${e.text}`).join('\n');
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: action === 'dialogue' ? 'improve_dialogue' : 'continue',
          currentText: scriptExcerpt,
          prompt:
            action === 'dialogue'
              ? 'Polish dialogue for cinema: subtext-heavy, realistic cadence, sharp character voice.'
              : 'Draft next screenplay action beats and character dialogue.',
          chapterTitle: activeScene.heading,
          sceneGoal: activeScene.synopsis,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          // Add as action/dialogue element
          const newEl: ScriptElement = {
            id: `el-${Date.now()}`,
            type: action === 'dialogue' ? 'dialogue' : 'action',
            text: data.result.trim(),
          };
          handleUpdateActiveScene({
            elements: [...activeScene.elements, newEl],
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('Screenplay AI assistant unavailable. Check your Gemini API Key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      id="film-script-studio"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDE4D6] dark:bg-[#1a0812] select-none"
    >
      {/* 1. Top Screenplay Header Bar */}
      <header className="min-h-[52px] px-5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-sm shadow-xs">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Film & Script Studio
              </span>
              <span className="text-xs text-[#CBBEAC]">&bull;</span>
              <span className="text-xs font-serif text-[#71685E] dark:text-[#c9b9a6]">
                {project.format}
              </span>
            </div>
            <h1 className="text-sm font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] truncate max-w-sm sm:max-w-md">
              {project.title} &mdash; Scene {activeScene.sceneNumber}: {activeScene.heading}
            </h1>
          </div>
        </div>

        {/* View Switchers & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-3 text-xs font-mono text-[#71685E] dark:text-[#c9b9a6] border-r border-[#CBBEAC] dark:border-[#4d1e2e] pr-3">
            <span>{project.scenes.length} Scenes</span>
            <span>&bull;</span>
            <span>Est. {project.scenes.reduce((acc, s) => acc + (s.pageLengthEstimated || 1), 0).toFixed(1)} Pages</span>
          </div>

          <div className="flex bg-[#EDE4D6] dark:bg-[#1a0812] rounded-xl p-0.5 border border-[#CBBEAC] dark:border-[#4d1e2e]">
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'script'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Screenplay
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'breakdown'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Breakdown
            </button>
            <button
              onClick={() => setActiveTab('characters')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'characters'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Cast ({project.characters.length})
            </button>
          </div>

          <button
            onClick={handleCreateScene}
            className="min-h-[36px] px-3 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-semibold hover:opacity-90 flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Scene</span>
          </button>
        </div>
      </header>

      {/* 2. Body Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Scene Directory */}
        <aside className="w-60 sm:w-72 border-r border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#CBBEAC] dark:border-[#4d1e2e] flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
              Scene Directory
            </span>
            <span className="text-xs font-mono text-[#71685E]">{project.scenes.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {project.scenes.map((sc) => {
              const isSelected = sc.id === activeScene.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => onUpdateProject({ ...project, activeSceneId: sc.id })}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex flex-col space-y-1 ${
                    isSelected
                      ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                      : 'hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] text-[#292521] dark:text-[#F6F0E7]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10.5px] px-1.5 py-0.2 rounded bg-black/20 font-bold">
                      {sc.sceneNumber}
                    </span>
                    <span className="font-mono font-bold text-[11.5px] truncate">{sc.heading}</span>
                  </div>
                  <p className={`text-[11px] truncate ${isSelected ? 'text-[#EDE4D6]' : 'text-[#71685E]'}`}>
                    {sc.synopsis || 'No synopsis'}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Screenplay Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 select-text">
          {activeTab === 'script' && (
            <div className="w-full max-w-[840px] mx-auto flex-1 flex flex-col space-y-4">
              {/* Screenplay Element Action Bar */}
              <div className="p-2.5 rounded-xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] flex flex-wrap items-center justify-between gap-2 text-xs sticky top-0 z-10 shadow-xs">
                <div className="flex items-center space-x-1.5">
                  {(['scene_heading', 'action', 'character', 'parenthetical', 'dialogue', 'transition'] as ScriptElementType[]).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => handleAddElement(type)}
                        className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-mono hover:bg-[#5A1832] hover:text-[#F6F0E7] transition-colors"
                        title={`Add ${ELEMENT_LABELS[type].label}`}
                      >
                        + {ELEMENT_LABELS[type].label}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRunScriptAI('dialogue')}
                    disabled={isGenerating}
                    className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:opacity-90 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#C29A52]" />
                    <span>Punch Dialogue</span>
                  </button>
                </div>
              </div>

              {/* Standard Screenplay Page (Courier Prime, 8.5 x 11 ratio visual container) */}
              <div className="flex-1 p-8 sm:p-14 rounded-2xl bg-[#FDFBF7] dark:bg-[#15060e] border border-[#CBBEAC] dark:border-[#4d1e2e] shadow-md font-mono text-[14px] leading-normal text-[#1a1a1a] dark:text-[#f0e6eb] space-y-4">
                {activeScene.elements.map((el) => {
                  let styleClass = 'w-full outline-none bg-transparent resize-none border-b border-transparent focus:border-[#5A1832]';
                  let placeholder = 'Write...';

                  if (el.type === 'scene_heading') {
                    styleClass += ' font-bold uppercase tracking-wide text-[14.5px] mt-4 mb-2 text-[#35101F] dark:text-[#C29A52]';
                    placeholder = 'INT. LOCATION - TIME OF DAY';
                  } else if (el.type === 'action') {
                    styleClass += ' text-[13.5px] leading-relaxed my-2';
                    placeholder = 'Describe immediate physical action, camera direction, and atmosphere...';
                  } else if (el.type === 'character') {
                    styleClass += ' font-bold uppercase text-center max-w-xs mx-auto block mt-4 mb-0 tracking-wider text-[#35101F] dark:text-[#F6F0E7]';
                    placeholder = 'CHARACTER NAME';
                  } else if (el.type === 'parenthetical') {
                    styleClass += ' italic text-center max-w-xs mx-auto block text-[12.5px] text-[#71685E] dark:text-[#c9b9a6]';
                    placeholder = '(emotion or delivery beat)';
                  } else if (el.type === 'dialogue') {
                    styleClass += ' text-left max-w-md mx-auto block text-[13.5px] leading-relaxed';
                    placeholder = 'Dialogue line...';
                  } else if (el.type === 'transition') {
                    styleClass += ' font-bold uppercase text-right block mt-3 mb-2 tracking-wider';
                    placeholder = 'CUT TO:';
                  }

                  return (
                    <div key={el.id} className="relative group flex items-start space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={el.text}
                          onChange={(e) => handleUpdateElement(el.id, e.target.value)}
                          placeholder={placeholder}
                          className={styleClass}
                        />
                      </div>

                      {/* Element Controls on hover */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0 pt-1 transition-opacity">
                        <select
                          value={el.type}
                          onChange={(e) => handleChangeElementType(el.id, e.target.value as ScriptElementType)}
                          className="text-[10px] p-0.5 rounded bg-[#EDE4D6] dark:bg-[#2b101c] border border-[#CBBEAC] outline-none"
                        >
                          <option value="scene_heading">Heading</option>
                          <option value="action">Action</option>
                          <option value="character">Character</option>
                          <option value="parenthetical">Parenthetical</option>
                          <option value="dialogue">Dialogue</option>
                          <option value="transition">Transition</option>
                        </select>
                        <button
                          onClick={() => handleDeleteElement(el.id)}
                          className="text-[#71685E] hover:text-rose-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="w-full max-w-[840px] mx-auto p-6 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-5 text-xs">
              <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                Scene {activeScene.sceneNumber} Breakdown & Production Notes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    INT / EXT
                  </label>
                  <select
                    value={activeScene.intExt}
                    onChange={(e) => handleUpdateActiveScene({ intExt: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none"
                  >
                    <option value="INT.">INT. (Interior)</option>
                    <option value="EXT.">EXT. (Exterior)</option>
                    <option value="INT./EXT.">INT./EXT. (Vehicles / Thresholds)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Setting / Location
                  </label>
                  <input
                    type="text"
                    value={activeScene.setting}
                    onChange={(e) => handleUpdateActiveScene({ setting: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Time of Day
                  </label>
                  <select
                    value={activeScene.timeOfDay}
                    onChange={(e) => handleUpdateActiveScene({ timeOfDay: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none"
                  >
                    <option value="DAY">DAY</option>
                    <option value="NIGHT">NIGHT</option>
                    <option value="DUSK">DUSK</option>
                    <option value="DAWN">DAWN</option>
                    <option value="CONTINUOUS">CONTINUOUS</option>
                    <option value="LATER">LATER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                  Dramatic Synopsis & Story Progression
                </label>
                <textarea
                  value={activeScene.synopsis}
                  onChange={(e) => handleUpdateActiveScene({ synopsis: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none font-serif text-sm resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="w-full max-w-[840px] mx-auto p-6 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                Screenplay Cast & Character Dialogue Notes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.characters.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#2b101c] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-2"
                  >
                    <div className="font-mono font-bold text-sm uppercase text-[#35101F] dark:text-[#F6F0E7]">
                      {c.name}
                    </div>
                    <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">{c.description}</p>
                    <div className="p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC]/50 text-[11.5px] font-mono text-[#9A7438] dark:text-[#C29A52]">
                      Voice: {c.dialogueNotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
