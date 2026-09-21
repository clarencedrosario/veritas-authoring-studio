import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { NovelProject, TimelineEvent } from '../types';

interface TimelineViewProps {
  project: NovelProject;
  onUpdateTimeline: (events: TimelineEvent[]) => void;
  isDarkMode: boolean;
  onNavigateToScene?: (chapterId: string, sceneId: string) => void;
}

const TRACK_LABELS: Record<TimelineEvent['track'], string> = {
  'Main Quest': 'Main Narrative Quest',
  'Character Arc / Romance': 'Character Arc & Secrets',
  'Antagonist Conspiracy': 'Antagonist & Syndicate',
  'Historical Lore': 'Historical Canon & Eras',
};

export const TimelineView: React.FC<TimelineViewProps> = ({
  project,
  onUpdateTimeline,
  isDarkMode,
  onNavigateToScene,
}) => {
  const [viewMode, setViewMode] = useState<'chronological' | 'narrative'>('chronological');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<TimelineEvent>>({});
  const [showConflictBanner, setShowConflictBanner] = useState(true);

  const events = project.timelineEvents || [];
  const characters = project.characters || [];
  const chapters = project.chapters || [];

  // Extract unique locations
  const locations = Array.from(
    new Set(events.map((e) => e.location).filter(Boolean) as string[])
  );

  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchesTrack = selectedTrack === 'all' || e.track === selectedTrack;
    const matchesChar =
      selectedCharacterFilter === 'all' || e.povCharacterId === selectedCharacterFilter;
    const matchesLoc =
      selectedLocationFilter === 'all' || e.location === selectedLocationFilter;
    const matchesChap =
      selectedChapterFilter === 'all' || e.narrativeChapterId === selectedChapterFilter;

    return matchesTrack && matchesChar && matchesLoc && matchesChap;
  });

  // Sort events based on selected mode
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (viewMode === 'chronological') {
      return a.storyOrder - b.storyOrder;
    } else {
      const chapA = a.narrativeChapterId
        ? chapters.findIndex((c) => c.id === a.narrativeChapterId)
        : 999;
      const chapB = b.narrativeChapterId
        ? chapters.findIndex((c) => c.id === b.narrativeChapterId)
        : 999;
      if (chapA !== chapB) return chapA - chapB;
      return a.storyOrder - b.storyOrder;
    }
  });

  const handleStartCreate = () => {
    const nextOrder = events.length > 0 ? Math.max(...events.map((e) => e.storyOrder)) + 1 : 1;
    const newEvent: TimelineEvent = {
      id: `time-${Date.now()}`,
      title: 'New Chronology Event',
      storyDate: 'Present Day, October 5',
      storyOrder: nextOrder,
      track: 'Main Quest',
      summary: '',
      impactLevel: 'Medium',
      isFlashback: false,
      location: 'Blackwater Cape',
    };
    setEditFormData(newEvent);
    setIsEditing(true);
  };

  const handleStartEdit = (event: TimelineEvent) => {
    setEditFormData({ ...event });
    setIsEditing(true);
  };

  const handleSaveEvent = () => {
    if (!editFormData.title) return;

    if (events.some((e) => e.id === editFormData.id)) {
      const updated = events.map((e) =>
        e.id === editFormData.id ? (editFormData as TimelineEvent) : e
      );
      onUpdateTimeline(updated);
    } else {
      const updated = [...events, editFormData as TimelineEvent];
      onUpdateTimeline(updated);
    }
    setIsEditing(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event from the timeline?')) {
      const updated = events.filter((e) => e.id !== id);
      onUpdateTimeline(updated);
      setIsEditing(false);
    }
  };

  return (
    <div id="timeline-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Workspace Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            Story Workspace
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            Chronology &amp; Timeline
          </h1>
          <span className="text-xs font-mono text-[#9c9c98]">({events.length} events)</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Dual-View Mode Switcher */}
          <div className="flex items-center rounded-lg border border-[#e8e8e6] dark:border-[#28292d] p-0.5 bg-[#fbfbfa] dark:bg-[#18191b] text-xs">
            <button
              onClick={() => setViewMode('chronological')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'chronological'
                  ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs'
                  : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
              }`}
            >
              Story Chronology
            </button>
            <button
              onClick={() => setViewMode('narrative')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'narrative'
                  ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs'
                  : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
              }`}
            >
              Narrative Reveal Order
            </button>
          </div>

          <button
            onClick={handleStartCreate}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </header>

      {/* Editorial Filter Bar */}
      <div className="px-6 py-2.5 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
          {/* Track Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-[#9c9c98] text-[11px] font-mono">Track:</span>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="text-xs py-1 px-2 rounded-md border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
            >
              <option value="all">All Tracks</option>
              {Object.keys(TRACK_LABELS).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Character Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-[#9c9c98] text-[11px] font-mono">POV / Character:</span>
            <select
              value={selectedCharacterFilter}
              onChange={(e) => setSelectedCharacterFilter(e.target.value)}
              className="text-xs py-1 px-2 rounded-md border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
            >
              <option value="all">All Characters</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          {locations.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-[#9c9c98] text-[11px] font-mono">Location:</span>
              <select
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value)}
                className="text-xs py-1 px-2 rounded-md border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
              >
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Chapter Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-[#9c9c98] text-[11px] font-mono">Chapter:</span>
            <select
              value={selectedChapterFilter}
              onChange={(e) => setSelectedChapterFilter(e.target.value)}
              className="text-xs py-1 px-2 rounded-md border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
            >
              <option value="all">All Chapters</option>
              {chapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  Chapter {chap.number}: {chap.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-[11px] font-mono text-[#9c9c98]">
          Showing {sortedEvents.length} of {events.length} chronological events
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full space-y-6">
        {/* Continuity Conflict Callout (As specifically specified in Prompt: "CONTINUITY CONFLICT...") */}
        {showConflictBanner && (
          <div className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#38393d] bg-white dark:bg-[#141517] shadow-2xs flex items-start justify-between gap-4 text-xs">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-[10px] uppercase font-bold text-[#d97706]">
                  Continuity Conflict Audit
                </div>
                <p className="text-xs font-serif text-[#191918] dark:text-[#f4f4f5] mt-1 leading-relaxed">
                  <strong>Chapter 1:</strong> Julian Mercer inspects the North Gallery at 18:15 sundown and measures the 3-meter drift.
                  <br />
                  <strong>Historical Timeline:</strong> The 1912 cipher requires astronomical low tide (occurring at 20:45 on October 3).
                </p>
                <span className="text-[10px] text-[#9c9c98] block mt-1">
                  Temporal margin: 2h 30m discrepancy. Recommendation: Align tidal table or add narrative bridge.
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onNavigateToScene && onNavigateToScene('chap-1', 'scene-1-2')}
                className="px-3 py-1.5 rounded text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] bg-[#fbfbfa] dark:bg-[#1f2023] hover:bg-white text-[#191918] dark:text-[#f4f4f5] transition-colors"
              >
                Review Conflict
              </button>
              <button
                onClick={() => setShowConflictBanner(false)}
                className="text-[#9c9c98] hover:text-[#191918] text-xs px-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Edit Form Modal/Drawer */}
        {isEditing && (
          <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-4 text-xs shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#ecece9] dark:border-[#28292d] pb-3">
              <h3 className="font-serif font-bold text-sm text-[#191918] dark:text-[#f4f4f5]">
                {editFormData.id ? 'Edit Chronology Event' : 'Add Chronology Event'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-[#9c9c98] hover:text-[#191918]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Event Title</label>
                <input
                  type="text"
                  value={editFormData.title || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Story Date / In-Universe Time</label>
                <input
                  type="text"
                  value={editFormData.storyDate || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, storyDate: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Narrative Track</label>
                <select
                  value={editFormData.track || 'Main Quest'}
                  onChange={(e) => setEditFormData({ ...editFormData, track: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  {Object.keys(TRACK_LABELS).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">POV Character</label>
                <select
                  value={editFormData.povCharacterId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, povCharacterId: e.target.value || undefined })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  <option value="">None / Omniscient</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Location</label>
                <input
                  type="text"
                  value={editFormData.location || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Linked Chapter</label>
                <select
                  value={editFormData.narrativeChapterId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, narrativeChapterId: e.target.value || undefined })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                >
                  <option value="">Historical / Unlinked</option>
                  {chapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                      Ch. {chap.number}: {chap.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Event Summary &amp; Narrative Purpose</label>
              <textarea
                value={editFormData.summary || ''}
                onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                rows={3}
                className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={editFormData.isFlashback || false}
                  onChange={(e) => setEditFormData({ ...editFormData, isFlashback: e.target.checked })}
                  className="rounded border-[#e8e8e6]"
                />
                <span className="text-[#191918] dark:text-[#f4f4f5]">Flashback / Retrospective Reveal</span>
              </label>

              <div className="flex items-center space-x-2">
                {editFormData.id && (
                  <button
                    onClick={() => handleDeleteEvent(editFormData.id!)}
                    className="px-3 py-1.5 text-xs text-[#b91c1c] hover:bg-[#fef2f2] rounded transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] rounded-lg font-medium shadow-2xs"
                >
                  Save Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clean Chronological Timeline Vertical Track */}
        <div className="relative pl-6 border-l-2 border-[#e8e8e6] dark:border-[#28292d] space-y-6">
          {sortedEvents.map((evt, index) => {
            const povChar = characters.find((c) => c.id === evt.povCharacterId);
            const linkedChap = chapters.find((c) => c.id === evt.narrativeChapterId);

            return (
              <div key={evt.id} className="relative group">
                {/* Node Dot on Timeline */}
                <div className="absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#141517] bg-[#191918] dark:bg-[#f4f4f5] group-hover:scale-125 transition-transform" />

                {/* Editorial Event Card */}
                <div className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs hover:border-[#4f46e5]/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-[#ecece9] dark:border-[#242528]">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#191918] dark:text-[#f4f4f5]">
                        {evt.storyDate}
                      </span>
                      {evt.isFlashback && (
                        <span className="px-1.5 py-0.25 rounded text-[10px] font-mono bg-[#fef3c7] text-[#92400e] dark:bg-[#78350f]/30 dark:text-[#fde68a]">
                          Flashback
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#9c9c98]">
                        ({evt.track})
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
                      <button
                        onClick={() => handleStartEdit(evt)}
                        className="p-1 text-[#9c9c98] hover:text-[#191918] dark:hover:text-[#f4f4f5] rounded"
                        title="Edit event"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] mt-1 leading-relaxed">
                    {evt.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 text-xs text-[#9c9c98]">
                    {evt.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{evt.location}</span>
                      </span>
                    )}
                    {povChar && (
                      <span className="flex items-center space-x-1 text-[#4f46e5] dark:text-[#818cf8]">
                        <Users className="w-3 h-3" />
                        <span>POV: {povChar.name}</span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono">
                      Impact: {evt.impactLevel || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
