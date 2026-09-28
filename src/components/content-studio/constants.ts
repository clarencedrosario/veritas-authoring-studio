import {
  ContentType,
  ContentCategory,
  AdFormatPreset,
  AdDimensionUnit,
} from '../../types';

export interface ContentTypeDescriptor {
  type: ContentType;
  category: ContentCategory;
  title: string;
  shortDesc: string;
  badge: string;
  iconName: string;
}

export const CONTENT_TYPE_CATEGORIES: Array<{
  id: ContentCategory;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'news',
    label: 'News & Journalism',
    description: 'Articles, news reports, investigative pieces, and editorial columns',
    icon: 'Newspaper',
  },
  {
    id: 'advertising',
    label: 'Advertising & Marketing',
    description: 'Print ads, display banners, classifieds, promotional flyers, and brochures',
    icon: 'Megaphone',
  },
  {
    id: 'digital',
    label: 'Digital Content',
    description: 'Blog posts, SEO articles, landing pages, and social media campaigns',
    icon: 'Globe',
  },
  {
    id: 'corporate',
    label: 'Corporate & PR',
    description: 'Press releases, media announcements, newsletters, and thought leadership',
    icon: 'Briefcase',
  },
  {
    id: 'education',
    label: 'Education & Institutional',
    description: 'School circulars, notices, admission campaigns, and institutional prospectuses',
    icon: 'GraduationCap',
  },
  {
    id: 'other',
    label: 'Other & Custom',
    description: 'Speeches, scripts, research essays, and custom creative compositions',
    icon: 'PenTool',
  },
];

