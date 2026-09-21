import {
  CompositionPrompt,
  CompositionEvaluationResult,
  FormalLetterDraft,
  NoticeDraft,
  GrammarClassLevel,
  CompositionGenre,
} from '../types';

export interface BoardRubricScheme {
  id: string;
  boardName: string;
  genre: CompositionGenre;
  totalMarks: number;
  formatMarks: number;
  contentMarks: number;
  expressionMarks: number;
  accuracyRule: string;
  formatChecklist: string[];
  contentGuidelines: string[];
  expressionGuidelines: string[];
}

export const BOARD_RUBRICS: Record<string, BoardRubricScheme> = {
  cbse_notice: {
    id: 'cbse_notice',
    boardName: 'CBSE & National Curricula',
    genre: 'notice',
    totalMarks: 5,
    formatMarks: 1,
    contentMarks: 2,
    expressionMarks: 2,
    accuracyRule: 'Strict 50-word limit. -0.5 mark deducted if word count deviates by more than 5-10 words. 1 mark deduction if not enclosed in a box.',
    formatChecklist: [
      "Name of Issuing School/Authority/Organization centered at the top",
      "The word 'NOTICE' in bold capital letters",
      "Date of issue on the left or right margin (e.g., '14 October 2026')",
      "Captivating, concise Heading / Title of the event",
      "Signatory Name with clear Designation at the bottom left",
      "Entire notice MUST be enclosed neatly in a rectangular box",
    ],
    contentGuidelines: [
      "Answers the 5 Ws: What (Event name), When (Date & Time), Where (Venue), Who (Eligibility / Target class), Whom to contact",
      "Relevant details only; no unnecessary background padding",
      "Objective, third-person formal tone (avoid 'I' or 'We')",
    ],
    expressionGuidelines: [
      "Grammatical accuracy, passive voice where appropriate",
      "Formal institutional diction without colloquialisms",
      "Crisp, punchy sentence structures suitable for bulletin display",
    ],
  },
  cbse_formal_letter: {
    id: 'cbse_formal_letter',
    boardName: 'CBSE & National Curricula',
    genre: 'formal_letter',
    totalMarks: 5,
    formatMarks: 1,
    contentMarks: 2,
    expressionMarks: 2,
    accuracyRule: 'Target 120-150 words. Format awarded 1 mark only if all 7 elements are sequenced correctly. Deduction of 0.5-1 mark for frequent grammatical errors.',
    formatChecklist: [
      "Sender's Address (without name, 2-3 lines)",
      "Date in expanded format (e.g. '15 November 2026')",
      "Receiver's Designation & Full Official Address (e.g., 'The Editor, The Times of India, New Delhi')",
      "Subject line (underlined or bolded, brief & summarizing purpose in 4-8 words)",
      "Salutation ('Sir / Madam' or 'Respected Sir/Madam')",
      "Body of the letter clearly structured into 3 distinct paragraphs",
      "Complimentary Close ('Yours faithfully' or 'Yours sincerely') followed by Full Name & Designation",
    ],
    contentGuidelines: [
      "Paragraph 1: Purpose of writing & reference/hook (e.g. 'Through the columns of your esteemed newspaper...')",
      "Paragraph 2: Cause, effect, real-world data, consequences, and public distress",
      "Paragraph 3: Constructive recommendations, appeal, or remedial action required",
    ],
    expressionGuidelines: [
      "Appropriate formal register (courteous, objective, assertive)",
      "Smooth transitional connectors ('Furthermore', 'Consequently', 'In view of the above')",
      "High vocabulary range and syntactical variety",
    ],
  },
  icse_formal_letter: {
    id: 'icse_formal_letter',
    boardName: 'ICSE / CISCE Standards',
    genre: 'formal_letter',
    totalMarks: 10,
    formatMarks: 3,
    contentMarks: 4,
    expressionMarks: 3,
    accuracyRule: 'Strict punctuation checking on postal addresses and dates. Commas and full stops in address block strictly penalized if omitted.',
    formatChecklist: [
      "Sender's Address with postal pin code",
      "Date on the line immediately following address",
      "Receiver's official title and postal address",
      "Salutation (Sir/Madam, followed by comma)",
      "Subject line concisely stating grievance or petition",
      "Three-tier paragraph structure with formal opening and closing",
      "Complimentary close with signature and designation",
    ],
    contentGuidelines: [
      "Specific details, dates, reference numbers, or incident specifics",
      "Direct articulation of the required redressal or assistance",
      "Maturity of expression and logical coherence of arguments",
    ],
    expressionGuidelines: [
      "Flawless subject-verb concord and tense consistency",
      "Sophisticated phrasing and absence of slang",
      "Appropriate paragraph transitions",
    ],
  },
};

