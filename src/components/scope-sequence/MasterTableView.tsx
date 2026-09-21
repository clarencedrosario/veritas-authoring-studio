import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowUpDown,
  Check,
  RotateCcw,
  Sparkles,
  Columns,
  Clock,
  FileText,
} from 'lucide-react';
import {
  ScopeSequenceMasterRow,
  ScopeSequenceColumnDef,
  ScopeSequenceMasteryStage,
  ScopeSequenceDepthLevel,
  ScopeSequenceProductionStatus,
} from '../../types';
import { SCOPE_SEQUENCE_COLUMNS } from '../../utils/scopeSequenceData';

interface MasterTableViewProps {
  rows: ScopeSequenceMasterRow[];
  onUpdateRow: (updated: ScopeSequenceMasterRow) => void;
  onOpenChapterPlan: (row: ScopeSequenceMasterRow) => void;
  onOpenChapterStudio?: (chapterId: string) => void;
  isDarkMode?: boolean;
}

export const MasterTableView: React.FC<MasterTableViewProps> = ({
  rows,
  onUpdateRow,
  onOpenChapterPlan,
  onOpenChapterStudio,
  isDarkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [depthFilter, setDepthFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'VERIFIED' | 'EDITORIAL_MODEL'>('ALL');

  // Column visibility state (initialize from SCOPE_SEQUENCE_COLUMNS defaults)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SCOPE_SEQUENCE_COLUMNS.forEach((col) => {
      init[col.id] = col.defaultVisible;
    });
    return init;
  });

  const [showColumnPicker, setShowColumnPicker] = useState(false);

  // Unique units
  const availableUnits = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.unitTitle) set.add(r.unitTitle);
    });
    return Array.from(set);
  }, [rows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        row.chapterTitle.toLowerCase().includes(q) ||
        row.unitTitle.toLowerCase().includes(q) ||
        row.curriculumMappingCode.toLowerCase().includes(q) ||
        row.curriculumMappingDescription.toLowerCase().includes(q) ||
        row.keyVocabulary.some((v) => v.toLowerCase().includes(q)) ||
        row.prerequisites.some((p) => p.toLowerCase().includes(q));

      const matchesUnit = unitFilter === 'ALL' || row.unitTitle === unitFilter;
      const matchesDepth = depthFilter === 'ALL' || row.depthLevel === depthFilter;
      const matchesStage = stageFilter === 'ALL' || row.masteryStage === stageFilter;
      const matchesVerification =
        verificationFilter === 'ALL' || row.evidenceStatus === verificationFilter;

      return matchesSearch && matchesUnit && matchesDepth && matchesStage && matchesVerification;
    });
  }, [rows, searchQuery, unitFilter, depthFilter, stageFilter, verificationFilter]);

  const toggleColumn = (colId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
  };

  const applyColumnPreset = (preset: 'all' | 'pedagogy' | 'curriculum' | 'exercise_assessment') => {
    const updated: Record<string, boolean> = {};
    SCOPE_SEQUENCE_COLUMNS.forEach((col) => {
      if (preset === 'all') {
        updated[col.id] = true;
      } else if (preset === 'pedagogy') {
        updated[col.id] = [
          'seq_num',
          'chapter_title',
          'unit_title',
          'learning_objectives',
          'prerequisites',
          'depth_level',
          'mastery_stage',
          'key_vocabulary',
          'teaching_lessons',
          'target_pages',
        ].includes(col.id);
      } else if (preset === 'curriculum') {
        updated[col.id] = [
          'seq_num',
          'chapter_title',
          'unit_title',
          'curriculum_code',
          'curriculum_desc',
          'evidence_status',
          'policy_alignment',
          'board_notes',
          'production_status',
        ].includes(col.id);
      } else if (preset === 'exercise_assessment') {
        updated[col.id] = [
          'seq_num',
          'chapter_title',
          'exercise_profile',
          'assessment_evidence',
          'diff_support',
          'diff_extension',
          'production_status',
        ].includes(col.id);
      }
    });
    setVisibleColumns(updated);
    setShowColumnPicker(false);
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
    <div className="space-y-4 animate-fadeIn">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#71685E] dark:text-[#c9b9a6]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across chapters, objectives, standards, or vocabulary..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
            />
          </div>

          {/* Right Action: Column Visibility & Presets */}
          <div className="relative flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917] text-xs font-semibold hover:bg-[#C29A52]/10 transition shadow-sm"
            >
              <Columns className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Columns ({Object.values(visibleColumns).filter(Boolean).length}/26)</span>
              <ChevronDown className="w-3 h-3 text-[#71685E]" />
            </button>

            {/* Column Visibility Dropdown */}
            {showColumnPicker && (
              <div className="absolute right-0 top-full mt-2 w-72 max-h-96 bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/40 rounded-xl shadow-2xl z-30 p-3 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between border-b border-[#C29A52]/20 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52]">
                    Master Columns
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowColumnPicker(false)}
                    className="text-xs text-[#71685E] hover:text-[#292521]"
                  >
                    Close
                  </button>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => applyColumnPreset('all')}
                    className="p-1 rounded bg-[#C29A52]/20 hover:bg-[#C29A52]/30 text-center"
                  >
                    All (26 Cols)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyColumnPreset('pedagogy')}
                    className="p-1 rounded bg-[#C29A52]/20 hover:bg-[#C29A52]/30 text-center"
                  >
                    Pedagogy View
                  </button>
                  <button
                    type="button"
                    onClick={() => applyColumnPreset('curriculum')}
                    className="p-1 rounded bg-[#C29A52]/20 hover:bg-[#C29A52]/30 text-center"
                  >
                    Curriculum & Policy
                  </button>
                  <button
                    type="button"
                    onClick={() => applyColumnPreset('exercise_assessment')}
                    className="p-1 rounded bg-[#C29A52]/20 hover:bg-[#C29A52]/30 text-center"
                  >
                    Exercise & Test
                  </button>
                </div>

                {/* Individual Checkboxes */}
                <div className="space-y-1.5 pt-1 divide-y divide-[#C29A52]/10">
                  {SCOPE_SEQUENCE_COLUMNS.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2 pt-1 text-xs cursor-pointer hover:text-[#5A1832]"
                    >
                      <input
                        type="checkbox"
                        checked={!!visibleColumns[col.id]}
                        onChange={() => toggleColumn(col.id)}
                        className="rounded border-[#C29A52]/50 text-[#5A1832] focus:ring-[#5A1832]"
                      />
                      <span className="truncate">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-[#C29A52]/15">
          <div className="flex items-center gap-1.5 text-[#71685E] dark:text-[#c9b9a6]">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Filters:</span>
          </div>

          {/* Unit Filter */}
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="text-[11px] font-medium p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
          >
            <option value="ALL">All Units ({availableUnits.length})</option>
            {availableUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* Depth Filter */}
          <select
            value={depthFilter}
            onChange={(e) => setDepthFilter(e.target.value)}
            className="text-[11px] font-medium p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
          >
            <option value="ALL">All Depths</option>
            <option value="Foundational">Foundational</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Analytical">Analytical</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Mastery Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-[11px] font-medium p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
          >
            <option value="ALL">All Stages (I/D/R/M/E)</option>
            <option value="Introduced">Introduced (I)</option>
            <option value="Developing">Developing (D)</option>
            <option value="Reinforced">Reinforced (R)</option>
            <option value="Mastered">Mastered (M)</option>
            <option value="Extended">Extended (E)</option>
          </select>

          {/* Verification Status Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value as any)}
            className="text-[11px] font-medium p-1.5 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
          >
            <option value="ALL">All Evidence Statuses</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="EDITORIAL_MODEL">Editorial Model Only</option>
          </select>

          {(searchQuery || unitFilter !== 'ALL' || depthFilter !== 'ALL' || stageFilter !== 'ALL' || verificationFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setUnitFilter('ALL');
                setDepthFilter('ALL');
                setStageFilter('ALL');
                setVerificationFilter('ALL');
              }}
              className="text-[11px] text-[#5A1832] dark:text-[#C29A52] font-semibold hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Master Scope & Sequence Table */}
      <div className="rounded-xl border border-[#C29A52]/30 bg-white dark:bg-[#292521] shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[640px]">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#F0EBE0] dark:bg-[#262220] text-[#71685E] dark:text-[#c9b9a6] font-bold sticky top-0 z-10 border-b border-[#C29A52]/30 shadow-sm">
              <tr>
                {visibleColumns['seq_num'] && (
                  <th className="py-3 px-3 w-12 text-center">Seq #</th>
                )}
                {visibleColumns['chapter_title'] && (
                  <th className="py-3 px-3 min-w-[200px]">Chapter Title</th>
                )}
                {visibleColumns['unit_title'] && (
                  <th className="py-3 px-3 min-w-[150px]">Instructional Unit</th>
                )}
                {visibleColumns['curriculum_code'] && (
                  <th className="py-3 px-3 min-w-[130px]">Curriculum Code</th>
                )}
                {visibleColumns['curriculum_desc'] && (
                  <th className="py-3 px-3 min-w-[220px]">Curriculum Link & Standard</th>
                )}
                {visibleColumns['evidence_status'] && (
                  <th className="py-3 px-3 min-w-[110px] text-center">Evidence</th>
                )}
                {visibleColumns['learning_objectives'] && (
                  <th className="py-3 px-3 min-w-[200px]">Learning Objectives</th>
                )}
                {visibleColumns['prerequisites'] && (
                  <th className="py-3 px-3 min-w-[180px]">Prerequisites</th>
                )}
                {visibleColumns['depth_level'] && (
                  <th className="py-3 px-3 min-w-[120px] text-center">Depth Level</th>
                )}
                {visibleColumns['mastery_stage'] && (
                  <th className="py-3 px-3 min-w-[120px] text-center">Mastery Stage</th>
                )}
                {visibleColumns['key_vocabulary'] && (
                  <th className="py-3 px-3 min-w-[160px]">Key Vocabulary</th>
                )}
                {visibleColumns['exercise_profile'] && (
                  <th className="py-3 px-3 min-w-[170px]">Exercise Profile</th>
                )}
                {visibleColumns['assessment_evidence'] && (
                  <th className="py-3 px-3 min-w-[160px]">Assessment Alignment</th>
                )}
                {visibleColumns['teaching_lessons'] && (
                  <th className="py-3 px-3 w-20 text-center">Lessons</th>
                )}
                {visibleColumns['target_pages'] && (
                  <th className="py-3 px-3 w-20 text-center">Pages</th>
                )}
                {visibleColumns['production_status'] && (
                  <th className="py-3 px-3 min-w-[110px] text-center">Status</th>
                )}
                <th className="py-3 px-3 w-24 text-center sticky right-0 bg-[#F0EBE0] dark:bg-[#262220]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#C29A52]/20 text-[#292521] dark:text-[#F6F0E7]">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={27} className="py-12 text-center text-[#71685E] dark:text-[#c9b9a6]">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-serif">No sequence rows match your active filter.</p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#FAF8F5]/80 dark:hover:bg-[#1c1917]/50 transition group"
                  >
                    {/* Seq Num */}
                    {visibleColumns['seq_num'] && (
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                        {row.seqNumber}
                      </td>
                    )}

                    {/* Chapter Title */}
                    {visibleColumns['chapter_title'] && (
                      <td className="py-2.5 px-3 font-semibold">
                        <button
                          type="button"
                          onClick={() => onOpenChapterPlan(row)}
                          className="hover:underline text-left text-[#5A1832] dark:text-[#C29A52] font-serif block font-bold"
                        >
                          {row.chapterTitle}
                        </button>
                        <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-1">
                          {row.priorLearning || 'Foundational concept'}
                        </span>
                      </td>
                    )}

                    {/* Instructional Unit */}
                    {visibleColumns['unit_title'] && (
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/30">
                          {row.unitTitle}
                        </span>
                      </td>
                    )}

                    {/* Curriculum Code */}
                    {visibleColumns['curriculum_code'] && (
                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        {row.curriculumMappingCode}
                      </td>
                    )}

                    {/* Curriculum Description */}
                    {visibleColumns['curriculum_desc'] && (
                      <td className="py-2.5 px-3">
                        <p className="line-clamp-2 text-xs">
                          {row.curriculumMappingDescription}
                        </p>
                      </td>
                    )}

                    {/* Evidence Status */}
                    {visibleColumns['evidence_status'] && (
                      <td className="py-2.5 px-3 text-center">
                        {row.evidenceStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" /> VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                            <AlertTriangle className="w-3 h-3" /> MODEL
                          </span>
                        )}
                      </td>
                    )}

                    {/* Learning Objectives */}
                    {visibleColumns['learning_objectives'] && (
                      <td className="py-2.5 px-3">
                        <span className="text-[11px] font-semibold text-[#5A1832] dark:text-[#C29A52] block">
                          {row.learningObjectives.length} Objectives
                        </span>
                        <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-1">
                          {row.learningObjectives[0] || 'None defined'}
                        </span>
                      </td>
                    )}

                    {/* Prerequisites */}
                    {visibleColumns['prerequisites'] && (
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {row.prerequisites.slice(0, 2).map((prereq, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded text-[10px] bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/30 text-[#71685E] dark:text-[#c9b9a6]"
                            >
                              {prereq}
                            </span>
                          ))}
                          {row.prerequisites.length > 2 && (
                            <span className="text-[10px] text-[#71685E]">
                              +{row.prerequisites.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Depth Level */}
                    {visibleColumns['depth_level'] && (
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={row.depthLevel}
                          onChange={(e) =>
                            onUpdateRow({ ...row, depthLevel: e.target.value as ScopeSequenceDepthLevel })
                          }
                          className="text-[11px] font-semibold p-1 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                        >
                          <option value="Foundational">Foundational</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Analytical">Analytical</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </td>
                    )}

                    {/* Mastery Stage */}
                    {visibleColumns['mastery_stage'] && (
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={row.masteryStage}
                          onChange={(e) => {
                            const st = e.target.value as ScopeSequenceMasteryStage;
                            const map: Record<ScopeSequenceMasteryStage, 'I' | 'D' | 'R' | 'M' | 'E'> = {
                              Introduced: 'I',
                              Developing: 'D',
                              Reinforced: 'R',
                              Mastered: 'M',
                              Extended: 'E',
                            };
                            onUpdateRow({ ...row, masteryStage: st, masteryCode: map[st] });
                          }}
                          className={`text-[11px] font-bold p-1 rounded border ${getStageBadge(row.masteryStage)}`}
                        >
                          <option value="Introduced">Introduced (I)</option>
                          <option value="Developing">Developing (D)</option>
                          <option value="Reinforced">Reinforced (R)</option>
                          <option value="Mastered">Mastered (M)</option>
                          <option value="Extended">Extended (E)</option>
                        </select>
                      </td>
                    )}

                    {/* Key Vocabulary */}
                    {visibleColumns['key_vocabulary'] && (
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {row.keyVocabulary.slice(0, 2).map((v, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded text-[10px] bg-[#5A1832]/5 text-[#5A1832] dark:text-[#C29A52] border border-[#C29A52]/30"
                            >
                              {v}
                            </span>
                          ))}
                          {row.keyVocabulary.length > 2 && (
                            <span className="text-[10px] text-[#71685E]">
                              +{row.keyVocabulary.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Exercise Profile */}
                    {visibleColumns['exercise_profile'] && (
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52]">
                            {row.exerciseProfile.length} Drills
                          </span>
                          <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                            ({row.exerciseProfile[0]?.label || 'Ex A'}..{row.exerciseProfile[row.exerciseProfile.length - 1]?.label || 'Ex D'})
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Assessment Evidence */}
                    {visibleColumns['assessment_evidence'] && (
                      <td className="py-2.5 px-3">
                        <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-1">
                          {row.assessmentEvidence[0] || 'Unit Test'}
                        </span>
                      </td>
                    )}

                    {/* Lessons */}
                    {visibleColumns['teaching_lessons'] && (
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        <input
                          type="number"
                          value={row.recommendedTeachingLessons}
                          onChange={(e) =>
                            onUpdateRow({
                              ...row,
                              recommendedTeachingLessons: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-12 text-center p-1 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                        />
                      </td>
                    )}

                    {/* Target Pages */}
                    {visibleColumns['target_pages'] && (
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        <input
                          type="number"
                          value={row.estimatedPages}
                          onChange={(e) =>
                            onUpdateRow({
                              ...row,
                              estimatedPages: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-12 text-center p-1 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                        />
                      </td>
                    )}

                    {/* Production Status */}
                    {visibleColumns['production_status'] && (
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={row.productionStatus}
                          onChange={(e) =>
                            onUpdateRow({
                              ...row,
                              productionStatus: e.target.value as ScopeSequenceProductionStatus,
                            })
                          }
                          className="text-[11px] font-semibold p-1 rounded border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                        >
                          <option value="Planned">Planned</option>
                          <option value="Drafting">Drafting</option>
                          <option value="In Review">In Review</option>
                          <option value="Completed">Completed</option>
                          <option value="Pre-Press">Pre-Press</option>
                        </select>
                      </td>
                    )}

                    {/* Row Actions */}
                    <td className="py-2.5 px-3 text-center sticky right-0 bg-white dark:bg-[#292521] shadow-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenChapterPlan(row)}
                          className="p-1 rounded hover:bg-[#C29A52]/20 text-[#5A1832] dark:text-[#C29A52]"
                          title="Open Chapter Plan Card"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {onOpenChapterStudio && (
                          <button
                            type="button"
                            onClick={() => onOpenChapterStudio(row.chapterId)}
                            className="p-1 rounded hover:bg-[#C29A52]/20 text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#C29A52]"
                            title="Open in Chapter Studio"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
