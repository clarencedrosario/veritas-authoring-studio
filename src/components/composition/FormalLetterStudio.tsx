import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  ChevronDown,
  Layers,
  HelpCircle,
  Send,
} from 'lucide-react';
import { FormalLetterDraft, FormalLetterCategory, GrammarClassLevel } from '../../types';
import { INITIAL_FORMAL_LETTER_DRAFTS } from '../../utils/compositionData';

interface FormalLetterStudioProps {
  draft: FormalLetterDraft;
  onUpdateDraft: (updated: FormalLetterDraft) => void;
  selectedClass: GrammarClassLevel;
  isDarkMode: boolean;
  onRunEvaluation: () => void;
}

export const FormalLetterStudio: React.FC<FormalLetterStudioProps> = ({
  draft,
  onUpdateDraft,
  selectedClass,
  isDarkMode,
  onRunEvaluation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FormalLetterCategory>('letter_to_editor');
  const [showPhraseBank, setShowPhraseBank] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Compute total word count
  const allText = [
    draft.senderAddress,
    draft.date,
    draft.receiverDesignation,
    draft.receiverAddress,
    draft.subject,
    draft.salutation,
    draft.bodyParagraph1,
    draft.bodyParagraph2,
    draft.bodyParagraph3,
    draft.complimentaryClose,
    draft.senderName,
    draft.senderDesignation,
  ]
    .filter(Boolean)
    .join(' ');

  const totalWords = allText.trim() ? allText.trim().split(/\s+/).length : 0;
  const bodyWords = [draft.bodyParagraph1, draft.bodyParagraph2, draft.bodyParagraph3]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const handleFieldChange = (field: keyof FormalLetterDraft, value: string) => {
    onUpdateDraft({
      ...draft,
      [field]: value,
    });
  };

  const loadPreset = (category: FormalLetterCategory) => {
    setSelectedCategory(category);
    if (category === 'letter_to_editor') {
      onUpdateDraft(INITIAL_FORMAL_LETTER_DRAFTS.editor_road_safety);
    } else if (category === 'complaint_letter') {
      onUpdateDraft(INITIAL_FORMAL_LETTER_DRAFTS.complaint_defective_goods);
    } else if (category === 'leave_application') {
      onUpdateDraft({
        senderAddress: 'Class X-A, Roll No. 24\nSt. Peter’s Academy\nKolkata - 700016',
        date: '20 October 2026',
        receiverDesignation: 'The Principal',
        receiverAddress: 'St. Peter’s Academy\nPark Street Campus\nKolkata - 700016',
        subject: 'Application for Five Days Leave of Absence to Attend National Science Camp',
        salutation: 'Respected Sir,',
        bodyParagraph1:
          'I am a student of Class X-A in your esteemed institution. I have been selected by the Department of Science and Technology to participate in the National Science Talent Camp scheduled from 25 October to 29 October 2026 in New Delhi.',
        bodyParagraph2:
          'This camp presents an exceptional opportunity to conduct hands-on laboratory research under the mentorship of senior scientists. Unfortunately, the camp dates coincide with the upcoming mid-term unit evaluations.',
        bodyParagraph3:
          'I earnestly request you to grant me five days leave of absence. I assure you that I will diligently complete all missed coursework and take the compensatory tests immediately upon my return.',
        complimentaryClose: 'Yours obediently,',
        senderName: 'Siddharth Roy',
        senderDesignation: 'Student (Class X-A, Roll No. 24)',
      });
    } else {
      onUpdateDraft(INITIAL_FORMAL_LETTER_DRAFTS.editor_road_safety);
    }
  };

  const handleCopyFormatted = () => {
    const fullLetter = `${draft.senderAddress}

${draft.date}

${draft.receiverDesignation}
${draft.receiverAddress}

Subject: ${draft.subject}

${draft.salutation}

${draft.bodyParagraph1}

${draft.bodyParagraph2}

${draft.bodyParagraph3}

${draft.complimentaryClose}
${draft.senderName}
${draft.senderDesignation || ''}`.trim();

    navigator.clipboard.writeText(fullLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const phraseCategories = [
    {
      title: 'Opening Lines (Letter to Editor)',
      phrases: [
        'Through the esteemed columns of your widely circulated daily, I wish to draw the attention of...',
        'I am writing to voice my deep concern regarding the growing menace of...',
        'Kindly permit me a little space in your popular newspaper to highlight the pressing issue of...',
      ],
    },
    {
      title: 'Opening Lines (Official Complaint)',
      phrases: [
        'I am writing to register an official complaint regarding the unsatisfactory service/defective...',
        'This is with reference to Invoice / Cash Memo No. [...] dated [...], which has developed serious faults...',
        'I wish to bring to your immediate notice the gross negligence displayed by...',
      ],
    },
    {
      title: 'Transitional Connectors (Body Paragraph 2)',
      phrases: [
        'Furthermore, the situation has been exacerbated by the continued apathy of...',
        'In light of these pressing challenges, the public has been subjected to severe inconvenience...',
        'Despite repeated representations and verbal reminders to the authorities...',
      ],
    },
    {
      title: 'Closing Appeals (Body Paragraph 3)',
      phrases: [
        'I earnestly hope this petition stirs the concerned authorities into taking prompt remedial action.',
        'I request you to look into this matter personally and arrange for an immediate replacement/refund.',
        'A swift and decisive response will go a long way in restoring public confidence.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Category selector & Helper toolbar */}
      <div
        className={`p-4 md:p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Letter Genre:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'letter_to_editor', label: 'Letter to Editor' },
              { id: 'complaint_letter', label: 'Complaint Letter' },
              { id: 'leave_application', label: 'Leave Application' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => loadPreset(cat.id as FormalLetterCategory)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowPhraseBank(!showPhraseBank)}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 border transition-all cursor-pointer ${
              showPhraseBank
                ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400'
                : isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Formal Phrase Bank</span>
          </button>

          <button
            onClick={handleCopyFormatted}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied' : 'Copy Letter'}</span>
          </button>

          <button
            onClick={onRunEvaluation}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-amber-600 to-orange-600 text-white shadow-xs hover:from-amber-500 hover:to-orange-500 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Grade Against Rubric</span>
          </button>
        </div>
      </div>

      {/* Phrase bank popdown drawer */}
      {showPhraseBank && (
        <div
          className={`p-5 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDarkMode ? 'bg-[#1a2333] border-amber-500/40' : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Curriculum Sentence Starters & Formal Connectors</span>
            </h4>
            <span className="text-xs text-stone-600 dark:text-slate-400">
              Click any phrase to append directly into your letter body
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {phraseCategories.map((cat, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-sm ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-amber-100'
                }`}
              >
                <div className="font-semibold text-stone-900 dark:text-slate-100 mb-2">{cat.title}</div>
                <div className="space-y-1.5">
                  {cat.phrases.map((phrase, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        handleFieldChange(
                          'bodyParagraph2',
                          draft.bodyParagraph2 ? `${draft.bodyParagraph2} ${phrase}` : phrase
                        );
                      }}
                      className={`block w-full text-left p-2 rounded-lg transition-all italic text-stone-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 text-sm cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-700/70' : 'hover:bg-amber-50'
                      }`}
                    >
                      "{phrase}"
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Column Studio: Left Scaffolding Editor + Right Authentic Typography Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 8-Part Anatomy Scaffold (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-5 md:p-6 rounded-2xl border ${
              isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-200 dark:border-slate-700 mb-4">
              <div className="flex items-center space-x-2.5">
                <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-slate-100">
                  8-Part Formal Letter Anatomy
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-stone-600 dark:text-slate-400">
                  Body Words:{' '}
                  <strong
                    className={
                      bodyWords >= 100 && bodyWords <= 150
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-amber-600 font-bold'
                    }
                  >
                    {bodyWords}
                  </strong>{' '}
                  / 120–150
                </span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-600 dark:text-slate-400">
                  Total Words: <strong>{totalWords}</strong>
                </span>
              </div>
            </div>

            {/* Form Fields Accordion / Grouping */}
            <div className="space-y-4">
              {/* 1. Sender's Address */}
              <div>
                <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>1. Sender's Address (without name, 2-3 lines)</span>
                  <span className="text-xs text-stone-500">Full marks anchor (CBSE/ICSE)</span>
                </label>
                <textarea
                  value={draft.senderAddress}
                  onChange={(e) => handleFieldChange('senderAddress', e.target.value)}
                  rows={2}
                  className={`w-full p-3 rounded-xl text-sm font-mono border transition-all ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                  placeholder="e.g. 42-B, Rosewood Apartments&#10;Sector 14, Rohini&#10;New Delhi - 110085"
                />
              </div>

              {/* 2. Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    2. Date (Expanded Format)
                  </label>
                  <input
                    type="text"
                    value={draft.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. 18 October 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    3. Receiver's Designation
                  </label>
                  <input
                    type="text"
                    value={draft.receiverDesignation}
                    onChange={(e) => handleFieldChange('receiverDesignation', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. The Editor / The Principal / The Sales Manager"
                  />
                </div>
              </div>

              {/* 4. Receiver's Address */}
              <div>
                <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                  4. Receiver's Official Address
                </label>
                <textarea
                  value={draft.receiverAddress}
                  onChange={(e) => handleFieldChange('receiverAddress', e.target.value)}
                  rows={2}
                  className={`w-full p-3 rounded-xl text-sm border transition-all ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                  placeholder="e.g. The National Chronicle&#10;KG Marg, Connaught Place&#10;New Delhi - 110001"
                />
              </div>

              {/* 5. Subject Line & Salutation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                    <span>5. Subject Line (Brief, 4-8 words)</span>
                    <span className="text-xs text-amber-600 font-normal">Must summarize goal</span>
                  </label>
                  <input
                    type="text"
                    value={draft.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm font-medium border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. Urgent Need for Traffic Calming on Sector 14 Main Road"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    6. Salutation
                  </label>
                  <input
                    type="text"
                    value={draft.salutation}
                    onChange={(e) => handleFieldChange('salutation', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. Sir, or Dear Sir,"
                  />
                </div>
              </div>

              {/* 7. The 3-Tier Body */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-stone-900 dark:text-slate-100">
                    7. Letter Body (3 Distinct Functional Paragraphs)
                  </label>
                  <span className="text-xs text-stone-500">Content & Expression: 4 Marks</span>
                </div>

                {/* Body Paragraph 1 */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50/80 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      Paragraph 1: Purpose & Context Hook
                    </span>
                    <span className="text-xs text-stone-500">~25-35 words</span>
                  </div>
                  <textarea
                    value={draft.bodyParagraph1}
                    onChange={(e) => handleFieldChange('bodyParagraph1', e.target.value)}
                    rows={3}
                    className={`w-full p-3 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-white border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="State who you are and why you are writing clearly..."
                  />
                </div>

                {/* Body Paragraph 2 */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50/80 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      Paragraph 2: Detailed Causes, Ground Realities & Impact
                    </span>
                    <span className="text-xs text-stone-500">~60-80 words</span>
                  </div>
                  <textarea
                    value={draft.bodyParagraph2}
                    onChange={(e) => handleFieldChange('bodyParagraph2', e.target.value)}
                    rows={4}
                    className={`w-full p-3 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-white border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="Elaborate on specific incidents, dangers, data, and grievances..."
                  />
                </div>

                {/* Body Paragraph 3 */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50/80 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      Paragraph 3: Constructive Appeal & Concrete Remedial Steps
                    </span>
                    <span className="text-xs text-stone-500">~25-35 words</span>
                  </div>
                  <textarea
                    value={draft.bodyParagraph3}
                    onChange={(e) => handleFieldChange('bodyParagraph3', e.target.value)}
                    rows={3}
                    className={`w-full p-3 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-white border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="Clearly articulate what action you expect from authorities or addressee..."
                  />
                </div>
              </div>

              {/* 8. Complimentary Close & Sign-off */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    8. Complimentary Close
                  </label>
                  <input
                    type="text"
                    value={draft.complimentaryClose}
                    onChange={(e) => handleFieldChange('complimentaryClose', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. Yours sincerely,"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={draft.senderName}
                    onChange={(e) => handleFieldChange('senderName', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. Aarav Malhotra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    Designation (Optional)
                  </label>
                  <input
                    type="text"
                    value={draft.senderDesignation || ''}
                    onChange={(e) => handleFieldChange('senderDesignation', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. General Secretary, RWA"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Formatted Sheet Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`p-6 md:p-8 rounded-2xl border min-h-[580px] shadow-sm transition-all relative ${
              isDarkMode
                ? 'bg-[#121822] border-slate-700 text-slate-200 font-serif'
                : 'bg-[#fffdfa] border-stone-300 text-stone-900 font-serif'
            }`}
          >
            {/* Sheet header badge */}
            <div className="flex items-center justify-between border-b pb-3.5 mb-5 border-stone-200 dark:border-slate-800 font-sans">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400">
                Formal Letter Preview (Print View)
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300">
                Class Level: {selectedClass}
              </span>
            </div>

            {/* Letter Content Preview with Left-Aligned Block Styling */}
            <div className="text-[16px] leading-[1.7] space-y-4 font-serif">
              {/* Sender Address */}
              <div className="whitespace-pre-line text-stone-800 dark:text-slate-200">
                {draft.senderAddress || <span className="text-stone-400 italic">[Sender's Address]</span>}
              </div>

              {/* Date */}
              <div className="font-sans font-medium text-stone-800 dark:text-slate-200 text-sm">
                {draft.date || <span className="text-stone-400 italic">[Date]</span>}
              </div>

              {/* Receiver Block */}
              <div className="whitespace-pre-line text-stone-800 dark:text-slate-200 pt-1">
                <div className="font-semibold">{draft.receiverDesignation || '[Receiver Designation]'}</div>
                <div>{draft.receiverAddress || '[Receiver Address]'}</div>
              </div>

              {/* Subject */}
              <div className="pt-2 font-sans font-bold text-base text-stone-900 dark:text-white underline decoration-stone-400">
                Subject:{' '}
                {draft.subject || <span className="text-stone-400 italic no-underline">[Subject Line]</span>}
              </div>

              {/* Salutation */}
              <div className="pt-1">{draft.salutation || 'Sir,'}</div>

              {/* Body Paragraphs */}
              <div className="space-y-3.5 pt-1 text-justify">
                <p className="leading-[1.7]">
                  {draft.bodyParagraph1 || (
                    <span className="text-stone-400 italic">[Paragraph 1: State purpose and hook]</span>
                  )}
                </p>
                <p className="leading-[1.7]">
                  {draft.bodyParagraph2 || (
                    <span className="text-stone-400 italic">[Paragraph 2: Ground reality, causes and impact]</span>
                  )}
                </p>
                <p className="leading-[1.7]">
                  {draft.bodyParagraph3 || (
                    <span className="text-stone-400 italic">[Paragraph 3: Remedy requested or closing appeal]</span>
                  )}
                </p>
              </div>

              {/* Sign-off */}
              <div className="pt-4 space-y-1.5 font-sans text-sm">
                <div>{draft.complimentaryClose || 'Yours sincerely,'}</div>
                <div className="font-bold text-base pt-1">{draft.senderName || '[Sender Name]'}</div>
                {draft.senderDesignation && (
                  <div className="text-xs text-stone-600 dark:text-slate-400">
                    {draft.senderDesignation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
