import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  Lock,
  GraduationCap,
  Sparkles,
  BookOpen,
  Filter,
  Calendar,
  Layers,
  Lightbulb,
  AlertTriangle,
  Users,
  Layout,
  CheckCircle2,
} from 'lucide-react';
import { StudioChapter, TeacherAuthorNoteRecord } from '../../types';

export interface TeacherAuthorNotesViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  seriesProject?: any;
  isDarkMode?: boolean;
}

export const TeacherAuthorNotesView: React.FC<TeacherAuthorNotesViewProps> = ({
  chapter,
  onUpdateChapter,
  seriesProject,
  isDarkMode = false,
}) => {
  const chapterAny = chapter as any;
  const effectiveSubject = chapterAny.subject || seriesProject?.subject || 'Academic Studies';
  const isGrammar = /grammar|syntax|english language/i.test(chapter.category || '') || /grammar/i.test(effectiveSubject);
  const isMath = /math/i.test(chapter.category || '') || /math/i.test(effectiveSubject);
  const isScience = /science|biology|physics|chemistry/i.test(chapter.category || '') || /science|biology|physics|chemistry/i.test(effectiveSubject);
  const isHistory = /history|civics|social/i.test(chapter.category || '') || /history|civics|social/i.test(effectiveSubject);

  const initialNotes = useMemo(() => {
    if (chapter.teacherAuthorNotes && chapter.teacherAuthorNotes.length > 0) {
      return chapter.teacherAuthorNotes;
    }
    return [] as TeacherAuthorNoteRecord[];
  }, [chapter.teacherAuthorNotes]);

  const [notes, setNotes] = useState<TeacherAuthorNoteRecord[]>(initialNotes);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<
    'all' | 'internal_only' | 'teacher_edition' | 'student_edition'
  >('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TeacherAuthorNoteRecord | null>(null);

  const [newNote, setNewNote] = useState<TeacherAuthorNoteRecord>({
    id: `note-${Date.now()}`,
    type: 'teaching_strategy',
    title: '',
    content: '',
    visibility: 'teacher_edition',
    createdDate: new Date().toISOString().split('T')[0],
  });

  const persistNotes = (updated: TeacherAuthorNoteRecord[]) => {
    setNotes(updated);
    onUpdateChapter({
      ...chapter,
      teacherAuthorNotes: updated,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleSaveNewNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    const updated = [...notes, { ...newNote, id: `note-${Date.now()}` }];
    persistNotes(updated);
    setNewNote({
      id: `note-${Date.now()}`,
      type: 'teaching_strategy',
      title: '',
      content: '',
      visibility: 'teacher_edition',
      createdDate: new Date().toISOString().split('T')[0],
    });
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    persistNotes(updated);
  };

  const handleStartEdit = (note: TeacherAuthorNoteRecord) => {
    setEditingNoteId(note.id);
    setEditForm({ ...note });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    const updated = notes.map((n) => (n.id === editForm.id ? editForm : n));
    persistNotes(updated);
    setEditingNoteId(null);
    setEditForm(null);
  };

  // AI Generation of Complete Teacher Guide
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    setErrorMessage(null);

    const chapterAny = chapter as any;
    const classLevel =
      chapterAny.targetClass ||
      chapterAny.classLevel ||
      seriesProject?.selectedClass ||
      'Class 6';
    const board =
      chapterAny.curriculumFramework ||
      chapterAny.board ||
      chapterAny.curriculumBoard ||
      seriesProject?.activeSystemId ||
      seriesProject?.targetBoard ||
      'CISCE';
    const subject = chapterAny.subject || seriesProject?.subject || (isGrammar ? 'English Grammar & Composition' : 'Academic Studies');
    const topic = chapter.title || (isGrammar ? 'Subject-Verb Agreement' : 'Core Study');

    try {
      const res = await fetch('/api/chapter-studio/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: 'comp-23',
          topic,
          classLevel,
          board,
          subject,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'AI generation could not be completed. Your existing content has not been changed.');
      }

      const generated = data.data;
      if (generated) {
        const generatedNotes: TeacherAuthorNoteRecord[] = [];

        // 1. Pacing Guide
        if (generated.pacingGuide && Array.isArray(generated.pacingGuide)) {
          const pacingText = generated.pacingGuide
            .map(
              (p: any) =>
                `• Period ${p.period} (${p.duration || '40 mins'}): ${p.topic}\n  Focus: ${p.activities}`
            )
            .join('\n\n');
          generatedNotes.push({
            id: `tg-pace-${Date.now()}`,
            type: 'pacing_guide',
            title: `4-Period Lesson Pacing Schedule (${activeBoard || 'CISCE'})`,
            content: pacingText,
            visibility: 'teacher_edition',
            createdDate: new Date().toISOString().split('T')[0],
          });
        }

        // 2. Teaching Strategies
        if (generated.teachingStrategies && Array.isArray(generated.teachingStrategies)) {
          generatedNotes.push({
            id: `tg-strat-${Date.now()}`,
            type: 'teaching_strategy',
            title: 'Concept Delivery & Direct Instruction Strategies',
            content: generated.teachingStrategies.map((s: string, idx: number) => `${idx + 1}. ${s}`).join('\n\n'),
            visibility: 'teacher_edition',
            createdDate: new Date().toISOString().split('T')[0],
          });
        }

        // 3. Common Misconceptions
        if (generated.commonMisconceptions && Array.isArray(generated.commonMisconceptions)) {
          const misText = generated.commonMisconceptions
            .map(
              (m: any) =>
                `• Pitfall: "${m.misconception}"\n  Teacher Intervention: ${m.intervention}`
            )
            .join('\n\n');
          generatedNotes.push({
            id: `tg-misc-${Date.now()}`,
            type: 'common_pitfall',
            title: 'High-Frequency Confusion Traps & Diagnostic Interventions',
            content: misText,
            visibility: 'teacher_edition',
            createdDate: new Date().toISOString().split('T')[0],
          });
        }

        // 4. Differentiated Instruction
        if (generated.differentiatedInstruction) {
          const diffText = `Remedial Support Strategy:\n${generated.differentiatedInstruction.remedial || 'Scaffold with color-coded subject and verb underlining.'}\n\nExtension & Olympiad Enrichment:\n${generated.differentiatedInstruction.extension || 'Challenge with inverted sentences and correlative conjunctions.'}`;
          generatedNotes.push({
            id: `tg-diff-${Date.now()}`,
            type: 'differentiation',
            title: 'Differentiated Instruction (Remedial & Gifted Enrichment)',
            content: diffText,
            visibility: 'teacher_edition',
            createdDate: new Date().toISOString().split('T')[0],
          });
        }

        // 5. Whiteboard Layout
        if (generated.whiteboardLayout) {
          generatedNotes.push({
            id: `tg-board-${Date.now()}`,
            type: 'pedagogical_background',
            title: 'Recommended Whiteboard & Blackboard Layout',
            content: generated.whiteboardLayout,
            visibility: 'teacher_edition',
            createdDate: new Date().toISOString().split('T')[0],
          });
        }

        if (generatedNotes.length > 0) {
          persistNotes([...notes, ...generatedNotes]);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'AI generation could not be completed. Your existing content has not been changed.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const activeBoard =
    (chapter as any).curriculumFramework ||
    (chapter as any).board ||
    seriesProject?.activeSystemId ||
    seriesProject?.targetBoard ||
    'CISCE';

  const filteredNotes = notes.filter((n) => {
    if (filterVisibility !== 'all' && n.visibility !== filterVisibility) return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const getVisibilityBadge = (visibility: TeacherAuthorNoteRecord['visibility']) => {
    switch (visibility) {
      case 'internal_only':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#F6F0E7] text-[#292521] font-semibold border border-[#CBBEAC]">
            <Lock className="w-3 h-3 text-[#71685E]" />
            Editorial Only
          </span>
        );
      case 'teacher_edition':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#EDE4D6] text-[#5A1832] font-semibold border border-[#C29A52]">
            <GraduationCap className="w-3 h-3 text-[#C29A52]" />
            Teacher Edition
          </span>
        );
      case 'student_edition':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
            <Eye className="w-3 h-3 text-emerald-700" />
            Student Visible
          </span>
        );
    }
  };

  const getTypeIcon = (type: TeacherAuthorNoteRecord['type']) => {
    switch (type) {
      case 'pacing_guide':
        return <Calendar className="w-4 h-4 text-blue-700" />;
      case 'teaching_strategy':
        return <Lightbulb className="w-4 h-4 text-[#C29A52]" />;
      case 'common_pitfall':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'differentiation':
        return <Users className="w-4 h-4 text-purple-700" />;
      case 'pedagogical_background':
        return <Layout className="w-4 h-4 text-[#5A1832]" />;
      default:
        return <MessageSquare className="w-4 h-4 text-[#71685E]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
            <GraduationCap className="w-5 h-5 text-[#C29A52]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                Component 23 • Pedagogical Teacher Guide
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE4D6] text-[#5A1832] font-semibold border border-[#CBBEAC]">
                {notes.length} Guidance Notes
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#35101F]">
              Teacher Guide &amp; Lesson Pacing Notes
            </h2>
            <p className="text-xs text-[#71685E] mt-0.5">
              Period pacing breakdowns, instructional strategies, common student traps, and differentiated remedial / extension guidance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Generator */}
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-[#5A1832] text-xs font-bold rounded-lg border border-[#CBBEAC] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>{isAiGenerating ? 'Drafting Pacing Guide...' : 'AI Generate Teacher Guide'}</span>
          </button>

          {/* Add Note Button */}
          <button
            type="button"
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>+ Add Note</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAiGenerate}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-semibold text-xs cursor-pointer transition-colors"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingNote(true);
                setErrorMessage(null);
              }}
              className="px-2.5 py-1 bg-[#5A1832] hover:bg-[#35101F] text-white rounded font-semibold text-xs cursor-pointer transition-colors"
            >
              Write Manually
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="px-2 py-1 text-amber-800 hover:text-amber-950 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#71685E] font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Category:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] text-xs rounded-lg px-2.5 py-1 font-medium focus:outline-none"
          >
            <option value="all">All Guidance Categories</option>
            <option value="pacing_guide">Lesson Pacing &amp; Timetable</option>
            <option value="teaching_strategy">Teaching Strategies &amp; Analogies</option>
            <option value="common_pitfall">Misconceptions &amp; Confusion Traps</option>
            <option value="differentiation">Differentiated Instruction</option>
            <option value="pedagogical_background">Blackboard Layout &amp; Pedagogy</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#71685E] font-medium">Audience Visibility:</span>
          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value as any)}
            className="bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] text-xs rounded-lg px-2.5 py-1 font-medium focus:outline-none"
          >
            <option value="all">All Visibilities</option>
            <option value="teacher_edition">Teacher Edition Only</option>
            <option value="internal_only">Internal / Editorial Only</option>
            <option value="student_edition">Student Edition</option>
          </select>
        </div>
      </div>

      {/* Add New Note Drawer */}
      {isAddingNote && (
        <div className="bg-[#FFFDF8] border-2 border-[#5A1832] rounded-xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
            <h4 className="text-xs font-bold text-[#5A1832] uppercase">
              Add Pedagogical Guidance Note
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="text-[#71685E] hover:text-[#5A1832] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-[#5A1832] block mb-1">Category:</label>
              <select
                value={newNote.type}
                onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
              >
                <option value="pacing_guide">Lesson Pacing &amp; Timetable</option>
                <option value="teaching_strategy">Teaching Strategy &amp; Model</option>
                <option value="common_pitfall">Misconception &amp; Diagnostic Trap</option>
                <option value="differentiation">Differentiated Instruction</option>
                <option value="pedagogical_background">Blackboard Layout &amp; Background</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#5A1832] block mb-1">Visibility:</label>
              <select
                value={newNote.visibility}
                onChange={(e) => setNewNote({ ...newNote, visibility: e.target.value as any })}
                className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
              >
                <option value="teacher_edition">Teacher Edition Only</option>
                <option value="internal_only">Internal Editorial Note</option>
                <option value="student_edition">Student Visible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A1832] block mb-1">Title:</label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="e.g. Period 2: Identifying Intervening Prepositional Distractors..."
              className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A1832] block mb-1">Guidance Body:</label>
            <textarea
              rows={4}
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Enter detailed instructional advice, lesson pacing points, or diagnostic cues..."
              className="w-full text-xs p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="px-3 py-1.5 rounded-lg bg-[#EDE4D6] text-[#71685E] text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveNewNote}
              className="px-4 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-white text-xs font-bold cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-[#FFFDF8] border border-dashed border-[#CBBEAC] rounded-xl p-8 text-center space-y-3">
            <GraduationCap className="w-8 h-8 text-[#CBBEAC] mx-auto" />
            <h4 className="text-sm font-serif font-bold text-[#35101F]">No Teacher Notes Available</h4>
            <p className="text-xs text-[#71685E] max-w-md mx-auto">
              No pedagogical notes have been added yet for this chapter. You can write custom guidance using "+ Add Note" or generate lesson notes with AI.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
          const isEditing = editingNoteId === note.id;

          if (isEditing && editForm) {
            return (
              <div
                key={note.id}
                className="bg-[#FFFDF8] border-2 border-[#5A1832] rounded-xl p-5 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                  <span className="text-xs font-bold text-[#5A1832] uppercase">
                    Editing Guidance Note
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-[#5A1832] text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNoteId(null)}
                      className="px-3 py-1 bg-white border border-[#CBBEAC] text-[#71685E] rounded text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                    Title:
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                    Content:
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif leading-relaxed"
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={note.id}
              className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3 transition-all hover:border-[#5A1832]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="p-1.5 rounded-lg bg-[#EDE4D6] border border-[#CBBEAC]">
                    {getTypeIcon(note.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-serif font-bold text-[#35101F]">
                        {note.title}
                      </h4>
                      {getVisibilityBadge(note.visibility)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(note)}
                    className="p-1 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                    title="Edit Note"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC]/70 text-xs font-serif text-[#292521] leading-relaxed whitespace-pre-line">
                {note.content}
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
