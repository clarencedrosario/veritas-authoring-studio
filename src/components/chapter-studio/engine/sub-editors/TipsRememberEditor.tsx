import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Lightbulb,
  Award,
  Sparkles,
  AlertCircle,
  Key,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from 'lucide-react';
import { TipRememberItem, Component11Data } from '../../../../types';
import { ViewDisplayMode } from '../types';

interface TipsRememberEditorProps {
  data: Component11Data;
  onChange: (updated: Component11Data) => void;
  viewMode: ViewDisplayMode;
  isDarkMode?: boolean;
}

export const TipsRememberEditor: React.FC<TipsRememberEditorProps> = ({
  data,
  onChange,
  viewMode,
  isDarkMode = false,
}) => {
  const items = data.items || [];
  const [expandedId, setExpandedId] = useState<string>(items[0]?.id || '');

  const handleAddItem = () => {
    const newId = `tip-${Date.now()}`;
    const newItem: TipRememberItem = {
      id: newId,
      title: `Golden Rule: Memory Anchor ${items.length + 1}`,
      tipType: 'golden_rule',
      calloutText: '',
      memoryHook: '',
      quickFormula: '',
      icon: 'lightbulb',
      importance: 'high',
      teacherNote: 'Instruct learners to box this in their notebooks and recite before beginning transformation drills.',
    };

    onChange({
      ...data,
      items: [...items, newItem],
      lastModified: new Date().toISOString(),
    });
    setExpandedId(newId);
  };

  const handleUpdateItem = (id: string, updates: Partial<TipRememberItem>) => {
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

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="w-5 h-5 text-[#9A7438]" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-[#9A7438]" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'key':
        return <Key className="w-5 h-5 text-[#5A1832]" />;
      default:
        return <Lightbulb className="w-5 h-5 text-[#9A7438]" />;
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
            <Lightbulb className="w-5 h-5 text-[#9A7438]" />
            <h3 className="font-serif text-lg font-bold text-[#292521] dark:text-[#F6F0E7]">
              Remember & Quick Tip Callouts
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium uppercase tracking-wider ${
              isTeacher
                ? 'bg-[#5A1832] text-[#F6F0E7]'
                : 'bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#9A7438]'
            }`}
          >
            {isTeacher ? 'Teacher Annotated Guide' : 'Student Textbook Edition'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-[#F6F0E7] dark:bg-[#1f150f] rounded-xl border border-dashed border-[#D8C7B5] dark:border-[#3D2C1E]">
            <p className="text-[#71685E] text-sm">No remember or quick tip callouts authored yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF5EE] dark:from-[#1e150f] dark:to-[#160f0a] border-2 border-[#D8C7B5] dark:border-[#3D2C1E] rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E8DED1] dark:border-[#3D2C1E] pb-2">
                  <div className="flex items-center gap-2.5">
                    {renderIcon(item.icon)}
                    <span className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#5A1832] dark:text-[#E8A87C]">
                    {item.tipType.replace('_', ' ')}
                  </span>
                </div>

                <p className="font-serif text-sm text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                  {item.calloutText || <span className="italic text-gray-400">Callout text pending</span>}
                </p>

                {item.quickFormula && (
                  <div className="p-2.5 bg-white dark:bg-[#120a06] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md font-mono text-xs text-[#5A1832] dark:text-[#E8A87C] font-semibold">
                    {item.quickFormula}
                  </div>
                )}

                {item.memoryHook && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#9A7438]">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>Memory Hook: &ldquo;{item.memoryHook}&rdquo;</span>
                  </div>
                )}

                {isTeacher && item.teacherNote && (
                  <div className="bg-[#FFFDF5] dark:bg-[#1f160c] border-l-3 border-[#9A7438] p-3 rounded-r-lg space-y-1">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#9A7438]" />
                      <span className="text-[10px] font-bold text-[#9A7438] uppercase tracking-wider">
                        Teacher Pacing & Emphasis Direction
                      </span>
                    </div>
                    <p className="text-xs text-[#292521] dark:text-[#F6F0E7]">
                      {item.teacherNote}
                    </p>
                  </div>
                )}
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
            Remember & Quick Tip Callouts
          </h4>
          <p className="text-xs text-[#71685E] dark:text-[#b4a496]">
            Author bite-sized memory hooks, golden rules, and exam shortcuts that stick with learners.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1832] text-white hover:bg-[#481226] text-xs font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Tip Box
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-[#F6F0E7]/60 dark:bg-[#1f150f] rounded-xl border border-dashed border-[#D8C7B5] dark:border-[#3D2C1E] space-y-3">
          <Lightbulb className="w-8 h-8 mx-auto text-[#9A7438]" />
          <p className="text-sm font-medium text-[#292521] dark:text-[#F6F0E7]">
            No Remember / Tip Boxes Authored
          </p>
          <p className="text-xs text-[#71685E] max-w-md mx-auto">
            Quick tips and mnemonics anchor essential rules in student memories. Click below to add your first callout box.
          </p>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A1832] text-white text-xs font-semibold rounded-lg hover:bg-[#481226] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Tip
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
                {/* Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                  className="px-4 py-3 cursor-pointer flex items-center justify-between select-none hover:bg-[#F6F0E7]/50 dark:hover:bg-[#24170e]/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1 rounded bg-[#EDE4D6] dark:bg-[#2A1D13]">
                      {renderIcon(item.icon)}
                    </span>
                    <div>
                      <span className="font-semibold text-xs text-[#292521] dark:text-[#F6F0E7]">
                        {item.title || `Tip Box ${idx + 1}`}
                      </span>
                      {item.calloutText && (
                        <p className="text-[11px] text-[#71685E] line-clamp-1">
                          {item.calloutText}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#5A1832] dark:text-[#E8A87C] font-mono px-2 py-0.5 rounded">
                      {item.tipType}
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

                {/* Body */}
                {isExpanded && (
                  <div className="p-4 border-t border-[#E8DED1] dark:border-[#3D2C1E] space-y-4 bg-white dark:bg-[#160e08]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Callout Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                          placeholder="e.g. Golden Rule: Head Noun Concord"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Callout Type
                        </label>
                        <select
                          value={item.tipType}
                          onChange={(e) => handleUpdateItem(item.id, { tipType: e.target.value as any })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        >
                          <option value="golden_rule">Golden Rule</option>
                          <option value="mnemonic">Mnemonic Device</option>
                          <option value="exam_tip">Board Exam Tip</option>
                          <option value="shortcut">Proofreading Shortcut</option>
                          <option value="remember">Remember Key Point</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Icon Style
                        </label>
                        <select
                          value={item.icon || 'lightbulb'}
                          onChange={(e) => handleUpdateItem(item.id, { icon: e.target.value as any })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        >
                          <option value="lightbulb">Lightbulb (Insight)</option>
                          <option value="award">Award (Golden Rule)</option>
                          <option value="sparkles">Sparkles (Mnemonic)</option>
                          <option value="alert">Alert (Warning Trap)</option>
                          <option value="key">Key (Mastery)</option>
                        </select>
                      </div>
                    </div>

                    {/* Callout Text */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                        Callout Advice Body
                      </label>
                      <textarea
                        rows={3}
                        value={item.calloutText}
                        onChange={(e) => handleUpdateItem(item.id, { calloutText: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-serif bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        placeholder="e.g. Always identify the true subject head noun before choosing your verb. Do not let words that come between them trick you!"
                      />
                    </div>

                    {/* Quick Formula and Memory Hook */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A1832] mb-1">
                          Quick Formula (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.quickFormula || ''}
                          onChange={(e) => handleUpdateItem(item.id, { quickFormula: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                          placeholder="e.g. [Subject Head] + [Intervening Phrase] + [Finite Verb]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9A7438] mb-1">
                          Catchy Memory Hook (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.memoryHook || ''}
                          onChange={(e) => handleUpdateItem(item.id, { memoryHook: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7438]"
                          placeholder="e.g. Drop the middle, solve the riddle!"
                        />
                      </div>
                    </div>

                    {/* Teacher Pacing Guidance */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#5A1832]" />
                        Teacher Pacing & Emphasis Guidance
                      </label>
                      <input
                        type="text"
                        value={item.teacherNote || ''}
                        onChange={(e) => handleUpdateItem(item.id, { teacherNote: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-[#FFFDF5] dark:bg-[#1a150c] border border-[#E8DED1] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        placeholder="Pedagogical note: prompt students to write this mnemonic on the top margin of their test papers."
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
