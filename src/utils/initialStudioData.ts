import { ContentWritingProject, ScriptProject } from '../types';

export const INITIAL_CONTENT_PROJECT: ContentWritingProject = {
  id: 'content-proj-1',
  title: 'Architectural Heritage & Sustainable Urbanism',
  authorName: 'Evelyn Vance',
  brandOrPublication: 'Veritas Longform Review & Architectural Digest',
  editorialGuidelines: 'Deeply researched, elegant prose, authoritative citations, concise subheadings, zero generic marketing buzzwords.',
  activeDocumentId: 'doc-1',
  documents: [
    {
      id: 'doc-1',
      title: 'The Memory of Stone: Adaptive Reuse and the Soul of Historic Facades',
      subtitle: 'Why preserving architectural friction creates more resilient cities than sterile demolition.',
      contentType: 'essay',
      targetAudience: 'Urban planners, architects, cultural historians, and design practitioners',
      primaryKeyword: 'adaptive reuse historic preservation',
      secondaryKeywords: ['urban resilience', 'embodied carbon', 'architectural palimpsest', 'vernacular craft'],
      searchIntent: 'Educational',
      thesisStatement: 'Buildings are not merely spatial containers for human activity; they are material archives whose tactile weathering and historical irregularities provide indispensable psychological grounding in modern cities.',
      outline: [
        {
          id: 'sec-1',
          title: 'I. The Erasure of Tactility in Glass Metropolises',
          keyPoints: ['Homogenization of contemporary commercial architecture', 'The loss of tactile surface variation and sensory feedback'],
          estimatedWords: 400,
        },
        {
          id: 'sec-2',
          title: 'II. Embodied Carbon vs. Embodied Memory',
          keyPoints: ['Material sustainability of stone and timber masonry', 'The psychological cost of erasing civic continuity'],
          estimatedWords: 600,
        },
        {
          id: 'sec-3',
          title: 'III. Case Studies in Symbiotic Intervention',
          keyPoints: ['Scarpa’s Castelvecchio in Verona', 'Chipperfield’s Neues Museum restoration in Berlin'],
          estimatedWords: 750,
        },
        {
          id: 'sec-4',
          title: 'IV. Principles for Contemporary Adaptive Reuse',
          keyPoints: ['Honoring structural scars while integrating accessibility', 'The grammar of contrast between old mortar and new steel'],
          estimatedWords: 500,
        },
      ],
      bodyContent: `Every great city is an involuntary palimpsest—a parchment where centuries of labor, tectonic ambition, and human habit have been inscribed, half-erased, and rewritten. Yet over the past four decades, the prevailing doctrine of commercial real estate development has favored the clean slate: the swift demolition of 19th-century brick warehouses and early modernist civic centers in exchange for hyper-sealed, mirrored glass towers that reflect everything and reveal nothing.

When we demolish a masonry structure, we discard not only its embodied carbon—the hundreds of thousands of gigajoules bound in its lime mortar, quarried granite, and hand-hewn heartpine timbers—we also dismantle the psychological scaffolding of the streetscape. Humans do not experience buildings purely as geometric volumes. We experience them through friction, acoustic warmth, and the visible evidence of time.

Consider Carlo Scarpa's legendary intervention at the Museo di Castelvecchio in Verona. Rather than attempting a sterile faux-historical pastiche or an aggressive brutalist obliteration, Scarpa left jagged gaps between the medieval stone fortifications and his slender concrete brackets. He treated every joint as a sentence break in an architectural conversation. The visitor is never deceived into thinking the 14th century and the 20th century are the same; instead, the tension between them generates an electric, contemplative dignity.

As we confront the dual crises of urban alienation and ecological limits, adaptive reuse cannot be relegated to an aesthetic indulgence for affluent museum wings. It must become the core discipline of sustainable architecture. To preserve an ancient wall is not to worship the past—it is to grant the future a standard of permanence against which to measure its own aspirations.`,
      callToAction: 'Explore the complete Adaptive Reuse Framework and download the civic preservation toolkit for your municipal district.',
      targetWordCount: 2500,
      wordCount: 382,
      readingTimeMinutes: 2,
      status: 'In Review',
      tags: ['Architecture', 'Urbanism', 'Sustainability', 'Cultural Essays'],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-2',
      title: 'Writing Under the Influence of Place: Geopoetics in Contemporary Nonfiction',
      subtitle: 'How landscape topography shapes syntax, paragraph cadence, and narrative pacing.',
      contentType: 'thought_leadership',
      targetAudience: 'Authors, literary critics, and creative nonfiction writers',
      primaryKeyword: 'geopoetics literary nonfiction',
      secondaryKeywords: ['place-based writing', 'prose rhythm', 'landscape psychology'],
      searchIntent: 'Inspirational',
      thesisStatement: 'Prose rhythm is never purely intellectual; it is an acoustic reverberation of the topography in which the writer thinks.',
      outline: [
        {
          id: 'sec-2-1',
          title: 'I. The Cartography of the Sentence',
          keyPoints: ['How flat horizons encourage rolling clauses', 'Mountainous terrain and staccato fragment rhythms'],
          estimatedWords: 450,
        },
        {
          id: 'sec-2-2',
          title: 'II. Sensory Grounding Beyond Visual Clichés',
          keyPoints: ['Acoustic ecology of salt marshes', 'The mineral smell of limestone after rain'],
          estimatedWords: 550,
        },
      ],
      bodyContent: `The writer who sits in a glass high-rise over a six-lane expressway will construct different sentences than the writer who works within earshot of a tidal bore crashing against jagged shale. This is not romantic mysticism; it is an ergonomic and auditory reality.

Landscape conditions the nervous system. In the fens of East Anglia, where the sky claims four-fifths of every sightline, sentences tend to stretch horizontally, carried along by commas like drainage dikes cutting through peat. On the crags of the Scottish Highlands, language turns flinty, monosyllabic, and defensive against the gale. When we teach writing as an abstract arrangement of rules divorced from geographic habitat, we strip prose of its native resonance.`,
      callToAction: 'Read the full craft dossier in the VERITAS Essay Archive.',
      targetWordCount: 1800,
      wordCount: 142,
      readingTimeMinutes: 1,
      status: 'Draft',
      tags: ['Craft of Writing', 'Geopoetics', 'Nonfiction'],
      updatedAt: new Date().toISOString(),
    },
  ],
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
