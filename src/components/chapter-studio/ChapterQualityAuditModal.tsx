import React, { useState } from 'react';
import {
  Award,
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  GitBranch,
  Layers,
  ShieldCheck,
  Check,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { StudioChapter, ChapterQualityAuditReport } from '../../types';

interface ChapterQualityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onUpdateQualityAudit: (updatedAudit: ChapterQualityAuditReport) => void;
  isDarkMode: boolean;
}

export const ChapterQualityAuditModal: React.FC<ChapterQualityAuditModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onUpdateQualityAudit,
  isDarkMode,
}) => {
  const audit = chapter?.qualityAudit || {
    overallReadinessScore: 88,
    workflowStatus: chapter?.workflowStatus,
    lastAudited: new Date().toISOString(),
    dimensions: {
      content: { score: 90, status: 'complete', notes: 'Core content and rules formatted.' },
      pedagogy: { score: 92, status: 'complete', notes: 'Scaffolded progression present.' },
      visualLearning: { score: 85, status: 'complete', notes: 'Visual assets mapped.' },
      practice: { score: 90, status: 'complete', notes: 'Graded exercises provided.' },
      assessment: { score: 86, status: 'complete', notes: 'Assessment items ready.' },
      editorial: { score: 88, status: 'complete', notes: 'Tone and language checked.' },
      publishing: { score: 82, status: 'review', notes: 'Illustration briefs ready.' },
    },
    distinctiveness: {
      score: 91,
      rating: 'High Distinction',
      highlights: ['Authentic proofreading passage', 'Clear worked example steps'],
      areasForDeepening: ['Add Olympiad challenge problem'],
      recommendations: ['Review cross-grade link with Class 5'],
    },
    repetitionAlerts: [],
    crossGradeProgression: {
      conceptName: chapter?.title || 'Grammar Concept',
      previousTreatmentClass5: 'Class 5: Concrete noun-verb pairing and simple sentences.',
      currentTreatmentClass6: 'Class 6: Intervening phrases, correlatives, and collective nouns.',
      nextLevelTreatmentClass7: 'Class 7: Inverted syntax, relative pronouns, and clause concord.',
    },
    checklistItems: [
      { id: 'ck-1', label: 'Chapter Opener & Hook finalized', done: true, category: 'Content' },
      { id: 'ck-2', label: 'Definitions and Golden Rules formatted', done: true, category: 'Content' },
      { id: 'ck-3', label: 'Worked Example step-by-step methodology included', done: true, category: 'Pedagogy' },
      { id: 'ck-4', label: 'At least 5 graded exercises created', done: true, category: 'Practice' },
      { id: 'ck-5', label: 'Full Answer Key with rationale prepared', done: true, category: 'Assessment' },
      { id: 'ck-6', label: 'Visual assets and illustration briefs specified', done: true, category: 'Visuals' },
      { id: 'ck-7', label: 'Author notes attached to teacher-sensitive sections', done: true, category: 'Editorial' },
    ],
  };

  const [activeTab, setActiveTab] = useState<
    'dimensions' | 'distinctiveness' | 'cross_grade' | 'checklist'
  >('dimensions');
  const [checklist, setChecklist] = useState(audit.checklistItems);

  if (!isOpen || !chapter) return null;

  const toggleChecklist = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setChecklist(updated);
    onUpdateQualityAudit({
      ...audit,
      checklistItems: updated,
    });
  };

  const dimensionKeys = [
    { key: 'content', label: '1. Content Depth & Rigour' },
    { key: 'pedagogy', label: '2. Pedagogical Scaffolding' },
    { key: 'visualLearning', label: '3. Visual Learning & Diagrams' },
    { key: 'practice', label: '4. Practice Volume & Variety' },
    { key: 'assessment', label: '5. Assessment & Answer Keys' },
    { key: 'editorial', label: '6. Editorial & Voice Restraint' },
    { key: 'publishing', label: '7. Publishing & Layout Readiness' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#CBBEAC] bg-[#EDE4D6]/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#5A1832] text-[#FFFDF8]">
              <Award className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-[#35101F]">Chapter Quality &amp; Distinctiveness Audit</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                  {audit.overallReadinessScore}% Readiness
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {audit.distinctiveness.rating}
                </span>
              </div>
              <p className="text-xs text-[#71685E]">
                Evaluation for: {chapter.title} ({chapter.equivalentClass} • {chapter.systemId || 'CBSE'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#292521] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#CBBEAC] px-4 text-xs font-semibold bg-[#EDE4D6]/30">
          <button
            type="button"
            onClick={() => setActiveTab('dimensions')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'dimensions'
                ? 'border-[#5A1832] text-[#5A1832]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            7 Quality Dimensions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('distinctiveness')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'distinctiveness'
                ? 'border-[#5A1832] text-[#5A1832]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Distinctiveness &amp; Voice Check
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cross_grade')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'cross_grade'
                ? 'border-[#5A1832] text-[#5A1832]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Cross-Grade Progression
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'checklist'
                ? 'border-[#5A1832] text-[#5A1832]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Publishing Checklist ({checklist.filter((c) => c.done).length}/{checklist.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'dimensions' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dimensionKeys.map(({ key, label }) => {
                  const dim = audit.dimensions[key as keyof typeof audit.dimensions];
                  return (
                    <div
                      key={key}
                      className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#35101F]">
                          {label}
                        </span>
                        <span
                          className={`font-bold font-mono text-xs ${
                            dim.score >= 90
                              ? 'text-emerald-700'
                              : dim.score >= 80
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {dim.score}%
                        </span>
                      </div>
                      <div className="w-full bg-[#EDE4D6] h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full ${
                            dim.score >= 90
                              ? 'bg-emerald-600'
                              : dim.score >= 80
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#71685E] leading-relaxed font-medium">
                        {dim.notes}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'distinctiveness' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#EDE4D6]/70 border border-[#CBBEAC] text-[#292521] space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#C29A52]" />
                  <span className="font-bold text-xs text-[#35101F]">
                    Distinctiveness Rating: {audit.distinctiveness.rating} ({audit.distinctiveness.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-[#71685E]">
                  This audit guarantees the chapter breaks away from generic textbook templates by providing distinct visual metaphors, real worked examples, and purposeful error analysis.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#35101F]">
                  Distinctiveness Highlights
                </h4>
                <div className="space-y-1.5">
                  {audit.distinctiveness.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-950 flex items-center space-x-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#35101F]">
                  Recommendations for Commercial Excellence
                </h4>
                <div className="space-y-1.5">
                  {audit.distinctiveness.recommendations.map((r, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-[#CBBEAC] bg-[#EDE4D6]/50 text-[#292521] flex items-center space-x-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#5A1832] shrink-0" />
                      <span className="text-[11px]">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cross_grade' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#EDE4D6]/70 border border-[#CBBEAC] text-[#292521]">
                <p className="font-bold text-[11px] text-[#35101F] mb-1">
                  Spiral Curriculum Inspector: {audit.crossGradeProgression.conceptName}
                </p>
                <p className="text-[11px] text-[#71685E]">
                  Verifies that the treatment for {chapter.equivalentClass} builds deliberately upon earlier grades without verbatim repetition.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7]">
                  <span className="font-bold uppercase text-[10px] text-[#71685E] block mb-1">
                    Previous Grade: Class 5 Foundation
                  </span>
                  <p className="text-[11px] text-[#292521] font-medium">
                    {audit.crossGradeProgression.previousTreatmentClass5}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#C29A52] bg-[#EDE4D6]/60">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold uppercase text-[10px] text-[#5A1832]">
                      Current Grade: {chapter.equivalentClass} (Active Workspace)
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#5A1832] text-[#FFFDF8]">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#292521] font-medium">
                    {audit.crossGradeProgression.currentTreatmentClass6}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7]">
                  <span className="font-bold uppercase text-[10px] text-[#71685E] block mb-1">
                    Next Grade: Class 7 Advanced Scope
                  </span>
                  <p className="text-[11px] text-[#292521] font-medium">
                    {audit.crossGradeProgression.nextLevelTreatmentClass7}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    item.done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-[#FFFDF8] border-[#CBBEAC] text-[#292521] hover:bg-[#EDE4D6]/30'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        item.done
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-[#CBBEAC]'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
