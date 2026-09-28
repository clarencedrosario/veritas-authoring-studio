import { ContentWritingProject, ScriptProject } from '../types';

export const INITIAL_CONTENT_PROJECT: ContentWritingProject = {
  id: 'content-proj-1',
  title: 'Veritas Newsroom & Professional Copywriting Portfolio',
  authorName: 'Evelyn Vance',
  brandOrPublication: 'Veritas Chronicle & Editorial Press',
  editorialGuidelines: 'High factual accuracy, zero hallucinated sources, active newsroom cadence, distinctive voice modulation, and clear audience targeting.',
  activeDocumentId: 'doc-news-1',
  documents: [
    {
      id: 'doc-news-1',
      title: 'Civic Council Unanimously Approves Historic Tramway Extension Along Heritage Riverfront',
      subtitle: 'Zero-emission transit corridor will link Old Town rail junction to university district by Autumn 2027.',
      contentType: 'news_article',
      category: 'news',
      topic: 'Urban Transit & Historic Heritage Preservation',
      purpose: 'Inform metropolitan commuters, historic district residents, and commercial traders of the approved infrastructure project, construction timeline, and funding breakdown.',
      targetAudience: 'City residents, daily commuters, local business proprietors, and urban transit planners',
      publicationOrPlatform: 'The Morning Herald / Civic Metro Section',
      desiredLength: 650,
      tone: 'Objective, authoritative, and fact-centered journalistic news style',
      language: 'English (UK / Commonwealth Standard)',
      deadline: 'Today, 18:00 BST',
      primaryKeyword: 'historic tramway extension municipal council',
      secondaryKeywords: ['heritage riverfront transit', 'zero-emission light rail', 'infrastructure bond approval'],
      importantFacts: [
        '£48.5 million public-private infrastructure bond ratified 11–0.',
        '4.2-kilometre dual-track extension breaking ground in March 2027.',
        'Preserves 19th-century basalt cobblestones via polymer vibration dampeners.',
        'Projected to cut cross-borough peak vehicular congestion by 22%.'
      ],
      keyMessage: 'A landmark consensus balances modern zero-emission transit needs with rigorous conservation of historic city riverfront stones.',
      callToAction: 'Public consultation hearings for neighbourhood station platforms open this Thursday at City Chambers.',
      referenceMaterial: 'Civic Transport Authority Resolution No. 2026/89B; Environmental Impact Statement Sec 4.',
      authorNotes: 'Confirmed budget and vote tally directly with City Clerk. Quotes verified on record.',
      aiInstructions: 'Write an authoritative news report adhering strictly to the inverted pyramid. Keep lead direct and factual. Never invent statistics or anonymous eyewitnesses.',
      searchIntent: 'Informational',
      thesisStatement: 'The municipal government has finalized approval for a £48.5M historic riverfront tramway extension with construction beginning in spring 2027.',
      newsroom: {
        headline: 'Civic Council Unanimously Approves Historic Tramway Extension Along Heritage Riverfront',
        subheadline: '£48.5M zero-emission link between Old Town and university sector slated for completion by late 2027.',
        slug: 'METRO-RIVERFRONT-TRAM-PASSES',
        byline: 'By Evelyn Vance, Senior Municipal Affairs Correspondent',
        dateline: 'WESTMINSTER, 28 SEP —',
        location: 'Westminster City Chambers',
        section: 'Civic News & Infrastructure',
        desk: 'Metro Affairs',
        wordTarget: 650,
        deadline: '18:00 BST',
        status: 'Fact-Checked',
        who: 'Westminster Metropolitan Council and Department of Urban Transport',
        what: 'Unanimous 11–0 vote approving £48.5M funding for 4.2km electric light-rail corridor',
        when: 'Monday evening session; ground-breaking scheduled March 2027',
        where: 'Westminster Chambers through Old Town Riverbank to St. Jude’s University campus',
        why: 'Relieve chronic road congestion, achieve 2030 municipal net-zero emissions, and restore historic tram connectivity',
        how: 'Funded via 60% regional green bond and 40% central infrastructure co-grant with vibration-absorbing trackbeds',
        lead: 'The Metropolitan Council voted unanimously on Monday night to ratify the long-debated £48.5 million Riverfront Tramway Extension, ending four years of legislative deadlock and paving the way for construction to break ground in early March.',
        nutGraph: 'The 4.2-kilometre zero-emission transit line will restore rail service along the historic cobblestone wharves for the first time since 1958, bridging the gap between the Old Town terminal and the burgeoning university district.',
        mainFacts: [
          'Unanimous 11–0 vote recorded at 20:15 GMT.',
          'Project cost allocated at £48.5M with a 15% contingency reserve.',
          'Total track length: 4.2 kilometres with 8 intermediate low-floor stops.',
          'Projected passenger throughput: 34,000 riders per weekday.'
        ],
        quotes: [
          {
            speaker: 'Marcus Thorne',
            title: 'Council Transport Committee Chairman',
            quote: 'Tonight’s vote proves that a city does not need to pave over its irreplaceable historic texture to deliver rapid, clean transit for the next century.',
            verified: true
          },
          {
            speaker: 'Elena Rostova',
            title: 'Chief Engineer, Riverfront Transit Authority',
            quote: 'By embedding elastomer dampening trays beneath the heritage rails, we protect the fragile 180-year-old river wall foundations from cyclic resonant vibrations.',
            verified: true
          }
        ],
        background: 'The previous municipal administration rejected two earlier proposals in 2022 and 2024 due to heritage wall stability concerns and funding shortfalls.',
        context: 'The approval comes as regional ambient air quality mandates require all metropolitan inner corridors to decrease vehicular carbon output by 30% before 2030.',
        closing: 'Public design hearings regarding individual station canopy aesthetics and pedestrian cycle-lane diversions commence at the Civic Chambers this Thursday at 17:30.',
        standfirst: 'Historic vote ends four years of municipal hesitation as engineers commit to safeguarding 19th-century basalt wharves during 18-month rail laydown.',
        pullQuote: 'A city does not need to pave over its irreplaceable historic texture to deliver rapid, clean transit for the next century.',
        missingInformationFlags: []
      },
      toneConfig: {
        tone: 'Journalistic Newsroom (Factual, Crisp & Objective)',
        formalityLevel: 4,
        readingLevel: 'High School',
        perspective: 'Third Person Objective (He/She/They)',
        emotionalCadence: 'Restrained & Factual'
      },
      savedHeadlines: [
        { id: 'hl-1', headline: 'Historic Riverfront Tramway Secures Final £48.5M Council Nod', category: 'Newspaper', saved: true, score: 96 },
        { id: 'hl-2', headline: 'Old Town to Campus in 12 Minutes: Council Greenlights Heritage Light Rail', category: 'Informative', saved: true, score: 92 },
        { id: 'hl-3', headline: 'Rails Return to the River: How Engineers Won Over Preservationists', category: 'Creative', saved: false, score: 88 }
      ],
      outline: [
        { id: 'sec-1', title: '1. The Lead & Vote Tally', keyPoints: ['Unanimous 11-0 verdict', '£48.5M funding approved', 'March groundbreaking'], estimatedWords: 120 },
        { id: 'sec-2', title: '2. Nut Graph & Route Geometry', keyPoints: ['4.2km dual track', 'Old Town to University link', '34,000 daily riders'], estimatedWords: 150 },
        { id: 'sec-3', title: '3. Technical Engineering Safeguards', keyPoints: ['Elastomer vibration trays', 'Basalt cobblestone preservation', 'River wall integrity'], estimatedWords: 180 },
        { id: 'sec-4', title: '4. Stakeholder Reactions & Public Timeline', keyPoints: ['Quotes from Chairman Thorne and Chief Engineer', 'Thursday public hearing at Chambers'], estimatedWords: 200 }
      ],
      bodyContent: `WESTMINSTER, 28 SEP — The Metropolitan Council voted unanimously on Monday night to ratify the long-debated £48.5 million Riverfront Tramway Extension, ending four years of legislative deadlock and paving the way for construction to break ground in early March.

The 4.2-kilometre zero-emission transit line will restore rail service along the historic cobblestone wharves for the first time since 1958, bridging the gap between the Old Town terminal and the burgeoning university district. Once operational in late 2027, the corridor is projected to transport 34,000 riders daily and divert more than 6,000 private vehicles from congested riverside thoroughfares.

"Tonight’s vote proves that a city does not need to pave over its irreplaceable historic texture to deliver rapid, clean transit for the next century," said Marcus Thorne, Chairman of the Council Transport Committee, addressing reporters following the 11–0 roll-call vote.

A critical breakthrough came after civil engineering consultants resolved longstanding conservation disputes regarding the fragile 180-year-old river revetment wall. Under the finalized engineering blueprint, tracks will rest on specialized sub-ballast elastomer trays that isolate acoustic and physical vibrations from surrounding historic brick structures.

"By embedding elastomer dampening trays beneath the heritage rails, we protect the fragile 180-year-old river wall foundations from cyclic resonant vibrations," confirmed Elena Rostova, Chief Engineer with the Riverfront Transit Authority. Rostova added that original basalt setts removed during trenching will be cleaned, indexed, and hand-relaid flush with the rail surface.

Funding for the capital works will be split between a £29.1 million municipal green infrastructure bond and £19.4 million from central department transport allotments. A mandatory £7.2 million contingency buffer remains ring-fenced against utility relocation overruns.

Public design consultations regarding platform accessibility ramps, tree canopy protection, and integrated bicycle corridors will open this Thursday at 17:30 in the City Chambers. Preliminary utility survey teams are scheduled to commence exploratory borehole drilling along the wharf line on 14 October.`,
      targetWordCount: 650,
      wordCount: 338,
      readingTimeMinutes: 2,
      status: 'In Review',
      tags: ['News', 'Transit', 'Urban Planning', 'City Council'],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-ad-1',
      title: 'St. Jude’s Collegiate Academy — 156 Years of Educational Excellence (Admissions 2027–28)',
      subtitle: 'Display and print newspaper advertisement campaign targeting prospective parents across the metropolitan area.',
      contentType: 'newspaper_ad',
      category: 'advertising',
      topic: 'K–12 Academic Admissions Campaign 2027–28',
      purpose: 'Drive open-house registrations and nursery-through-sixth-form admissions applications for the upcoming academic year.',
      targetAudience: 'Prospective parents, guardians, and families seeking rigorous academic formation and holistic character development',
      publicationOrPlatform: 'Weekend Broadsheet Saturday Magazine / Education Supplement',
      desiredLength: 200,
      tone: 'Prestigious, warm, aspirational, and rigorous without commercial hyperbole',
      language: 'English (UK / Commonwealth Standard)',
      deadline: 'Print Booking Deadline: Wednesday Noon',
      primaryKeyword: 'school admissions collegiate academy 2027',
      secondaryKeywords: ['independent day school', 'scholarship examination', 'holistic pastoral care'],
      importantFacts: [
        'Founded 1871; 156-year heritage of scholarship.',
        '1:9 faculty-to-student ratio; 98% first-choice Russell Group & Ivy League university placement.',
        'Comprehensive 14-acre collegiate campus with STEM observatory and arts centre.',
        'Merit scholarships and means-tested bursaries available for up to 100% of tuition.'
      ],
      keyMessage: 'At St. Jude’s, timeless academic rigor meets contemporary scientific inquiry, nurturing young minds to lead with integrity, wisdom, and purpose.',
      callToAction: 'Reserve your family’s place at our Autumn Open Morning: Saturday, 17 October 2026. Register online at stjudesacademy.org/admissions or call +44 (0) 20 7946 0192.',
      referenceMaterial: 'School Prospectus 2027–28; Examination Board League Tables.',
      authorNotes: 'Ad adheres to ASA and CAP code standards for independent educational establishments. Mandatory registered charity number must appear in footer.',
      aiInstructions: 'Draft persuasive, elegant advertising copy for a full-page newspaper display advertisement. Highlight 156 years of heritage, intellectual discipline, and admissions for 2027–28.',
      searchIntent: 'Commercial',
      thesisStatement: 'St. Jude’s Collegiate Academy offers transformative academic and character education for admissions 2027–28.',
      adSpec: {
        productOrOrg: 'St. Jude’s Collegiate Academy',
        campaignObjective: 'Open Morning Attendance & 2027–28 Admissions Enrolment',
        targetAudience: 'Parents of children aged 4 to 18 seeking academic excellence and character formation',
        mainBenefit: 'An enduring 156-year tradition of intellectual curiosity, moral clarity, and unmatched university entry.',
        keySellingPoints: [
          '98% acceptance to first-choice universities worldwide.',
          '1:9 faculty-student ratio with bespoke academic mentoring.',
          '14-acre campus featuring state-of-the-art laboratory wing and performing arts pavilion.',
          'Generous means-tested bursaries covering up to 100% of fees.'
        ],
        offer: 'Admissions Open for Academic Year 2027–28 — Open Day Registration Complimentary',
        callToAction: 'Register for our Autumn Open Morning: Saturday, 17 October 2026 | www.stjudesacademy.org/admissions',
        contactDetails: 'The Admissions Registrar, St. Jude’s Close, Westminster SW1P 3PB | admissions@stjudesacademy.org | +44 (0) 20 7946 0192',
        mandatoryText: 'St. Jude’s Collegiate Academy is a Registered Educational Charity No. 312849. Co-educational Day School for ages 4–18.',
        formatPreset: 'full_page',
        width: 260,
        height: 340,
        unit: 'mm',
        publication: 'The Saturday Times & Telegraph Education Special',
        tone: 'Prestigious, Inspiring & Warm',
        activeVariantKey: 'A',
        variants: [
          {
            id: 'var-a',
            variantKey: 'A',
            headline: 'Where 156 Years of Scholarship Inspires Tomorrow’s Leaders.',
            subheadline: 'Admissions Open for Kindergarten through Sixth Form — Academic Year 2027–28.',
            tagline: 'Truth. Intellect. Integrity.',
            bodyCopy: 'For more than a century and a half, St. Jude’s Collegiate Academy has stood at the crossroads of academic rigor and character formation. In an accelerating world, we ground young scholars in enduring intellectual habits—fostering analytical clarity in the laboratory, eloquent expression in the humanities, and courage in civic life.\n\nWith a 1:9 faculty ratio, Olympic-grade athletics, and 98% first-choice university placement, we do not merely prepare students for examinations; we prepare them for a life of purpose.',
            keyBenefits: [
              '156 years of continuous academic heritage',
              '98% entry to Russell Group & global universities',
              'Means-tested bursaries up to 100% of fees'
            ],
            callToAction: 'Reserve Your Family’s Place at our Autumn Open Morning: Saturday, 17 October 2026.\nVisit www.stjudesacademy.org/admissions or call +44 (0) 20 7946 0192.'
          },
          {
            id: 'var-b',
            variantKey: 'B',
            headline: 'Not Just an Education. A Foundation for Life.',
            subheadline: 'Discover the St. Jude’s Distinction at our Autumn Open Morning — 17 October 2026.',
            tagline: 'Nurturing Minds. Inspiring Purpose.',
            bodyCopy: 'Every child possesses an innate curiosity waiting to be kindled. At St. Jude’s, our dedicated masters and mentors combine world-class scientific facilities with classical debate, orchestral performance, and competitive sport.\n\nFrom early years discovery to rigorous Sixth Form scholarship, our students learn to question thoughtfully, think independently, and act with unyielding integrity.',
            keyBenefits: [
              'Dedicated tutorial mentoring with 1:9 teacher ratio',
              'Award-winning STEM observatory and creative arts centre',
              'Comprehensive pastoral care and character development'
            ],
            callToAction: 'Admissions Now Open for 2027–28. Book your campus tour today at stjudesacademy.org.'
          },
          {
            id: 'var-c',
            variantKey: 'C',
            headline: 'The Mind Disciplined. The Future Unlocked.',
            subheadline: 'Scholarships & Admissions Open for Academic Year 2027–28.',
            tagline: 'Excellence without Compromise.',
            bodyCopy: 'When deep intellectual curiosity meets dedicated guidance, exceptional futures emerge. St. Jude’s scholars achieve remarkable academic distinctions—yet our greatest pride remains their empathy, ethical resolve, and resilience.\n\nJoin our community of independent thinkers and tomorrow’s pioneers.',
            keyBenefits: [
              'Prestigious 156-year academic track record',
              'Full range of academic, musical, and athletic scholarships',
              'Central metropolitan campus with 14 acres of open grounds'
            ],
            callToAction: 'Explore admissions and register for 17 October Open Day: stjudesacademy.org/visit'
          }
        ]
      },
      toneConfig: {
        tone: 'Prestigious & Warm (Aspirational Educational Tone)',
        formalityLevel: 4,
        readingLevel: 'High School',
        perspective: 'Second Person (You)',
        emotionalCadence: 'Warm & Engaging'
      },
      savedHeadlines: [
        { id: 'ad-hl-1', headline: 'Where 156 Years of Scholarship Inspires Tomorrow’s Leaders', category: 'Advertising', saved: true, score: 95 },
        { id: 'ad-hl-2', headline: 'Not Just an Education. A Foundation for Life.', category: 'Emotional', saved: true, score: 91 },
        { id: 'ad-hl-3', headline: 'The Mind Disciplined. The Future Unlocked.', category: 'Creative', saved: false, score: 87 }
      ],
      outline: [
        { id: 'sec-ad-1', title: '1. Header & Heritage Proposition', keyPoints: ['156-year heritage', 'Timeless scholarship'], estimatedWords: 50 },
        { id: 'sec-ad-2', title: '2. Core Distinction & Proof Points', keyPoints: ['1:9 ratio', 'STEM and humanities synthesis', 'Pastoral care'], estimatedWords: 90 },
        { id: 'sec-ad-3', title: '3. Urgent Call to Action & Open Day', keyPoints: ['October 17 Open Morning', 'Booking URL and telephone number'], estimatedWords: 60 }
      ],
      bodyContent: `WHERE 156 YEARS OF SCHOLARSHIP INSPIRES TOMORROW’S LEADERS.

Admissions Open for Kindergarten through Sixth Form — Academic Year 2027–28.

For more than a century and a half, St. Jude’s Collegiate Academy has stood at the crossroads of academic rigor and character formation. In an accelerating world, we ground young scholars in enduring intellectual habits—fostering analytical clarity in the laboratory, eloquent expression in the humanities, and courage in civic life.

With a 1:9 faculty ratio, Olympic-grade athletics, and 98% first-choice university placement across Russell Group and global institutions, we do not merely prepare students for examinations; we prepare them for a life of purpose.

KEY DISTINCTIONS:
• 156 years of continuous academic heritage and moral stewardship
• 1:9 faculty-to-student mentoring ratio
• 14-acre central collegiate campus with state-of-the-art STEM pavilion
• Generous means-tested bursaries and merit scholarships up to 100% of fees

AUTUMN OPEN MORNING:
Saturday, 17 October 2026 | 09:30 – 13:00
Experience our vibrant classrooms, meet the Headmaster, and tour our historic grounds.

RESERVE YOUR VISIT:
Online: www.stjudesacademy.org/admissions
Admissions Office: +44 (0) 20 7946 0192 | admissions@stjudesacademy.org
The Admissions Registrar, St. Jude’s Close, Westminster SW1P 3PB

St. Jude’s Collegiate Academy is a Registered Educational Charity No. 312849. Co-educational Day School for ages 4–18.`,
      targetWordCount: 220,
      wordCount: 198,
      readingTimeMinutes: 1,
      status: 'Polished',
      tags: ['Advertisement', 'Education', 'Print Ad', 'Admissions'],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-notice-1',
      title: 'Official School Circular: Annual Founders’ Day Celebrations & Sports Exhibition (Advisory)',
      subtitle: 'Mandatory instructions for student reporting times, uniform standards, parking regulations, and parent seating.',
      contentType: 'school_notice',
      category: 'education',
      topic: 'Founders’ Day Logistics & Parent Protocols',
      purpose: 'Provide precise scheduling, dress code requirements, security verification protocols, and event itinerary to all parents and guardians.',
      targetAudience: 'Parents, guardians, staff, and enrolled students of Classes 1 through 12',
      publicationOrPlatform: 'School Parent Portal & Printed Official Circular',
      desiredLength: 450,
      tone: 'Formal, precise, respectful, and authoritative institutional notice',
      language: 'English (UK Standard)',
      deadline: 'Immediate Distribution',
      primaryKeyword: 'school circular founders day sports exhibition',
      secondaryKeywords: ['parent advisory', 'dress code regulations', 'campus gate access'],
      importantFacts: [
        'Event date: Friday, 24 October 2026; Gates open 08:30 AM.',
        'All students must report in full Ceremonial Blazer Uniform by 08:00 AM sharp.',
        'Entry restricted strictly to parents carrying biometric parent RFID ID cards.',
        'Vehicular parking prohibited on St. Jude’s Close; shuttle service operational from Metro Station.'
      ],
      keyMessage: 'Detailed logistical advisory ensuring seamless, dignified, and secure celebration of our 156th Founders’ Day.',
      callToAction: 'Parents are requested to acknowledge receipt via the Veritas Parent App before Wednesday, 22 October 2026.',
      referenceMaterial: 'Institutional Event Calendar 2026–27 Item 4.2.',
      authorNotes: 'Signed under the seal of the Vice-Principal (Administration) and Bursar.',
      aiInstructions: 'Draft an institutional school circular with reference number, date, subject, structured points, and authorized signatory.',
      searchIntent: 'Informational',
      thesisStatement: 'Mandatory operational and security instructions for Founders’ Day on 24 October 2026.',
      schoolNotice: {
        institutionName: 'ST. JUDE’S COLLEGIATE ACADEMY',
        noticeNumber: 'REF: SJCA/ADMIN/CIR-2026/048',
        noticeDate: '28 September 2026',
        targetGroup: 'Parents',
        subjectLine: 'ANNUAL FOUNDERS’ DAY & SPORTS EXHIBITION 2026 — LOGISTICAL ADVISORY',
        actionRequired: 'Acknowledge circular receipt in parent portal and adhere strictly to reporting schedules.',
        authorizedSignatory: 'Dr. Alistair Montgomery',
        signatoryTitle: 'Vice-Principal (Administration) & Dean of Pastoral Care'
      },
      toneConfig: {
        tone: 'Formal Institutional Notice',
        formalityLevel: 5,
        readingLevel: 'High School',
        perspective: 'Third Person Objective (He/She/They)',
        emotionalCadence: 'Restrained & Factual'
      },
      outline: [
        { id: 'sec-not-1', title: '1. Official Header & Subject', keyPoints: ['Reference code', 'Date of issue', 'Subject line'], estimatedWords: 40 },
        { id: 'sec-not-2', title: '2. Student Reporting & Dress Code', keyPoints: ['08:00 AM sharp', 'Ceremonial uniform', 'House badges'], estimatedWords: 120 },
        { id: 'sec-not-3', title: '3. Security, Seating & Transit Guidelines', keyPoints: ['RFID cards mandatory', 'Zero parking zone', 'Metro shuttle'], estimatedWords: 160 },
        { id: 'sec-not-4', title: '4. Programme Schedule & Sign-Off', keyPoints: ['Timeline of march-past and exhibition', 'Authorized signatory'], estimatedWords: 100 }
      ],
      bodyContent: `ST. JUDE’S COLLEGIATE ACADEMY
WESTMINSTER, SW1P 3PB | FOUNDED 1871

REF: SJCA/ADMIN/CIR-2026/048
DATE: 28 September 2026

CIRCULAR TO ALL PARENTS AND GUARDIANS (CLASSES 1 TO 12)

SUBJECT: 156TH ANNUAL FOUNDERS’ DAY & SPORTS EXHIBITION — ARRIVAL SCHEDULE, UNIFORM STANDARDS, AND CAMPUS PROTOCOLS

Dear Parents and Guardians,

The 156th Annual Founders’ Day & Inter-House Sports Exhibition of St. Jude’s Collegiate Academy will be commemorated on Friday, 24 October 2026, on the Main Oval. To ensure the safety, decorum, and punctuality of the proceedings, your strict adherence to the following instructions is requested:

1. STUDENT REPORTING TIME & DRESS PROTOCOL
• All students must report to their designated House Tents no later than 08:00 AM sharp. Late arrivals cannot be permitted into the March-Past contingent.
• Attire: Complete Winter Ceremonial Uniform (Navy Crested Blazer, Pressed White Shirt, House Tie, Charcoal Trousers/Pleated Skirt, and Polished Black Oxfords).
• Participants in track events will be allocated changing quarters in the Sports Pavilion at 09:15 AM under House Master supervision.

2. PARENT ENTRY & SECURITY PROTOCOL
• School Gates 1 & 2 will open for parent seating at 08:30 AM. The March-Past commences precisely at 09:00 AM.
• Security Entry: In accordance with campus safeguarding directives, admittance is restricted strictly to parents presenting their official Parent RFID Identification Badge. Visitors without credentials will be redirected to the Bursar’s Verification Desk.

3. TRAFFIC & PARKING RESTRICTIONS
• St. Jude’s Close will operate as a designated Zero-Idling and Pedestrian-Only corridor between 07:30 AM and 14:00 PM.
• No private vehicular parking is permitted within the campus perimeter. A complimentary round-trip electric shuttle service will run every seven minutes between Westminster Central Underground Station (Exit 4) and the South Gate between 07:45 AM and 13:30 PM.

4. PROGRAMME OVERVIEW
• 09:00 AM: Guard of Honour, Inspection & Inter-House March-Past
• 09:45 AM: Address by the Chairman of the Board of Governors
• 10:15 AM: Track Finals & Gymnastic Vaulting Exhibition
• 12:00 PM: Presentation of the Victor Ludorum & Champion House Trophy
• 12:30 PM: Dispersal under Class Teacher supervision

We anticipate an uplifting celebration of student discipline, camaraderie, and scholastic heritage. Parents are kindly requested to confirm receipt of this circular via the Veritas Parent Portal by Wednesday, 22 October 2026.

Yours faithfully in academic service,

[Official Seal Affixed]

Dr. Alistair Montgomery, MA (Oxon), PhD
Vice-Principal (Administration) & Dean of Pastoral Care
St. Jude’s Collegiate Academy`,
      targetWordCount: 450,
      wordCount: 421,
      readingTimeMinutes: 2,
      status: 'Polished',
      tags: ['Circular', 'Notice', 'School Administration', 'Founders Day'],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-essay-1',
      title: 'The Memory of Stone: Adaptive Reuse and the Soul of Historic Facades',
      subtitle: 'Why preserving architectural friction creates more resilient cities than sterile demolition.',
      contentType: 'essay',
      category: 'other',
      topic: 'Architectural Philosophy & Adaptive Reuse',
      purpose: 'Argue that tactile architectural weathering provides psychological grounding in contemporary urban environments.',
      targetAudience: 'Urban planners, architects, cultural historians, and design practitioners',
      publicationOrPlatform: 'Veritas Longform Review & Architectural Digest',
      desiredLength: 1500,
      tone: 'Reflective, rigorous, evocative literary essay',
      language: 'English (UK / Commonwealth Standard)',
      deadline: 'Next Month',
      primaryKeyword: 'adaptive reuse historic preservation',
      secondaryKeywords: ['urban resilience', 'embodied carbon', 'architectural palimpsest', 'vernacular craft'],
      importantFacts: [
        'Stone and masonry encapsulate decades of embodied carbon.',
        'Carlo Scarpa’s Castelvecchio restoration in Verona illustrates intentional temporal friction.',
        'Demolition wastes up to 300,000 gigajoules per 19th-century warehouse block.'
      ],
      keyMessage: 'Buildings are material archives whose tactile irregularities provide indispensable psychological stability in modern metropolises.',
      callToAction: 'Explore the complete Adaptive Reuse Framework in the Veritas Architectural Dossier.',
      referenceMaterial: 'Scarpa, C. (1964) Architectural Interventions; Ruskin, J. The Seven Lamps of Architecture.',
      authorNotes: 'Focus on prose cadence, sensory balance, and philosophical depth.',
      aiInstructions: 'Draft an evocative philosophical architectural essay. Ensure sentence rhythm alternates between rolling descriptive clauses and punchy declarative insights.',
      searchIntent: 'Educational',
      thesisStatement: 'Buildings are not merely spatial containers for human activity; they are material archives whose tactile weathering provides indispensable psychological grounding.',
      toneConfig: {
        tone: 'Literary & Evocative Essay',
        formalityLevel: 4,
        readingLevel: 'Undergraduate',
        perspective: 'First Person (I/We)',
        emotionalCadence: 'Inspirational'
      },
      savedHeadlines: [
        { id: 'es-hl-1', headline: 'The Memory of Stone: Adaptive Reuse and the Soul of Historic Facades', category: 'Creative', saved: true, score: 94 },
        { id: 'es-hl-2', headline: 'Why Demolishing Old Brick Destroys Civic Psychology', category: 'Curiosity', saved: true, score: 89 }
      ],
      outline: [
        { id: 'sec-1', title: 'I. The Erasure of Tactility in Glass Metropolises', keyPoints: ['Homogenization of commercial architecture', 'The loss of tactile surface variation'], estimatedWords: 350 },
        { id: 'sec-2', title: 'II. Embodied Carbon vs. Embodied Memory', keyPoints: ['Material sustainability of stone masonry', 'Psychological cost of civic amnesia'], estimatedWords: 450 },
        { id: 'sec-3', title: 'III. Case Studies in Symbiotic Intervention', keyPoints: ['Scarpa’s Castelvecchio in Verona', 'Chipperfield’s Neues Museum'], estimatedWords: 500 }
      ],
      bodyContent: `Every great city is an involuntary palimpsest—a parchment where centuries of labor, tectonic ambition, and human habit have been inscribed, half-erased, and rewritten. Yet over the past four decades, the prevailing doctrine of commercial real estate development has favored the clean slate: the swift demolition of 19th-century brick warehouses and early modernist civic centers in exchange for hyper-sealed, mirrored glass towers that reflect everything and reveal nothing.

When we demolish a masonry structure, we discard not only its embodied carbon—the hundreds of thousands of gigajoules bound in its lime mortar, quarried granite, and hand-hewn heartpine timbers—we also dismantle the psychological scaffolding of the streetscape. Humans do not experience buildings purely as geometric volumes. We experience them through friction, acoustic warmth, and the visible evidence of time.

Consider Carlo Scarpa's legendary intervention at the Museo di Castelvecchio in Verona. Rather than attempting a sterile faux-historical pastiche or an aggressive brutalist obliteration, Scarpa left jagged gaps between the medieval stone fortifications and his slender concrete brackets. He treated every joint as a sentence break in an architectural conversation. The visitor is never deceived into thinking the 14th century and the 20th century are the same; instead, the tension between them generates an electric, contemplative dignity.

As we confront the dual crises of urban alienation and ecological limits, adaptive reuse cannot be relegated to an aesthetic indulgence for affluent museum wings. It must become the core discipline of sustainable architecture. To preserve an ancient wall is not to worship the past—it is to grant the future a standard of permanence against which to measure its own aspirations.`,
      targetWordCount: 1500,
      wordCount: 265,
      readingTimeMinutes: 2,
      status: 'In Review',
      tags: ['Architecture', 'Urbanism', 'Sustainability', 'Cultural Essays'],
      updatedAt: new Date().toISOString()
    }
  ]
};

