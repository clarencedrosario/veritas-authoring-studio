import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Trash2,
  Eye,
  Key,
  AlertTriangle,
  AlertOctagon,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { GrammarTopic, GrammarTestSeries, GrammarClassLevel, BoardQuestionBlueprint, BlueprintAuditReport } from '../types';
import { exportToMoodleGIFT, generatePrintableExamText } from '../utils/grammarExport';
import { PRECONFIGURED_BOARD_BLUEPRINTS, auditTestPaperAgainstBlueprint } from '../utils/boardBlueprintEngine';

interface GrammarTestSeriesTabProps {
  topic: GrammarTopic;
  onUpdateTopic: (updated: GrammarTopic) => void;
  isDarkMode: boolean;
  onOpenAiGenerator: () => void;
  onNavigateToBlueprints?: () => void;
}

export const GrammarTestSeriesTab: React.FC<GrammarTestSeriesTabProps> = ({
  topic,
  onUpdateTopic,
  isDarkMode,
  onOpenAiGenerator,
  onNavigateToBlueprints,
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(
    topic.testSeries[0]?.id || ''
  );
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);

  const activeTest =
    topic.testSeries.find((t) => t.id === selectedTestId) || topic.testSeries[0];

  // Derive matching board blueprint and real-time audit report
  const matchedBlueprint: BoardQuestionBlueprint | undefined = React.useMemo(() => {
    if (!activeTest) return undefined;
    if (activeTest.blueprintId) {
      const byId = PRECONFIGURED_BOARD_BLUEPRINTS.find((b) => b.id === activeTest.blueprintId);
      if (byId) return byId;
    }
    // Match by board and class level
    const byBoardAndClass = PRECONFIGURED_BOARD_BLUEPRINTS.find(
      (b) => b.targetClass === activeTest.classLevel && (activeTest.boardTarget ? b.board === activeTest.boardTarget : true)
    );
    return byBoardAndClass || PRECONFIGURED_BOARD_BLUEPRINTS[0];
  }, [activeTest]);

  const auditReport: BlueprintAuditReport | null = React.useMemo(() => {
    if (!activeTest || !matchedBlueprint) return null;
    const allQuestions = activeTest.sections.flatMap((s) => s.questions);
    return auditTestPaperAgainstBlueprint(matchedBlueprint, allQuestions);
  }, [activeTest, matchedBlueprint]);

  const handleExportMoodle = () => {
    if (!activeTest) return;
    const allQ = activeTest.sections.flatMap((s) => s.questions);
    const giftContent = exportToMoodleGIFT(activeTest.title, allQ);

    const blob = new Blob([giftContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTest.title.replace(/\s+/g, '_')}_Moodle.gift`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadWorksheet = () => {
    if (!activeTest) return;
    const sheetText = generatePrintableExamText(activeTest, includeAnswerKey);
    const blob = new Blob([sheetText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTest.title.replace(/\s+/g, '_')}_Worksheet.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteTest = (testId: string) => {
    if (confirm('Delete this test series paper?')) {
      const updated = topic.testSeries.filter((t) => t.id !== testId);
      onUpdateTopic({ ...topic, testSeries: updated });
    }
  };

  return (
    <div id="grammar-test-series-tab" className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Left Sidebar: List of Tests */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 dark:border-slate-800 p-4 space-y-3 bg-stone-50/50 dark:bg-slate-900/40 shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400">
            Test Papers ({topic.testSeries.length})
          </span>
          <button
            onClick={onOpenAiGenerator}
            className="p-1 rounded-md text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/40"
            title="AI Draft Test Paper"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          {topic.testSeries.length === 0 ? (
            <div className="p-4 text-center text-xs text-stone-400">
              No test series created yet. Click "Generate Exam Paper" to generate one.
            </div>
          ) : (
            topic.testSeries.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTestId(t.id)}
                className={`w-full text-left p-3 rounded-xl transition-colors text-xs flex flex-col ${
                  activeTest?.id === t.id
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold'
                    : 'hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
                }`}
              >
                <div className="truncate font-medium">{t.title}</div>
                <div className="flex items-center space-x-2 text-[10px] text-stone-400 mt-1">
                  <span>{t.totalMarks} Marks</span>
                  <span>•</span>
                  <span>{t.durationMinutes} Mins</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="pt-3 space-y-2">
          <button
            onClick={onOpenAiGenerator}
            className="w-full p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Generate Exam Paper</span>
          </button>

          {onNavigateToBlueprints && (
            <button
              onClick={onNavigateToBlueprints}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Board Blueprints &amp; Audit</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-5">
        {activeTest ? (
          <>
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    {activeTest.classLevel}
                  </span>
                  {activeTest.boardTarget && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-800 dark:text-indigo-300">
                      {activeTest.boardTarget}
                    </span>
                  )}
                  <span className="text-xs text-stone-400 font-mono">
                    {activeTest.durationMinutes} Minutes • {activeTest.totalMarks} Marks
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-slate-100 mt-1">
                  {activeTest.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Answer key toggle */}
                <label className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAnswerKey}
                    onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                    className="accent-amber-600"
                  />
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Teacher's Key</span>
                </label>

                {/* Printable preview */}
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 flex items-center space-x-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>Exam Paper Preview</span>
                </button>

                {/* Download Text Worksheet */}
                <button
                  onClick={handleDownloadWorksheet}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>Download Worksheet</span>
                </button>

                {/* Export to Moodle GIFT */}
                <button
                  onClick={handleExportMoodle}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center space-x-1.5 shadow-xs transition-colors"
                  title="Export to Moodle GIFT format for importing into Moodle/Canvas LMS"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Export to Moodle LMS</span>
                </button>

                <button
                  onClick={() => handleDeleteTest(activeTest.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete Test Paper"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* REAL-TIME BOARD BLUEPRINT AUDIT WIDGET */}
            {auditReport && matchedBlueprint && (
              <div
                className={`p-4 rounded-2xl border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  auditReport.status === 'compliant'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                    : auditReport.status === 'minor_discrepancy'
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                    : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                      auditReport.status === 'compliant'
                        ? 'bg-emerald-600'
                        : auditReport.status === 'minor_discrepancy'
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`}
                  >
                    {auditReport.compliancePercentage}%
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-stone-900 dark:text-slate-100">
                        Board Blueprint Audit: {matchedBlueprint.title}
                      </span>
                      {auditReport.status === 'compliant' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>
                        Assigned: <strong>{auditReport.assignedTotalMarks}</strong> / Target:{' '}
                        <strong>{auditReport.targetTotalMarks}m</strong>
                      </span>
                      {auditReport.overTestedConcepts.length > 0 && (
                        <span className="text-amber-700 dark:text-amber-300 font-semibold">
                          • {auditReport.overTestedConcepts.length} Over-tested (
                          {auditReport.overTestedConcepts.join(', ')})
                        </span>
                      )}
                      {auditReport.underTestedConcepts.length > 0 && (
                        <span className="text-sky-700 dark:text-sky-300 font-semibold">
                          • {auditReport.underTestedConcepts.length} Under-tested (
                          {auditReport.underTestedConcepts.join(', ')})
                        </span>
                      )}
                      {auditReport.missingMandatoryConcepts.length > 0 && (
                        <span className="text-rose-700 dark:text-rose-300 font-bold">
                          • {auditReport.missingMandatoryConcepts.length} Mandatory Missing!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {onNavigateToBlueprints && (
                  <button
                    onClick={onNavigateToBlueprints}
                    className="h-8 px-3 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-amber-500/50 text-stone-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 shrink-0 transition-colors shadow-2xs"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                    <span>View Weightage Matrix</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </button>
                )}
              </div>
            )}

            {/* Test Paper Sections */}
            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Instructions Box */}
              {activeTest.instructions && activeTest.instructions.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-200">
                    General Exam Instructions:
                  </span>
                  <ul className="list-disc pl-4 text-amber-800 dark:text-amber-300 space-y-0.5">
                    {activeTest.instructions.map((ins, iIdx) => (
                      <li key={iIdx}>{ins}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sections */}
              {activeTest.sections.map((section, sIdx) => (
                <div
                  key={section.id || sIdx}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs space-y-4"
                >
                  <div className="border-b border-stone-100 dark:border-slate-700/80 pb-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                      {section.title}
                    </h4>
                    {section.description && (
                      <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="p-3.5 rounded-xl bg-stone-50/70 dark:bg-slate-900/50 border border-stone-200/70 dark:border-slate-700/70 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-stone-800 dark:text-slate-200">
                              Q{qIdx + 1}. {q.prompt}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                            </span>
                          </div>
                        </div>

                        {q.instruction && (
                          <div className="italic text-[11px] text-stone-500 dark:text-slate-400">
                            ↳ Instruction: {q.instruction}
                          </div>
                        )}

                        {q.type === 'mcq' && q.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pl-2">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="p-1.5 rounded bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-[11px]"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === 'fill_in_blanks' && q.blanksSentence && (
                          <div className="p-2 rounded bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 font-serif">
                            {q.blanksSentence} {q.hints ? `(${q.hints})` : ''}
                          </div>
                        )}

                        {q.type === 'match_column' && q.columnA && q.columnB && (
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-white dark:bg-slate-800 border">
                              <strong>Column A</strong>
                              {q.columnA.map((ca) => (
                                <div key={ca.id}>{ca.text}</div>
                              ))}
                            </div>
                            <div className="p-2 rounded bg-white dark:bg-slate-800 border">
                              <strong>Column B</strong>
                              {q.columnB.map((cb) => (
                                <div key={cb.id}>{cb.text}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {includeAnswerKey && (
                          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-[11px] space-y-0.5">
                            <div>
                              <strong>Answer:</strong> {q.correctAnswer}
                            </div>
                            {q.explanation && (
                              <div className="text-stone-600 dark:text-slate-400">
                                <em>Why:</em> {q.explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <FileText className="w-12 h-12 text-stone-400 mb-3" />
            <h4 className="text-sm font-bold text-stone-700 dark:text-slate-300">
              No Test Series Selected
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Select or generate a test paper from the sidebar to view sections and print worksheets.
            </p>
          </div>
        )}
      </div>

      {/* Printable Exam Paper Modal */}
      {showPrintModal && activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white text-stone-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-sm font-bold text-stone-800 flex items-center space-x-2">
                <Printer className="w-4 h-4 text-amber-600" />
                <span>Printable Examination Paper Preview</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Paper</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-stone-300 hover:bg-stone-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Paper Body */}
            <div className="flex-1 overflow-y-auto p-8 font-serif space-y-6 text-sm">
              {/* Exam Header */}
              <div className="text-center border-b-2 border-stone-800 pb-4 space-y-1 font-sans">
                <h2 className="text-xl font-black uppercase tracking-wider">
                  {topic.category.toUpperCase()} EXAMINATION
                </h2>
                <h3 className="text-base font-bold">{activeTest.title}</h3>
                <div className="text-xs font-semibold flex items-center justify-center space-x-4 pt-1">
                  <span>CLASS: {activeTest.classLevel}</span>
                  <span>•</span>
                  <span>TIME ALLOWED: {activeTest.durationMinutes} MINUTES</span>
                  <span>•</span>
                  <span>MAXIMUM MARKS: {activeTest.totalMarks}</span>
                </div>
              </div>

              {/* Student Details Line */}
              <div className="grid grid-cols-3 gap-4 text-xs font-sans border-b border-stone-300 pb-3">
                <div>Candidate Name: _________________________</div>
                <div>Roll Number: ____________</div>
                <div>Date: ____________</div>
              </div>

              {/* General Instructions */}
              {activeTest.instructions && activeTest.instructions.length > 0 && (
                <div className="text-xs font-sans space-y-1">
                  <div className="font-bold uppercase tracking-wider">Instructions:</div>
                  <ol className="list-decimal pl-4 space-y-0.5 text-stone-700">
                    {activeTest.instructions.map((ins, iIdx) => (
                      <li key={iIdx}>{ins}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Sections & Questions */}
              {activeTest.sections.map((sec, sIndex) => (
                <div key={sIndex} className="space-y-4 pt-2">
                  <div className="text-center border-y border-stone-300 py-1 font-sans font-bold text-xs uppercase tracking-wider">
                    {sec.title}
                  </div>

                  <div className="space-y-4 text-xs">
                    {sec.questions.map((q, qIndex) => (
                      <div key={q.id || qIndex} className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>
                            Q{qIndex + 1}. {q.prompt}
                          </span>
                          <span className="font-mono font-normal">
                            [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                          </span>
                        </div>

                        {q.type === 'mcq' && q.options && (
                          <div className="grid grid-cols-2 gap-2 pl-4 pt-1">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx}>{opt}</div>
                            ))}
                          </div>
                        )}

                        {q.type === 'fill_in_blanks' && (
                          <div className="pl-4 pt-1 italic">
                            {q.blanksSentence} {q.hints ? `(${q.hints})` : ''}
                          </div>
                        )}

                        {q.type === 'match_column' && q.columnA && q.columnB && (
                          <div className="grid grid-cols-2 gap-4 pl-4 pt-1 font-mono text-[11px]">
                            <div>
                              <div className="font-bold">Column A</div>
                              {q.columnA.map((ca) => (
                                <div key={ca.id}>{ca.text}</div>
                              ))}
                            </div>
                            <div>
                              <div className="font-bold">Column B</div>
                              {q.columnB.map((cb) => (
                                <div key={cb.id}>{cb.text}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {q.originalSentence && (
                          <div className="pl-4 pt-1 italic">
                            "{q.originalSentence}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {includeAnswerKey && (
                <div className="border-t-2 border-dashed border-stone-800 pt-6 mt-8 space-y-4 text-xs font-sans">
                  <h3 className="font-bold text-center uppercase tracking-widest text-sm text-stone-700">
                    Teacher's Assessment Key &amp; Explanations
                  </h3>
                  {activeTest.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <div className="font-bold text-stone-800">{sec.title}:</div>
                      {sec.questions.map((q, qIdx) => (
                        <div key={q.id || qIdx} className="pl-3">
                          <div>
                            <strong>Q{qIdx + 1}:</strong> {q.correctAnswer}
                          </div>
                          {q.explanation && (
                            <div className="text-stone-500 text-[11px]">
                              Rule: {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