export const INITIAL_FORMAL_LETTER_DRAFTS: Record<string, FormalLetterDraft> = {
  editor_road_safety: {
    senderAddress: '42-B, Rosewood Apartments\nSector 14, Rohini\nNew Delhi - 110085',
    date: '18 October 2026',
    receiverDesignation: 'The Editor',
    receiverAddress: 'The National Chronicle\nKG Marg, Connaught Place\nNew Delhi - 110001',
    subject: 'Urgent Need for Traffic Calming and Road Safety Measures on Sector 14 Main Road',
    salutation: 'Sir,',
    bodyParagraph1:
      'Through the esteemed columns of your widely circulated daily, I wish to draw the immediate attention of the municipal corporation and the traffic police authorities to the alarming increase in reckless driving and pedestrian hazards on the Sector 14 Main Road.',
    bodyParagraph2:
      'Over the past six months, this arterial stretch has become notorious for over-speeding vehicles, particularly during morning and evening rush hours. The absence of functional streetlights, faded zebra crossings, and a lack of speed bumps outside the local primary school make commuting perilous for senior citizens and young students. Despite multiple representations to the local ward council, no concrete preventive measures have materialized, resulting in three major accidents in the past fortnight alone.',
    bodyParagraph3:
      'I earnestly request the concerned transport and law-enforcement authorities to install speed cameras, paint prominent rumble strips, and deploy traffic personnel during peak school hours. Immediate intervention will avert further loss of life and restore civic order.',
    complimentaryClose: 'Yours sincerely,',
    senderName: 'Aarav Malhotra',
    senderDesignation: 'General Secretary, Residents Welfare Association',
  },
  complaint_defective_goods: {
    senderAddress: 'Flat 304, Green Meadows\nCivil Lines\nJaipur - 302006',
    date: '5 November 2026',
    receiverDesignation: 'The Sales Manager',
    receiverAddress: 'Apex Electronics Pvt. Ltd.\nM.I. Road Commercial Complex\nJaipur - 302001',
    subject: 'Complaint Regarding Defective Apex Pro-Book Laptop (Invoice No. APX-9941)',
    salutation: 'Dear Sir,',
    bodyParagraph1:
      'I am writing to express my grave disappointment with the Apex Pro-Book 15 laptop purchased from your retail showroom on 24 October 2026 against Cash Memo No. APX-9941, carrying a two-year manufacturer warranty.',
    bodyParagraph2:
      'Within ten days of normal academic usage, the device began exhibiting severe technical glitches. The display flickers intermittently, the trackpad is completely unresponsive to touch gestures, and the battery drains completely within thirty minutes of a full charge. When I contacted your service desk on 2 November, I was met with uncooperative delays rather than prompt technical support.',
    bodyParagraph3:
      'Given that the product is well within the replacement guarantee period, I request an immediate replacement with a brand-new, defect-free unit or a full refund of ₹54,000. Kindly expedite this matter within five business days to prevent the need for escalation to consumer dispute forums.',
    complimentaryClose: 'Yours faithfully,',
    senderName: 'Rhea Sengupta',
    senderDesignation: 'Customer',
  },
};

