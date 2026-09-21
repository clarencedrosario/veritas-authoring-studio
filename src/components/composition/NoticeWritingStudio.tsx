import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  Layers,
  Square,
  CheckSquare,
  Clock,
  MapPin,
  Users,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { NoticeDraft, NoticeCategory, GrammarClassLevel } from '../../types';
import { INITIAL_NOTICE_DRAFTS } from '../../utils/compositionData';

interface NoticeWritingStudioProps {
  draft: NoticeDraft;
  onUpdateDraft: (updated: NoticeDraft) => void;
  selectedClass: GrammarClassLevel;
  isDarkMode: boolean;
  onRunEvaluation: () => void;
}

export const NoticeWritingStudio: React.FC<NoticeWritingStudioProps> = ({
  draft,
  onUpdateDraft,
  selectedClass,
  isDarkMode,
  onRunEvaluation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory>('school_event');
  const [copied, setCopied] = useState(false);

  // Compute notice body word count (curriculum 50-word rule focuses specifically on body + details)
  const bodyWords = draft.body.trim() ? draft.body.trim().split(/\s+/).filter(Boolean).length : 0;
  const totalWords = [
    draft.issuingAuthority,
    draft.noticeHeader,
    draft.dateOfIssue,
    draft.titleOrHeadline,
    draft.body,
    draft.signatoryName,
    draft.signatoryDesignation,
  ]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const handleFieldChange = (field: keyof NoticeDraft, value: any) => {
    onUpdateDraft({
      ...draft,
      [field]: value,
    });
  };

  const loadCategoryPreset = (category: NoticeCategory) => {
    setSelectedCategory(category);
    if (category === 'school_event') {
      onUpdateDraft(INITIAL_NOTICE_DRAFTS.debate_competition);
    } else if (category === 'lost_and_found') {
      onUpdateDraft(INITIAL_NOTICE_DRAFTS.lost_and_found);
    } else if (category === 'tour_excursion') {
      onUpdateDraft({
        issuingAuthority: 'MODERN VIDYA MANDIR, JAIPUR',
        noticeHeader: 'NOTICE',
        dateOfIssue: '28 October 2026',
        titleOrHeadline: 'EDUCATIONAL TRIP TO NATIONAL SCIENCE CENTRE',
        body: 'The Science Department is organizing a one-day educational excursion for students of Classes VII and VIII to the National Science Centre, New Delhi on Saturday, 15 November 2026. The registration fee is ₹650 per student, covering air-conditioned luxury transport, entry tickets, and lunch. Interested students must submit parental consent forms along with the fee to their respective class teachers by 5 November 2026.',
        signatoryName: 'Suman Chawla',
        signatoryDesignation: 'Head of Science Department',
        enclosedInBox: true,
      });
    } else {
      onUpdateDraft(INITIAL_NOTICE_DRAFTS.debate_competition);
    }
  };

  const handleCopyNotice = () => {
    const text = `${draft.issuingAuthority}
${draft.noticeHeader}

${draft.dateOfIssue}

${draft.titleOrHeadline}

${draft.body}

${draft.signatoryName}
${draft.signatoryDesignation}`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 5 Ws Detection Engine
  const lowerBody = draft.body.toLowerCase();
  const detected5Ws = {
    what: draft.titleOrHeadline.length > 3 || /(competition|tour|debate|camp|match|meeting|exhibition|drive|found|lost)/i.test(lowerBody),
    when: /(\bon\s+[A-Za-z0-9]+\b|\bat\s+\d{1,2}(:\d{2})?\s*(am|pm)|\bfrom\s+\d{1,2}\b|\bnovember\b|\boctober\b|\bdecember\b|\btime\b|\bdate\b)/i.test(lowerBody),
    where: /(in\s+the\s+[a-z]+|at\s+the\s+[a-z]+|auditorium|playground|ground|room|centre|hall|campus)/i.test(lowerBody),
    who: /(class(es)?\s+[ivxlcdm0-9]+|all\s+students|interested\s+students|participants|members)/i.test(lowerBody),
    contact: /(contact\s+the\s+undersigned|submit\s+names|respective\s+house|class\s+teacher|reach\s+out|claim\s+from)/i.test(lowerBody),
  };

  return (
    <div className="space-y-6">
      {/* Category selector & Action Bar */}
      <div
        className={`p-4 md:p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Notice Type:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'school_event', label: 'School Event / Competition' },
              { id: 'lost_and_found', label: 'Lost & Found' },
              { id: 'tour_excursion', label: 'Excursion / Tour' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => loadCategoryPreset(cat.id as NoticeCategory)}
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
          {/* Box Toggle */}
          <button
            onClick={() => handleFieldChange('enclosedInBox', !draft.enclosedInBox)}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 border transition-all cursor-pointer ${
              draft.enclosedInBox
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
                : isDarkMode
                ? 'border-slate-700 text-slate-400'
                : 'border-stone-200 text-stone-500'
            }`}
          >
            {draft.enclosedInBox ? (
              <CheckSquare className="w-4 h-4 text-emerald-500" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>Enclose in Box (Board Mandate)</span>
          </button>

          <button
            onClick={handleCopyNotice}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied' : 'Copy Notice'}</span>
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

      {/* 5 Ws Radar Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
          isDarkMode ? 'bg-[#18202f] border-slate-700' : 'bg-amber-50/70 border-amber-200/80'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-slate-200">
            Notice 5 Ws Verification Radar:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              detected5Ws.what
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-stone-200/50 dark:bg-slate-800 border-transparent text-stone-500 dark:text-slate-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. What (Event / Object)</span>
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              detected5Ws.when
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-stone-200/50 dark:bg-slate-800 border-transparent text-stone-500 dark:text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. When (Date & Time)</span>
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              detected5Ws.where
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-stone-200/50 dark:bg-slate-800 border-transparent text-stone-500 dark:text-slate-400'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>3. Where (Venue)</span>
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              detected5Ws.who
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-stone-200/50 dark:bg-slate-800 border-transparent text-stone-500 dark:text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4. Who (Target Class)</span>
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              detected5Ws.contact
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-stone-200/50 dark:bg-slate-800 border-transparent text-stone-500 dark:text-slate-400'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>5. Whom to Contact</span>
          </span>
        </div>
      </div>

      {/* Main Split: Form Inputs (Left) + Formatted Framed Box Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-5 md:p-6 rounded-2xl border ${
              isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
            }`}
          >
            <h3 className="text-base font-serif font-bold text-stone-900 dark:text-slate-100 mb-4 flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-700">
              <span>Notice Format Specifications</span>
              <span className="text-xs font-mono font-medium text-stone-500 dark:text-slate-400">
                Class: <strong className="text-amber-600 dark:text-amber-400">{selectedClass}</strong>
              </span>
            </h3>

            <div className="space-y-4">
              {/* Issuing Authority */}
              <div>
                <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                  1. Name of Issuing Authority / School (Centered, Uppercase)
                </label>
                <input
                  type="text"
                  value={draft.issuingAuthority}
                  onChange={(e) => handleFieldChange('issuingAuthority', e.target.value.toUpperCase())}
                  className={`w-full p-2.5 rounded-xl text-sm font-bold uppercase border transition-all ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                  placeholder="e.g. ST. XAVIER'S HIGH SCHOOL, NEW DELHI"
                />
              </div>

              {/* Notice Word Header & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    2. Header (Always NOTICE)
                  </label>
                  <input
                    type="text"
                    value={draft.noticeHeader}
                    onChange={(e) => handleFieldChange('noticeHeader', e.target.value.toUpperCase())}
                    className={`w-full p-2.5 rounded-xl text-sm font-extrabold uppercase tracking-widest border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100'
                        : 'bg-stone-50 border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    3. Date of Issuance
                  </label>
                  <input
                    type="text"
                    value={draft.dateOfIssue}
                    onChange={(e) => handleFieldChange('dateOfIssue', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. 22 October 2026"
                  />
                </div>
              </div>

              {/* Title / Heading */}
              <div>
                <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>4. Catchy Subject / Event Title (Uppercase)</span>
                  <span className="text-xs text-amber-600 font-normal">3-6 words maximum</span>
                </label>
                <input
                  type="text"
                  value={draft.titleOrHeadline}
                  onChange={(e) => handleFieldChange('titleOrHeadline', e.target.value.toUpperCase())}
                  className={`w-full p-2.5 rounded-xl text-sm font-bold uppercase border transition-all ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                  placeholder="e.g. ANNUAL INTER-HOUSE DEBATE COMPETITION"
                />
              </div>

              {/* Body of Notice */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200">
                    5. Notice Body (5 Ws & Objective Details)
                  </label>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                      bodyWords >= 40 && bodyWords <= 55
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : bodyWords > 55
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {bodyWords} / 50 words
                  </span>
                </div>
                <textarea
                  value={draft.body}
                  onChange={(e) => handleFieldChange('body', e.target.value)}
                  rows={6}
                  className={`w-full p-3.5 rounded-xl text-sm leading-relaxed border transition-all ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                  placeholder="State What, When, Where, Who is eligible, and Whom to contact. Maintain objective third-person style (avoid 'I' or 'We')..."
                />
                <div className="flex items-center justify-between mt-1.5 text-xs text-stone-500 dark:text-slate-400">
                  <span>Standard prescribed limit: 50 words.</span>
                  <span>Penalty applies if exceeding by &gt;5-10 words.</span>
                </div>
              </div>

              {/* Signatory Name & Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    6. Signatory Name
                  </label>
                  <input
                    type="text"
                    value={draft.signatoryName}
                    onChange={(e) => handleFieldChange('signatoryName', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. Ananya Deshmukh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-slate-200 mb-1.5">
                    7. Signatory Designation
                  </label>
                  <input
                    type="text"
                    value={draft.signatoryDesignation}
                    onChange={(e) => handleFieldChange('signatoryDesignation', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-sm border transition-all ${
                      isDarkMode
                        ? 'bg-slate-900/80 border-slate-700 text-slate-100 focus:border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                    }`}
                    placeholder="e.g. Head Girl / President, Literary Club"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Formatted Framed Box Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 md:p-8 rounded-2xl border flex flex-col justify-between shadow-sm transition-all ${
              isDarkMode ? 'bg-[#121822] border-slate-700' : 'bg-stone-100/60 border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400 font-mono">
                Simulated Bulletin Board Preview
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-semibold">
                {draft.enclosedInBox ? 'Box: Enclosed' : 'Box: Missing (1 Mark Deduction)'}
              </span>
            </div>

            {/* Simulated School Notice Box Frame */}
            <div
              className={`p-6 md:p-8 transition-all relative ${
                draft.enclosedInBox
                  ? isDarkMode
                    ? 'border-2 border-slate-400 bg-slate-900/90 shadow-md'
                    : 'border-2 border-stone-800 bg-white shadow-md'
                  : isDarkMode
                  ? 'border border-dashed border-rose-500/60 bg-slate-900/40'
                  : 'border border-dashed border-rose-400 bg-white'
              }`}
            >
              {!draft.enclosedInBox && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded bg-rose-500 text-white text-xs font-bold shadow-xs">
                  Penalty: Missing Box Border (-1 Mark)
                </div>
              )}

              {/* Issuing Authority */}
              <div className="text-center font-bold text-sm md:text-base uppercase tracking-wider text-stone-900 dark:text-white mb-2">
                {draft.issuingAuthority || '[NAME OF ISSUING AUTHORITY / SCHOOL]'}
              </div>

              {/* NOTICE Keyword */}
              <div className="text-center font-black text-lg md:text-xl uppercase tracking-widest text-stone-900 dark:text-white mb-3">
                {draft.noticeHeader || 'NOTICE'}
              </div>

              {/* Date */}
              <div className="text-sm font-semibold text-stone-800 dark:text-slate-200 mb-3 font-sans">
                {draft.dateOfIssue || '[Date of Issue]'}
              </div>

              {/* Title / Heading */}
              <div className="text-center font-bold text-sm md:text-base uppercase underline tracking-wide text-stone-900 dark:text-white mb-4 decoration-stone-400">
                {draft.titleOrHeadline || '[HEADING / TITLE OF NOTICE]'}
              </div>

              {/* Body */}
              <div className="text-[15px] md:text-base leading-[1.7] text-justify text-stone-800 dark:text-slate-200 mb-6 whitespace-pre-line font-serif">
                {draft.body ||
                  '[Notice body answering 5 Ws: What the event is, When it happens, Where it will take place, Who is eligible, and Whom to contact...]'}
              </div>

              {/* Signatory details */}
              <div className="pt-2 text-sm space-y-0.5 text-stone-900 dark:text-white font-sans">
                <div className="font-bold">{draft.signatoryName || '[Signatory Name]'}</div>
                <div className="text-xs text-stone-600 dark:text-slate-400">
                  {draft.signatoryDesignation || '[Designation]'}
                </div>
              </div>
            </div>

            {/* Quick Word Count Meter */}
            <div className="mt-4 pt-3.5 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-stone-600 dark:text-slate-400">Word Count Compliance:</span>
              <div className="flex items-center space-x-2.5">
                <div className="w-28 h-2.5 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      bodyWords >= 40 && bodyWords <= 55
                        ? 'bg-emerald-500'
                        : bodyWords > 55
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (bodyWords / 50) * 100)}%` }}
                  />
                </div>
                <span className="font-bold text-stone-800 dark:text-slate-200">
                  {bodyWords} / 50 words
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
