import React, { useState } from 'react';
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
} from 'lucide-react';
import { StudioChapter, TeacherAuthorNoteRecord } from '../../types';
import { CANONICAL_SVA_TEACHER_NOTES } from '../../utils/chapterStudioData';

export interface TeacherAuthorNotesViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  isDarkMode: boolean;
}

export const TeacherAuthorNotesView: React.FC<TeacherAuthorNotesViewProps> = ({
  chapter,
  onUpdateChapter,
  isDarkMode,
}) => {
  const notes = chapter.teacherAuthorNotes || CANONICAL_SVA_TEACHER_NOTES;
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'internal_only' | 'teacher_edition' | 'student_edition'>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const [newNote, setNewNote] = useState<TeacherAuthorNoteRecord>({
    id: `note-${Date.now()}`,
    type: 'teaching_strategy',
    title: '',
    content: '',
    visibility: 'teacher_edition',
    createdDate: new Date().toISOString().split('T')[0],
  });

  const handleSaveNewNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    const updated = [...notes, { ...newNote, id: `note-${Date.now()}` }];
    onUpdateChapter({
      ...chapter,
      teacherAuthorNotes: updated,
      lastSaved: new Date().toISOString(),
    });
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
    onUpdateChapter({
      ...chapter,
      teacherAuthorNotes: updated,
      lastSaved: new Date().toISOString(),
    });
  };

  const filteredNotes = notes.filter((n) => {
    if (filterVisibility === 'all') return true;
    return n.visibility === filterVisibility;
  });

  const getVisibilityBadge = (visibility: TeacherAuthorNoteRecord['visibility']) => {
    switch (visibility) {
      case 'internal_only':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#F6F0E7] text-[#292521] font-semibold border border-[#CBBEAC]">
            <Lock className="w-3 h-3 text-[#71685E]" />
            Internal / Editorial Only
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
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-300">
            <Eye className="w-3 h-3 text-emerald-600" />
            Student Edition
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#EDE4D6]/70 border border-[#CBBEAC] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
              <MessageSquare className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                  Production Stage 14 • Pedagogical Annotations
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A1832]/10 text-[#5A1832] border border-[#5A1832]/20">
                  {notes.length} Annotations
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#35101F]">
                Teacher &amp; Author Notes Studio
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Embed author rationales, editor style notes, classroom teaching strategies, misconceptions, differentiation, and extension activities with strict publication visibility controls.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="flex bg-[#F6F0E7] p-1 rounded-xl border border-[#CBBEAC] text-xs">
              {(['all', 'teacher_edition', 'internal_only', 'student_edition'] as const).map((vis) => (
                <button
                  key={vis}
                  onClick={() => setFilterVisibility(vis)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterVisibility === vis
                      ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                      : 'text-[#71685E] hover:text-[#292521]'
                  }`}
                >
                  {vis === 'all'
                    ? 'All'
                    : vis === 'teacher_edition'
                    ? 'Teacher Edition'
                    : vis === 'internal_only'
                    ? 'Internal Only'
                    : 'Student'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddingNote(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>+ Add Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add New Note Drawer / Form */}
      {isAddingNote && (
        <div className="p-5 bg-[#FFFDF8] border-2 border-[#5A1832] rounded-xl shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#CBBEAC]">
            <h3 className="text-sm font-serif font-bold text-[#35101F]">
              Create Pedagogical Annotation
            </h3>
            <button
              onClick={() => setIsAddingNote(false)}
              className="p-1 text-[#71685E] hover:text-[#292521] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#5A1832] block mb-1">
                Annotation Type:
              </label>
              <select
                value={newNote.type}
                onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] focus:outline-none"
              >
                <option value="teaching_strategy">Teaching Strategy</option>
                <option value="expected_misconception">Expected Misconception</option>
                <option value="differentiation_suggestion">Differentiation Suggestion</option>
                <option value="remediation">Remediation Activity</option>
                <option value="extension_activity">Extension / Olympiad Challenge</option>
                <option value="author_note">Author Rationale</option>
                <option value="editor_note">Editorial Style Note</option>
                <option value="teacher_note">Teacher Note</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5A1832] block mb-1">
                Publication Visibility:
              </label>
              <select
                value={newNote.visibility}
                onChange={(e) => setNewNote({ ...newNote, visibility: e.target.value as any })}
                className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] focus:outline-none"
              >
                <option value="teacher_edition">Teacher Edition (Annotated)</option>
                <option value="internal_only">Internal Only (Staff &amp; Editorial)</option>
                <option value="student_edition">Student Edition (Public)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5A1832] block mb-1">
                Annotation Title:
              </label>
              <input
                type="text"
                placeholder="e.g. Scaffolding for Proximity Concord"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#5A1832] block mb-1">
              Annotation Content:
            </label>
            <textarea
              rows={3}
              placeholder="Detail the classroom instructions, student misconceptions, or editorial standard..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAddingNote(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[#71685E] hover:bg-[#EDE4D6] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewNote}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] shadow-xs cursor-pointer"
            >
              Save Annotation
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3 hover:border-[#5A1832]/40 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#71685E] block">
                    {note.type.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-sm font-serif font-bold text-[#35101F]">
                    {note.title}
                  </h3>
                </div>
                {getVisibilityBadge(note.visibility)}
              </div>

              <p className="text-xs text-[#292521] font-serif leading-relaxed">
                {note.content}
              </p>
            </div>

            <div className="pt-3 border-t border-[#CBBEAC]/50 flex items-center justify-between text-[11px] text-[#71685E]">
              <span>Logged: {note.createdDate || '2026-08'}</span>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove Note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
