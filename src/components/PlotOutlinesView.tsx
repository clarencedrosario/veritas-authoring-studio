import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { PlotBeat, NovelProject } from '../types';

interface PlotOutlinesViewProps {
  project: NovelProject;
  onUpdatePlotBeats: (beats: PlotBeat[]) => void;
  isDarkMode: boolean;
  onNavigateToScene?: (chapterId: string, sceneId: string) => void;
}

const ACTS: PlotBeat['act'][] = [
  'Act I (Beginning)',
  'Act II (Middle)',
  'Act III (Climax & Resolution)',
];

const BEAT_TYPES: PlotBeat['beatType'][] = [
  'Hook',
  'Inciting Incident',
  'First Plot Point',
  'Midpoint',
  'All Hope Lost',
  'Climax',
  'Resolution',
  'Custom',
];

export const PlotOutlinesView: React.FC<PlotOutlinesViewProps> = ({
  project,
  onUpdatePlotBeats,
  isDarkMode,
  onNavigateToScene,
}) => {
  const [selectedAct, setSelectedAct] = useState<string>('All');
  const [isAddingBeat, setIsAddingBeat] = useState(false);
  const [editingBeatId, setEditingBeatId] = useState<string | null>(null);

  // Form state
  const [newBeatAct, setNewBeatAct] = useState<PlotBeat['act']>('Act I (Beginning)');
  const [newBeatType, setNewBeatType] = useState<PlotBeat['beatType']>('Inciting Incident');
  const [newBeatTitle, setNewBeatTitle] = useState('');
  const [newBeatDesc, setNewBeatDesc] = useState('');
  const [newBeatTension, setNewBeatTension] = useState(5);
  const [newBeatChapterId, setNewBeatChapterId] = useState('');

  const beats = project.plotBeats || [];
  const chapters = project.chapters || [];

  const handleAddBeat = () => {
    if (!newBeatTitle.trim()) return;

    const newBeat: PlotBeat = {
      id: `beat-${Date.now()}`,
      act: newBeatAct,
      beatType: newBeatType,
      title: newBeatTitle.trim(),
      description: newBeatDesc.trim(),
      tensionLevel: newBeatTension,
      status: 'Planned',
      linkedChapterId: newBeatChapterId || undefined,
    };

    onUpdatePlotBeats([...beats, newBeat]);
    setIsAddingBeat(false);
    setNewBeatTitle('');
    setNewBeatDesc('');
  };

  const handleDeleteBeat = (id: string) => {
    if (confirm('Delete this narrative beat?')) {
      onUpdatePlotBeats(beats.filter((b) => b.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, status: PlotBeat['status']) => {
    onUpdatePlotBeats(beats.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const filteredBeats =
    selectedAct === 'All' ? beats : beats.filter((b) => b.act === selectedAct);

  // Calculate tension points for SVG curve
  const points = beats.map((b, i) => {
    const x = beats.length > 1 ? (i / (beats.length - 1)) * 100 : 50;
    const y = 100 - (b.tensionLevel / 10) * 80 - 10;
    return { x, y, beat: b };
  });

  const svgPath =
    points.length > 1
      ? points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')
      : '';

  return (
    <div id="plot-architecture-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Editorial Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            Story Workspace
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            Plot Architecture &amp; Dramatic Arc
          </h1>
          <span className="text-xs font-mono text-[#9c9c98]">({beats.length} beats)</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center rounded-lg border border-[#e8e8e6] dark:border-[#28292d] p-0.5 bg-[#fbfbfa] dark:bg-[#18191b] text-xs">
            {['All', ...ACTS].map((actName) => (
              <button
                key={actName}
                onClick={() => setSelectedAct(actName)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedAct === actName
                    ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs'
                    : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
                }`}
              >
                {actName === 'All' ? 'All Acts' : actName.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingBeat(true)}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Beat</span>
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
        {/* Narrative Tension Arc Visualizer (Refined, no rainbow slop) */}
        <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#4f46e5] dark:text-[#818cf8]" />
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#191918] dark:text-[#f4f4f5]">
                Narrative Tension Progression
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#9c9c98]">
              Dramatic Stakes Curve across Manuscript
            </span>
          </div>

          <div className="h-28 relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Reference Grid lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeDasharray="2 2" className="text-[#e8e8e6] dark:text-[#28292d]" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeDasharray="2 2" className="text-[#e8e8e6] dark:text-[#28292d]" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeDasharray="2 2" className="text-[#e8e8e6] dark:text-[#28292d]" />

              {/* Tension Curve */}
              {svgPath && (
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  className="transition-all"
                />
              )}

              {/* Beat Points */}
              {points.map((pt, i) => (
                <g key={i} className="cursor-pointer group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    className="fill-white dark:fill-[#141517] stroke-[#4f46e5] stroke-[2px] transition-transform group-hover:scale-150"
                  />
                </g>
              ))}
            </svg>

            {/* Tension Labels */}
            <div className="flex justify-between text-[10px] font-mono text-[#9c9c98] mt-2">
              <span>Act I: Exposition</span>
              <span>Act II: Rising Action &amp; Midpoint</span>
              <span>Act III: Climax &amp; Denouement</span>
            </div>
          </div>
        </div>

        {/* Add Beat Form Modal/Drawer */}
        {isAddingBeat && (
          <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-4 text-xs shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#ecece9] dark:border-[#28292d] pb-3">
              <h3 className="font-serif font-bold text-sm text-[#191918] dark:text-[#f4f4f5]">
                Add Narrative Beat
              </h3>
              <button
                onClick={() => setIsAddingBeat(false)}
                className="text-xs text-[#9c9c98] hover:text-[#191918]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Beat Title</label>
                <input
                  type="text"
                  value={newBeatTitle}
                  onChange={(e) => setNewBeatTitle(e.target.value)}
                  placeholder="e.g. Discovery of the Subterranean Cloister"
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Act</label>
                <select
                  value={newBeatAct}
                  onChange={(e) => setNewBeatAct(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  {ACTS.map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Beat Type</label>
                <select
                  value={newBeatType}
                  onChange={(e) => setNewBeatType(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  {BEAT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">
                  Tension Level (1-10): <span className="font-mono text-[#4f46e5]">{newBeatTension}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newBeatTension}
                  onChange={(e) => setNewBeatTension(parseInt(e.target.value))}
                  className="w-full accent-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Linked Chapter</label>
                <select
                  value={newBeatChapterId}
                  onChange={(e) => setNewBeatChapterId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  <option value="">Unassigned</option>
                  {chapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                      Ch. {chap.number}: {chap.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Beat Description &amp; Stakes</label>
              <textarea
                value={newBeatDesc}
                onChange={(e) => setNewBeatDesc(e.target.value)}
                rows={3}
                placeholder="Describe what occurs, why it matters, and the irreversible change it produces..."
                className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsAddingBeat(false)}
                className="px-3 py-1.5 rounded-lg border border-[#dcdcd9] dark:border-[#38393d] text-[#6e6e6b] dark:text-[#9ca3af]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBeat}
                className="px-4 py-2 bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] rounded-lg font-medium shadow-2xs"
              >
                Save Beat
              </button>
            </div>
          </div>
        )}

        {/* Narrative Beats Organized by Acts */}
        <div className="space-y-8">
          {ACTS.map((act) => {
            const actBeats = filteredBeats.filter((b) => b.act === act);
            if (actBeats.length === 0 && selectedAct !== 'All') return null;

            return (
              <div key={act} className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-[#e8e8e6] dark:border-[#28292d] pb-2">
                  <h2 className="text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                    {act}
                  </h2>
                  <span className="text-[11px] font-mono text-[#9c9c98]">
                    ({actBeats.length} beats)
                  </span>
                </div>

                <div className="space-y-3">
                  {actBeats.map((beat) => {
                    const linkedChap = chapters.find((c) => c.id === beat.linkedChapterId);
                    return (
                      <div
                        key={beat.id}
                        className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs hover:border-[#4f46e5]/40 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-[#ecece9] dark:border-[#242528]">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]">
                              {beat.beatType}
                            </span>
                            <span className="text-[10px] font-mono text-[#9c9c98]">
                              Tension: <strong className="text-[#4f46e5] dark:text-[#818cf8] font-bold">{beat.tensionLevel}/10</strong>
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {linkedChap && (
                              <button
                                onClick={() => onNavigateToScene && onNavigateToScene(linkedChap.id, linkedChap.scenes[0]?.id || '')}
                                className="text-[11px] font-mono text-[#4f46e5] dark:text-[#818cf8] hover:underline flex items-center space-x-1"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>Ch. {linkedChap.number}</span>
                              </button>
                            )}

                            {/* Status Selector */}
                            <select
                              value={beat.status}
                              onChange={(e) => handleUpdateStatus(beat.id, e.target.value as any)}
                              className="text-[11px] font-mono py-0.5 px-2 rounded border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                            >
                              <option value="Planned">Planned</option>
                              <option value="Drafted">Drafted</option>
                              <option value="Revised">Revised</option>
                            </select>

                            <button
                              onClick={() => handleDeleteBeat(beat.id)}
                              className="p-1 text-[#9c9c98] hover:text-[#b91c1c] transition-colors"
                              title="Delete beat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                          {beat.title}
                        </h3>

                        <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] mt-1 leading-relaxed">
                          {beat.description}
                        </p>

                        {beat.notes && (
                          <div className="mt-3 p-2.5 rounded-lg bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] italic">
                            Editorial Note: {beat.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
