// =============================================================
// VERITAS Editorial Platform — Exercise Intelligence & Properties Panel
// Section 24: Right column inspector for curriculum, answer logic & audit
// =============================================================

import React, { useState } from 'react';
import {
  StudioExercise,
  GrammarQuestion,
  StudioChapter,
  ExerciseAuditIssue,
} from '../../../types';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Tag,
  BookOpen,
  Brain,
  GraduationCap,
  Scale,
  Clock,
  Plus,
  X,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface ExerciseIntelligencePanelProps {
  exercise: StudioExercise;
  chapter: StudioChapter;
  onUpdateExercise: (updated: StudioExercise) => void;
  auditIssues: ExerciseAuditIssue[];
  onOpenAiGeneratorWithMode: (mode: any) => void;
  selectedQuestionId?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

type RightPanelTab = 'properties' | 'curriculum' | 'answers' | 'ai_tools' | 'audit';

export const ExerciseIntelligencePanel: React.FC<ExerciseIntelligencePanelProps> = ({
  exercise,
  chapter,
  onUpdateExercise,
  auditIssues,
  onOpenAiGeneratorWithMode,
  selectedQuestionId,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('properties');
  const [newRuleTag, setNewRuleTag] = useState('');

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#F6F0E7] border-l border-[#D8CBB9] flex flex-col items-center py-4 gap-4 shrink-0 transition-all select-none">
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-[#615546] hover:text-[#292521] hover:bg-[#EBE2D3] rounded transition-all cursor-pointer"
            title="Expand Exercise Intelligence Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <span className="text-[10px] font-serif font-bold text-[#8C2435] [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase py-2">
          Intelligence &amp; Properties
        </span>
        {auditIssues.length > 0 && (
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600" title={`${auditIssues.length} audit notices`} />
        )}
      </div>
    );
  }

  const questions = exercise.questions || [];
  const exerciseAuditIssues = auditIssues.filter(
    (issue) => issue.exerciseLetter === exercise.letter
  );

  // Calculate Bloom Cognitive distribution in this exercise
  const bloomDistribution = questions.reduce((acc, q) => {
    const level = q.cognitiveLevel || 'Understanding';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAddRuleTag = () => {
    if (!newRuleTag.trim()) return;
    const current = exercise.grammarRuleCoverage || [];
    if (!current.includes(newRuleTag.trim())) {
      onUpdateExercise({
        ...exercise,
        grammarRuleCoverage: [...current, newRuleTag.trim()],
      });
    }
    setNewRuleTag('');
  };

  const handleRemoveRuleTag = (tagToRemove: string) => {
    onUpdateExercise({
      ...exercise,
      grammarRuleCoverage: (exercise.grammarRuleCoverage || []).filter(
        (t) => t !== tagToRemove
      ),
    });
  };

  return (
    <div
      id="exercise-intelligence-panel"
      className="w-80 bg-[#F6F0E7] border-l border-[#D8CBB9] flex flex-col h-full shrink-0 select-none"
    >
      {/* Tab Navigation Header with Collapse Toggle */}
      <div className="bg-[#EFE8DC] border-b border-[#D8CBB9] p-2 flex items-center gap-1">
        <div className="grid grid-cols-5 gap-1 text-[11px] font-serif font-bold flex-1 min-w-0">
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-1.5 px-1 rounded text-center truncate transition-all ${
              activeTab === 'properties'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-xs'
                : 'text-[#615546] hover:bg-[#E5DACB]'
            }`}
            title="Properties & Metadata"
          >
            Meta
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`py-1.5 px-1 rounded text-center truncate transition-all ${
              activeTab === 'curriculum'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-xs'
                : 'text-[#615546] hover:bg-[#E5DACB]'
            }`}
            title="Curriculum & Bloom Taxonomy"
          >
            Curric
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`py-1.5 px-1 rounded text-center truncate transition-all ${
              activeTab === 'answers'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-xs'
                : 'text-[#615546] hover:bg-[#E5DACB]'
            }`}
            title="Answer Intelligence & Rubrics"
          >
            Answers
          </button>
          <button
            onClick={() => setActiveTab('ai_tools')}
            className={`py-1.5 px-1 rounded text-center truncate transition-all ${
              activeTab === 'ai_tools'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-xs'
                : 'text-[#615546] hover:bg-[#E5DACB]'
            }`}
            title="AI Generation Tools"
          >
            AI
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-1.5 px-1 rounded text-center truncate transition-all flex items-center justify-center gap-0.5 ${
              activeTab === 'audit'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-xs'
                : 'text-[#615546] hover:bg-[#E5DACB]'
            }`}
            title="Exercise Health Audit"
          >
            Audit
            {exerciseAuditIssues.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            )}
          </button>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 text-[#615546] hover:text-[#292521] hover:bg-[#E5DACB] rounded transition-all cursor-pointer shrink-0"
            title="Collapse Intelligence Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 text-xs font-serif text-[#292521] space-y-4">
        {/* TAB 1: PROPERTIES & METADATA */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F] block mb-1">
                Exercise Identity
              </span>
              <div className="bg-[#FAF7F2] p-3 rounded border border-[#DDD0BC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#615546]">Identifier:</span>
                  <span className="font-bold text-[#8C2435]">Exercise {exercise.letter}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#615546]">Tier:</span>
                  <span className="font-bold">{exercise.developmentalTier || 'PRACTICE'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#615546]">Curriculum:</span>
                  <span className="font-bold">{chapter.curriculumBoard || chapter.systemId || 'CISCE'} {chapter.equivalentClass || 'Class 6'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#615546]">Total Questions:</span>
                  <span className="font-mono font-bold">{questions.length} Items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#615546]">Allocated Marks:</span>
                  <span className="font-mono font-bold text-[#8C2435]">
                    {exercise.suggestedMarks || 5} Marks
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F] block mb-1">
                Pedagogical Purpose
              </span>
              <textarea
                rows={3}
                value={exercise.pedagogicalPurpose || ''}
                onChange={(e) =>
                  onUpdateExercise({
                    ...exercise,
                    pedagogicalPurpose: e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F2] border border-[#DDD0BC] rounded p-2 text-xs text-[#292521] outline-none resize-none focus:border-[#8C2435]"
                placeholder="Explain the intended learning goal of this exercise set..."
              />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F] block mb-1">
                Teacher Edition Note
              </span>
              <textarea
                rows={3}
                value={exercise.teacherNote || ''}
                onChange={(e) =>
                  onUpdateExercise({
                    ...exercise,
                    teacherNote: e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F2] border border-[#DDD0BC] rounded p-2 text-xs text-[#292521] outline-none resize-none focus:border-[#8C2435]"
                placeholder="Instructional tips for teachers using this exercise in class..."
              />
            </div>
          </div>
        )}

        {/* TAB 2: CURRICULUM & BLOOM TAXONOMY */}
        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F] block mb-1">
                Bloom Cognitive Distribution
              </span>
              <div className="bg-[#FAF7F2] p-3 rounded border border-[#DDD0BC] space-y-1.5">
                {['Remembering', 'Understanding', 'Applying', 'Analysing', 'Evaluating', 'Creating'].map(
                  (level) => {
                    const count = bloomDistribution[level] || 0;
                    const percent = questions.length > 0 ? Math.round((count / questions.length) * 100) : 0;
                    return (
                      <div key={level} className="flex items-center justify-between text-xs">
                        <span className="text-[#615546]">{level}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#EDE4D6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8C2435]"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-[11px] text-[#292521] w-6 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F]">
                  Grammar Rule Tags
                </span>
                <span className="text-[10px] text-[#7A6E5F]">
                  {(exercise.grammarRuleCoverage || []).length} Rules
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {(exercise.grammarRuleCoverage || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EDE4D6] text-[#4A3F33] text-[11px] border border-[#D8CBB9]"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveRuleTag(tag)}
                      className="text-[#7A6E5F] hover:text-[#8C2435]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newRuleTag}
                  onChange={(e) => setNewRuleTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRuleTag()}
                  placeholder="Add grammar rule tag..."
                  className="flex-1 bg-[#FAF7F2] border border-[#DDD0BC] rounded px-2 py-1 text-xs outline-none focus:border-[#8C2435]"
                />
                <button
                  onClick={handleAddRuleTag}
                  className="p-1 bg-[#8C2435] text-white rounded hover:bg-[#721B2A]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F] block mb-1">
                Chapter Objective Alignment
              </span>
              <div className="p-2.5 bg-[#FAF7F2] rounded border border-[#DDD0BC] text-xs text-[#4A3F33] leading-relaxed">
                {exercise.learningObjective ||
                  (chapter.opening?.learningObjectives?.[0] ??
                    'Demonstrate mastery of grammatical concord and syntax.')}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANSWER INTELLIGENCE */}
        {activeTab === 'answers' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#FAF7F2] rounded border border-[#DDD0BC] space-y-2">
              <span className="text-xs font-bold text-[#8C2435] block">
                Open-Ended Marking Intelligence
              </span>
              <p className="text-[11px] text-[#615546] leading-relaxed">
                VERITAS avoids rigid exact-string checks. Each question maintains a primary model answer, a bank of acceptable alternatives, case-sensitivity controls, and partial-credit guidelines.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded border border-[#DDD0BC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F] block">
                Marking Standards for Exercise {exercise.letter}
              </span>
              <div className="space-y-1.5 text-xs text-[#4A3F33]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Accepts valid synonyms & word orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Punctuation tolerance enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Partial credit: 0.5 mark for each target</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E5F] block mb-1">
                Answer Key Editorial Notes
              </span>
              <textarea
                rows={3}
                value={exercise.answerKeyNotes || ''}
                onChange={(e) =>
                  onUpdateExercise({
                    ...exercise,
                    answerKeyNotes: e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F2] border border-[#DDD0BC] rounded p-2 text-xs text-[#292521] outline-none resize-none focus:border-[#8C2435]"
                placeholder="Special grading instructions for evaluators..."
              />
            </div>
          </div>
        )}

        {/* TAB 4: AI GENERATION QUICK TOOLS */}
        {activeTab === 'ai_tools' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#FAF7F2] rounded border border-[#D4AF37]/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C2435]">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                Targeted AI Generators
              </div>
              <p className="text-[11px] text-[#615546]">
                Preview candidate questions before accepting into Exercise {exercise.letter}.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onOpenAiGeneratorWithMode('more_like_this')}
                className="w-full p-2.5 text-left bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD0BC] rounded text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#292521]">Generate 3 More Like This</div>
                  <div className="text-[11px] text-[#7A6E5F]">Variations of existing items</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C2435]" />
              </button>

              <button
                onClick={() => onOpenAiGeneratorWithMode('easier_version')}
                className="w-full p-2.5 text-left bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD0BC] rounded text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#292521]">Generate Scaffolded / Easier Variant</div>
                  <div className="text-[11px] text-[#7A6E5F]">Lower cognitive hurdle for struggling learners</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C2435]" />
              </button>

              <button
                onClick={() => onOpenAiGeneratorWithMode('harder_version')}
                className="w-full p-2.5 text-left bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD0BC] rounded text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#292521]">Generate Higher-Order Extension</div>
                  <div className="text-[11px] text-[#7A6E5F]">Challenging synthesis questions</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C2435]" />
              </button>

              <button
                onClick={() => onOpenAiGeneratorWithMode('misconceptions')}
                className="w-full p-2.5 text-left bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD0BC] rounded text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#292521]">Generate Misconception Traps</div>
                  <div className="text-[11px] text-[#7A6E5F]">Target common primary errors</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C2435]" />
              </button>

              <button
                onClick={() => onOpenAiGeneratorWithMode('from_visual')}
                className="w-full p-2.5 text-left bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD0BC] rounded text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#292521]">Generate from Figure 1.1</div>
                  <div className="text-[11px] text-[#7A6E5F]">Classroom visual stimulus questions</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C2435]" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT HEALTH FOR THIS EXERCISE */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#FAF7F2] rounded border border-[#DDD0BC] space-y-1">
              <span className="text-xs font-bold text-[#292521]">
                Quality Status: Exercise {exercise.letter}
              </span>
              <p className="text-[11px] text-[#615546]">
                {exerciseAuditIssues.length === 0
                  ? 'No critical pedagogical issues flagged in this exercise set.'
                  : `${exerciseAuditIssues.length} issue(s) detected.`}
              </p>
            </div>

            {exerciseAuditIssues.length === 0 ? (
              <div className="p-4 bg-[#EAF2DC] rounded border border-[#C6DC9E] text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-[#4D7C0F] mx-auto" />
                <div className="text-xs font-bold text-[#2E4A08]">Clean Academic Record</div>
                <p className="text-[11px] text-[#4A6E1E]">
                  All questions have valid keys, objectives, and age-appropriate prompts.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {exerciseAuditIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-2.5 bg-[#FAF7F2] rounded border border-amber-300 space-y-1 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{issue.title}</span>
                    </div>
                    <p className="text-[11px] text-[#615546]">{issue.description}</p>
                    <div className="p-1.5 bg-[#FFFDF9] rounded border border-[#E3D7C5] text-[10px] text-[#4A3F33]">
                      <span className="font-bold">Recommendation:</span> {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