export const CONTENT_TYPE_REGISTRY: ContentTypeDescriptor[] = [
  // 1. NEWS & JOURNALISM
  {
    type: 'news_article',
    category: 'news',
    title: 'News Article',
    shortDesc: 'Objective, inverted-pyramid news coverage with 5W1H structure and verified quotes.',
    badge: 'Wire & Broadsheet',
    iconName: 'FileText',
  },
  {
    type: 'news_report',
    category: 'news',
    title: 'News Report',
    shortDesc: 'Timely situational dispatch detailing breaking civic, economic, or event developments.',
    badge: 'On-the-ground',
    iconName: 'Radio',
  },
  {
    type: 'feature_article',
    category: 'news',
    title: 'Feature Article',
    shortDesc: 'In-depth narrative storytelling exploring human interest, cultural trends, and context.',
    badge: 'Narrative Journalism',
    iconName: 'BookOpen',
  },
  {
    type: 'editorial',
    category: 'news',
    title: 'Editorial',
    shortDesc: 'Authoritative board commentary presenting a principled perspective on public issues.',
    badge: 'Editorial Board',
    iconName: 'Feather',
  },
  {
    type: 'opinion_oped',
    category: 'news',
    title: 'Opinion / Op-Ed',
    shortDesc: 'Compelling guest column arguing an original thesis with rigorous supporting logic.',
    badge: 'Perspectives',
    iconName: 'MessageSquare',
  },
  {
    type: 'column',
    category: 'news',
    title: 'Column',
    shortDesc: 'Regular authored dispatch featuring personal voice, domain expertise, and style.',
    badge: 'Commentary',
    iconName: 'UserCheck',
  },
  {
    type: 'interview',
    category: 'news',
    title: 'Interview',
    shortDesc: 'Q&A format capturing dialogue, cadence, and insights from distinguished figures.',
    badge: 'Dialogue',
    iconName: 'Mic',
  },
  {
    type: 'profile',
    category: 'news',
    title: 'Profile',
    shortDesc: 'Biographical study illuminating an individual’s achievements, character, and vision.',
    badge: 'Character Study',
    iconName: 'User',
  },
  {
    type: 'review',
    category: 'news',
    title: 'Review',
    shortDesc: 'Critical assessment of books, exhibitions, theatre, architecture, or creative works.',
    badge: 'Criticism',
    iconName: 'Star',
  },
  {
    type: 'investigative_article',
    category: 'news',
    title: 'Investigative Article',
    shortDesc: 'Rigorous deep-dive based on public records, interviews, data, and source vetting.',
    badge: 'Deep Investigation',
    iconName: 'Search',
  },

  // 2. ADVERTISING & MARKETING
  {
    type: 'newspaper_ad',
    category: 'advertising',
    title: 'Newspaper Advertisement',
    shortDesc: 'Print broadsheet advertisement with bold headline, structured body, and direct CTA.',
    badge: 'Print Broadsheet',
    iconName: 'Layout',
  },
  {
    type: 'display_ad',
    category: 'advertising',
    title: 'Display Advertisement',
    shortDesc: 'Visual layout copy crafted to stop scanners and communicate key benefits quickly.',
    badge: 'Commercial Display',
    iconName: 'Image',
  },
  {
    type: 'classified_ad',
    category: 'advertising',
    title: 'Classified Advertisement',
    shortDesc: 'High-density, concise text advertisement adhering to strict word and line limits.',
    badge: 'Classifieds',
    iconName: 'AlignLeft',
  },
  {
    type: 'promotional_copy',
    category: 'advertising',
    title: 'Promotional Copy',
    shortDesc: 'Persuasive marketing copy highlighting seasonal promotions, offers, and value.',
    badge: 'Promotions',
    iconName: 'Sparkles',
  },
  {
    type: 'brochure',
    category: 'advertising',
    title: 'Brochure',
    shortDesc: 'Tri-fold or multi-page booklet copy communicating comprehensive brand offerings.',
    badge: 'Collateral',
    iconName: 'Book',
  },
  {
    type: 'flyer',
    category: 'advertising',
    title: 'Flyer',
    shortDesc: 'Single-sheet promotional flyer copy designed for immediate impact and action.',
    badge: 'Handout',
    iconName: 'File',
  },
  {
    type: 'poster_copy',
    category: 'advertising',
    title: 'Poster Copy',
    shortDesc: 'High-visibility display copy with arresting headlines and memorable taglines.',
    badge: 'Display Poster',
    iconName: 'Monitor',
  },
  {
    type: 'product_ad',
    category: 'advertising',
    title: 'Product Advertisement',
    shortDesc: 'Feature-to-benefit commercial copy driving customer interest and purchase intent.',
    badge: 'Product Marketing',
    iconName: 'Tag',
  },
  {
    type: 'campaign_copy',
    category: 'advertising',
    title: 'Campaign Copy',
    shortDesc: 'Multi-touch advertising copy orchestrated around a unified campaign narrative.',
    badge: 'Campaign',
    iconName: 'Target',
  },
  {
    type: 'sales_copy',
    category: 'advertising',
    title: 'Sales Copy',
    shortDesc: 'High-conversion persuasive copy systematically addressing objections and driving action.',
    badge: 'Direct Response',
    iconName: 'TrendingUp',
  },

  // 3. DIGITAL CONTENT
  {
    type: 'blog_article',
    category: 'digital',
    title: 'Blog Article',
    shortDesc: 'Engaging, readable digital article crafted for web readers and community engagement.',
    badge: 'Digital Web',
    iconName: 'Bookmark',
  },
  {
    type: 'seo_article',
    category: 'digital',
    title: 'SEO Article',
    shortDesc: 'Search-optimized authoritative article balancing keyword intent and reader value.',
    badge: 'Search Optimized',
    iconName: 'Compass',
  },
  {
    type: 'website_copy',
    category: 'digital',
    title: 'Website Copy',
    shortDesc: 'Clear, compelling web page copy tailored for headers, value propositions, and UX.',
    badge: 'Web UX',
    iconName: 'Globe',
  },
  {
    type: 'landing_page',
    category: 'digital',
    title: 'Landing Page',
    shortDesc: 'Structured high-converting landing page copy with hero, proof points, and CTAs.',
    badge: 'Conversion',
    iconName: 'Layers',
  },
  {
    type: 'social_media_post',
    category: 'digital',
    title: 'Social Media Post',
    shortDesc: 'Punchy, platform-optimized post formatted with hooks, spacing, and call to engagement.',
    badge: 'Social Post',
    iconName: 'Share2',
  },
  {
    type: 'social_media_campaign',
    category: 'digital',
    title: 'Social Media Campaign',
    shortDesc: 'Sequence of cohesive social posts scheduled around a brand milestone or theme.',
    badge: 'Social Series',
    iconName: 'Grid',
  },
  {
    type: 'caption',
    category: 'digital',
    title: 'Caption',
    shortDesc: 'Brevity-focused photo, infographic, or video captions that contextualize visual media.',
    badge: 'Micro-Copy',
    iconName: 'Type',
  },
  {
    type: 'product_description',
    category: 'digital',
    title: 'Product Description',
    shortDesc: 'E-commerce and catalogue descriptions highlighting specifications and craftsmanship.',
    badge: 'Catalogue',
    iconName: 'ShoppingBag',
  },

  // 4. CORPORATE & PR
  {
    type: 'press_release',
    category: 'corporate',
    title: 'Press Release',
    shortDesc: 'Standard AP-style corporate announcement for immediate distribution to wire and media.',
    badge: 'Wire Dispatch',
    iconName: 'Send',
  },
  {
    type: 'media_statement',
    category: 'corporate',
    title: 'Media Statement',
    shortDesc: 'Concise, carefully vetted institutional statement addressing a specific public inquiry.',
    badge: 'Official Press',
    iconName: 'Shield',
  },
  {
    type: 'newsletter',
    category: 'corporate',
    title: 'Newsletter',
    shortDesc: 'Curated periodic briefing keeping subscribers, alumni, or partners informed.',
    badge: 'Dispatch',
    iconName: 'Mail',
  },
  {
    type: 'company_announcement',
    category: 'corporate',
    title: 'Company Announcement',
    shortDesc: 'Internal or external communication detailing strategic milestones or leadership changes.',
    badge: 'Internal / External',
    iconName: 'Bell',
  },
  {
    type: 'corporate_article',
    category: 'corporate',
    title: 'Corporate Article',
    shortDesc: 'Longform company publication celebrating institutional history, innovation, and culture.',
    badge: 'Corporate Press',
    iconName: 'Building',
  },
  {
    type: 'thought_leadership',
    category: 'corporate',
    title: 'Thought Leadership',
    shortDesc: 'Forward-looking essay establishing strategic authority in an industry or field.',
    badge: 'Executive Brief',
    iconName: 'Award',
  },
  {
    type: 'email_campaign',
    category: 'corporate',
    title: 'Email Campaign',
    shortDesc: 'Direct-to-inbox copy designed with compelling subject lines and clear calls to action.',
    badge: 'Email Dispatch',
    iconName: 'Inbox',
  },

  // 5. EDUCATION & INSTITUTIONAL
  {
    type: 'school_notice',
    category: 'education',
    title: 'School Notice',
    shortDesc: 'Official institutional advisory communicating schedules, regulations, and updates.',
    badge: 'School Admin',
    iconName: 'FileCheck',
  },
  {
    type: 'circular',
    category: 'education',
    title: 'Circular',
    shortDesc: 'Formal numbered advisory distributed to parents, staff, or examination candidates.',
    badge: 'Official Advisory',
    iconName: 'FileText',
  },
  {
    type: 'school_newsletter_article',
    category: 'education',
    title: 'School Newsletter Article',
    shortDesc: 'Celebratory community story recounting sports days, debates, academic laurels, and arts.',
    badge: 'School Community',
    iconName: 'Smile',
  },
  {
    type: 'admission_ad',
    category: 'education',
    title: 'Admission Advertisement',
    shortDesc: 'Targeted campaign copy promoting admissions, open houses, and scholarship exams.',
    badge: 'Admissions 2027',
    iconName: 'GraduationCap',
  },
  {
    type: 'event_promotion',
    category: 'education',
    title: 'Event Promotion',
    shortDesc: 'Inviting copy for inter-school exhibitions, annual days, seminars, and concerts.',
    badge: 'Event Copy',
    iconName: 'Calendar',
  },
  {
    type: 'institutional_profile',
    category: 'education',
    title: 'Institutional Profile',
    shortDesc: 'Comprehensive historical and academic overview of a school, university, or foundation.',
    badge: 'Heritage',
    iconName: 'Archive',
  },
  {
    type: 'prospectus_copy',
    category: 'education',
    title: 'Prospectus Copy',
    shortDesc: 'Polished catalogue copy detailing vision, pastoral care, curriculum, and admissions.',
    badge: 'Prospectus',
    iconName: 'Folder',
  },

  // 6. OTHER
  {
    type: 'speech',
    category: 'other',
    title: 'Speech',
    shortDesc: 'Oratory crafted for oral delivery with rhythmic pauses, cadence, and rhetorical power.',
    badge: 'Oratory',
    iconName: 'Volume2',
  },
  {
    type: 'script',
    category: 'other',
    title: 'Script',
    shortDesc: 'Audiovisual, promotional video, or documentary script with visual & audio cues.',
    badge: 'Screen & AV',
    iconName: 'Film',
  },
  {
    type: 'research_essay',
    category: 'other',
    title: 'Research Essay',
    shortDesc: 'Rigorously annotated scholarly investigation synthesizing empirical evidence and theory.',
    badge: 'Scholarly',
    iconName: 'Bookmark',
  },
  {
    type: 'custom_content',
    category: 'other',
    title: 'Custom Content',
    shortDesc: 'Blank professional canvas with customized brief parameters for specialized commissions.',
    badge: 'Custom Studio',
    iconName: 'PenTool',
  },
];