export const INITIAL_NOTICE_DRAFTS: Record<string, NoticeDraft> = {
  debate_competition: {
    issuingAuthority: "CAMBRIDGE INTERNATIONAL SCHOOL, BENGALURU",
    noticeHeader: 'NOTICE',
    dateOfIssue: '22 October 2026',
    titleOrHeadline: 'INTER-HOUSE SENIOR ENGLISH DEBATE 2026',
    body: 'All students of Classes IX to XII are hereby informed that the Literary Society is organizing the Annual Inter-House English Debate on 10 November 2026 at 10:00 AM in the Main Auditorium. The motion for the debate is: "Artificial Intelligence in Education Hinders Authentic Human Critical Thinking." Each house may nominate two speakers (one for and one against the motion). Interested students should submit their names to their respective House Captains by 30 October 2026.',
    signatoryName: 'Ananya Deshmukh',
    signatoryDesignation: 'President, Literary Club',
    enclosedInBox: true,
  },
  lost_and_found: {
    issuingAuthority: 'ST. COLUMBA’S PUBLIC SCHOOL, CHENNAI',
    noticeHeader: 'NOTICE',
    dateOfIssue: '14 November 2026',
    titleOrHeadline: 'FOUND: BLUE TITAN WRIST WATCH',
    body: 'A navy-blue strap Titan analog wrist watch with a silver dial was found in the Junior School Football Playground near the basketball court yesterday during the recess bell. The rightful owner may claim it from the Physical Education Department office after providing proof of ownership and describing specific engravings on the case back during school hours.',
    signatoryName: 'Vikramaditya Rao',
    signatoryDesignation: 'Sports Captain',
    enclosedInBox: true,
  },
};

