import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Target,
} from 'lucide-react';
import {
  ScopeSequenceMasterRow,
  ScopeSequenceExerciseItem,
  ScopeSequenceProductionStatus,
  ScopeSequenceMasteryStage,
  ScopeSequenceDepthLevel,
} from '../../types';

interface ChapterPlanModalProps {
  row: ScopeSequenceMasterRow;
  onClose: () => void;
  onSaveRow: (updated: ScopeSequenceMasterRow) => void;
  onOpenChapterStudio?: (chapterId: string) => void;
  isDarkMode?: boolean;
}

export const ChapterPlanModal: React.FC<ChapterPlanModalProps> = ({
  row,
  onClose,
  onSaveRow,
  onOpenChapterStudio,
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pedagogy' | 'exercises' | 'assessment' | 'differentiation' | 'notes'>('overview');
  const [editedRow, setEditedRow] = useState<ScopeSequenceMasterRow>({ ...row });

  const [newObjective, setNewObjective] = useState('');
  const [newVocab, setNewVocab] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseType, setNewExerciseType] = useState<ScopeSequenceExerciseItem['pedagogicalType']>('controlled_practice');

  const handleSave = () => {
    onSaveRow(editedRow);
    onClose();
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setEditedRow({
      ...editedRow,
      learningObjectives: [...editedRow.learningObjectives, newObjective.trim()],
    });
    setNewObjective('');
  };

  const handleRemoveObjective = (index: number) => {
    setEditedRow({
      ...editedRow,
      learningObjectives: editedRow.learningObjectives.filter((_, i) => i !== index),
    });
  };

  const handleAddVocab = () => {
    if (!newVocab.trim()) return;
    setEditedRow({
      ...editedRow,
      keyVocabulary: [...editedRow.keyVocabulary, newVocab.trim()],
    });
    setNewVocab('');
  };

  const handleRemoveVocab = (index: number) => {
    setEditedRow({
      ...editedRow,
      keyVocabulary: editedRow.keyVocabulary.filter((_, i) => i !== index),
    });
  };

  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return;
    const nextLetter = String.fromCharCode(65 + editedRow.exerciseProfile.length);
    const newEx: ScopeSequenceExerciseItem = {
      id: `ex-${Date.now()}`,
      label: `Ex ${nextLetter}`,
      name: newExerciseName.trim(),
      pedagogicalType: newExerciseType,
      targetQuestionsCount: 8,
      description: `Targeted practice for ${newExerciseName.trim()}`,
    };
    setEditedRow({
      ...editedRow,
      exerciseProfile: [...editedRow.exerciseProfile, newEx],
    });
    setNewExerciseName('');
  };

  const handleRemoveExercise = (exId: string) => {
    setEditedRow({
      ...editedRow,
      exerciseProfile: editedRow.exerciseProfile.filter((e) => e.id !== exId),
    });
  };

  const getStageBadge = (stage: ScopeSequenceMasteryStage) => {
    switch (stage) {
      case 'Introduced':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Developing':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'Reinforced':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'Mastered':
        return 'bg-[#5A1832]/10 text-[#5A1832] border-[#5A1832]/30 dark:bg-[#C29A52]/20 dark:text-[#C29A52] dark:border-[#C29A52]/40';
      case 'Extended':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/40 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#5A1832] text-[#FAF8F5] border-b border-[#C29A52]/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#C29A52]/20 border border-[#C29A52]/40 flex items-center justify-center text-[#C29A52] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-[#C29A52] uppercase">
                  Chapter Plan Card • Seq #{editedRow.seqNumber}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStageBadge(editedRow.masteryStage)}`}>
                  {editedRow.masteryStage} ({editedRow.masteryCode})
                </span>
                {editedRow.evidenceStatus === 'VERIFIED' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-600/40">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-600/40">
                    <AlertTriangle className="w-3 h-3" /> EDITORIAL MODEL
                  </span>
                )}
              </div>
              <h2 className="text-lg font-serif font-bold text-[#F6F0E7] truncate mt-0.5">
                {editedRow.chapterTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenChapterStudio && (
              <button
                type="button"
                onClick={() => {
                  onOpenChapterStudio(editedRow.chapterId);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C29A52] hover:bg-[#d6ac60] text-[#292521] text-xs font-bold transition shadow-sm"
                title="Launch directly in Chapter Authoring Studio with this chapter loaded"
              >
                <span>Open in Chapter Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-[#F0EBE0] dark:bg-[#262220] border-b border-[#C29A52]/20 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            Overview & Curriculum
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pedagogy')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'pedagogy'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            Objectives & Prerequisites
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exercises')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'exercises'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            Exercise Progression ({editedRow.exerciseProfile.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assessment')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'assessment'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            Assessment Alignment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('differentiation')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'differentiation'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            Connections & Differentiation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'notes'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            Production & Notes
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-[#292521] dark:text-[#F6F0E7]">
          {/* 1. OVERVIEW & CURRICULUM TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block mb-1">
                    Instructional Unit
                  </label>
                  <input
                    type="text"
                    value={editedRow.unitTitle}
                    onChange={(e) => setEditedRow({ ...editedRow, unitTitle: e.target.value })}
                    className="w-full text-sm font-semibold p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                  />
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block mb-1">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={editedRow.chapterTitle}
                    onChange={(e) => setEditedRow({ ...editedRow, chapterTitle: e.target.value })}
                    className="w-full text-sm font-semibold p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                  />
                </div>
              </div>

              {/* Curriculum Mapping Banner */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-[#262220] border border-[#C29A52]/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> Curriculum Mapping Reference
                  </span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white dark:bg-[#1c1917] border border-[#C29A52]/30">
                    {editedRow.curriculumMappingCode}
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={editedRow.curriculumMappingDescription}
                  onChange={(e) => setEditedRow({ ...editedRow, curriculumMappingDescription: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                />
                {editedRow.evidenceCitation && (
                  <div className="mt-2 text-[11px] text-[#71685E] dark:text-[#c9b9a6] flex items-center gap-1">
                    <span className="font-semibold">Official Evidence Citation:</span>
                    <span className="italic">{editedRow.evidenceCitation}</span>
                  </div>
                )}
              </div>

              {/* Instructional Dimensions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/20">
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
                    Depth Level
                  </span>
                  <select
                    value={editedRow.depthLevel}
                    onChange={(e) => setEditedRow({ ...editedRow, depthLevel: e.target.value as ScopeSequenceDepthLevel })}
                    className="w-full mt-1 text-xs font-semibold p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  >
                    <option value="Foundational">Foundational</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Analytical">Analytical</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/20">
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
                    Mastery Stage
                  </span>
                  <select
                    value={editedRow.masteryStage}
                    onChange={(e) => {
                      const st = e.target.value as ScopeSequenceMasteryStage;
                      const codeMap: Record<ScopeSequenceMasteryStage, 'I' | 'D' | 'R' | 'M' | 'E'> = {
                        Introduced: 'I',
                        Developing: 'D',
                        Reinforced: 'R',
                        Mastered: 'M',
                        Extended: 'E',
                      };
                      setEditedRow({ ...editedRow, masteryStage: st, masteryCode: codeMap[st] });
                    }}
                    className="w-full mt-1 text-xs font-semibold p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  >
                    <option value="Introduced">Introduced (I)</option>
                    <option value="Developing">Developing (D)</option>
                    <option value="Reinforced">Reinforced (R)</option>
                    <option value="Mastered">Mastered (M)</option>
                    <option value="Extended">Extended (E)</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/20">
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
                    Teaching Lessons
                  </span>
                  <input
                    type="number"
                    value={editedRow.recommendedTeachingLessons}
                    onChange={(e) => setEditedRow({ ...editedRow, recommendedTeachingLessons: parseInt(e.target.value) || 1 })}
                    className="w-full mt-1 text-xs font-semibold p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/20">
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
                    Target Pages
                  </span>
                  <input
                    type="number"
                    value={editedRow.estimatedPages}
                    onChange={(e) => setEditedRow({ ...editedRow, estimatedPages: parseInt(e.target.value) || 1 })}
                    className="w-full mt-1 text-xs font-semibold p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. PEDAGOGY TAB: OBJECTIVES & PREREQUISITES */}
          {activeTab === 'pedagogy' && (
            <div className="space-y-5">
              {/* Learning Objectives */}
              <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#5A1832] dark:text-[#C29A52] flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> Targeted Learning Objectives
                  </h3>
                  <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    {editedRow.learningObjectives.length} objectives defined
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {editedRow.learningObjectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{obj}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(idx)}
                        className="text-[#71685E] hover:text-red-600 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
                    placeholder="Add learning objective..."
                    className="flex-1 text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3 py-1.5 rounded bg-[#5A1832] text-white text-xs font-semibold hover:bg-[#722342] transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Prerequisites & Prior Learning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <h4 className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider mb-2">
                    Prerequisites (Required Prior Competencies)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#292521] dark:text-[#F6F0E7]">
                    {editedRow.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C29A52] mt-1.5 shrink-0" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <h4 className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider mb-2">
                    Prior Learning vs New Learning
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-amber-700 dark:text-amber-300 block">Prior Learning:</span>
                      <p className="text-[#71685E] dark:text-[#c9b9a6] mt-0.5">{editedRow.priorLearning || 'None recorded'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 block">New Learning in This Book:</span>
                      <p className="text-[#71685E] dark:text-[#c9b9a6] mt-0.5">{editedRow.newLearning || 'Core topic advancement'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Vocabulary */}
              <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                <h4 className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider mb-2">
                  Key Vocabulary Terms
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {editedRow.keyVocabulary.map((term, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#5A1832]/10 text-[#5A1832] dark:bg-[#C29A52]/20 dark:text-[#C29A52] border border-[#C29A52]/30"
                    >
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVocab(idx)}
                        className="hover:text-red-500 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVocab}
                    onChange={(e) => setNewVocab(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddVocab()}
                    placeholder="Add term (e.g. Proximity attraction)..."
                    className="flex-1 text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                  />
                  <button
                    type="button"
                    onClick={handleAddVocab}
                    className="px-3 py-1.5 rounded bg-[#C29A52] text-[#292521] text-xs font-semibold hover:bg-[#d6ac60] transition"
                  >
                    Add Term
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. EXERCISE PROGRESSION TAB */}
          {activeTab === 'exercises' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#5A1832] dark:text-[#C29A52]">
                    Structured Exercise Progression
                  </h3>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    Scaffolded from recognition to controlled drills, error correction, and higher-order challenges.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {editedRow.exerciseProfile.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 flex items-start justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 rounded bg-[#5A1832] text-white text-xs font-mono font-bold shrink-0">
                        {ex.label}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{ex.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/30 text-[#71685E] dark:text-[#c9b9a6]">
                            {ex.pedagogicalType.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                            (~{ex.targetQuestionsCount} questions)
                          </span>
                        </div>
                        <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                          {ex.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="text-[#71685E] hover:text-red-600 p-1 transition"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Exercise Card */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-[#262220] border border-dashed border-[#C29A52]/50 space-y-3">
                <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add New Exercise to Sequence
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    placeholder="Exercise title (e.g. Synthesis & Inversion)..."
                    className="sm:col-span-2 text-xs p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#1c1917]"
                  />
                  <select
                    value={newExerciseType}
                    onChange={(e) => setNewExerciseType(e.target.value as any)}
                    className="text-xs p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#1c1917]"
                  >
                    <option value="recognition">Recognition</option>
                    <option value="controlled_practice">Controlled Practice</option>
                    <option value="application">Application</option>
                    <option value="editing_correction">Editing & Correction</option>
                    <option value="sentence_transformation">Transformation</option>
                    <option value="contextual_application">Contextual Application</option>
                    <option value="higher_order_challenge">Higher-Order Challenge</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="px-3 py-1.5 rounded bg-[#5A1832] text-white text-xs font-semibold hover:bg-[#722342] transition"
                >
                  Append Exercise
                </button>
              </div>
            </div>
          )}

          {/* 4. ASSESSMENT ALIGNMENT TAB */}
          {activeTab === 'assessment' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                <h3 className="text-sm font-bold text-[#5A1832] dark:text-[#C29A52] mb-1">
                  Assessment Evidence Suite
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mb-3">
                  Connected assessment instruments tracking diagnostic, formative, and summative milestones.
                </p>
                <div className="space-y-1.5">
                  {editedRow.assessmentEvidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium">{ev}</span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        ACTIVE INSTRUMENT
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Taught / Practised / Assessed Matrix */}
              <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                <h4 className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider mb-2">
                  Learning Objective Alignment (Taught • Practised • Assessed)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#C29A52]/30 text-[#71685E] dark:text-[#c9b9a6]">
                        <th className="py-2 px-2">Objective</th>
                        <th className="py-2 px-2 text-center">Taught</th>
                        <th className="py-2 px-2 text-center">Practised</th>
                        <th className="py-2 px-2 text-center">Assessed</th>
                        <th className="py-2 px-2">Assessment Instrument</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C29A52]/20">
                      {(editedRow.assessmentAlignments || []).map((align, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2 font-medium">{align.objectiveText}</td>
                          <td className="py-2 px-2 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                              YES
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                              YES
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                              YES
                            </span>
                          </td>
                          <td className="py-2 px-2 text-[#71685E] dark:text-[#c9b9a6] italic">
                            {align.chapterAssessmentInstrument || 'Unit Test Section B'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. CONNECTIONS & DIFFERENTIATION TAB */}
          {activeTab === 'differentiation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] block mb-1">
                    Writing Connection
                  </label>
                  <textarea
                    rows={2}
                    value={editedRow.writingConnection}
                    onChange={(e) => setEditedRow({ ...editedRow, writingConnection: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] block mb-1">
                    Reading Connection
                  </label>
                  <textarea
                    rows={2}
                    value={editedRow.readingConnection}
                    onChange={(e) => setEditedRow({ ...editedRow, readingConnection: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] block mb-1">
                    Oral / Listening Connection
                  </label>
                  <textarea
                    rows={2}
                    value={editedRow.speakingListeningConnection}
                    onChange={(e) => setEditedRow({ ...editedRow, speakingListeningConnection: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] block mb-1">
                    Cross-Curricular Connection
                  </label>
                  <textarea
                    rows={2}
                    value={editedRow.crossCurricularConnection}
                    onChange={(e) => setEditedRow({ ...editedRow, crossCurricularConnection: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>
              </div>

              {/* Differentiation Support vs Extension */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    Learning Support (Scaffolding / Visual Cues)
                  </label>
                  <textarea
                    rows={3}
                    value={editedRow.differentiationSupport}
                    onChange={(e) => setEditedRow({ ...editedRow, differentiationSupport: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-purple-700 dark:text-purple-400 block mb-1">
                    Gifted / Extension (Higher-Order Challenges)
                  </label>
                  <textarea
                    rows={3}
                    value={editedRow.differentiationExtension}
                    onChange={(e) => setEditedRow({ ...editedRow, differentiationExtension: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. PRODUCTION & NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block mb-1">
                    Production Lifecycle Status
                  </label>
                  <select
                    value={editedRow.productionStatus}
                    onChange={(e) => setEditedRow({ ...editedRow, productionStatus: e.target.value as ScopeSequenceProductionStatus })}
                    className="w-full text-xs font-semibold p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Drafting">Drafting</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Pre-Press">Pre-Press</option>
                  </select>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                  <label className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block mb-1">
                    Board / System Examination Weightage
                  </label>
                  <input
                    type="text"
                    value={editedRow.boardSystemNotes}
                    onChange={(e) => setEditedRow({ ...editedRow, boardSystemNotes: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                <label className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block mb-1">
                  Teacher Instructional Notes
                </label>
                <textarea
                  rows={3}
                  value={editedRow.teacherNotes || ''}
                  onChange={(e) => setEditedRow({ ...editedRow, teacherNotes: e.target.value })}
                  placeholder="Pedagogical guidance for classroom teachers..."
                  className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                />
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
                <label className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block mb-1">
                  Author & Editorial Notes
                </label>
                <textarea
                  rows={3}
                  value={editedRow.authorNotes || ''}
                  onChange={(e) => setEditedRow({ ...editedRow, authorNotes: e.target.value })}
                  placeholder="Private author notes regarding manuscript drafting, tone, and examples..."
                  className="w-full text-xs p-2 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0EBE0] dark:bg-[#262220] border-t border-[#C29A52]/30">
          <div className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
            {onOpenChapterStudio && (
              <span>
                Want to write chapter text? Click <strong className="text-[#5A1832] dark:text-[#C29A52]">Open in Chapter Studio</strong>.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#C29A52]/40 hover:bg-[#C29A52]/10 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-[#5A1832] hover:bg-[#722342] text-white text-xs font-bold shadow-md transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
