import React, { useState, useRef } from 'react';
import {
  Sparkles,
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Layers,
  FileCheck,
} from 'lucide-react';
import { GrammarTopic, GrammarClassLevel, GrammarQuestion, GrammarDefinition } from '../types';

interface GrammarAICopilotModalProps {
  topic: GrammarTopic;
  classLevel: GrammarClassLevel;
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedContent: (payload: {
    mode: 'definitions' | 'exercises' | 'test_series';
    definitions?: GrammarDefinition[];
    notesAndTheoryMarkdown?: string;
    questions?: GrammarQuestion[];
    testSeries?: any;
  }) => void;
  isDarkMode: boolean;
}

export const GrammarAICopilotModal: React.FC<GrammarAICopilotModalProps> = ({
  topic,
  classLevel,
  isOpen,
  onClose,
  onApplyGeneratedContent,
  isDarkMode,
}) => {
  const [mode, setMode] = useState<'exercises' | 'definitions' | 'test_series'>('exercises');
  const [instructions, setInstructions] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'mcq',
    'fill_in_blanks',
    'match_column',
    'error_correction',
    'transformation',
  ]);

  // File upload state (PDF or text)
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: number;
    mimeType: string;
    base64Data?: string;
    extractedText?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Please upload a file smaller than 15MB.');
      return;
    }

    const reader = new FileReader();

    if (file.type === 'application/pdf') {
      reader.onload = () => {
        const resultStr = reader.result as string;
        // Strip data:application/pdf;base64, prefix
        const base64Data = resultStr.split(',')[1] || resultStr;
        setAttachedFile({
          name: file.name,
          size: file.size,
          mimeType: file.type,
          base64Data,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Text or markdown or json
      reader.onload = () => {
        const text = reader.result as string;
        setAttachedFile({
          name: file.name,
          size: file.size,
          mimeType: file.type || 'text/plain',
          extractedText: text,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleToggleType = (t: string) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((item) => item !== t));
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/gemini/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          classLevel,
          topic: topic.title,
          instructions,
          questionTypes: selectedTypes,
          count: questionCount,
          difficulty,
          pdfBase64: attachedFile?.base64Data,
          pdfMimeType: attachedFile?.mimeType,
          extractedText: attachedFile?.extractedText,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to generate grammar content.');
      }

      const data = await res.json();
      setGeneratedResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during AI generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedResult) return;

    if (mode === 'definitions') {
      onApplyGeneratedContent({
        mode: 'definitions',
        definitions: generatedResult.definitions,
        notesAndTheoryMarkdown: generatedResult.notesAndTheoryMarkdown,
      });
    } else if (mode === 'test_series') {
      onApplyGeneratedContent({
        mode: 'test_series',
        testSeries: {
          id: `ts-${Date.now()}`,
          title: generatedResult.title || `Unit Assessment: ${topic.title}`,
          classLevel,
          totalMarks: generatedResult.totalMarks || 25,
          durationMinutes: generatedResult.durationMinutes || 45,
          instructions: generatedResult.instructions || ['All questions are compulsory.'],
          sections: generatedResult.sections || [],
        },
      });
    } else {
      // exercises
      onApplyGeneratedContent({
        mode: 'exercises',
        questions: generatedResult.questions || [],
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-slate-800 bg-amber-500/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                AI Grammar Author &amp; LMS Test Generator
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-slate-400">
                Target: <strong>{classLevel}</strong> • Topic: <strong>{topic.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              1. What would you like the AI to generate?
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMode('exercises')}
                className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                  mode === 'exercises'
                    ? 'border-amber-500 bg-amber-500/15 font-semibold text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Exercise Bank</span>
                </div>
                <span className="text-[10px] text-stone-500 dark:text-slate-400">
                  MCQ, Blanks, Matching, &amp; Error Spotting
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('definitions')}
                className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                  mode === 'definitions'
                    ? 'border-amber-500 bg-amber-500/15 font-semibold text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Textbook Lesson</span>
                </div>
                <span className="text-[10px] text-stone-500 dark:text-slate-400">
                  Definitions, formulas, rules &amp; common pitfalls
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('test_series')}
                className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                  mode === 'test_series'
                    ? 'border-amber-500 bg-amber-500/15 font-semibold text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Exam Paper Series</span>
                </div>
                <span className="text-[10px] text-stone-500 dark:text-slate-400">
                  Multi-section exam paper with marks &amp; time
                </span>
              </button>
            </div>
          </div>

          {/* Optional PDF / Document Attachment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                2. Attach Syllabus / PDF / Notes (Optional)
              </label>
              <span className="text-[10px] text-stone-400">Supports PDF, TXT, MD (up to 15MB)</span>
            </div>

            {attachedFile ? (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-emerald-950 dark:text-emerald-100">
                      {attachedFile.name}
                    </div>
                    <div className="text-[10px] text-emerald-800 dark:text-emerald-300">
                      {(attachedFile.size / 1024).toFixed(1)} KB • Attached for AI extraction
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1 rounded text-stone-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-dashed border-stone-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500/60 bg-stone-50 dark:bg-slate-800/40 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                <div className="text-xs font-semibold text-stone-700 dark:text-slate-300">
                  Drop syllabus PDF here or click to upload
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  AI will analyze your document to generate relevant definitions and exercises.
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Specific Custom Prompt / Instructions */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              3. Custom Author Instructions
            </label>
            <textarea
              rows={3}
              placeholder={`e.g. "Focus on irregular past participles and subject-verb concord edge cases. Make distractors challenging for ${classLevel} students, and ensure explanations cite specific grammar rules."`}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs text-stone-900 dark:text-slate-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Exercise Specific Controls: Types, Count, Difficulty */}
          {mode !== 'definitions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                  Target Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800"
                >
                  <option value="Easy">Easy (Foundational)</option>
                  <option value="Medium">Medium (Standard Syllabus)</option>
                  <option value="Hard">Hard (Olympiad / Board Prep)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                  Number of Items
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={8}>8 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400">
                  Include Question Formats:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'mcq', label: 'MCQ' },
                    { id: 'fill_in_blanks', label: 'Fill in Blanks' },
                    { id: 'match_column', label: 'Match Column' },
                    { id: 'error_correction', label: 'Error Spotting' },
                    { id: 'transformation', label: 'Transformation' },
                  ].map((btn) => {
                    const isChecked = selectedTypes.includes(btn.id);
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleToggleType(btn.id)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                          isChecked
                            ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold'
                            : 'border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-400'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    Successfully Generated{' '}
                    {mode === 'definitions'
                      ? 'Textbook Lesson & Rules'
                      : mode === 'test_series'
                      ? 'Examination Paper'
                      : `${generatedResult.questions?.length || 0} Questions`}
                  </span>
                </span>
                <span className="text-[10px] text-stone-400">Ready to insert</span>
              </div>

              <div className="max-h-48 overflow-y-auto p-3 rounded-lg bg-white dark:bg-slate-900 text-xs font-mono space-y-1 border border-stone-200 dark:border-slate-800">
                {mode === 'definitions' && generatedResult.definitions && (
                  <div>
                    <div className="font-bold text-amber-600">
                      {generatedResult.definitions[0]?.term}
                    </div>
                    <div className="text-stone-600 dark:text-slate-400 mt-1">
                      {generatedResult.definitions[0]?.ageAppropriateExplanation}
                    </div>
                  </div>
                )}

                {mode !== 'definitions' &&
                  (generatedResult.questions || []).slice(0, 3).map((q: any, i: number) => (
                    <div key={i} className="text-stone-700 dark:text-slate-300">
                      <strong>Q{i + 1} ({q.type}):</strong> {q.prompt}
                    </div>
                  ))}

                {mode === 'test_series' && generatedResult.sections && (
                  <div className="text-stone-700 dark:text-slate-300">
                    <div>
                      <strong>Title:</strong> {generatedResult.title}
                    </div>
                    <div>
                      <strong>Sections:</strong> {generatedResult.sections.length} sections,{' '}
                      {generatedResult.totalMarks} Total Marks
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            {generatedResult ? (
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Insert into Book / LMS</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1.5 shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Grammar Content</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