export const EXEMPLAR_PROMPTS: CompositionPrompt[] = [
  {
    id: 'prompt_notice_debate',
    title: 'Inter-House Debate Competition',
    genre: 'notice',
    subCategory: 'school_event',
    classLevels: ['Class 7', 'Class 8', 'Class 9', 'Class 10'],
    scenarioDescription:
      'You are Ananya Deshmukh, Secretary of the Literary Club of Cambridge International School, Bengaluru. Draft a notice in not more than 50 words inviting students of Classes IX-XII to participate in the Annual Inter-House Debate Competition.',
    inputNotes: [
      'Occasion: Annual Inter-House English Debate 2026',
      'Date & Time: 10 November 2026 at 10:00 AM',
      'Venue: Main Auditorium',
      'Topic: "Artificial Intelligence in Education Hinders Authentic Human Critical Thinking"',
      'Last date for registration: 30 October 2026',
    ],
    prescribedWordCount: { min: 40, max: 55, target: 50 },
    maxMarks: 5,
    rubric: {
      formatMarks: 1,
      contentMarks: 2,
      expressionMarks: 2,
      accuracyPenaltyNotes: '-0.5 mark for word limit deviation (> 55 words); -1 mark if box is missing.',
      guidelines: [
        'Center the School Name in capital letters.',
        'Include NOTICE and Date.',
        'Mention the 5 Ws concisely.',
        'End with Signatory name and title.',
      ],
    },
    sampleSolution: {
      modelText: `CAMBRIDGE INTERNATIONAL SCHOOL, BENGALURU
NOTICE

22 October 2026

INTER-HOUSE SENIOR ENGLISH DEBATE 2026

All students of Classes IX to XII are hereby informed that the Literary Society is organizing the Annual Inter-House English Debate on 10 November 2026 at 10:00 AM in the Main Auditorium. The motion for the debate is: "Artificial Intelligence in Education Hinders Authentic Human Critical Thinking." Each house may nominate two speakers (one for and one against the motion). Interested students should submit their names to their respective House Captains by 30 October 2026.

Ananya Deshmukh
President, Literary Club`,
      markingAnnotations: [
        { element: "School Name & NOTICE", marksEarned: "0.5 mark", note: "Prominently centered at top in capital lettering" },
        { element: "Date & Catchy Headline", marksEarned: "0.5 mark", note: "Standard expanded date format with precise topic" },
        { element: "Content: 5 Ws", marksEarned: "2.0 marks", note: "Includes Date, Time, Venue, Topic, Eligibility, and Submission deadline" },
        { element: "Expression & 50-word adherence", marksEarned: "2.0 marks", note: "Formal third-person phrasing, 49 words body, clean box enclosure" },
      ],
    },
  },
  {
    id: 'prompt_notice_lost_item',
    title: 'Found Wrist Watch on Campus',
    genre: 'notice',
    subCategory: 'lost_and_found',
    classLevels: ['Class 6', 'Class 7', 'Class 8', 'Class 9'],
    scenarioDescription:
      'You are Vikramaditya Rao, Sports Captain of St. Columba’s Public School, Chennai. You found an expensive wrist watch on the school playground. Draft a notice in not more than 50 words informing students and asking the rightful owner to claim it.',
    inputNotes: [
      'Item: Titan wrist watch with blue strap',
      'Location found: Football playground near basketball court',
      'When: Recess hours on 13 November',
      'Claim location: PE Department office',
      'Requirement: Identify marks or provide bill to verify ownership',
    ],
    prescribedWordCount: { min: 40, max: 55, target: 50 },
    maxMarks: 5,
    rubric: {
      formatMarks: 1,
      contentMarks: 2,
      expressionMarks: 2,
      accuracyPenaltyNotes: 'Do not disclose excessive identifying details so false claims can be filtered.',
      guidelines: [
        'Clear heading indicating LOST or FOUND',
        'State time and place found',
        'Direct claimant to authorized person with proof',
      ],
    },
  },
  {
    id: 'prompt_letter_editor_safety',
    title: 'Letter to Editor on Reckless Driving',
    genre: 'formal_letter',
    subCategory: 'letter_to_editor',
    classLevels: ['Class 8', 'Class 9', 'Class 10', 'Class 11'],
    scenarioDescription:
      'You are Aarav Malhotra / Ananya Sharma, a resident of Sector 14, Rohini, New Delhi. The main road passing through your residential colony has become a hazard due to over-speeding vehicles and lack of traffic calming measures. Write a letter to the Editor of The National Chronicle in 120-150 words highlighting the issue and proposing actionable solutions.',
    inputNotes: [
      'Problem: Over-speeding, street drag racing, non-functional streetlights',
      'Impact: Peril for school children and senior citizens, 3 accidents in fortnight',
      'Remedies: Rumble strips, speed cameras, deployment of traffic police during peak hours',
    ],
    prescribedWordCount: { min: 120, max: 150, target: 135 },
    maxMarks: 5,
    rubric: {
      formatMarks: 1,
      contentMarks: 2,
      expressionMarks: 2,
      accuracyPenaltyNotes: 'Deductions for misaligned addresses or missing subject line.',
      guidelines: [
        "Sender's address, Date, Receiver's address, Subject, Salutation",
        'Paragraph 1: Reference to newspaper and highlight core grievance',
        'Paragraph 2: Detailed ground reality, consequences, and civic apathy',
        'Paragraph 3: Concrete recommendations and appeal to authorities',
        'Complimentary close and signatory',
      ],
    },
  },
  {
    id: 'prompt_letter_complaint_laptop',
    title: 'Complaint regarding Defective Laptop',
    genre: 'formal_letter',
    subCategory: 'complaint_letter',
    classLevels: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
    scenarioDescription:
      'You recently purchased a laptop from Apex Electronics Pvt. Ltd., Jaipur. Within ten days, the display started flickering and the trackpad ceased functioning. Write a formal letter of complaint to the Sales Manager requesting an immediate replacement or full refund in 120-150 words.',
    inputNotes: [
      'Purchase date: 24 October 2026; Invoice: APX-9941; Warranty: 2 years',
      'Defects: Screen flickering, trackpad unresponsive, rapid battery drain',
      'Action requested: Brand-new replacement or full refund within 5 working days',
    ],
    prescribedWordCount: { min: 120, max: 150, target: 135 },
    maxMarks: 5,
    rubric: {
      formatMarks: 1,
      contentMarks: 2,
      expressionMarks: 2,
      accuracyPenaltyNotes: 'Maintain courteous yet firm formal consumer grievance tone.',
      guidelines: [
        'Mention invoice number, model, and purchase date clearly',
        'Catalog the exact technical failures experienced',
        'Specify desired remedy under consumer warranty terms',
      ],
    },
  },
  {
    id: 'prompt_letter_leave_application',
    title: 'Leave Application for Science Olympiad',
    genre: 'formal_letter',
    subCategory: 'leave_application',
    classLevels: ['Class 6', 'Class 7', 'Class 8'],
    scenarioDescription:
      'You have been selected to represent your state at the National Science Olympiad finals in New Delhi. Write an application to the Principal of your school requesting five days of leave of absence and permission to take the pending unit test at a later date (100-120 words).',
    inputNotes: [
      'Event: National Science Olympiad 2026 Finals',
      'Leave duration: 18 November to 22 November 2026 (5 days)',
      'Commitment: Submitting all pending class assignments upon return',
    ],
    prescribedWordCount: { min: 100, max: 120, target: 110 },
    maxMarks: 5,
    rubric: {
      formatMarks: 1,
      contentMarks: 2,
      expressionMarks: 2,
      accuracyPenaltyNotes: 'Clear mention of roll number, class & section, and parent countersignature expectation.',
      guidelines: [
        'Respectful formal tone addressed to Principal',
        'State dates of absence with legitimate justification',
        'Reassure coverage of missed coursework',
      ],
    },
  },
];