export const INITIAL_SCRIPT_PROJECT: ScriptProject = {
  id: 'script-proj-1',
  title: 'THE ARCHITECT OF ECHOES',
  format: 'Feature Film (Screenplay)',
  logline: 'An architectural conservator tasked with restoring a tide-locked coastal conservatory discovers that its limestone walls rearrange themselves each dusk—etched with the handwriting of his vanished sister.',
  screenwriter: 'Evelyn Vance & Julian Mercer',
  basedOnSource: 'Based on the novel "The Architect of Echoes"',
  actStructure: '3-Act Structure',
  targetPages: 115,
  activeSceneId: 'sc-1',
  characters: [
    {
      id: 'c-julian',
      name: 'JULIAN MERCER',
      description: 'Late 30s. Lean, weathered by coastal winds, wears heavy tweed dusted with lime mortar. Speaks in quiet, measured cadences, observing structural flaws before people.',
      dialogueNotes: 'Economical, subtext-heavy. Rarely raises his voice; precision is his armor.',
    },
    {
      id: 'c-clara',
      name: 'CLARA MERCER',
      description: 'Late 20s. Julian’s younger sister. Architectural draughtswoman who disappeared three years ago. Radiant, obsessive, fiercely brilliant.',
      dialogueNotes: 'Fast, visionary, questioning assumptions with incandescent curiosity.',
    },
    {
      id: 'c-gideon',
      name: 'GIDEON HOLLOWAY',
      description: '60s. Caretaker of Highclere. Hands scarred by salt brine. His cordiality conceals decades of silence.',
      dialogueNotes: 'Deliberate, colloquial coastal rhythm, evasive about the past.',
    },
  ],
  scenes: [
    {
      id: 'sc-1',
      sceneNumber: 1,
      heading: 'EXT. BLACKWATER CAPE - CAUSEWAY - DUSK',
      intExt: 'EXT.',
      setting: 'BLACKWATER CAPE - CAUSEWAY',
      timeOfDay: 'DUSK',
      synopsis: 'Julian drives his battered estate car across the tidal causeway as waves lap against the asphalt.',
      charactersPresent: ['JULIAN MERCER'],
      pageLengthEstimated: 1.5,
      elements: [
        {
          id: 'el-1',
          type: 'scene_heading',
          text: 'EXT. BLACKWATER CAPE - CAUSEWAY - DUSK',
        },
        {
          id: 'el-2',
          type: 'action',
          text: 'Grey Atlantic spray detonates against black basalt boulders. The causeway is a narrow ribbon of pitted tarmac, already drowning beneath the incoming tide.',
        },
        {
          id: 'el-3',
          type: 'action',
          text: 'A vintage Volvo 240 estate crawls through two inches of surging seawater, wipers fighting a relentless sleet.',
        },
        {
          id: 'el-4',
          type: 'scene_heading',
          text: 'INT. VOLVO ESTATE - CONTINUOUS',
        },
        {
          id: 'el-5',
          type: 'action',
          text: 'JULIAN MERCER (38) grips the cracked steering wheel. His knuckles are raw, his coat collar pulled high against the damp chill. On the passenger seat beside him sits a brass plumb-bob, two surveyor’s notebooks, and a framed black-and-white photograph of CLARA.',
        },
        {
          id: 'el-6',
          type: 'action',
          text: 'Through the wiper blade arc, the promontory emerges: HIGHCLERE CONSERVATORY. A cathedral of Victorian iron and salt-scoured glass jutting over the abyss.',
        },
        {
          id: 'el-7',
          type: 'character',
          text: 'JULIAN',
        },
        {
          id: 'el-8',
          type: 'parenthetical',
          text: '(under his breath, checking watch)',
        },
        {
          id: 'el-9',
          type: 'dialogue',
          text: 'High tide in twenty minutes. Cut it close, Julian.',
        },
        {
          id: 'el-10',
          type: 'action',
          text: 'The tires bite gravel as the car crests the headland. Behind him, the causeway disappears beneath a wall of white foam. Cut off.',
        },
        {
          id: 'el-11',
          type: 'transition',
          text: 'DISSOLVE TO:',
        },
      ],
    },
    {
      id: 'sc-2',
      sceneNumber: 2,
      heading: 'INT. HIGHCLERE CONSERVATORY - VESTIBULE - NIGHT',
      intExt: 'INT.',
      setting: 'HIGHCLERE CONSERVATORY - VESTIBULE',
      timeOfDay: 'NIGHT',
      synopsis: 'Julian enters the darkened conservatory and meets Holloway for the first time.',
      charactersPresent: ['JULIAN MERCER', 'GIDEON HOLLOWAY'],
      pageLengthEstimated: 2.2,
      elements: [
        {
          id: 'el-201',
          type: 'scene_heading',
          text: 'INT. HIGHCLERE CONSERVATORY - VESTIBULE - NIGHT',
        },
        {
          id: 'el-202',
          type: 'action',
          text: 'The heavy oak doors boom shut. The sound echoes into an impossibly cavernous interior. Rain drums against miles of overhead glass panes like thousands of tapping fingers.',
        },
        {
          id: 'el-203',
          type: 'action',
          text: 'A storm lantern flares in the shadows. GIDEON HOLLOWAY (65) steps forward, oilskin coat dripping.',
        },
        {
          id: 'el-204',
          type: 'character',
          text: 'HOLLOWAY',
        },
        {
          id: 'el-205',
          type: 'dialogue',
          text: 'You crossed after the warning bell. Most men who value their lungs turn around at the jetty.',
        },
        {
          id: 'el-206',
          type: 'character',
          text: 'JULIAN',
        },
        {
          id: 'el-207',
          type: 'dialogue',
          text: 'The Historic Monuments Trust doesn’t pay me to wait for gentle weather, Mr. Holloway. Where is the western gallery?',
        },
        {
          id: 'el-208',
          type: 'action',
          text: 'Holloway holds up the lantern. The amber glow catches the limestone corridor ahead. The floor joists emit a deep, groaning resonance, like a wooden ship tacking into a gale.',
        },
        {
          id: 'el-209',
          type: 'character',
          text: 'HOLLOWAY',
        },
        {
          id: 'el-210',
          type: 'parenthetical',
          text: '(wry, uneasy smile)',
        },
        {
          id: 'el-211',
          type: 'dialogue',
          text: 'It was on the left this morning. At sunset, it tends to slide behind the chapel vault. Best keep your hands off the mortar until dawn.',
        },
      ],
    },
  ],
};
