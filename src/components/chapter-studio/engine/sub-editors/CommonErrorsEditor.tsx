import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  GraduationCap,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CommonErrorItem, Component10Data } from '../../../../types';
import { ViewDisplayMode } from '../types';

interface CommonErrorsEditorProps {
  data: Component10Data;
  onChange: (updated: Component10Data) => void;
  viewMode: ViewDisplayMode;
  isDarkMode?: boolean;
}

export const CommonErrorsEditor: React.FC<CommonErrorsEditorProps> = ({
  data,
  onChange,
  viewMode,
  isDarkMode = false,
}) => {
  const items = data.items || [];
  const [expandedId, setExpandedId] = useState<string>(items[0]?.id || '');

  const handleAddItem = () => {
    const newId = `ce-${Date.now()}`;
    const newItem: CommonErrorItem = {
      id: newId,
      title: `Error Pattern ${items.length + 1}: False Attraction / Misconception`,
      incorrectSentence: '',
      correctSentence: '',
      mistakeType: 'Proximity Trap / False Concord',
      explanation: 'Students are drawn to agree the verb with the immediately adjacent noun rather than identifying the true syntactic head.',
      ruleAnchor: 'Rule: The verb must agree with its grammatical head noun, not intervening prepositional modifiers.',
      preventionTip: 'Cover the prepositional modifier between subject and verb to reveal the true head noun.',
      frequency: 'Critical Exam Trap',
      teacherNote: 'This represents the single most frequently failed question format on middle and secondary school English papers.',
    };

    onChange({
      ...data,
      items: [...items, newItem],
      lastModified: new Date().toISOString(),
    });
    setExpandedId(newId);
  };

  const handleUpdateItem = (id: string, updates: Partial<CommonErrorItem>) => {
    const updated = items.map((it) => (it.id === id ? { ...it, ...updates } : it));
    onChange({
      ...data,
      items: updated,
      lastModified: new Date().toISOString(),
    });
  };

  const handleDeleteItem = (id: string) => {
    const filtered = items.filter((it) => it.id !== id);
    onChange({
      ...data,
      items: filtered,
      lastModified: new Date().toISOString(),
    });
    if (expandedId === id && filtered.length > 0) {
      setExpandedId(filtered[0].id);
    }
  };

  // -------------------------------------------------------------
  // PREVIEW MODES (Student Edition vs Teacher Edition)
  // -------------------------------------------------------------
  if (viewMode === 'student_preview' || viewMode === 'teacher_preview') {
    const isTeacher = viewMode === 'teacher_preview';

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-2">
        <div className="flex items-center justify-between border-b border-[#D8C7B5] dark:border-[#3D2C1E] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-700" />
            <h3 className="font-serif text-lg font-bold text-[#292521] dark:text-[#F6F0E7]">
              Watch Out! Common Errors & Pitfalls
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium uppercase tracking-wider ${
              isTeacher
                ? 'bg-[#5A1832] text-[#F6F0E7]'
                : 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
            }`}
          >
            {isTeacher ? 'Teacher Annotated Diagnostic' : 'Student Callout Display'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-[#F6F0E7] dark:bg-[#1f150f] rounded-xl border border-dashed border-[#D8C7B5] dark:border-[#3D2C1E]">
            <p className="text-[#71685E] text-sm">No common errors authored yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white dark:bg-[#1a110a] rounded-xl border-2 border-rose-200 dark:border-rose-900/40 shadow-sm overflow-hidden"
              >
                {/* Header Badge */}
                <div className="bg-rose-50 dark:bg-rose-950/20 px-5 py-2.5 border-b border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      PITFALL #{idx + 1}: {item.title}
                    </span>
                  </div>
                  {item.frequency && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.frequency === 'Critical Exam Trap'
                          ? 'bg-rose-700 text-white'
                          : 'bg-[#EDE4D6] text-[#5A1832]'
                      }`}
                    >
                      {item.frequency}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Contrastive Pairs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Incorrect Exemplar */}
                    <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-3.5 rounded-lg flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                          Incorrect Usage:
                        </span>
                        <p className="font-serif text-sm line-through text-rose-900 dark:text-rose-200 mt-1">
                          {item.incorrectSentence || '(No incorrect sentence entered)'}
                        </p>
                      </div>
                    </div>

                    {/* Correct Exemplar */}
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-3.5 rounded-lg flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Correct Standard Usage:
                        </span>
                        <p className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-100 mt-1">
                          {item.correctSentence || '(No correct sentence entered)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Why Students Make This Mistake */}
                  {item.explanation && (
                    <div className="text-xs bg-[#FAF7F2] dark:bg-[#20150d] p-3 rounded-lg border border-[#E8DED1] dark:border-[#3D2C1E]">
                      <span className="font-bold text-[#5A1832] uppercase tracking-wider text-[10px] block mb-1">
                        Why students stumble:
                      </span>
                      <p className="text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  )}

                  {/* Prevention Tip / Memory Hook */}
                  {item.preventionTip && (
                    <div className="bg-[#FFFDF5] dark:bg-[#20180a] border-l-3 border-[#9A7438] p-3 rounded-r-lg flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#9A7438] flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-[#9A7438] uppercase tracking-wider text-[10px]">
                          How to avoid it (Memory Hook):
                        </span>
                        <p className="text-[#292521] dark:text-[#F6F0E7] mt-0.5 font-medium">
                          {item.preventionTip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Teacher Annotation */}
                  {isTeacher && item.teacherNote && (
                    <div className="bg-[#FAF7F2] dark:bg-[#1c120b] border-l-3 border-[#5A1832] p-3 rounded-r-lg space-y-1">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[#5A1832]" />
                        <span className="text-[10px] font-bold text-[#5A1832] uppercase tracking-wider">
                          Teacher Diagnostic Observation & Remediation
                        </span>
                      </div>
                      <p className="text-xs text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                        {item.teacherNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHORING MODE
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#292521] dark:text-[#F6F0E7]">
            Common Errors & Contrastive Pitfalls
          </h4>
          <p className="text-xs text-[#71685E] dark:text-[#b4a496]">
            Protect students from common exam traps with explicit incorrect vs correct contrastive pairs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1832] text-white hover:bg-[#481226] text-xs font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Error Pair
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-[#F6F0E7]/60 dark:bg-[#1f150f] rounded-xl border border-dashed border-[#D8C7B5] dark:border-[#3D2C1E] space-y-3">
          <AlertTriangle className="w-8 h-8 mx-auto text-rose-600" />
          <p className="text-sm font-medium text-[#292521] dark:text-[#F6F0E7]">
            No Common Errors Authored Yet
          </p>
          <p className="text-xs text-[#71685E] max-w-md mx-auto">
            High-contrast error pairs are proven to reduce recurrent student mistakes on board examinations. Click below to add your first pair.
          </p>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A1832] text-white text-xs font-semibold rounded-lg hover:bg-[#481226] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Common Error
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id || idx}
                className="bg-[#FCFAF7] dark:bg-[#1a110a] rounded-xl border border-[#D8C7B5] dark:border-[#3D2C1E] shadow-sm transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                  className="px-4 py-3 cursor-pointer flex items-center justify-between select-none hover:bg-[#F6F0E7]/50 dark:hover:bg-[#24170e]/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-rose-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-xs text-[#292521] dark:text-[#F6F0E7]">
                        {item.title || `Common Error ${idx + 1}`}
                      </span>
                      {item.incorrectSentence && (
                        <p className="text-[11px] text-rose-700 dark:text-rose-400 line-through line-clamp-1">
                          {item.incorrectSentence}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-medium px-2 py-0.5 rounded">
                      {item.frequency || 'High'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Form Body */}
                {isExpanded && (
                  <div className="p-4 border-t border-[#E8DED1] dark:border-[#3D2C1E] space-y-4 bg-white dark:bg-[#160e08]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Error Pattern Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                          placeholder="e.g. Agreement with Collective Nouns & Intervening Modifiers"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Severity / Frequency
                        </label>
                        <select
                          value={item.frequency || 'High'}
                          onChange={(e) => handleUpdateItem(item.id, { frequency: e.target.value as any })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        >
                          <option value="High">High Frequency</option>
                          <option value="Medium">Medium Frequency</option>
                          <option value="Critical Exam Trap">Critical Board Exam Trap</option>
                        </select>
                      </div>
                    </div>

                    {/* Contrastive Sentence Pair */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrect Exemplar (With Faulty Form)
                        </label>
                        <textarea
                          rows={2}
                          value={item.incorrectSentence}
                          onChange={(e) => handleUpdateItem(item.id, { incorrectSentence: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-serif bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                          placeholder="e.g. The list of items were submitted by the captain."
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct Exemplar (Standard Form)
                        </label>
                        <textarea
                          rows={2}
                          value={item.correctSentence}
                          onChange={(e) => handleUpdateItem(item.id, { correctSentence: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-serif font-semibold bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          placeholder="e.g. The list of items was submitted by the captain."
                        />
                      </div>
                    </div>

                    {/* Explanation and Prevention Tip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Why Students Make This Mistake
                        </label>
                        <textarea
                          rows={2}
                          value={item.explanation}
                          onChange={(e) => handleUpdateItem(item.id, { explanation: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                          placeholder="e.g. Learners look at the plural noun 'items' immediately preceding the verb and mistakenly use a plural verb."
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9A7438] mb-1">
                          How to Avoid It (Memory Hook / Test)
                        </label>
                        <textarea
                          rows={2}
                          value={item.preventionTip}
                          onChange={(e) => handleUpdateItem(item.id, { preventionTip: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7438]"
                          placeholder="e.g. Eliminate the prepositional phrase 'of items' to see: 'The list was submitted'."
                        />
                      </div>
                    </div>

                    {/* Teacher Diagnostic Observation */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A1832] mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Teacher Diagnostic Observation (Classroom Remediation)
                      </label>
                      <input
                        type="text"
                        value={item.teacherNote || ''}
                        onChange={(e) => handleUpdateItem(item.id, { teacherNote: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-[#FFFDF5] dark:bg-[#1a150c] border border-[#E8DED1] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        placeholder="Pedagogical observation: have students physically draw brackets around prepositional phrases on the board."
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