export const AD_FORMAT_PRESETS: Array<{
  id: AdFormatPreset;
  label: string;
  width: number;
  height: number;
  unit: AdDimensionUnit;
  aspectDesc: string;
}> = [
  { id: 'full_page', label: 'Full Page Broadsheet', width: 260, height: 340, unit: 'mm', aspectDesc: 'Standard broadsheet full page' },
  { id: 'half_page', label: 'Half Page (Horizontal)', width: 260, height: 170, unit: 'mm', aspectDesc: 'Half page horizontal banner' },
  { id: 'quarter_page', label: 'Quarter Page', width: 130, height: 170, unit: 'mm', aspectDesc: 'Corner display quarter page' },
  { id: 'column_ad', label: '2-Column Advertisement', width: 85, height: 200, unit: 'mm', aspectDesc: 'Vertical 2-column strip' },
  { id: 'digital_banner', label: 'Digital Banner (Desktop)', width: 1200, height: 628, unit: 'pixels', aspectDesc: '1.91:1 Social / Display' },
  { id: 'leaderboard', label: 'Leaderboard Banner', width: 728, height: 90, unit: 'pixels', aspectDesc: '8:1 Top of page display' },
  { id: 'square', label: 'Square Post / Ad', width: 1080, height: 1080, unit: 'pixels', aspectDesc: '1:1 Square visual' },
  { id: 'portrait', label: 'Portrait Story / Banner', width: 1080, height: 1920, unit: 'pixels', aspectDesc: '9:16 Vertical mobile' },
  { id: 'skyscraper', label: 'Skyscraper Banner', width: 160, height: 600, unit: 'pixels', aspectDesc: 'Sidebar skyscraper' },
  { id: 'custom', label: 'Custom Dimensions', width: 200, height: 200, unit: 'mm', aspectDesc: 'Custom dimensions' },
];

