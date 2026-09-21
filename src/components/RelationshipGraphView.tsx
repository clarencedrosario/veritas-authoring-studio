import React, { useState } from 'react';
import {
  Network,
  Users,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  AlertTriangle,
  Heart,
  Zap,
  Info,
  Layers,
  ChevronRight,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { NovelProject, CharacterRelationship, Character } from '../types';

interface RelationshipGraphViewProps {
  project: NovelProject;
  onUpdateRelationships: (relationships: CharacterRelationship[]) => void;
  isDarkMode: boolean;
  onNavigateToCharacter?: (characterId: string) => void;
}

const RELATION_STYLES: Record<
  CharacterRelationship['relationshipType'],
  { stroke: string; label: string; strokeDash?: string }
> = {
  Allied: { stroke: '#4f46e5', label: 'Allied' },
  Rival: { stroke: '#dc2626', label: 'Rival', strokeDash: '4 2' },
  Romantic: { stroke: '#db2777', label: 'Romantic' },
  Family: { stroke: '#7c3aed', label: 'Family' },
  Mentor: { stroke: '#2563eb', label: 'Mentor' },
  Betrayal: { stroke: '#991b1b', label: 'Betrayal', strokeDash: '2 2' },
  'Debt / Obligation': { stroke: '#d97706', label: 'Debt / Obligation' },
  'Unresolved Tension': { stroke: '#b45309', label: 'Unresolved Tension', strokeDash: '5 3' },
};

export const RelationshipGraphView: React.FC<RelationshipGraphViewProps> = ({
  project,
  onUpdateRelationships,
  isDarkMode,
  onNavigateToCharacter,
}) => {
  const [selectedRelType, setSelectedRelType] = useState<string>('all');
  const [chapterSlider, setChapterSlider] = useState<number>(project.chapters.length || 1);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(
    project.characterRelationships?.[0]?.id || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<CharacterRelationship>>({});

  const characters = project.characters || [];
  const relationships = project.characterRelationships || [];

  // Filter relationships by type and evolution chapter
  const filteredRelationships = relationships.filter((rel) => {
    const matchesType = selectedRelType === 'all' || rel.relationshipType === selectedRelType;
    const isEvolved = rel.evolutionChapter ? rel.evolutionChapter <= chapterSlider : true;
    return matchesType && isEvolved;
  });

  const selectedRel = relationships.find((r) => r.id === selectedRelationshipId);
  const sourceChar = characters.find((c) => c.id === selectedRel?.sourceCharacterId);
  const targetChar = characters.find((c) => c.id === selectedRel?.targetCharacterId);

  // Layout calculations for characters
  const width = 640;
  const height = 440;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 150;

  const charPositions = characters.reduce((acc, char, idx) => {
    const angle = (idx / characters.length) * 2 * Math.PI - Math.PI / 2;
    acc[char.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
    return acc;
  }, {} as Record<string, { x: number; y: number }>);

  const handleStartCreate = () => {
    if (characters.length < 2) {
      alert('You need at least 2 characters to map an interpersonal relationship.');
      return;
    }
    const newRel: CharacterRelationship = {
      id: `rel-${Date.now()}`,
      sourceCharacterId: characters[0].id,
      targetCharacterId: characters[1].id,
      relationshipType: 'Allied',
      description: '',
      tensionScore: 5,
      status: 'Active',
    };
    setEditFormData(newRel);
    setIsEditing(true);
  };

  const handleStartEdit = (rel: CharacterRelationship) => {
    setEditFormData({ ...rel });
    setIsEditing(true);
  };

  const handleSaveRelationship = () => {
    if (!editFormData.sourceCharacterId || !editFormData.targetCharacterId) return;
    if (editFormData.sourceCharacterId === editFormData.targetCharacterId) {
      alert('A character cannot have a relationship with themselves.');
      return;
    }

    if (relationships.some((r) => r.id === editFormData.id)) {
      const updated = relationships.map((r) =>
        r.id === editFormData.id ? (editFormData as CharacterRelationship) : r
      );
      onUpdateRelationships(updated);
    } else {
      const updated = [...relationships, editFormData as CharacterRelationship];
      onUpdateRelationships(updated);
      setSelectedRelationshipId(editFormData.id!);
    }
    setIsEditing(false);
  };

  const handleDeleteRelationship = (id: string) => {
    if (confirm('Delete this relationship bond?')) {
      const updated = relationships.filter((r) => r.id !== id);
      onUpdateRelationships(updated);
      if (selectedRelationshipId === id) setSelectedRelationshipId(updated[0]?.id || null);
    }
  };

  return (
    <div id="relationship-web-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Editorial Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            Story Workspace
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            Relationship Web &amp; Interpersonal Dynamics
          </h1>
          <span className="text-xs font-mono text-[#9c9c98]">({relationships.length} bonds)</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Chapter evolution slider */}
          <div className="flex items-center space-x-2 text-xs text-[#6e6e6b] dark:text-[#9ca3af]">
            <span className="text-[11px] font-mono">Evolution:</span>
            <span className="font-mono font-medium text-[#191918] dark:text-[#f4f4f5]">
              Ch. {chapterSlider}
            </span>
            <input
              type="range"
              min="1"
              max={Math.max(1, project.chapters.length)}
              value={chapterSlider}
              onChange={(e) => setChapterSlider(parseInt(e.target.value))}
              className="w-20 accent-[#4f46e5]"
            />
          </div>

          <button
            onClick={handleStartCreate}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Bond</span>
          </button>
        </div>
      </header>

      {/* Main Two-Pane View: Left = Professional Graph Canvas, Right = Contextual Inspector Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
          {/* Filter Pills */}
          <div className="absolute top-4 left-6 flex items-center space-x-1 text-xs">
            <span className="text-[11px] font-mono text-[#9c9c98] mr-1">Filter:</span>
            <button
              onClick={() => setSelectedRelType('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedRelType === 'all'
                  ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                  : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#ecece9] dark:hover:bg-[#1e1f23]'
              }`}
            >
              All Types
            </button>
            {(Object.keys(RELATION_STYLES) as CharacterRelationship['relationshipType'][]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedRelType(type)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedRelType === type
                    ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                    : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#ecece9] dark:hover:bg-[#1e1f23]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* SVG Graph Canvas */}
          <div className="w-full max-w-2xl h-[460px] flex items-center justify-center relative">
            <svg width={width} height={height} className="overflow-visible">
              {/* Edges (Relationships) */}
              {filteredRelationships.map((rel) => {
                const p1 = charPositions[rel.sourceCharacterId];
                const p2 = charPositions[rel.targetCharacterId];
                if (!p1 || !p2) return null;

                const isSelected = rel.id === selectedRelationshipId;
                const style = RELATION_STYLES[rel.relationshipType] || RELATION_STYLES.Allied;

                // Midpoint for label
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                return (
                  <g
                    key={rel.id}
                    onClick={() => setSelectedRelationshipId(rel.id)}
                    className="cursor-pointer group"
                  >
                    {/* Hover hit area */}
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="transparent"
                      strokeWidth="16"
                    />
                    {/* Visible line */}
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={style.stroke}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={style.strokeDash}
                      className="transition-all opacity-80 group-hover:opacity-100"
                    />
                    {/* Tension Indicator Dot at Midpoint */}
                    <circle
                      cx={midX}
                      cy={midY}
                      r={isSelected ? 10 : 8}
                      className="fill-white dark:fill-[#141517] stroke-current transition-all"
                      style={{ stroke: style.stroke, strokeWidth: 2 }}
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-[#191918] dark:fill-[#f4f4f5] pointer-events-none"
                    >
                      {rel.tensionScore}
                    </text>
                  </g>
                );
              })}

              {/* Character Nodes */}
              {characters.map((char) => {
                const pos = charPositions[char.id];
                if (!pos) return null;

                return (
                  <g
                    key={char.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer group"
                    onClick={() => onNavigateToCharacter && onNavigateToCharacter(char.id)}
                  >
                    {/* Node Circle */}
                    <circle
                      r="26"
                      className="fill-white dark:fill-[#141517] stroke-[#e8e8e6] dark:stroke-[#28292d] group-hover:stroke-[#4f46e5] stroke-[2px] transition-all"
                    />

                    {/* Character Avatar or Monogram */}
                    <text
                      textAnchor="middle"
                      y="4"
                      className="text-xs font-serif font-bold fill-[#191918] dark:fill-[#f4f4f5] pointer-events-none"
                    >
                      {char.name.slice(0, 2).toUpperCase()}
                    </text>

                    {/* Node Label Below */}
                    <text
                      textAnchor="middle"
                      y="40"
                      className="text-[11px] font-serif font-semibold fill-[#191918] dark:fill-[#f4f4f5] pointer-events-none"
                    >
                      {char.name}
                    </text>
                    <text
                      textAnchor="middle"
                      y="52"
                      className="text-[9.5px] font-sans fill-[#9c9c98] pointer-events-none"
                    >
                      {char.role} &bull; {char.archetype}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Contextual Inspector Panel */}
        <div className="w-88 shrink-0 border-l border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex flex-col overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#ecece9] dark:border-[#242528] pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
              Bond Inspector
            </span>
            {selectedRel && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleStartEdit(selectedRel)}
                  className="p-1 text-[#9c9c98] hover:text-[#191918] rounded"
                  title="Edit Bond"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteRelationship(selectedRel.id)}
                  className="p-1 text-[#9c9c98] hover:text-[#b91c1c] rounded"
                  title="Delete Bond"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            /* Edit Form in Inspector */
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Source Character</label>
                <select
                  value={editFormData.sourceCharacterId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, sourceCharacterId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Target Character</label>
                <select
                  value={editFormData.targetCharacterId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, targetCharacterId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Relationship Type</label>
                <select
                  value={editFormData.relationshipType || 'Allied'}
                  onChange={(e) => setEditFormData({ ...editFormData, relationshipType: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  {Object.keys(RELATION_STYLES).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">
                  Tension Score (1-10): <span className="font-mono text-[#4f46e5]">{editFormData.tensionScore || 5}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editFormData.tensionScore || 5}
                  onChange={(e) => setEditFormData({ ...editFormData, tensionScore: parseInt(e.target.value) })}
                  className="w-full accent-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Qualitative Dynamics &amp; Subtext</label>
                <textarea
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={4}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#dcdcd9] dark:border-[#38393d] text-[#6e6e6b] dark:text-[#9ca3af]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRelationship}
                  className="px-4 py-1.5 bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] rounded-lg font-medium shadow-2xs"
                >
                  Save Bond
                </button>
              </div>
            </div>
          ) : selectedRel && sourceChar && targetChar ? (
            /* Selected Relationship Inspection */
            <div className="space-y-6 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]">
                    {selectedRel.relationshipType}
                  </span>
                  <span className="text-[10px] font-mono text-[#9c9c98]">Status: {selectedRel.status}</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                  <span>{sourceChar.name}</span>
                  <span className="text-[#9c9c98] font-mono text-xs font-normal">&harr;</span>
                  <span>{targetChar.name}</span>
                </div>
              </div>

              {/* Tension Gauge */}
              <div className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#18191b] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#9c9c98]">Dramatic Tension</span>
                  <span className="font-mono font-bold text-[#4f46e5] dark:text-[#818cf8]">
                    {selectedRel.tensionScore}/10
                  </span>
                </div>
                <div className="w-full bg-[#e8e8e6] dark:bg-[#28292d] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#4f46e5] h-full rounded-full transition-all"
                    style={{ width: `${(selectedRel.tensionScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Qualitative Notes */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#9c9c98]">Qualitative Notes</span>
                <p className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed font-serif">
                  {selectedRel.description}
                </p>
              </div>

              {/* Narrative Consequences */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#9c9c98]">Narrative Consequences</span>
                <div className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] text-xs text-[#6e6e6b] dark:text-[#9ca3af] leading-relaxed">
                  Tension escalates past Chapter {selectedRel.evolutionChapter || 1}. If confrontation remains unresolved, characters will be forced into an irreversible betrayal or alliance during Act II.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-xs text-[#9c9c98]">
              Select a bond line in the graph to inspect interpersonal dynamics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
