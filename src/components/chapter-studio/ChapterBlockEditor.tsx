import React, { useState } from 'react';
import {
  X,
  Check,
  Plus,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  Eye,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Award,
} from 'lucide-react';
import {
  TextbookContentBlock,
  ContentBlockType,
  BlockVisibility,
  WorkedExampleStep,
  ExampleItem,
  AssociatedRuleData,
} from '../../types';

interface ChapterBlockEditorProps {
  isOpen: boolean;
  onClose: () => void;
  block: TextbookContentBlock | null;
  onSaveBlock: (updated: TextbookContentBlock) => void;
  isDarkMode: boolean;
}

export const ChapterBlockEditor: React.FC<ChapterBlockEditorProps> = ({
  isOpen,
  onClose,
  block,
  onSaveBlock,
  isDarkMode,
}) => {
  const [type, setType] = useState<ContentBlockType>(block?.type || 'text');
  const [title, setTitle] = useState(block?.title || '');
  const [visibility, setVisibility] = useState<BlockVisibility>(block?.visibility || 'student');
  const [textContent, setTextContent] = useState(block?.textContent || '');
  const [calloutTitle, setCalloutTitle] = useState(block?.calloutTitle || '');
  const [calloutText, setCalloutText] = useState(block?.calloutText || '');
  const [authorNotes, setAuthorNotes] = useState(block?.authorNotes || '');
  const [teacherGuidance, setTeacherGuidance] = useState(block?.teacherGuidance || '');

  // Grammar rule state (with associated rule data)
  const [grRuleText, setGrRuleText] = useState(
    block?.associatedRuleData?.ruleText || block?.calloutText || block?.textContent || ''
  );
  const [grExplanation, setGrExplanation] = useState(
    block?.associatedRuleData?.explanation || ''
  );
  const [grFormula, setGrFormula] = useState(
    block?.associatedRuleData?.formulaOrPattern || ''
  );
  const [grCorrectExamples, setGrCorrectExamples] = useState(
    block?.associatedRuleData?.correctExamples?.join('\n') || ''
  );
  const [grIncorrectExamples, setGrIncorrectExamples] = useState(
    block?.associatedRuleData?.incorrectExamples?.join('\n') || ''
  );
  const [grWhyIncorrectFails, setGrWhyIncorrectFails] = useState(
    block?.associatedRuleData?.whyIncorrectFails || ''
  );
  const [grCommonLearnerError, setGrCommonLearnerError] = useState(
    block?.associatedRuleData?.commonLearnerError || ''
  );
  const [grTeacherNote, setGrTeacherNote] = useState(
    block?.associatedRuleData?.teacherNote || ''
  );

  // Visual / diagram brief state
  const [visTitle, setVisTitle] = useState(block?.visualData?.title || block?.title || '');
  const [visType, setVisType] = useState(block?.visualData?.visualType || 'diagram');
  const [visBrief, setVisBrief] = useState(block?.visualData?.svgIllustrationBrief || '');
  const [visCaption, setVisCaption] = useState(block?.visualData?.caption || '');

  // Worked example state
  const [weProblem, setWeProblem] = useState(block?.workedExample?.problem || '');
  const [weFinalAnswer, setWeFinalAnswer] = useState(block?.workedExample?.finalAnswer || '');
  const [weWhyRationale, setWeWhyRationale] = useState(block?.workedExample?.whyRationale || '');
  const [weRuleApplied, setWeRuleApplied] = useState(block?.workedExample?.ruleApplied || '');
  const [weCommonMistake, setWeCommonMistake] = useState(block?.workedExample?.commonMistake || '');
  const [weTeacherNote, setWeTeacherNote] = useState(block?.workedExample?.teacherNote || '');
  const [weDifficulty, setWeDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(
    block?.workedExample?.difficulty || 'Medium'
  );
  const [weSteps, setWeSteps] = useState<WorkedExampleStep[]>(
    block?.workedExample?.steps || [
      { stepNumber: 1, title: 'Step 1: Identify key elements', instruction: 'Analyze the sentence.', sampleWork: '' },
    ]
  );

  // Common error state
  const [ceIncorrect, setCeIncorrect] = useState(block?.commonError?.incorrectSentence || '');
  const [ceCorrect, setCeCorrect] = useState(block?.commonError?.correctSentence || '');
  const [ceExplanation, setCeExplanation] = useState(block?.commonError?.explanation || '');
  const [ceMistakeType, setCeMistakeType] = useState(block?.commonError?.mistakeType || 'Concord Trap');

  // Example pair state
  const [pairIncorrect, setPairIncorrect] = useState(block?.examplePair?.incorrect || '');
  const [pairCorrect, setPairCorrect] = useState(block?.examplePair?.correct || '');
  const [pairWhy, setPairWhy] = useState(block?.examplePair?.why || '');
  const [pairRule, setPairRule] = useState(block?.examplePair?.rule || '');

  const handleAddStep = () => {
    setWeSteps((prev) => [
      ...prev,
      {
        stepNumber: prev.length + 1,
        title: `Step ${prev.length + 1}: Action`,
        instruction: 'Perform next analysis step.',
        sampleWork: '',
      },
    ]);
  };

  const handleUpdateStep = (idx: number, field: keyof WorkedExampleStep, val: any) => {
    setWeSteps((prev) =>
      prev.map((step, i) => (i === idx ? { ...step, [field]: val } : step))
    );
  };

  const handleRemoveStep = (idx: number) => {
    setWeSteps((prev) =>
      prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 }))
    );
  };

  const handleSave = () => {
    const updated: TextbookContentBlock = {
      ...block,
      type,
      title: title.trim() || undefined,
      visibility,
      textContent: textContent.trim() || undefined,
      calloutTitle: calloutTitle.trim() || undefined,
      calloutText: calloutText.trim() || undefined,
      authorNotes: authorNotes.trim() || undefined,
      teacherGuidance: teacherGuidance.trim() || undefined,
    };

    if (type === 'grammar_rule') {
      updated.calloutTitle = calloutTitle.trim() || 'GRAMMAR RULE';
      updated.calloutText = grRuleText.trim() || calloutText.trim();
      updated.associatedRuleData = {
        ruleText: grRuleText.trim(),
        explanation: grExplanation.trim() || undefined,
        formulaOrPattern: grFormula.trim() || undefined,
        correctExamples: grCorrectExamples
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        incorrectExamples: grIncorrectExamples
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        whyIncorrectFails: grWhyIncorrectFails.trim() || undefined,
        commonLearnerError: grCommonLearnerError.trim() || undefined,
        teacherNote: grTeacherNote.trim() || undefined,
      };
    }

    if (type === 'visual' || type === 'diagram' || type === 'illustration') {
      updated.visualData = {
        title: visTitle.trim() || title.trim() || 'Visual Specimen',
        visualType: (visType as any) || 'illustration',
        svgIllustrationBrief: visBrief.trim(),
        caption: visCaption.trim(),
        altText: visTitle.trim() || 'Visual illustration specimen',
        source: 'Original Artwork',
        credit: 'Veritas Academic Press',
        licenseStatus: 'Original Creation',
        placement: 'center',
        size: 'medium',
      };
    }

    if (type === 'worked_example') {
      updated.workedExample = {
        problem: weProblem,
        steps: weSteps,
        finalAnswer: weFinalAnswer,
        whyRationale: weWhyRationale,
        ruleApplied: weRuleApplied,
        commonMistake: weCommonMistake,
        teacherNote: weTeacherNote,
        difficulty: weDifficulty,
      };
    }

    if (type === 'common_error') {
      updated.commonError = {
        incorrectSentence: ceIncorrect,
        correctSentence: ceCorrect,
        explanation: ceExplanation,
        mistakeType: ceMistakeType,
      };
    }

    if (type === 'example_pair') {
      updated.examplePair = {
        incorrect: pairIncorrect,
        correct: pairCorrect,
        why: pairWhy,
        rule: pairRule,
      };
    }

    onSaveBlock(updated);
    onClose();
  };

  if (!isOpen || !block) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#CBBEAC] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-[#C29A52]" />
            <h3 className="font-bold text-sm text-[#35101F]">Edit Textbook Content Block</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Block Type and Visibility */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                Block Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentBlockType)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-medium focus:outline-none"
              >
                <option value="text">Text / Prose Explanation</option>
                <option value="grammar_rule">Grammar Rule Callout</option>
                <option value="definition">Definition Box</option>
                <option value="example">Example</option>
                <option value="example_pair">Example Pair (Correct vs Incorrect)</option>
                <option value="worked_example">Step-by-Step Worked Example</option>
                <option value="common_error">Common Error / Trap Box</option>
                <option value="remember">Remember Callout</option>
                <option value="grammar_tip">Grammar Tip</option>
                <option value="watch_out">Watch Out Warning</option>
                <option value="exam_tip">Exam Tip</option>
                <option value="did_you_know">Did You Know?</option>
                <option value="try_this">Try This Activity</option>
                <option value="challenge">Challenge Box</option>
                <option value="teacher_note">Teacher Guidance (Instructor Only)</option>
                <option value="author_note">Private Author Note</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                Visibility Audience
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as BlockVisibility)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-medium focus:outline-none"
              >
                <option value="student">Student &amp; Teacher (Standard Textbook)</option>
                <option value="teacher_only">Teacher Edition Only</option>
                <option value="author_only">Author Only (Internal Notes)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
              Block Title / Subheading (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Parenthetical Bracket Rule"
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
            />
          </div>

          {/* Conditional inputs based on type */}
          {type === 'text' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                Textbook Prose (Markdown supported)
              </label>
              <textarea
                rows={8}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Write continuous textbook explanation prose..."
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-mono text-xs focus:outline-none"
              />
            </div>
          )}

          {/* Dedicated Grammar Rule Editor */}
          {type === 'grammar_rule' && (
            <div className="space-y-3 p-4 rounded-xl border border-[#C29A52]/60 bg-[#EDE4D6]/40">
              <div className="flex items-center space-x-2 text-[#35101F] font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#C29A52]" />
                <span>Textbook Grammar Rule Specification</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Rule Banner Header
                </label>
                <input
                  type="text"
                  value={calloutTitle}
                  onChange={(e) => setCalloutTitle(e.target.value)}
                  placeholder="e.g. RULE 6.8: INDEFINITE PRONOUNS (CONCORD)"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  1. Canonical Rule Statement *
                </label>
                <textarea
                  rows={2}
                  value={grRuleText}
                  onChange={(e) => setGrRuleText(e.target.value)}
                  placeholder="e.g. Indefinite pronouns like 'each', 'either', and 'neither' always take a singular verb."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] font-medium text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  2. Clear Pedagogical Explanation
                </label>
                <textarea
                  rows={2}
                  value={grExplanation}
                  onChange={(e) => setGrExplanation(e.target.value)}
                  placeholder="Explain why this rule operates this way, clarifying the syntactic logic for young learners..."
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  3. Syntactic Formula or Pattern
                </label>
                <input
                  type="text"
                  value={grFormula}
                  onChange={(e) => setGrFormula(e.target.value)}
                  placeholder="e.g. [Each / Either / Neither] + [of + Plural Noun] + [Singular Verb (-s / -es)]"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                    4. Correct Exemplary Sentences (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={grCorrectExamples}
                    onChange={(e) => setGrCorrectExamples(e.target.value)}
                    placeholder={"Each of the boys has a bicycle.\nNeither of the answers is correct."}
                    className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 bg-[#FFFDF8] text-[#292521] text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-rose-800 mb-1">
                    5. Incorrect Sentences (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={grIncorrectExamples}
                    onChange={(e) => setGrIncorrectExamples(e.target.value)}
                    placeholder={"Each of the boys have a bicycle.\nNeither of the answers are correct."}
                    className="w-full px-3 py-1.5 rounded-xl border border-rose-300 bg-[#FFFDF8] text-[#292521] text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  6. Why the Incorrect Example Fails
                </label>
                <textarea
                  rows={2}
                  value={grWhyIncorrectFails}
                  onChange={(e) => setGrWhyIncorrectFails(e.target.value)}
                  placeholder="e.g. The verb mistakenly agrees with the prepositional object 'boys' rather than the singular head subject 'each'."
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                    7. Common Learner Error
                  </label>
                  <input
                    type="text"
                    value={grCommonLearnerError}
                    onChange={(e) => setGrCommonLearnerError(e.target.value)}
                    placeholder="e.g. Proximity trap: plural noun immediately precedes the verb."
                    className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-purple-800 mb-1">
                    8. Teacher Pedagogy Note
                  </label>
                  <input
                    type="text"
                    value={grTeacherNote}
                    onChange={(e) => setGrTeacherNote(e.target.value)}
                    placeholder="e.g. Advise students to cross out the 'of...' prepositional phrase."
                    className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Academic Callout Boxes (non-rule) */}
          {(type === 'remember' ||
            type === 'grammar_tip' ||
            type === 'watch_out' ||
            type === 'exam_tip' ||
            type === 'did_you_know' ||
            type === 'try_this' ||
            type === 'challenge') && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Callout Banner Title
                </label>
                <input
                  type="text"
                  value={calloutTitle}
                  onChange={(e) => setCalloutTitle(e.target.value)}
                  placeholder="e.g. REMEMBER: THE INVERTED S PRINCIPLE"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Callout Content
                </label>
                <textarea
                  rows={4}
                  value={calloutText}
                  onChange={(e) => setCalloutText(e.target.value)}
                  placeholder="Precise rule or pedagogical tip text..."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Visual / Diagram Specimen Editor */}
          {(type === 'visual' || type === 'diagram' || type === 'illustration') && (
            <div className="space-y-3 p-4 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6]/40">
              <div className="flex items-center space-x-2 text-[#35101F] font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#C29A52]" />
                <span>Textbook Visual / Diagram Asset Specification</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                    Visual Title
                  </label>
                  <input
                    type="text"
                    value={visTitle}
                    onChange={(e) => setVisTitle(e.target.value)}
                    placeholder="e.g. Agreement Scale Diagram"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                    Visual Format / Type
                  </label>
                  <select
                    value={visType}
                    onChange={(e) => setVisType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                  >
                    <option value="diagram">Diagram</option>
                    <option value="flowchart">Flowchart / Decision Tree</option>
                    <option value="table">Syntactic Comparison Table</option>
                    <option value="concept_map">Concept Map</option>
                    <option value="illustration">Pedagogical Illustration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Designer / Illustration Graphic Brief (Detailed Description)
                </label>
                <textarea
                  rows={4}
                  value={visBrief}
                  onChange={(e) => setVisBrief(e.target.value)}
                  placeholder="e.g. An 'Agreement Scale' showing a two-pan balance: on Left Pan sits 'Singular Subject' balanced with 'Singular Verb'; on Right Pan sits 'Plural Subject' balanced with 'Plural Verb'. Underneath, an imbalanced scale shows the error of pairing Singular Subject with Plural Verb."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Textbook Figure Caption
                </label>
                <input
                  type="text"
                  value={visCaption}
                  onChange={(e) => setVisCaption(e.target.value)}
                  placeholder="e.g. Fig. 6.3: The Balance of Concord in English Sentence Syntax"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {type === 'worked_example' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Problem / Sentence
                </label>
                <input
                  type="text"
                  value={weProblem}
                  onChange={(e) => setWeProblem(e.target.value)}
                  placeholder="e.g. The bouquet of fragrant red roses (was / were) presented."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>

              {/* Step list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#5A1832]">
                    Step-by-Step Methodological Reasoning
                  </span>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="flex items-center space-x-1 text-[11px] font-bold text-[#5A1832] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-[#C29A52]" />
                    <span>Add Step</span>
                  </button>
                </div>

                {weSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px] uppercase text-[#71685E]">
                        Step {step.stepNumber}
                      </span>
                      {weSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-[#71685E] hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Step Title"
                      value={step.title}
                      onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Instruction / Action"
                      value={step.instruction}
                      onChange={(e) => handleUpdateStep(idx, 'instruction', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Sample Work / Demonstration"
                      value={step.sampleWork}
                      onChange={(e) => handleUpdateStep(idx, 'sampleWork', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] text-xs font-mono focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Final Answer
                </label>
                <input
                  type="text"
                  value={weFinalAnswer}
                  onChange={(e) => setWeFinalAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Why? (Grammar Rationale)
                </label>
                <textarea
                  rows={2}
                  value={weWhyRationale}
                  onChange={(e) => setWeWhyRationale(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                    Rule Applied
                  </label>
                  <input
                    type="text"
                    value={weRuleApplied}
                    onChange={(e) => setWeRuleApplied(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                    Common Mistake
                  </label>
                  <input
                    type="text"
                    value={weCommonMistake}
                    onChange={(e) => setWeCommonMistake(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'common_error' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Mistake Type
                </label>
                <input
                  type="text"
                  value={ceMistakeType}
                  onChange={(e) => setCeMistakeType(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                    Incorrect Sentence
                  </label>
                  <textarea
                    rows={2}
                    value={ceIncorrect}
                    onChange={(e) => setCeIncorrect(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50/50 text-[#292521] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                    Corrected Sentence
                  </label>
                  <textarea
                    rows={2}
                    value={ceCorrect}
                    onChange={(e) => setCeCorrect(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-[#292521] text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Explanation &amp; Exam Trap Note
                </label>
                <textarea
                  rows={2}
                  value={ceExplanation}
                  onChange={(e) => setCeExplanation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {type === 'example_pair' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Rule Demonstrated
                </label>
                <input
                  type="text"
                  value={pairRule}
                  onChange={(e) => setPairRule(e.target.value)}
                  placeholder="e.g. Intervening Prepositional Modifiers"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                    Incorrect Sentence (Common Mistake)
                  </label>
                  <textarea
                    rows={2}
                    value={pairIncorrect}
                    onChange={(e) => setPairIncorrect(e.target.value)}
                    placeholder="e.g. The bouquet of flowers are on the table."
                    className="w-full px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50/50 text-[#292521] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                    Correct Sentence
                  </label>
                  <textarea
                    rows={2}
                    value={pairCorrect}
                    onChange={(e) => setPairCorrect(e.target.value)}
                    placeholder="e.g. The bouquet of flowers is on the table."
                    className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-[#292521] text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5A1832] mb-1">
                  Why? (Diagnostic explanation)
                </label>
                <textarea
                  rows={2}
                  value={pairWhy}
                  onChange={(e) => setPairWhy(e.target.value)}
                  placeholder="Explain why the head noun governs agreement..."
                  className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Author Private Notes */}
          <div className="pt-2 border-t border-[#CBBEAC]">
            <label className="block text-[11px] font-semibold text-[#71685E] mb-1">
              Private Author Notes (attached to this block)
            </label>
            <input
              type="text"
              value={authorNotes}
              onChange={(e) => setAuthorNotes(e.target.value)}
              placeholder="Editorial notes, rationale, or review reminders..."
              className="w-full px-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-[11px] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#CBBEAC] flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs border border-[#CBBEAC] hover:bg-[#EDE4D6] text-[#292521] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] shadow-xs cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Save Block</span>
          </button>
        </div>
      </div>
    </div>
  );
};
