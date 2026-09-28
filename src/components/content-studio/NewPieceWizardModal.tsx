import React, { useState } from 'react';
import {
  X,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Newspaper,
  Megaphone,
  Globe,
  Briefcase,
  GraduationCap,
  PenTool,
  CheckCircle2,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import {
  ContentType,
  ContentCategory,
  ContentDocument,
  AdFormatPreset,
  AdDimensionUnit,
} from '../../types';
import {
  CONTENT_TYPE_CATEGORIES,
  CONTENT_TYPE_REGISTRY,
  AD_FORMAT_PRESETS,
} from './constants';

interface NewPieceWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePiece: (newDoc: ContentDocument, generateInitialDraftWithAi?: boolean) => Promise<void> | void;
  isDarkMode: boolean;
}

export const NewPieceWizardModal: React.FC<NewPieceWizardModalProps> = ({
  isOpen,
  onClose,
  onCreatePiece,
  isDarkMode,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType>('news_article');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Step 2 Core Brief Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [topic, setTopic] = useState('');
  const [purpose, setPurpose] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [publicationOrPlatform, setPublicationOrPlatform] = useState('');
  const [desiredLength, setDesiredLength] = useState<number>(650);
  const [tone, setTone] = useState('Professional & Objective');
  const [language, setLanguage] = useState('English (UK / Commonwealth Standard)');
  const [deadline, setDeadline] = useState('Immediate / This Week');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [importantFacts, setImportantFacts] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [referenceMaterial, setReferenceMaterial] = useState('');
  const [authorNotes, setAuthorNotes] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');

  // Specialized News Fields
  const [newsHeadline, setNewsHeadline] = useState('');
  const [newsDateline, setNewsDateline] = useState('LONDON, 28 SEP —');
  const [newsLocation, setNewsLocation] = useState('');
  const [newsDesk, setNewsDesk] = useState('Metro Affairs');
  const [newsSection, setNewsSection] = useState('Page 1 / Lead');
  const [newsWho, setNewsWho] = useState('');
  const [newsWhat, setNewsWhat] = useState('');
  const [newsWhen, setNewsWhen] = useState('');
  const [newsWhere, setNewsWhere] = useState('');
  const [newsWhy, setNewsWhy] = useState('');
  const [newsHow, setNewsHow] = useState('');
  const [newsQuotes, setNewsQuotes] = useState('');

  // Specialized Feature Fields
  const [featureCentralAngle, setFeatureCentralAngle] = useState('');
  const [featureOpeningHook, setFeatureOpeningHook] = useState('');
  const [featureClosingDirection, setFeatureClosingDirection] = useState('');

  // Specialized Ad Fields
  const [adProductOrOrg, setAdProductOrOrg] = useState('');
  const [adCampaignObjective, setAdCampaignObjective] = useState('');
  const [adMainBenefit, setAdMainBenefit] = useState('');
  const [adKeySellingPoints, setAdKeySellingPoints] = useState('');
  const [adOffer, setAdOffer] = useState('');
  const [adContactDetails, setAdContactDetails] = useState('');
  const [adMandatoryText, setAdMandatoryText] = useState('');
  const [adFormatPreset, setAdFormatPreset] = useState<AdFormatPreset>('full_page');
  const [adWidth, setAdWidth] = useState<number>(260);
  const [adHeight, setAdHeight] = useState<number>(340);
  const [adUnit, setAdUnit] = useState<AdDimensionUnit>('mm');

  // Specialized Press Release Fields
  const [prOrganisation, setPrOrganisation] = useState('');
  const [prAnnouncement, setPrAnnouncement] = useState('');
  const [prReleaseDate, setPrReleaseDate] = useState('FOR IMMEDIATE RELEASE');
  const [prLocation, setPrLocation] = useState('');
  const [prMediaContact, setPrMediaContact] = useState('');

  // Specialized Social Media Fields
  const [socialPlatform, setSocialPlatform] = useState<'LinkedIn' | 'Twitter/X' | 'Instagram' | 'Facebook' | 'Threads' | 'YouTube Community' | 'Multi-Platform'>('LinkedIn');
  const [socialObjective, setSocialObjective] = useState('Thought Leadership & Engagement');
  const [socialCaptionLength, setSocialCaptionLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [socialHashtags, setSocialHashtags] = useState('');
  const [socialCampaignTheme, setSocialCampaignTheme] = useState('');

  // Specialized Institutional Notice Fields
  const [noticeOrgName, setNoticeOrgName] = useState('');
  const [noticeRefNumber, setNoticeRefNumber] = useState('');
  const [noticeTargetGroup, setNoticeTargetGroup] = useState<'Parents' | 'Students' | 'Staff' | 'General Public' | 'All Stakeholders'>('Parents');
  const [noticeActionRequired, setNoticeActionRequired] = useState('');
  const [noticeSignatory, setNoticeSignatory] = useState('');

  if (!isOpen) return null;

  // Filter content types
  const filteredTypes = CONTENT_TYPE_REGISTRY.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedDescriptor = CONTENT_TYPE_REGISTRY.find((d) => d.type === selectedType) || CONTENT_TYPE_REGISTRY[0];

  const handleSelectTypeAndAdvance = (type: ContentType) => {
    setSelectedType(type);
    const descriptor = CONTENT_TYPE_REGISTRY.find((d) => d.type === type);
    if (descriptor) {
      if (!title) setTitle(`New ${descriptor.title}`);
      if (descriptor.category === 'news') {
        setDesiredLength(650);
        setTone('Objective, fact-centered journalistic style');
      } else if (descriptor.category === 'advertising') {
        setDesiredLength(250);
        setTone('Persuasive, prestigious, and benefit-driven');
      } else if (descriptor.category === 'education') {
        setDesiredLength(400);
        setTone('Formal, precise institutional notice');
      }
    }
    setStep(2);
  };

  const handleFormatPresetChange = (presetId: AdFormatPreset) => {
    setAdFormatPreset(presetId);
    const preset = AD_FORMAT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setAdWidth(preset.width);
      setAdHeight(preset.height);
      setAdUnit(preset.unit);
    }
  };

  const handleCreateDocument = async (generateInitialDraftWithAi: boolean) => {
    const newDocId = `doc-${Date.now()}`;
    const desc = CONTENT_TYPE_REGISTRY.find((d) => d.type === selectedType) || CONTENT_TYPE_REGISTRY[0];

    const factsList = importantFacts
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const docTitle = title.trim() || `Untitled ${desc.title}`;
    const docSubtitle = subtitle.trim() || desc.shortDesc;

    // Build specialized state blocks
    const newsroomBlock =
      desc.category === 'news'
        ? {
            headline: newsHeadline || docTitle,
            subheadline: docSubtitle,
            slug: docTitle.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 32),
            byline: 'By Editorial Staff',
            dateline: newsDateline || 'WESTMINSTER —',
            location: newsLocation || 'City Pressroom',
            section: newsSection || 'Metro & Civic',
            desk: newsDesk || 'General Desk',
            wordTarget: desiredLength || 650,
            deadline: deadline || 'Today',
            status: 'Draft' as const,
            who: newsWho || '',
            what: newsWhat || topic || docTitle,
            when: newsWhen || '',
            where: newsWhere || newsLocation || '',
            why: newsWhy || purpose || '',
            how: newsHow || '',
            lead: newsWhat ? `The ${newsWho || 'authorities'} announced ${newsWhat} during recent proceedings.` : '',
            nutGraph: keyMessage || purpose || '',
            mainFacts: factsList,
            quotes: newsQuotes
              ? [
                  {
                    speaker: 'Official Spokesperson',
                    title: 'Authority Representative',
                    quote: newsQuotes,
                    verified: true,
                  },
                ]
              : [],
            background: referenceMaterial || '',
            context: authorNotes || '',
            closing: callToAction || '',
            standfirst: docSubtitle,
            pullQuote: keyMessage || '',
            missingInformationFlags: [],
          }
        : undefined;

    const adSpecBlock =
      desc.category === 'advertising'
        ? {
            productOrOrg: adProductOrOrg || docTitle,
            campaignObjective: adCampaignObjective || purpose || 'Lead Generation',
            targetAudience: targetAudience || 'Target Consumers',
            mainBenefit: adMainBenefit || keyMessage || '',
            keySellingPoints: adKeySellingPoints
              ? adKeySellingPoints.split('\n').map((s) => s.trim()).filter(Boolean)
              : factsList,
            offer: adOffer || 'Admissions & Inquiries Now Open',
            callToAction: callToAction || 'Visit our website or call our office today.',
            contactDetails: adContactDetails || 'Telephone & Website contact info',
            mandatoryText: adMandatoryText || 'Terms and conditions apply. Registered entity.',
            formatPreset: adFormatPreset,
            width: adWidth,
            height: adHeight,
            unit: adUnit,
            publication: publicationOrPlatform || 'Broadsheet Daily',
            tone: tone || 'Prestigious & Persuasive',
            activeVariantKey: 'A' as const,
            variants: [
              {
                id: 'var-a',
                variantKey: 'A' as const,
                headline: docTitle,
                subheadline: docSubtitle,
                tagline: adMainBenefit ? `${adMainBenefit}.` : 'Excellence in Action.',
                bodyCopy: `Discover how our dedicated team delivers unmatched results. Grounded in tradition, forward-looking in vision.`,
                keyBenefits: ['Distinguished track record', 'Bespoke individual attention', 'Recognized excellence'],
                callToAction: callToAction || 'Reserve your place today.',
              },
            ],
          }
        : undefined;

    const pressReleaseBlock =
      selectedType === 'press_release' || selectedType === 'media_statement'
        ? {
            organisation: prOrganisation || adProductOrOrg || 'Organisation',
            announcement: prAnnouncement || docTitle,
            releaseDate: prReleaseDate || 'FOR IMMEDIATE RELEASE',
            releaseLocation: prLocation || newsLocation || 'Westminster',
            keyFacts: factsList,
            spokespersonQuote: newsQuotes || '',
            boilerplate: authorNotes || 'About the Organisation: Founded with a commitment to excellence.',
            mediaContactName: prMediaContact || 'Media Relations Officer',
            mediaContactEmail: 'press@organization.org',
            mediaContactPhone: '+44 (0) 20 7946 0000',
          }
        : undefined;

    const socialMediaBlock =
      desc.category === 'digital' && (selectedType === 'social_media_post' || selectedType === 'social_media_campaign' || selectedType === 'caption')
        ? {
            platform: socialPlatform,
            objective: socialObjective,
            audience: targetAudience || 'Followers & Industry Network',
            captionLength: socialCaptionLength,
            hashtags: socialHashtags ? socialHashtags.split(/\s+/).map((h) => h.startsWith('#') ? h : `#${h}`) : ['#Veritas', '#Insights'],
            callToAction: callToAction || 'Share your thoughts in the comments.',
            campaignTheme: socialCampaignTheme || topic || 'Thought Leadership',
          }
        : undefined;

    const schoolNoticeBlock =
      desc.category === 'education'
        ? {
            institutionName: noticeOrgName || 'ST. JUDE’S COLLEGIATE ACADEMY',
            noticeNumber: noticeRefNumber || `REF: SJCA/ADMIN/CIR-${new Date().getFullYear()}/049`,
            noticeDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            targetGroup: noticeTargetGroup,
            subjectLine: docTitle.toUpperCase(),
            actionRequired: noticeActionRequired || 'Review instructions and acknowledge receipt.',
            authorizedSignatory: noticeSignatory || 'Head of Administration',
            signatoryTitle: 'Dean of Institutional Affairs',
          }
        : undefined;

    const newDoc: ContentDocument = {
      id: newDocId,
      title: docTitle,
      subtitle: docSubtitle,
      contentType: selectedType,
      category: desc.category,
      topic: topic || docTitle,
      purpose: purpose || 'Communicate key information effectively.',
      targetAudience: targetAudience || 'General Audience',
      publicationOrPlatform: publicationOrPlatform || 'Editorial Publication',
      desiredLength: Number(desiredLength) || 500,
      tone: tone || 'Professional',
      language: language || 'English',
      deadline: deadline || 'This Week',
      primaryKeyword: primaryKeyword || '',
      secondaryKeywords: secondaryKeywords ? secondaryKeywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
      importantFacts: factsList,
      keyMessage: keyMessage || '',
      callToAction: callToAction || '',
      referenceMaterial: referenceMaterial || '',
      authorNotes: authorNotes || '',
      aiInstructions: aiInstructions || '',
      searchIntent: 'Informational',
      thesisStatement: keyMessage || purpose || 'Provide structured, verifiable information with clarity.',
      newsroom: newsroomBlock,
      adSpec: adSpecBlock,
      pressRelease: pressReleaseBlock,
      socialMedia: socialMediaBlock,
      schoolNotice: schoolNoticeBlock,
      toneConfig: {
        tone: tone || 'Professional & Objective',
        formalityLevel: desc.category === 'education' || desc.category === 'corporate' ? 4 : 3,
        readingLevel: 'High School',
        perspective: desc.category === 'news' ? 'Third Person Objective (He/She/They)' : 'First Person (I/We)',
        emotionalCadence: desc.category === 'news' ? 'Restrained & Factual' : 'Warm & Engaging',
      },
      outline: [
        {
          id: 'sec-1',
          title: 'I. Lead Hook & Context Anchor',
          keyPoints: ['Establish the focal theme', 'Introduce key actors and core premise'],
          estimatedWords: Math.round(desiredLength * 0.25),
        },
        {
          id: 'sec-2',
          title: 'II. Central Development & Evidence',
          keyPoints: ['Detail key facts, proof points, or narrative arc', 'Address implications and context'],
          estimatedWords: Math.round(desiredLength * 0.5),
        },
        {
          id: 'sec-3',
          title: 'III. Synthesis & Action Directive',
          keyPoints: ['Summarize the core takeaway', 'Present closing call to action'],
          estimatedWords: Math.round(desiredLength * 0.25),
        },
      ],
      bodyContent: '',
      targetWordCount: desiredLength || 500,
      wordCount: 0,
      readingTimeMinutes: 1,
      status: 'Draft',
      tags: [desc.category.toUpperCase(), desc.title],
      updatedAt: new Date().toISOString(),
    };

    console.log("[ContentAI] Generate clicked");
    // Ensure brief data is immutably captured before wizard state is reset (Step 6)
    const briefForGeneration: ContentDocument = { ...newDoc };
    console.log("[ContentAI] Brief received:", {
      title: briefForGeneration.title,
      contentType: briefForGeneration.contentType,
      topic: briefForGeneration.topic,
      facts: briefForGeneration.importantFacts,
      audience: briefForGeneration.targetAudience,
      desiredLength: briefForGeneration.desiredLength,
    });

    if (generateInitialDraftWithAi) {
      setIsGenerating(true);
      setGenerationError(null);
      try {
        await onCreatePiece(briefForGeneration, true);
        onClose();
      } catch (err: any) {
        const errorMsg = err?.message || err?.toString() || "Unknown error generating piece";
        console.error("[ContentAI] Gemini generation failed:", errorMsg);
        setGenerationError(errorMsg);
      } finally {
        setIsGenerating(false);
      }
    } else {
      onCreatePiece(briefForGeneration, false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#292521] dark:text-[#F6F0E7]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-base shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                  New Content Creation Wizard
                </span>
                <span>&bull;</span>
                <span className="font-medium text-[#71685E] dark:text-[#c9b9a6]">
                  Step {step} of 2: {step === 1 ? 'Select Content Format' : 'Configure Writing Brief'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                {step === 1 ? 'What are you writing today?' : `Professional Brief: ${selectedDescriptor.title}`}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-xl text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/30 dark:hover:bg-[#4d1e2e]/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ==================================================== */}
          {/* STEP 1: SELECT CONTENT TYPE */}
          {/* ==================================================== */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Category Pills & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Category tabs */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                        : 'bg-[#EDE4D6] dark:bg-[#200b14] text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50'
                    }`}
                  >
                    All Categories ({CONTENT_TYPE_REGISTRY.length})
                  </button>
                  {CONTENT_TYPE_CATEGORIES.map((cat) => {
                    const count = CONTENT_TYPE_REGISTRY.filter((i) => i.category === cat.id).length;
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                          isActive
                            ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                            : 'bg-[#EDE4D6] dark:bg-[#200b14] text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="text-[10px] font-mono opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-[#71685E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 35+ content formats..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E]"
                  />
                </div>
              </div>

              {/* Grid of Content Types */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredTypes.map((item) => {
                  const isSelected = selectedType === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setSelectedType(item.type)}
                      onDoubleClick={() => handleSelectTypeAndAdvance(item.type)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2.5 relative ${
                        isSelected
                          ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#EDE4D6] dark:bg-[#2b101c] ring-2 ring-[#5A1832]/20 dark:ring-[#C29A52]/20 shadow-md'
                          : 'border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] hover:border-[#9A7438] hover:bg-[#EDE4D6]/70 dark:hover:bg-[#280d19]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                              isSelected
                                ? 'bg-[#5A1832] text-[#F6F0E7]'
                                : 'bg-[#EDE4D6] dark:bg-[#2b101c] text-[#9A7438] dark:text-[#C29A52]'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                            {item.title}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                        )}
                      </div>

                      <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-[#CBBEAC]/40 dark:border-[#4d1e2e]">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                          {item.badge}
                        </span>
                        <span className="text-[10.5px] font-medium text-[#71685E] dark:text-[#a89989] capitalize">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: PROFESSIONAL CONTENT BRIEF */}
          {/* ==================================================== */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Type summary banner */}
              <div className="p-3.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#C29A52] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                      Selected Format: {selectedDescriptor.category.toUpperCase()}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                      {selectedDescriptor.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold hover:bg-[#F6F0E7] dark:hover:bg-[#2b101c]"
                >
                  Change Format
                </button>
              </div>

              {/* Natural-Language AI Instructions Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EDE4D6] to-[#F6F0E7] dark:from-[#200b14] dark:to-[#2b101c] border-2 border-[#9A7438]/50 dark:border-[#C29A52]/50 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Write Instructions to AI (Natural Language)</span>
                  </label>
                  <span className="text-[11px] text-[#71685E] dark:text-[#a89989]">
                    Natural direction for AI synthesis
                  </span>
                </div>
                <textarea
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  rows={3}
                  placeholder={`e.g. "Write a 500-word newspaper report about the school's annual sports day. Keep it factual and professional without exaggeration." or "Create newspaper advertisement copy for school admissions. Highlight 156 years of excellence and admissions for 2027–28."`}
                  className="w-full p-3 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs leading-relaxed outline-none text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] resize-none"
                />
              </div>

              {/* Core Brief Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Title / Working Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Civic Council Approves Riverfront Light Rail Corridor..."
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Topic / Subject Focus
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Urban Light Rail Transit & Historic Wall Preservation"
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Commuters, local residents, traders, municipal taxpayers..."
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Publication / Platform
                  </label>
                  <input
                    type="text"
                    value={publicationOrPlatform}
                    onChange={(e) => setPublicationOrPlatform(e.target.value)}
                    placeholder="e.g. The Morning Herald / Saturday Broadsheet / School Portal"
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Desired Word Count
                  </label>
                  <input
                    type="number"
                    value={desiredLength}
                    onChange={(e) => setDesiredLength(Number(e.target.value) || 500)}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Tone & Voice
                  </label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="e.g. Objective, authoritative, prestigious, urgent..."
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>
              </div>

              {/* SMART CONTENT-SPECIFIC FORM BLOCKS */}

              {/* 1. NEWS & JOURNALISM SMART FIELDS */}
              {selectedDescriptor.category === 'news' && (
                <div className="p-4 rounded-2xl bg-[#EDE4D6]/70 dark:bg-[#200b14]/70 border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-4">
                  <div className="flex items-center space-x-2">
                    <Newspaper className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
                    <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                      Newsroom & 5W1H Journalistic Fields
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Dateline
                      </label>
                      <input
                        type="text"
                        value={newsDateline}
                        onChange={(e) => setNewsDateline(e.target.value)}
                        placeholder="e.g. WESTMINSTER, 28 SEP —"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Desk / Section
                      </label>
                      <input
                        type="text"
                        value={newsDesk}
                        onChange={(e) => setNewsDesk(e.target.value)}
                        placeholder="Metro / National / Editorial"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Location / Chamber
                      </label>
                      <input
                        type="text"
                        value={newsLocation}
                        onChange={(e) => setNewsLocation(e.target.value)}
                        placeholder="e.g. City Chambers"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* 5W1H Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                        WHO? (Actors/Officials)
                      </label>
                      <input
                        type="text"
                        value={newsWho}
                        onChange={(e) => setNewsWho(e.target.value)}
                        placeholder="e.g. Metropolitan Council & Transport Board"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                        WHAT? (Core Action/Verdict)
                      </label>
                      <input
                        type="text"
                        value={newsWhat}
                        onChange={(e) => setNewsWhat(e.target.value)}
                        placeholder="e.g. Voted 11-0 to approve £48.5M tram extension"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                        WHEN? (Time/Date)
                      </label>
                      <input
                        type="text"
                        value={newsWhen}
                        onChange={(e) => setNewsWhen(e.target.value)}
                        placeholder="e.g. Monday evening; works begin March"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                        WHERE? (Precise Geography)
                      </label>
                      <input
                        type="text"
                        value={newsWhere}
                        onChange={(e) => setNewsWhere(e.target.value)}
                        placeholder="e.g. 4.2km riverfront line from Old Town to Campus"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                        WHY? (Causal Rationale)
                      </label>
                      <input
                        type="text"
                        value={newsWhy}
                        onChange={(e) => setNewsWhy(e.target.value)}
                        placeholder="e.g. Relieve peak vehicle congestion, hit 2030 net-zero"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                        HOW? (Funding/Method)
                      </label>
                      <input
                        type="text"
                        value={newsHow}
                        onChange={(e) => setNewsHow(e.target.value)}
                        placeholder="e.g. Green bonds + vibration-absorbing elastomer trays"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                      Verified Quotes on Record (Never Invent Quotes!)
                    </label>
                    <textarea
                      value={newsQuotes}
                      onChange={(e) => setNewsQuotes(e.target.value)}
                      rows={2}
                      placeholder={`e.g. "Tonight’s vote proves that a city does not need to pave over its irreplaceable historic texture..." — Marcus Thorne, Transport Chair`}
                      className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 2. ADVERTISING & MARKETING SMART FIELDS */}
              {selectedDescriptor.category === 'advertising' && (
                <div className="p-4 rounded-2xl bg-[#EDE4D6]/70 dark:bg-[#200b14]/70 border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-4">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
                    <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                      Advertising Specifications & Publication Dimensions
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Product / Organisation
                      </label>
                      <input
                        type="text"
                        value={adProductOrOrg}
                        onChange={(e) => setAdProductOrOrg(e.target.value)}
                        placeholder="e.g. St. Jude’s Collegiate Academy"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Campaign Objective
                      </label>
                      <input
                        type="text"
                        value={adCampaignObjective}
                        onChange={(e) => setAdCampaignObjective(e.target.value)}
                        placeholder="e.g. Admissions 2027–28 & Open Day Bookings"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Offer / Incentive
                      </label>
                      <input
                        type="text"
                        value={adOffer}
                        onChange={(e) => setAdOffer(e.target.value)}
                        placeholder="e.g. Admissions Open / Scholarships Available up to 100%"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Format Presets */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Ad Format Preset
                      </label>
                      <select
                        value={adFormatPreset}
                        onChange={(e) => handleFormatPresetChange(e.target.value as AdFormatPreset)}
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none cursor-pointer"
                      >
                        {AD_FORMAT_PRESETS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label} ({p.width}×{p.height} {p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        value={adWidth}
                        onChange={(e) => setAdWidth(Number(e.target.value) || 0)}
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        value={adHeight}
                        onChange={(e) => setAdHeight(Number(e.target.value) || 0)}
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Unit
                      </label>
                      <select
                        value={adUnit}
                        onChange={(e) => setAdUnit(e.target.value as AdDimensionUnit)}
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none cursor-pointer"
                      >
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="inches">inches</option>
                        <option value="pixels">pixels</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Key Selling Points (1 per line)
                      </label>
                      <textarea
                        value={adKeySellingPoints}
                        onChange={(e) => setAdKeySellingPoints(e.target.value)}
                        rows={2}
                        placeholder={`156 years of continuous scholarship\n1:9 faculty-student ratio\n98% university acceptance`}
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Contact Details & Mandatory Legal Copy
                      </label>
                      <textarea
                        value={adMandatoryText}
                        onChange={(e) => setAdMandatoryText(e.target.value)}
                        rows={2}
                        placeholder="Registered Charity No. 312849 | Admissions: +44 (0) 20 7946 0192 | stjudesacademy.org"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. EDUCATION / INSTITUTIONAL NOTICES SMART FIELDS */}
              {selectedDescriptor.category === 'education' && (
                <div className="p-4 rounded-2xl bg-[#EDE4D6]/70 dark:bg-[#200b14]/70 border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
                    <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                      School Administration & Official Notice Fields
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={noticeOrgName}
                        onChange={(e) => setNoticeOrgName(e.target.value)}
                        placeholder="e.g. St. Jude’s Collegiate Academy"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Notice / Circular Ref No.
                      </label>
                      <input
                        type="text"
                        value={noticeRefNumber}
                        onChange={(e) => setNoticeRefNumber(e.target.value)}
                        placeholder="REF: SJCA/ADMIN/CIR-2026/049"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Target Group
                      </label>
                      <select
                        value={noticeTargetGroup}
                        onChange={(e) => setNoticeTargetGroup(e.target.value as any)}
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none cursor-pointer"
                      >
                        <option value="Parents">Parents & Guardians</option>
                        <option value="Students">Enrolled Students</option>
                        <option value="Staff">Faculty & Staff</option>
                        <option value="General Public">General Public</option>
                        <option value="All Stakeholders">All Community Stakeholders</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Action Required from Recipient
                      </label>
                      <input
                        type="text"
                        value={noticeActionRequired}
                        onChange={(e) => setNoticeActionRequired(e.target.value)}
                        placeholder="e.g. Acknowledge in parent portal; report in winter uniform by 08:00 AM"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                        Authorized Signatory & Title
                      </label>
                      <input
                        type="text"
                        value={noticeSignatory}
                        onChange={(e) => setNoticeSignatory(e.target.value)}
                        placeholder="e.g. Dr. Alistair Montgomery, Vice-Principal"
                        className="w-full p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Facts, Message & CTA */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Important Facts & Verified Data Points (1 per line)
                  </label>
                  <textarea
                    value={importantFacts}
                    onChange={(e) => setImportantFacts(e.target.value)}
                    rows={3}
                    placeholder={`e.g.\n• £48.5M infrastructure funding ratified unanimously 11-0\n• Groundbreaking scheduled for March 2027\n• 4.2km total route length`}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                      Key Takeaway / Core Message
                    </label>
                    <input
                      type="text"
                      value={keyMessage}
                      onChange={(e) => setKeyMessage(e.target.value)}
                      placeholder="The central message the reader should remember..."
                      className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                      Call to Action (CTA)
                    </label>
                    <input
                      type="text"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      placeholder="e.g. Register for open house / Attend public consultation..."
                      className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {step === 1 ? (
            <>
              <div className="text-xs text-[#71685E] dark:text-[#c9b9a6] flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-[#9A7438]" />
                <span>Double-click any card or click Next to configure brief</span>
              </div>
              <button
                onClick={() => handleSelectTypeAndAdvance(selectedType)}
                className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-2 shadow-xs"
              >
                <span>Continue to Content Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {generationError && (
                <div className="w-full mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center justify-between shadow-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">AI generation failed:</span>
                    <span>{generationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGenerationError(null)}
                    className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 rounded text-xs font-semibold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold hover:bg-[#F6F0E7] dark:hover:bg-[#2b101c] flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Formats</span>
              </button>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => handleCreateDocument(false)}
                  disabled={isGenerating}
                  className="px-4 py-2.5 rounded-xl border border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] text-xs font-bold hover:bg-[#5A1832]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Blank Workspace
                </button>
                <button
                  onClick={() => handleCreateDocument(true)}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-2 shadow-xs disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Generating article with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create & Generate Draft with AI</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
