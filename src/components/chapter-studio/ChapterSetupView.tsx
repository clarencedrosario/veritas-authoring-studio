import React, { useState } from 'react';
import {
  Settings,
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  Clock,
  Award,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Globe,
  Sliders,
  HelpCircle,
  Save,
} from 'lucide-react';
import { StudioChapter, GrammarSeriesProject, CurriculumSystemId, GrammarClassLevel } from '../../types';

interface ChapterSetupViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  seriesProject?: GrammarSeriesProject;
  onOpenBoardAdapt?: () => void;
  isDarkMode: boolean;
}

export const ChapterSetupView: React.FC<ChapterSetupViewProps> = ({
  chapter,
  onUpdateChapter,
  seriesProject,
  onOpenBoardAdapt,
  isDarkMode,
}) => {
  const [newVocabItem, setNewVocabItem] = useState('');
  const [newObjectiveItem, setNewObjectiveItem] = useState('');

  const handleFieldChange = <K extends keyof StudioChapter>(key: K, value: StudioChapter[K]) => {
    onUpdateChapter({
      ...chapter,
      [key]: value,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleAddVocabulary = () => {
    if (!newVocabItem.trim()) return;
    const current = chapter.keyVocabulary || [];
    if (!current.includes(newVocabItem.trim())) {
      handleFieldChange('keyVocabulary', [...current, newVocabItem.trim()]);
    }
    setNewVocabItem('');
  };

  const handleRemoveVocabulary = (item: string) => {
    const current = chapter.keyVocabulary || [];
    handleFieldChange('keyVocabulary', current.filter((v) => v !== item));
  };

  const handleAddObjective = () => {
    if (!newObjectiveItem.trim()) return;
    const current = chapter.opening.learningObjectives || [];
    const updated = [...current, newObjectiveItem.trim()];
    onUpdateChapter({
      ...chapter,
      opening: {
        ...chapter.opening,
        learningObjectives: updated,
      },
    });
    setNewObjectiveItem('');
  };

  const handleRemoveObjective = (index: number) => {
    const current = chapter.opening.learningObjectives || [];
    const updated = current.filter((_, i) => i !== index);
    onUpdateChapter({
      ...chapter,
      opening: {
        ...chapter.opening,
        learningObjectives: updated,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with VERITAS Luxury Palette */}
      <div className="p-6 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-4">
        <div className="flex flex-wrap lg:flex-nowrap items-start lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="p-3 rounded-xl bg-[#5A1832] text-[#FFFDF8] shrink-0 shadow-xs border border-[#C29A52]/30">
              <Settings className="w-6 h-6 text-[#C29A52]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832]">
                  Production Stage 1
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ✓ Configured
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-[#292521] tracking-tight mt-0.5">
                Chapter Setup &amp; Curriculum Metadata
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5 leading-relaxed">
                Define the pedagogical boundaries, syllabus mappings, teaching requirements, and editorial specifications for this chapter.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={onOpenBoardAdapt}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border border-[#CBBEAC] bg-[#EDE4D6] text-[#5A1832] hover:bg-[#CBBEAC]/40 transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Adapt for Another Board</span>
            </button>
          </div>
        </div>

        {/* Series Context Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#CBBEAC]/50 text-xs">
          <div className="p-2.5 rounded-xl bg-[#EDE4D6] border border-[#CBBEAC]">
            <span className="text-[10px] uppercase font-bold text-[#71685E] block">Board Curriculum</span>
            <span className="font-bold text-[#5A1832] text-sm">
              {chapter.systemId || seriesProject?.activeSystemId || 'CBSE'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EDE4D6] border border-[#CBBEAC]">
            <span className="text-[10px] uppercase font-bold text-[#71685E] block">Target Class / Stage</span>
            <span className="font-bold text-[#5A1832] text-sm">
              {chapter.equivalentClass}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EDE4D6] border border-[#CBBEAC]">
            <span className="text-[10px] uppercase font-bold text-[#71685E] block">Series Edition</span>
            <span className="font-bold text-[#5A1832] text-sm truncate block">
              {seriesProject?.seriesTitle || 'VERITAS Grammar Series'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EDE4D6] border border-[#CBBEAC]">
            <span className="text-[10px] uppercase font-bold text-[#71685E] block">Workflow Status</span>
            <span className="font-bold capitalize text-amber-800 text-sm">
              {chapter.workflowStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Core Identification */}
        <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#5A1832] flex items-center space-x-2 pb-2 border-b border-[#CBBEAC]/50">
            <BookOpen className="w-4 h-4 text-[#C29A52]" />
            <span>Chapter Identification</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#292521] block mb-1">
                Chapter No.
              </label>
              <input
                type="number"
                value={chapter.chapterNumber}
                onChange={(e) => handleFieldChange('chapterNumber', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-semibold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-[#292521] block mb-1">
                Parent Unit / Module
              </label>
              <input
                type="text"
                value={chapter.unitTitle || ''}
                onChange={(e) => handleFieldChange('unitTitle', e.target.value)}
                placeholder="e.g. Unit 1: The World of Naming Words"
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-semibold text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1">
              Short Title (for Running Headers)
            </label>
            <input
              type="text"
              value={chapter.shortTitle || chapter.title}
              onChange={(e) => handleFieldChange('shortTitle', e.target.value)}
              placeholder="e.g. Naming Words (Nouns)"
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-semibold text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1">
              Full Chapter Title
            </label>
            <input
              type="text"
              value={chapter.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-bold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1">
              Subtitle / Scope Tagline
            </label>
            <input
              type="text"
              value={chapter.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              placeholder="e.g. Mastering Number, Person, Modifiers, and Correlative Concord"
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#292521] block mb-1">
                Grammar Category
              </label>
              <input
                type="text"
                value={chapter.category || 'Syntax & Concord'}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-semibold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#292521] block mb-1">
                Difficulty Level
              </label>
              <select
                value={chapter.difficultyLevel || 'Medium'}
                onChange={(e) => handleFieldChange('difficultyLevel', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-semibold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              >
                <option value="Easy">Foundation (Easy)</option>
                <option value="Medium">Standard Curriculum (Medium)</option>
                <option value="Hard">Rigorous (Hard)</option>
                <option value="Advanced">Advanced / Olympiad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1">
              Curriculum Topic &amp; Syllabus Code
            </label>
            <input
              type="text"
              value={chapter.curriculumTopic || 'Syntax & Concord Principles'}
              onChange={(e) => handleFieldChange('curriculumTopic', e.target.value)}
              placeholder="e.g. CBSE SEC-6.3 / CISCE ENG-II Syntax"
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1">
              Estimated Teaching Time
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#5A1832] shrink-0" />
              <input
                type="text"
                value={chapter.estimatedTeachingTime || '4 Periods (160 mins)'}
                onChange={(e) => handleFieldChange('estimatedTeachingTime', e.target.value)}
                placeholder="e.g. 4 Periods (160 mins total)"
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Pedagogical Specifications */}
        <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#5A1832] flex items-center space-x-2 pb-2 border-b border-[#CBBEAC]/50">
            <GraduationCap className="w-4 h-4 text-[#C29A52]" />
            <span>Pedagogical Scope &amp; Prerequisites</span>
          </h3>

          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1">
              Chapter Description &amp; Academic Scope
            </label>
            <textarea
              rows={3}
              value={chapter.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Summary of grammatical scope, pedagogical aims, and practical outcomes..."
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs leading-relaxed text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1">
              Prerequisite Knowledge (What students must already master)
            </label>
            <textarea
              rows={2}
              value={chapter.prerequisiteKnowledge || ''}
              onChange={(e) => handleFieldChange('prerequisiteKnowledge', e.target.value)}
              placeholder="e.g. Identification of head nouns, subject personal pronouns, and auxiliary verbs."
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs leading-relaxed text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          {/* Key Vocabulary Pills */}
          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1.5 flex items-center justify-between">
              <span>Key Technical Vocabulary ({chapter.keyVocabulary?.length || 0})</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(chapter.keyVocabulary || []).map((vocab) => (
                <span
                  key={vocab}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]"
                >
                  <Tag className="w-2.5 h-2.5 text-[#5A1832]" />
                  <span>{vocab}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVocabulary(vocab)}
                    className="hover:text-rose-600 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add vocabulary term..."
                value={newVocabItem}
                onChange={(e) => setNewVocabItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddVocabulary()}
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
              <button
                type="button"
                onClick={handleAddVocabulary}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] border border-[#CBBEAC] transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Learning Objectives List - natural expansion without cramped max-h-36 */}
          <div>
            <label className="text-[11px] font-bold text-[#292521] block mb-1.5 flex items-center justify-between">
              <span>Learning Objectives ({chapter.opening.learningObjectives?.length || 0})</span>
            </label>
            <div className="space-y-1.5 mb-2">
              {(chapter.opening.learningObjectives || []).map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-2.5 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]/70 text-xs"
                >
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-[#5A1832] shrink-0">{i + 1}.</span>
                    <span className="text-[#292521] leading-relaxed">{obj}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(i)}
                    className="text-[#71685E] hover:text-rose-600 ml-2 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add measurable learning objective..."
                value={newObjectiveItem}
                onChange={(e) => setNewObjectiveItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] border border-[#CBBEAC] transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Author & Teacher Global Guidance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-2">
          <label className="text-xs font-bold text-[#5A1832] flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Author Editorial Notes (Private)</span>
          </label>
          <textarea
            rows={4}
            value={chapter.authorNotes || ''}
            onChange={(e) => handleFieldChange('authorNotes', e.target.value)}
            placeholder="Editorial reminders, series consistency checks, proofreading reminders..."
            className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs leading-relaxed text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
          />
        </div>

        <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-2">
          <label className="text-xs font-bold text-[#5A1832] flex items-center space-x-2">
            <GraduationCap className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Teacher Lesson Guidance (Printed in Teacher Edition)</span>
          </label>
          <textarea
            rows={4}
            value={
              typeof chapter.teacherNotes === 'string'
                ? chapter.teacherNotes
                : chapter.teacherNotes?.pedagogicalNotes || ''
            }
            onChange={(e) => handleFieldChange('teacherNotes', e.target.value)}
            placeholder="Period distribution, warm-up diagnostics, anticipated student confusion points..."
            className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs leading-relaxed text-[#292521] placeholder-[#71685E] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
          />
        </div>
      </div>
    </div>
  );
};