/**
 * Local Rule-based Evaluation Engine that evaluates student drafts according
 * to official K-12 board marking criteria (CBSE/ICSE) with immediate feedback.
 */
export function evaluateCompositionLocally(
  genre: CompositionGenre,
  subCategory: string,
  rawText: string,
  classLevel: GrammarClassLevel,
  rubricScheme: BoardRubricScheme = BOARD_RUBRICS.cbse_formal_letter
): CompositionEvaluationResult {
  const words = rawText.trim() ? rawText.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  let recommendedMin = genre === 'notice' ? 40 : 120;
  let recommendedMax = genre === 'notice' ? 55 : 160;

  if (genre === 'diary_entry') {
    recommendedMin = 100;
    recommendedMax = 130;
  }

  // Word count status
  let wordStatus: 'under' | 'optimal' | 'over' = 'optimal';
  let wordPenalty = 0;
  if (wordCount < recommendedMin) {
    wordStatus = 'under';
    if (recommendedMin - wordCount > 15) wordPenalty = 0.5;
    if (recommendedMin - wordCount > 30) wordPenalty = 1.0;
  } else if (wordCount > recommendedMax) {
    wordStatus = 'over';
    if (wordCount - recommendedMax > 15) wordPenalty = 0.5;
    if (wordCount - recommendedMax > 30) wordPenalty = 1.0;
  }

  const strengths: string[] = [];
  const improvements: string[] = [];
  const annotatedNotes: Array<{
    targetText: string;
    annotationType: 'format' | 'grammar' | 'vocabulary' | 'praise';
    comment: string;
  }> = [];

  let formatScore = rubricScheme.formatMarks;
  let contentScore = rubricScheme.contentMarks;
  let expressionScore = rubricScheme.expressionMarks;

  const lower = rawText.toLowerCase();

  if (genre === 'notice') {
    // 1. Check for issuing authority
    const firstLines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const hasAuthority = firstLines.length > 0 && firstLines[0].length > 4;
    const hasNoticeWord = /\bNOTICE\b/i.test(rawText);
    const hasDate = /\b(\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/i.test(rawText);
    const hasHeading = firstLines.length >= 3;
    const hasSignatory = firstLines.length >= 5;

    let formatDeductions = 0;
    if (!hasAuthority) {
      formatDeductions += 0.25;
      improvements.push("Missing or unclear Issuing Authority / School name at the very top.");
    } else {
      strengths.push("Clear institutional header / issuing authority identified.");
    }

    if (!hasNoticeWord) {
      formatDeductions += 0.25;
      improvements.push("The keyword 'NOTICE' must be prominently included in capital letters.");
    }

    if (!hasDate) {
      formatDeductions += 0.25;
      improvements.push("Date of issue is missing or not formatted in standard expanded style.");
    } else {
      strengths.push("Date of issuance is clearly specified.");
    }

    if (!hasHeading) {
      formatDeductions += 0.25;
      improvements.push("Include a concise, eye-catching Subject/Heading for the notice.");
    }

    formatScore = Math.max(0, formatScore - formatDeductions);

    // 2. Content 5 Ws inspection
    const mentionsTimeOrDate = /(at\s+\d{1,2}(:\d{2})?\s*(am|pm|hours)|\bon\s+[A-Za-z]+\b|\bdate\b|\btime\b)/i.test(lower);
    const mentionsVenue = /(in\s+the\s+[a-z]+|at\s+the\s+[a-z]+|venue|auditorium|ground|room|hall)/i.test(lower);
    const mentionsContact = /(contact\s+the\s+undersigned|submit\s+names|further\s+details|reach\s+out|interested\s+students)/i.test(lower);
    const mentionsTargetGroup = /(class(es)?\s+[ivxlcdm0-9]+|all\s+students|members|grades)/i.test(lower);

    let contentDeductions = 0;
    if (!mentionsTimeOrDate) {
      contentDeductions += 0.5;
      improvements.push("Specify exact Date and Time of the event (When).");
    }
    if (!mentionsVenue) {
      contentDeductions += 0.5;
      improvements.push("Clarify the exact Venue / Location where the event will take place (Where).");
    }
    if (!mentionsContact) {
      contentDeductions += 0.5;
      improvements.push("Include a clear call to action: Whom to contact or deadline for submission.");
    }
    if (mentionsTimeOrDate && mentionsVenue && mentionsContact) {
      strengths.push("Successfully addresses the essential 5 Ws (What, When, Where, Who, and Contact details).");
    }
    contentScore = Math.max(0.5, contentScore - contentDeductions);

    // 3. Expression & Box Check
    if (wordCount >= 40 && wordCount <= 55) {
      strengths.push("Exemplary brevity! Strictly maintained the 50-word prescribed limit.");
    } else if (wordCount > 60) {
      expressionScore = Math.max(0.5, expressionScore - 0.5);
      improvements.push(`Notice is verbose (${wordCount} words). Prune unnecessary narrative descriptions to keep under 50 words.`);
    }

    if (/\b(i|we|my|our)\b/i.test(rawText)) {
      expressionScore = Math.max(0.5, expressionScore - 0.25);
      annotatedNotes.push({
        targetText: "Personal pronouns (I/We)",
        annotationType: 'grammar',
        comment: "Notices should always adhere to an objective third-person passive style. Replace with 'It is hereby notified that...' or 'Students are informed that...'",
      });
    } else {
      strengths.push("Maintained professional third-person passive perspective.");
    }
  } else {
    // Formal Letter Evaluation
    const hasSenderAddress = rawText.split('\n').slice(0, 4).some((l) => /\d|street|apartments|road|nagar|vihar|delhi|mumbai|chennai|sector/i.test(l));
    const hasExpandedDate = /\b(\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/i.test(rawText);
    const hasReceiver = /the\s+(editor|principal|manager|commissioner|director)/i.test(rawText);
    const hasSubject = /\bsubject\s*[:\-]/i.test(rawText);
    const hasSalutation = /\b(sir|madam|respected\s+sir|dear\s+sir)\b/i.test(lower);
    const hasComplimentaryClose = /\b(yours\s+(sincerely|faithfully|obediently|truly))\b/i.test(lower);

    let formatDeductions = 0;
    if (!hasSenderAddress) {
      formatDeductions += 0.25;
      improvements.push("Sender's address is missing or incomplete at the top.");
    } else {
      strengths.push("Sender's address is correctly placed without preceding name.");
    }

    if (!hasExpandedDate) {
      formatDeductions += 0.25;
      improvements.push("Use the expanded date format (e.g., '14 October 2026') rather than numeric abbreviations.");
    } else {
      strengths.push("Standard expanded date format utilized.");
    }

    if (!hasReceiver) {
      formatDeductions += 0.25;
      improvements.push("Specify receiver's official designation (e.g. 'The Editor', 'The Principal') followed by full address.");
    }

    if (!hasSubject) {
      formatDeductions += 0.25;
      improvements.push("Include a clear 'Subject:' line summarizing the core grievance or purpose in 4-8 words.");
    } else {
      strengths.push("Subject line concisely captures the objective of the letter.");
    }

    if (!hasSalutation) {
      formatDeductions += 0.25;
      improvements.push("Add an appropriate formal salutation ('Sir / Madam').");
    }

    if (!hasComplimentaryClose) {
      formatDeductions += 0.25;
      improvements.push("Conclude with an approved complimentary close ('Yours sincerely' or 'Yours faithfully').");
    } else {
      strengths.push("Complimentary sign-off adheres to formal letter etiquette.");
    }

    formatScore = Math.max(0, formatScore - formatDeductions);

    // Paragraph structure inspection
    const paragraphs = rawText.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
    if (paragraphs.length >= 3) {
      strengths.push("Well-proportioned 3-tier paragraph structure: Hook/Purpose, Elaboration, and Resolution.");
    } else {
      contentScore = Math.max(0.5, contentScore - 0.5);
      improvements.push("Organize the letter body into 3 clear paragraphs: 1) Purpose, 2) Cause & Impact, 3) Actionable remedy.");
    }

    // Formal connectors check
    const connectors = [
      'furthermore',
      'consequently',
      'in light of',
      'therefore',
      'through the columns',
      'request you to',
      'immediate attention',
      'alarming',
      'prompt action',
    ];
    const foundConnectors = connectors.filter((c) => lower.includes(c));
    if (foundConnectors.length >= 2) {
      strengths.push(`Rich formal register with authentic transitional connectors (${foundConnectors.slice(0, 3).join(', ')}).`);
    } else {
      improvements.push("Incorporate formal transitional phrases to elevate the fluency and coherence of arguments.");
    }

    // Check tone
    if (lower.includes('hey') || lower.includes('gonna') || lower.includes('wanna') || lower.includes('pls')) {
      expressionScore = Math.max(0.5, expressionScore - 0.5);
      annotatedNotes.push({
        targetText: "Informal slang/shorthand",
        annotationType: 'vocabulary',
        comment: "Avoid text-speak or casual colloquialisms in formal institutional correspondence.",
      });
    }
  }

  // Calculate total
  const rawTotal = formatScore + contentScore + expressionScore - wordPenalty;
  const totalScore = Math.max(0, Math.min(rubricScheme.totalMarks, Math.round(rawTotal * 2) / 2));
  const maxScore = rubricScheme.totalMarks;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Needs Revision' = 'B';
  if (percentage >= 90) letterGrade = 'A+';
  else if (percentage >= 80) letterGrade = 'A';
  else if (percentage >= 70) letterGrade = 'B+';
  else if (percentage >= 60) letterGrade = 'B';
  else if (percentage >= 50) letterGrade = 'C';
  else letterGrade = 'Needs Revision';

  const criteriaBreakdown = [
    {
      criterion: 'Format' as const,
      scoredMarks: formatScore,
      maxMarks: rubricScheme.formatMarks,
      rubricExpectations: rubricScheme.formatChecklist.slice(0, 3),
      assessedFeedback:
        formatScore === rubricScheme.formatMarks
          ? 'Full marks for format! All structural anchors and layout constraints satisfied.'
          : 'Minor deviations in positioning, date notation, or heading styling.',
    },
    {
      criterion: 'Content' as const,
      scoredMarks: contentScore,
      maxMarks: rubricScheme.contentMarks,
      rubricExpectations: rubricScheme.contentGuidelines.slice(0, 3),
      assessedFeedback:
        contentScore >= rubricScheme.contentMarks - 0.5
          ? 'Comprehensive thematic coverage addressing the key situational prompts and requirements.'
          : 'Certain key situational facts, dates, or actionable remedies require further elaboration.',
    },
    {
      criterion: 'Expression' as const,
      scoredMarks: expressionScore,
      maxMarks: rubricScheme.expressionMarks,
      rubricExpectations: rubricScheme.expressionGuidelines.slice(0, 3),
      assessedFeedback:
        expressionScore >= rubricScheme.expressionMarks - 0.5
          ? 'Fluent, cohesive prose with appropriate formal tone and grammatical dexterity.'
          : 'Opportunity to strengthen sentence variety, tone formality, and passive voice usage.',
    },
  ];

  return {
    totalScore,
    maxScore,
    percentage,
    letterGrade,
    wordCount: {
      actual: wordCount,
      recommendedMin,
      recommendedMax,
      status: wordStatus,
      penalty: wordPenalty,
    },
    criteriaBreakdown,
    strengths: strengths.length > 0 ? strengths : ['Basic structure attempted.'],
    improvements: improvements.length > 0 ? improvements : ['Review minor grammatical nuances for perfection.'],
    annotatedObservations: annotatedNotes,
    overallComments:
      totalScore >= maxScore * 0.85
        ? 'Outstanding composition demonstrating thorough command of curriculum format, succinct vocabulary, and persuasive clarity.'
        : totalScore >= maxScore * 0.65
        ? 'Commendable draft with a solid foundational structure. Address the highlighted format and content recommendations to achieve top-tier marks.'
        : 'Requires structural revision. Focus on ensuring all mandatory format anchors (addresses, dates, salutations, 5 Ws) are systematically in place.',
  };
}
