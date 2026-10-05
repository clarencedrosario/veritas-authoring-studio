import { ContentWritingProject, ScriptProject } from '../types';

export const INITIAL_CONTENT_PROJECT: ContentWritingProject = {
  id: "content-proj-1",
  title: "Content Writing Project",
  authorName: "",
  brandOrPublication: "",
  editorialGuidelines: "",
  documents: [],
  activeDocumentId: "",
  researchNotes: [],
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