export const HUMANISE_STYLE_PRESETS = [
  { id: 'light_polish', label: 'Light Polish', desc: 'Subtle cadence tuning and removal of stiff phrasings' },
  { id: 'natural', label: 'Natural', desc: 'Organic human cadence with balanced sentence-length variation' },
  { id: 'professional', label: 'Professional', desc: 'Clear, balanced, executive-grade syntax' },
  { id: 'conversational', label: 'Conversational', desc: 'Warm, direct, spoken-language naturalness' },
  { id: 'journalistic', label: 'Journalistic', desc: 'Crisp inverted-pyramid style with strong verbs and zero fluff' },
  { id: 'editorial', label: 'Editorial', desc: 'Authoritative, resonant prose with thoughtful rhetorical pauses' },
  { id: 'persuasive', label: 'Persuasive', desc: 'Compelling momentum, active voice, and decisive cadence' },
  { id: 'academic', label: 'Academic', desc: 'Intellectual depth, nuanced vocabulary, and scholarly precision' },
  { id: 'warm', label: 'Warm', desc: 'Empathetic, approachable, community-oriented warmth' },
  { id: 'concise', label: 'Concise', desc: 'Lean, punchy, high-impact phrasing stripped of excess' },
];

export const HEADLINE_LAB_CATEGORIES = [
  'All',
  'Straight',
  'Informative',
  'Creative',
  'Emotional',
  'Professional',
  'Curiosity',
  'SEO',
  'Newspaper',
  'Magazine',
  'Advertising',
] as const;
