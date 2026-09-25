import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  generatePedagogicalWritingAction,
  generatePedagogicalChapterDraft,
  generatePedagogicalHumanizedText,
} from "./src/utils/pedagogicalFallback";
import {
  buildAcademicAiPromptContext,
  cleanMarkdownSyntax,
  cleanHeadingTitle,
  getPedagogicalClassProfile,
  getCurriculumBoardProfile,
  parseClassLevelNumber,
  cleanLeakedEditorialTerms,
  sanitizeContentStrippingRationale,
} from "./src/utils/pedagogicalProfileSystem";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// In-memory store for Cloud Sync, Version Snapshots, and Audit Logs
interface CloudProjectPayload {
  projectId: string;
  encryptedData: string; // E2EE cipher payload
  iv: string;
  version: number;
  author: string;
  authorEmail?: string;
  timestamp: string;
  metadata: {
    title: string;
    wordCount: number;
    chapterCount: number;
    characterCount: number;
  };
  auditLog: Array<{
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
  }>;
}

const cloudStorage: Record<string, CloudProjectPayload[]> = {};
const globalAuditLogs: Array<{
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}> = [];

// Helper for Gemini AI client
function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// Live API capabilities & metadata
app.get("/api/live/info", (_req, res) => {
  res.json({
    model: "gemini-3.8-live",
    supportedVoices: ["Zephyr", "Puck", "Charon", "Kore", "Fenrir"],
    defaultVoice: "Zephyr",
    inputSampleRate: 16000,
    outputSampleRate: 24000,
    hasKey: !!process.env.GEMINI_API_KEY,
  });
});

// Fallback Voice & Chat Companion API (for when WebSocket / Live API is unavailable or quota limited)
app.post("/api/gemini/companion-chat", async (req, res) => {
  try {
    const { message, context, projectInfo, voiceName } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGenAI();
    let replyText = "";

    if (ai) {
      try {
        const prompt = `You are an expressive, encouraging creative writing companion and grammar mentor for the Novel Organizer & Humanized Writer studio.
Voice Persona: ${voiceName || "Zephyr"} (Warm, thoughtful, articulate, conversational).
Context: ${context || projectInfo || "Creative drafting and language authoring"}.

User says: "${message}"

Provide an engaging, helpful, and natural spoken response (2 to 4 sentences). Keep it concise, direct, and conversational so it sounds great spoken aloud. Avoid markdown symbols or asterisks if possible.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.8,
            maxOutputTokens: 300,
          },
        });
        replyText = response.text?.trim() || "";
      } catch (aiErr: any) {
        console.warn("Companion AI generation fallback:", aiErr?.message);
      }
    }

    // High-quality contextual fallback if Gemini is offline or credits are depleted
    if (!replyText) {
      const lower = message.toLowerCase();
      if (lower.includes("sensory") || lower.includes("storm") || lower.includes("scene")) {
        replyText = "Consider anchoring the scene with sharp sensory shifts: the smell of ozone cutting through warm pine, the sudden percussion of hail against zinc roof tiles, and the abrupt dropping of temperature in the room.";
      } else if (lower.includes("antagonist") || lower.includes("character") || lower.includes("flaw")) {
        replyText = "An antagonist bound by extreme loyalty makes for powerful drama because their villainy stems from conviction rather than cruelty. Let their loyalty force them into tragic dilemmas where they betray their own humanity to protect a cause.";
      } else if (lower.includes("sentence") || lower.includes("compound") || lower.includes("complex") || lower.includes("grammar")) {
        replyText = "A simple sentence carries a single independent thought. A compound sentence connects two balanced independent clauses with a coordinator like 'and' or 'but'. A complex sentence introduces subordination, giving weight to the main clause while the dependent clause frames time, condition, or reason.";
      } else {
        replyText = `I hear you. That is a compelling creative thread. In your next passage, try opening with an unexpected physical motion or sensory contrast to pull the reader right into the scene's emotional core.`;
      }
    }

    return res.json({ reply: replyText, model: "gemini-3.8-flash" });
  } catch (err: any) {
    console.warn("Companion chat endpoint error:", err?.message || err);
    return res.json({
      reply: "That sounds like a great direction. Focus on high sentence variance and concrete sensory details as you draft your next scene.",
      fallback: true,
    });
  }
});

// 1. Humanized Drafting & Voice Consistency API with Full Fiction Continuity & Author Voice
app.post("/api/gemini/draft", async (req, res) => {
  try {
    const {
      prompt,
      currentText,
      mode, // NovelAIActionType
      styleProfile,
      authorVoiceProfile,
      chapterTitle,
      sceneGoal,
      characters,
      pov,
      continuityContext,
      selectedSnippet,
    } = req.body;

    const charactersInfo = Array.isArray(characters)
      ? characters.map((c: any) => `${c.name} (${c.role || "Character"}): ${c.personality || c.voiceNotes || ""}`).join("; ")
      : "";

    // Author Voice Profile Directives
    const voiceProfile = authorVoiceProfile || {
      proseDensity: styleProfile?.sensoryLevel === 'Dense & Visceral' ? 'Dense' : 'Balanced',
      sentenceRhythm: styleProfile?.burstinessLevel === 'Extreme Organic' ? 'Varied & Syncopated' : 'Balanced Classical',
      dialogueStyle: styleProfile?.dialogueStyle || 'Naturalistic & Indirect',
      descriptionLevel: styleProfile?.sensoryLevel === 'Dense & Visceral' ? 'Rich & Atmospheric' : 'Selective Anchors',
      vocabularyLevel: 'Elevated & Nuanced',
      narrativeDistance: 'Deep Close POV',
      preferredPov: pov || 'Third Person Limited',
      tone: styleProfile?.tone || 'Grounded, tactile, psychologically alert',
      pacing: styleProfile?.pacingPreference || 'Measured & Deliberate',
      recurringPreferences: styleProfile?.bannedWords ? [`Banned clichés: ${styleProfile.bannedWords.slice(0, 8).join(', ')}`] : [],
      customVoiceNotes: '',
    };

    // Continuity Intelligence Block
    const continuityBlock = continuityContext ? `
CONTINUITY INTELLIGENCE (PREVENT FICTION CONTRADICTIONS):
- POV Character: ${continuityContext.activePovCharacter ? `${continuityContext.activePovCharacter.name} — Voice: ${continuityContext.activePovCharacter.voiceNotes || 'Standard'}` : (pov || 'Third Person Limited')}
- Characters Present in Scene: ${continuityContext.activeCharacters?.map((c: any) => `${c.name} (${c.personality || 'Present'})`).join(', ') || charactersInfo || 'None specified'}
- Scene Setting & Time: ${continuityContext.location || 'Current scene setting'} &bull; ${continuityContext.timePeriod || continuityContext.timelineMilestone || 'Present timeline milestone'}
- Scene Objective / Conflict: ${continuityContext.sceneGoal || sceneGoal || 'Advance chapter arc'} &mdash; Conflict: ${continuityContext.sceneConflict || 'Internal/external tension'}
- Unresolved Story Threads: ${continuityContext.unresolvedThreads?.join('; ') || 'Follow active manuscript arc'}
- Plot Beat Position: ${continuityContext.plotArc || 'Developing arc'}
${continuityContext.previousSceneSnippet ? `- Preceding Narrative Beats:\n"${continuityContext.previousSceneSnippet.slice(-300)}"` : ''}
` : '';

    const humanWritingRules = `
CRITICAL AUTHOR VOICE & FICTION CRAFT DIRECTIVES:
- Author Voice Profile:
  - Prose Density: ${voiceProfile.proseDensity}
  - Sentence Rhythm: ${voiceProfile.sentenceRhythm} (drastically modulate cadence between staccato thought beats and rolling descriptive clauses)
  - Dialogue Style: ${voiceProfile.dialogueStyle} (prioritize subtext, natural interruptions, micro-actions, avoid informational infodumping)
  - Description Level: ${voiceProfile.descriptionLevel} (anchor in concrete tactile, olfactory, thermal, and auditory textures)
  - Vocabulary Level: ${voiceProfile.vocabularyLevel}
  - Narrative Distance: ${voiceProfile.narrativeDistance}
  - Tone & Atmosphere: ${voiceProfile.tone}
  - Pacing: ${voiceProfile.pacing}
  ${voiceProfile.recurringPreferences?.length ? `- Specific Preferences: ${voiceProfile.recurringPreferences.join('; ')}` : ''}
  ${voiceProfile.customVoiceNotes ? `- Voice Notes: ${voiceProfile.customVoiceNotes}` : ''}
- BANNED FORMULAIC PHRASINGS: Do NOT use "rich tapestry", "testament to", "delve", "intertwined", "palpable tension", "moreover", "furthermore", "it is important to remember", "a symphony of", "navigating the", or "little did they know".
- PRESERVE AUTHOR INTENT: Keep the core dramatic premise, character motivations, and narrative trajectory intact.

${continuityBlock}
`;

    let systemInstruction = humanWritingRules;
    let userPrompt = "";

    const textToWorkWith = selectedSnippet && selectedSnippet.trim().length > 0 ? selectedSnippet : currentText;

    switch (mode) {
      case "humanize":
        userPrompt = `Refine and humanize the following manuscript excerpt to match the Author Voice Profile. Improve natural prose rhythm, sentence-length variation, paragraph variation, specificity, emotional nuance, dialogue naturalness, and transitions while removing formulaic or repetitive phrasing. Preserve the author's intended meaning unless substantive rewriting was requested.\n\nOriginal Text:\n"${textToWorkWith}"\n\nWriter's guidance: ${prompt || "Preserve authentic author voice."}`;
        break;

      case "continue":
        userPrompt = `Draft the next sequence of narrative prose continuing seamlessly from the current manuscript. Follow the strict Author Voice Profile and Continuity Intelligence directives.\n\nExisting passage prior to continuation:\n"${textToWorkWith ? textToWorkWith.slice(-1200) : "Beginning of scene"}"\n\nWriter's guidance note: ${prompt || "Advance the scene naturally with dramatic momentum."}`;
        break;

      case "draft_scene":
        userPrompt = `Draft a complete novel scene based on the scene objective and outline.\n\nScene Goal: ${sceneGoal || "Advance the narrative"}\nChapter: ${chapterTitle || "Active Chapter"}\nGuidance: ${prompt || "Bring the scene alive with high sensory detail and distinct character cadences."}`;
        break;

      case "rewrite":
        userPrompt = `Rewrite the following excerpt according to the author's directive, strictly maintaining the Author Voice Profile.\n\nText:\n"${textToWorkWith}"\n\nDirective: ${prompt || "Rewrite with heightened emotional clarity and tighter syntax."}`;
        break;

      case "expand":
        userPrompt = `Expand the following passage, deepening the sensory immersion, interiority, and subtextual reactions without adding fluff or filler.\n\nText to expand:\n"${textToWorkWith}"\n\nGuidance: ${prompt || "Deepen the emotional and physical texture of the moment."}`;
        break;

      case "shorten":
        userPrompt = `Shorten and tighten the following passage. Strip away redundant adverbs, tautologies, and slow transitions while preserving every drop of dramatic tension and character voice.\n\nText to tighten:\n"${textToWorkWith}"\n\nGuidance: ${prompt || "Make it punchy, lean, and urgent."}`;
        break;

      case "improve_description":
        userPrompt = `Enhance the physical and atmospheric description in this passage. Ground the scene in distinctive visual, tactile, and spatial details appropriate to the setting.\n\nText:\n"${textToWorkWith}"\n\nGuidance: ${prompt || "Avoid generic purple prose; focus on concrete world-building textures."}`;
        break;

      case "deepen_sensory":
        userPrompt = `Deepen the tactile, olfactory, thermal, and auditory textures in this scene. Make the reader experience the weight, cold, scents, and acoustics of the room.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "improve_dialogue":
        userPrompt = `Polish the dialogue in this excerpt. Ensure each character speaks in their established cadence. Inject realistic subtext, conversational hesitation, interruptions, and character-specific syntax. Strip out artificial exposition.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "character_voice":
        userPrompt = `Audit and calibrate the character voices in this passage. Ensure the active POV character and speaking characters adhere strictly to their established speech patterns, vocabulary, and quirks.\n\nText:\n"${textToWorkWith}"\n\nGuidance: ${prompt || "Sharpen distinct vocal identities."}`;
        break;

      case "increase_tension":
        userPrompt = `Heighten the dramatic or psychological tension in this passage. Shorten sentence lengths, sharpen sensory awareness, and introduce stakes or ticking-clock pressure.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "reduce_tension":
        userPrompt = `Decompress this passage into a contemplative, restorative narrative pause. Allow characters space to breathe, reflect, and observe their surroundings.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "improve_pacing":
      case "vary_pacing":
        userPrompt = `Rewrite the following prose specifically focusing on narrative PACING and BURSTINESS. Introduce stark contrasts between staccato action/thought beats and languid sensory pauses to mimic true organic author rhythm.\n\nText to modulate:\n"${textToWorkWith}"`;
        break;

      case "show_not_tell":
        userPrompt = `Transform narrative exposition in this passage into visceral 'showing'. Convert emotional summaries into concrete physical reactions, micro-actions, and environmental resonance.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "strengthen_opening":
        userPrompt = `Strengthen the opening sentences of this scene. Create an immediate, unforgettable hook that anchors the reader in time, space, and dramatic intrigue without clumsy exposition.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "strengthen_ending":
        userPrompt = `Strengthen the ending of this scene. Formulate a poignant closing beat, lingering image, or suspenseful revelation that compels the reader into the next chapter.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "scene_alternatives":
        userPrompt = `Provide 3 distinct creative alternatives for where this scene can go next, each exploring a different dramatic direction (e.g. sudden revelation, unexpected obstacle, character confrontation).\n\nCurrent Scene Context:\n"${textToWorkWith}"`;
        break;

      case "check_pov":
        userPrompt = `Check this passage for POV consistency. Identify any 'head-hopping', omniscient narrator slips, or violations of ${pov || "Third Person Limited"}. Provide specific corrections.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "check_character":
        userPrompt = `Check this passage for character consistency. Highlight any behavior, speech, or reaction that conflicts with established character profiles or relationships.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "check_timeline":
        userPrompt = `Audit this scene for timeline continuity. Ensure elapsed hours, weather conditions, injuries, and preceding events match the established timeline.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "suggest_plot":
        userPrompt = `Analyze the current scene and suggest 3 high-impact plot development twists or complications that tie back to unresolved story threads.\n\nScene Context:\n"${textToWorkWith}"`;
        break;

      case "critique":
        userPrompt = `Perform a comprehensive editorial craft critique of this scene. Evaluate: 1) Pacing & Burstiness, 2) POV Discipline, 3) Character Subtext, 4) Sensory Grounding, and 5) Continuity. Provide constructive, specific recommendations.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "continuity":
        userPrompt = `Audit this scene against the novel's continuity context. Report on: 1) Character status & location consistency, 2) Timeline alignment, 3) Unresolved threads referenced, and 4) Any discrepancies.\n\nText:\n"${textToWorkWith}"`;
        break;

      case "research":
        userPrompt = `Provide historical, geographical, architectural, or sensory reference notes for the author's query: "${prompt}". Keep the response practical for a novelist, emphasizing concrete sensory textures and authentic terminology.`;
        break;

      default:
        userPrompt = `Draft the next sequence of narrative prose continuing seamlessly from the current manuscript.\n\nPassage:\n"${textToWorkWith ? textToWorkWith.slice(-1200) : "Beginning of scene"}"\n\nGuidance: ${prompt || "Write the next scene naturally."}`;
        break;
    }

    const ai = getGenAI();
    let resultText = "";

    if (!ai && mode === "humanize") {
      return res.status(503).json({
        error: "Humanise could not be completed. Your original text is unchanged.",
      });
    }

    const effectiveClassLevel = req.body?.classLevel || "Class 6";
    const effectiveBoard = req.body?.board || "CISCE";
    const effectiveTitle = chapterTitle || req.body?.title || "Textbook Manuscript";

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `${systemInstruction}\n\n${userPrompt}`,
          config: {
            temperature: 0.85,
            topP: 0.95,
          },
        });
        resultText = response.text || "";
      } catch (geminiError: any) {
        console.log("Gemini draft error, switching to pedagogical engine fallback:", geminiError?.message || geminiError);
        if (mode === "humanize") {
          resultText = generatePedagogicalHumanizedText(
            textToWorkWith,
            "natural",
            effectiveClassLevel,
            effectiveBoard,
            effectiveTitle
          );
        } else {
          resultText = cleanMarkdownSyntax(
            generatePedagogicalWritingAction(
              "continue_writing",
              effectiveTitle,
              "",
              effectiveClassLevel,
              effectiveBoard,
              "English Language & Grammar",
              textToWorkWith,
              prompt
            ).result
          );
        }
      }
    } else {
      if (mode === "humanize") {
        resultText = generatePedagogicalHumanizedText(
          textToWorkWith,
          "natural",
          effectiveClassLevel,
          effectiveBoard,
          effectiveTitle
        );
      } else {
        resultText = cleanMarkdownSyntax(
          generatePedagogicalWritingAction(
            "continue_writing",
            effectiveTitle,
            "",
            effectiveClassLevel,
            effectiveBoard,
            "English Language & Grammar",
            textToWorkWith,
            prompt
          ).result
        );
      }
    }

    if (!resultText) {
      return res.status(502).json({
        error:
          mode === "humanize"
            ? "Humanise could not be completed. Your original text is unchanged."
            : "AI generation failed. Your existing content has not been changed.",
      });
    }

    return res.json({ result: cleanMarkdownSyntax(resultText) });
  } catch (error: any) {
    console.error("Gemini draft general error, attempting graceful fallback:", error);
    try {
      const fallbackText = req.body?.mode === "humanize"
        ? generatePedagogicalHumanizedText(
            req.body?.selectedText || req.body?.fullText || "",
            "natural",
            req.body?.classLevel || "Class 6",
            req.body?.board || "CISCE",
            req.body?.title || req.body?.chapterTitle || "Textbook Manuscript"
          )
        : cleanMarkdownSyntax(
            generatePedagogicalWritingAction(
              "continue_writing",
              req.body?.title || req.body?.chapterTitle || "Textbook Manuscript",
              "",
              req.body?.classLevel || "Class 6",
              req.body?.board || "CISCE",
              "English Language & Grammar",
              req.body?.selectedText || req.body?.fullText || "",
              req.body?.prompt || ""
            ).result
          );
      return res.json({ result: fallbackText });
    } catch {
      return res.status(502).json({
        error:
          req.body?.mode === "humanize"
            ? "Humanise could not be completed. Your original text is unchanged."
            : "AI generation failed. Your existing content has not been changed.",
      });
    }
  }
});

// Chapter Studio Authoring Engine: Components 1–4
app.post("/api/chapter-studio/author-components", async (req, res) => {
  try {
    const board = req.body.board || req.body.systemId || "CISCE";
    const classLevel = req.body.classLevel || "Class 6";
    const subject = req.body.subject || req.body.category || "English Grammar";
    const chapterNumber = Number(req.body.chapterNumber) || 1;
    const chapterTitle = (req.body.chapterTitle || req.body.title || "").trim();
    const subtitle = (req.body.subtitle || "").trim();

    const ai = getGenAI();
    if (!ai) {
      return res.status(502).json({
        success: false,
        error: "AI generation failed. Your existing content has not been changed.",
      });
    }

    try {
      const prompt = `You are the Chief Academic Curriculum Author for VERITAS Academic Publishing. Author the definitive, textbook-grade pedagogical content for Components 1–4 of the following textbook chapter:
Board: ${board}
Class Level: ${classLevel}
Subject: ${subject}
Chapter ${chapterNumber}: ${chapterTitle}
Subtitle: ${subtitle}

Produce strict, valid JSON conforming to this schema:
{
  "component1": {
    "chapterNumber": ${chapterNumber},
    "title": "${chapterTitle}",
    "subtitle": "precise scholarly scope summary (min 10 words)",
    "openingHook": "engaging provocation or linguistic dilemma question connecting to daily language use (min 35 words)",
    "shortIntroduction": "rigorous explanatory prose introducing the core linguistic concept and its importance (min 70 words)",
    "estimatedStudyTimeMinutes": 120,
    "keyVocabulary": ["term1", "term2", "term3", "term4", "term5"],
    "conceptsCovered": ["concept1", "concept2", "concept3", "concept4"]
  },
  "component2": {
    "learningObjectives": [
      "at least 5 measurable Bloom's taxonomy objectives starting with action verbs (Identify, Distinguish, Select, Apply, Diagnose, Synthesize)"
    ]
  },
  "component3": {
    "warmUpActivity": "structured 2-minute diagnostic starter with 3 paired sentences comparing correct vs incorrect usage, with step-by-step tasks (min 60 words)",
    "priorKnowledge": "prerequisites checklist for ${board} ${classLevel} (min 3 bullet points)"
  },
  "component4": {
    "sectionTitle": "Concept Discovery: [Creative Title]",
    "discoveryVignette": "engaging contextual reading scenario narrative with student dialogue where the grammatical problem emerges naturally before formal rules are introduced (min 150 words)",
    "discoveryQuestions": "4 numbered guided inquiry questions directing students to notice and deduce the grammatical patterns from the vignette",
    "teacherGuidance": "pedagogical facilitation notes for the instructor"
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (
          parsed.component1?.title &&
          parsed.component1?.shortIntroduction &&
          parsed.component2?.learningObjectives?.length >= 3 &&
          parsed.component3?.warmUpActivity &&
          parsed.component4?.discoveryVignette
        ) {
          return res.json({
            success: true,
            components: parsed,
            data: parsed,
            source: "gemini-3.8-flash"
          });
        }
      }
      return res.status(502).json({
        success: false,
        error: "AI generation failed. Your existing content has not been changed.",
      });
    } catch (geminiError: any) {
      console.log("Gemini authoring call failed:", geminiError?.message || geminiError);
      return res.status(502).json({
        success: false,
        error: "AI generation failed. Your existing content has not been changed.",
      });
    }
  } catch (error: any) {
    console.log("Author components endpoint error:", error);
    return res.status(500).json({ success: false, error: "AI generation failed. Your existing content has not been changed." });
  }
});

// ============================================================================
// COMP-04: Concept Introduction & Discovery Vignette Generator
// ============================================================================
app.post("/api/chapter-studio/generate-discovery-vignette", async (req, res) => {
  try {
    const {
      board = "CISCE",
      grade = "Class 6",
      classLevel,
      chapterTitle = "Subject–Verb Agreement: Concord & Syntactic Synthesis",
      grammarTopic = "Subject–Verb Agreement",
      componentNumber = 4,
      existingContextualVignette = "",
      existingGuidedDiscoveryQuestions = "",
    } = req.body || {};

    const effectiveGrade = grade || classLevel || "Class 6";
    const effectiveBoard = board || "CISCE";
    const effectiveTopic = grammarTopic || chapterTitle || "Subject–Verb Agreement";

    const prompt = `You are an expert pedagogical textbook author for Indian school curricula (${effectiveBoard}, CBSE, State Boards).
Your task is to author Component 4: Concept Introduction & Discovery Vignette for a high-quality grammar textbook chapter.

Curriculum Context:
- Educational Board: ${effectiveBoard}
- Grade/Class Level: ${effectiveGrade}
- Chapter Title: ${chapterTitle}
- Grammar Concept/Topic: ${effectiveTopic}
- Component Number: ${componentNumber}

Pedagogical & Linguistic Guidelines:
1. Contextual Reading Vignette / Dialogue:
   - Write a short, engaging, age-appropriate narrative or dialogue (approx 150-250 words) featuring school-age characters in an authentic scenario (such as a student newspaper editorial room, school science exhibition, sports team rehearsal, classroom debate, or library project).
   - Natural examples of the chapter grammar concept (${effectiveTopic}) MUST be embedded directly in the scenario.
   - Crucial Inductive Rule: The scenario must showcase natural linguistic evidence and the problem/contrast naturally WITHOUT immediately explaining or lecturing the formal grammatical rule.
2. Guided Discovery Questions for Students (Notice & Inquire):
   - Provide 3 to 5 targeted inquiry questions.
   - These questions must guide students to NOTICE the language pattern inductively from the scenario's evidence before being explicitly taught the rule.
   - Format each question with a brief sub-heading or theme (e.g., "1. Subject Hunt: ...", "2. Verb Spotting: ...", "3. Pattern Mystery: ...", "4. Ear Check: ...").

${existingContextualVignette ? `Existing Vignette Draft for Reference:\n${existingContextualVignette}\n` : ""}
${existingGuidedDiscoveryQuestions ? `Existing Questions for Reference:\n${typeof existingGuidedDiscoveryQuestions === "string" ? existingGuidedDiscoveryQuestions : existingGuidedDiscoveryQuestions.join("\n")}\n` : ""}

You MUST respond strictly with valid JSON conforming to this exact structure:
{
  "contextualVignette": "A compelling 150-250 word contextual narrative or student dialogue embedding the grammar concept naturally.",
  "guidedDiscoveryQuestions": [
    "1. Subject Hunt: [Question directing student to identify the grammatical subject in the vignette]",
    "2. Verb Spotting: [Question comparing verb forms in singular vs plural context]",
    "3. Pattern Discovery: [Question asking student what happens to the verb inflection]",
    "4. Ear Check: [Question testing auditory intuition with contrasting sentences]"
  ]
}`;

    const ai = getGenAI();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (
            parsed.contextualVignette &&
            typeof parsed.contextualVignette === "string" &&
            Array.isArray(parsed.guidedDiscoveryQuestions) &&
            parsed.guidedDiscoveryQuestions.length >= 3
          ) {
            return res.json({
              contextualVignette: parsed.contextualVignette.trim(),
              guidedDiscoveryQuestions: parsed.guidedDiscoveryQuestions,
            });
          }
        }
        return res.status(502).json({
          error: "AI generation failed. Your existing content has not been changed.",
        });
      } catch (geminiError: any) {
        console.log("Gemini discovery vignette generation failed:", geminiError?.message || geminiError);
        return res.status(502).json({
          error: "AI generation failed. Your existing content has not been changed.",
        });
      }
    }

    return res.status(502).json({
      error: "AI generation failed. Your existing content has not been changed.",
    });
  } catch (error: any) {
    console.log("Discovery vignette route error:", error);
    return res.status(500).json({ error: "AI generation failed. Your existing content has not been changed." });
  }
});

// ============================================================================
// COMP-05: Theoretical Content & Syntactic Analysis Generator
// ============================================================================
app.post("/api/chapter-studio/generate-theoretical-explanation", async (req, res) => {
  try {
    const {
      board = "CISCE",
      grade = "Class 6",
      classLevel,
      chapterTitle = "Subject–Verb Agreement: Concord & Syntactic Synthesis",
      grammarTopic = "Subject–Verb Agreement",
      chapterObjectives = [],
      priorKnowledgeContent = "",
      discoveryVignette = "",
      discoveryQuestions = "",
      componentNumber = 5,
    } = req.body || {};

    const effectiveBoard = board || "CISCE";
    const effectiveGrade = grade || classLevel || "Class 6";
    const effectiveTopic = grammarTopic || chapterTitle || "Subject–Verb Agreement";

    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `You are an expert academic grammar textbook author and curriculum specialist for ${effectiveBoard} (${effectiveGrade} / Grade VI).
You are authoring COMPONENT 5 of the textbook chapter:
CHAPTER TITLE: "${chapterTitle}"
GRAMMAR TOPIC: "${effectiveTopic}"
CURRICULUM BOARD: ${effectiveBoard}
GRADE LEVEL: ${effectiveGrade}

PEDAGOGICAL CONTINUITY:
The students have just completed Component 4 (Inductive Inquiry & Discovery Vignette), where they observed language in context:
DISCOVERY CONTEXT:
"${discoveryVignette ? discoveryVignette.slice(0, 500) : "Students observed character dialogue showing agreement in context (e.g. 'The captain of the school cricket team has scored' vs 'The players have scored')."}"
"${discoveryQuestions ? (Array.isArray(discoveryQuestions) ? discoveryQuestions.join("\n") : discoveryQuestions).slice(0, 400) : "Noticed head nouns, intervening phrases, and auxiliary verbs."}"

INSTRUCTIONAL PURPOSE FOR COMPONENT 5:
Component 5 is "THEORETICAL CONTENT & SYNTACTIC ANALYSIS".
It transforms the inductive discovery from Component 4 into explicit, mature grammatical understanding.
It explains WHY the grammatical structure works before Component 6 formalises the learning into rules.

CONCEPTUAL PROGRESSION TO FOLLOW:
SUBJECT → HEAD NOUN → FINITE VERB → NUMBER → PERSON → AGREEMENT / CONCORD → INTERVENING WORDS OR PHRASES → IDENTIFICATION OF THE TRUE GRAMMATICAL SUBJECT.

IMPORTANT CONSTRAINTS:
- Do NOT turn Component 5 into a long list of formal grammar rules (reserved for Component 6).
- Do NOT include drill exercises (reserved for Component 12).
- Use British English throughout (e.g., 'focussed', 'practise' as verb, 'synthesise', 'behavioural').
- The prose must read like an edited CISCE Class 6 grammar textbook, with academic authority, warmth, and clarity—never sounding like an AI chatbot.

REQUIREMENTS:
Generate a valid JSON object with the following fields:

1. "conceptualExplanation" (string):
   - Target length: 280–420 words for ${effectiveGrade}.
   - Begin naturally from the discovery in Component 4.
   - Follow the conceptual progression: explain subject and predicate, then head noun, finite verb, number (singular vs plural) and person.
   - Explain that a finite verb changes according to features of its subject (concord).
   - Explain how intervening phrases (especially prepositional phrases) can mislead a learner into proximity traps.
   - Explain how to isolate the true grammatical subject.
   - Move from simple to more complex structures.
   - Avoid generic chatbot phrases ("In this chapter", "Welcome", "Let's dive in").

2. "syntacticAnalysis" (array of 3 to 5 specimen card objects):
   - Show students how sentences work structurally.
   - Include contrastive pairs where helpful (e.g., singular head noun vs plural head noun with the same intervening phrase).
   - Do NOT rely exclusively on has/have; include present tense -s patterns or be/do verbs.
   - Each card object must include:
     - "sentence": Full specimen sentence.
     - "expandedSubject": The entire subject phrase (e.g., "The captain of the school cricket team").
     - "subjectHeadNoun": The true head noun (e.g., "captain").
     - "interveningPhrase": The modifying/prepositional material separating subject and verb, or empty string if none (e.g., "of the school cricket team").
     - "verbPhrase": The finite verb or auxiliary phrase (e.g., "has scored").
     - "grammaticalNumber": "singular" or "plural".
     - "person": "3rd person" (or relevant person).
     - "agreementRelationship": Concord formula (e.g., "captain (singular, 3rd person) → has scored (singular)").
     - "explanation": Clear syntactic explanation (25–45 words) explaining why the verb agrees with the head noun and ignores nearby intervening nouns.
     - "notes": Practical tip on recognizing the syntactic pattern or avoiding auditory traps.
     - "isContrastivePair": boolean (true if part of a contrastive pair).

3. "conceptChecks" (array of 3 to 4 strings):
   - "Pause & Think" conceptual reasoning prompts embedded inside the explanation.
   - Stimulate syntactic thinking (e.g., "Which noun actually controls the verb?", "If you remove the intervening phrase, does the subject-verb relationship become clearer?", "What changes if the head noun becomes plural?").
   - These are NOT mechanical fill-in-the-blank drills.

4. "linguisticInsight" (string):
   - ONE concise, memorable linguistic takeaway of 25–50 words capturing the deeper principle.

5. "teacherAnnotations" (object):
   - "teachingFocus": Clear statement of the pedagogical objective (30–50 words).
   - "terminologyGuidance": Explanation of key grammatical terms (e.g., head noun, finite verb, concord) for classroom instruction.
   - "commonMisconceptions": Array of 2–3 specific learner errors (e.g., proximity agreement, collective noun confusion).
   - "suggestedBoardExplanation": How to demonstrate the concept on the blackboard with arrows or brackets.
   - "questioningStrategies": Array of 2–3 questions the teacher should ask aloud in class to guide students to isolate the head noun.
   - "diagnosticObservations": What to look for in student notebooks to diagnose comprehension.
   - "extensionSuggestions": Extension challenge for advanced students.

Output ONLY pure, valid JSON with keys: "conceptualExplanation", "syntacticAnalysis", "conceptChecks", "linguisticInsight", "teacherAnnotations". No extra markdown or markdown wrappers.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.35,
            maxOutputTokens: 3200,
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text?.trim() || "";
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          }
        }

        if (
          parsed &&
          typeof parsed.conceptualExplanation === "string" &&
          parsed.conceptualExplanation.trim().length > 100 &&
          Array.isArray(parsed.syntacticAnalysis) &&
          parsed.syntacticAnalysis.length >= 2 &&
          Array.isArray(parsed.conceptChecks) &&
          typeof parsed.linguisticInsight === "string"
        ) {
          const wordCount = parsed.conceptualExplanation.trim().split(/\s+/).length;
          return res.json({
            conceptualExplanation: parsed.conceptualExplanation.trim(),
            syntacticAnalysis: parsed.syntacticAnalysis,
            conceptChecks: parsed.conceptChecks,
            linguisticInsight: parsed.linguisticInsight.trim(),
            teacherAnnotations: parsed.teacherAnnotations || undefined,
            wordCount,
            generationMetadata: {
              board: effectiveBoard,
              grade: effectiveGrade,
              topic: effectiveTopic,
              model: "gemini-3.8-flash",
              generatedAt: new Date().toISOString(),
            },
          });
        }
        return res.status(502).json({
          error: "AI generation failed. Your existing content has not been changed.",
        });
      } catch (geminiError: any) {
        console.log("Gemini theoretical content generation failed:", geminiError?.message || geminiError);
        return res.status(502).json({
          error: "AI generation failed. Your existing content has not been changed.",
        });
      }
    }

    return res.status(502).json({
      error: "AI generation failed. Your existing content has not been changed.",
    });
  } catch (error: any) {
    console.log("Theoretical content generation route error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate theoretical content" });
  }
});

// ============================================================================
// COMP-06: Grammar Rules & Structural Form Boxes Generator
// ============================================================================
app.post("/api/chapter-studio/generate-grammar-rules", async (req, res) => {
  try {
    const {
      board = "CISCE",
      grade = "Class 6",
      classLevel,
      bookTitle = "Classical Grammar: ICSE Class 6",
      seriesTitle = "Grammar in Action: Tri-Board English Series",
      chapterTitle = "Subject–Verb Agreement: Concord & Syntactic Synthesis",
      grammarTopic = "Subject–Verb Agreement",
      grammarStrand = "Verbal Syntax & Concord",
      discoveryVignette = "",
      discoveryQuestions = "",
      conceptualExplanation = "",
      syntacticAnalysis = [],
      componentNumber = 6,
    } = req.body || {};

    const effectiveBoard = board || "CISCE";
    const effectiveGrade = grade || classLevel || "Class 6";
    const effectiveTopic = grammarTopic || chapterTitle || "Subject–Verb Agreement";

    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `You are an expert academic grammar textbook author and curriculum specialist for ${effectiveBoard} (${effectiveGrade} / Grade VI).
You are authoring COMPONENT 6 ("Grammar Rules & Structural Form Boxes") for the textbook:
BOOK: "${bookTitle}" (${seriesTitle})
CHAPTER TITLE: "${chapterTitle}"
GRAMMAR TOPIC: "${effectiveTopic}"
STRAND: "${grammarStrand}"
CURRICULUM BOARD: ${effectiveBoard}
GRADE LEVEL: ${effectiveGrade}

PEDAGOGICAL CONTINUITY:
The students have already completed:
- Component 4 (Inductive Inquiry / Discovery Vignette):
  "${discoveryVignette ? discoveryVignette.slice(0, 400) : "Observed contextual dialogue and inductive clues."}"
- Component 5 (Theoretical Explanation & Syntactic Analysis):
  "${conceptualExplanation ? conceptualExplanation.slice(0, 500) : "Understood the foundational concepts of subject, head noun, finite verb, person, number, and concord."}"

INSTRUCTIONAL PURPOSE FOR COMPONENT 6:
Component 6 converts the conceptual/theoretical understanding from Component 5 into formal, authoritative grammar rules, structural formulas, and concise rule boxes suitable for a professionally published ${effectiveBoard} textbook.
It does NOT repeat the explanatory theory of Component 5; it codifies it into crystal-clear rules, formulas, variations, rule-of-thumb checklists, and exception boxes.

CRITICAL INSTRUCTIONS:
- Adapt specifically to the topic: "${effectiveTopic}". Do NOT force Subject-Verb Agreement if the topic is different.
- British English conventions throughout (e.g., 'focussed', 'practise' as verb, 'synthesise', 'programme').
- Provide token-based representations for structural formulas so they render as syntax blocks/chips.
- Follow ${effectiveBoard} Class 6 academic standards: precise terminology, authoritative tone, unambiguous formulas, pedagogical clarity.

REQUIREMENTS:
Generate a valid JSON object with the following schema:
{
  "ruleIdentifier": string (e.g. "RULE 1.1" or "RULE-01"),
  "formalRuleStatement": string (Definitive, authoritative textbook rule phrasing in 35–65 words),
  "pedagogicalSummary": string (Clear, student-accessible plain-English version in 20–35 words),
  "structuralFormula": string (Symbolic or structured formula, e.g. "[Singular Subject] + [Singular Finite Verb]"),
  "formulaTokens": array of objects: [
    { "text": string, "role": "subject" | "verb" | "modifier" | "operator" | "punctuation" | "note" | "conjunction" | "object" | "complement", "highlight": boolean }
  ],
  "ruleVariations": array of 3 to 5 variation objects: [
    {
      "id": string (e.g. "var-1"),
      "title": string (e.g. "Basic Number Concord (Singular vs Plural)"),
      "condition": string (Syntactic context or condition, e.g. "When the subject consists of a single noun or pronoun"),
      "ruleStatement": string (Precise rule statement for this variation),
      "formula": string (e.g. "[Singular Subject] + [Singular Verb (-s/-es in present tense)]"),
      "formulaTokens": array of token objects as above,
      "correctExample": string (Exemplary sentence illustrating correct usage),
      "incorrectExample": string (Contrastive non-example showing common pitfall),
      "explanation": string (Linguistic/syntactic explanation of why the correct form is required, 20–40 words),
      "learnerNote": string (Practical cautionary note or mnemonic for students)
    }
  ],
  "ruleOfThumb": {
    "title": string (e.g. "The Rule of Thumb" or "The Golden Suffix Test"),
    "summary": string (Concise heuristic or mental checklist for students in 30–60 words),
    "mnemonicOrContrast": string (Memorable contrast or mnemonic summary, e.g. "Noun + S = Plural | Verb + S = Singular")
  },
  "exceptions": array of 2 to 4 edge-case objects: [
    {
      "id": string (e.g. "ex-1"),
      "caseTitle": string (e.g. "Plural Nouns Expressing a Single Quantity or Amount"),
      "condition": string (Condition under which the primary rule alters),
      "explanation": string (Grammatical reason for the exception),
      "example": string (Model sentence exhibiting the exception)
    }
  ],
  "teacherAnnotations": {
    "introductionStrategy": string (Recommended pedagogical procedure to introduce the rule box in 35–60 words),
    "commonConfusionPoints": array of 2 to 4 strings (Specific student conceptual confusions to anticipate),
    "boardExamAlignmentNote": string (How this rule aligns with ${effectiveBoard} question formats and examination papers),
    "blackboardSummarySchema": string (Visual schema or board-layout diagram instruction for teachers to sketch),
    "diagnosticCheckSuggestion": string (Quick formative assessment or oral prompt to verify student rule retention)
  }
}

Output pure, valid JSON only. No markdown ticks or explanation.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.3,
            maxOutputTokens: 3500,
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text?.trim() || "";
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          }
        }

        if (
          parsed &&
          typeof parsed.ruleIdentifier === "string" &&
          typeof parsed.formalRuleStatement === "string" &&
          Array.isArray(parsed.ruleVariations) &&
          parsed.ruleVariations.length >= 2
        ) {
          const wordCount = [
            parsed.formalRuleStatement,
            parsed.pedagogicalSummary || "",
            ...(parsed.ruleVariations || []).map((v: any) => `${v.title} ${v.ruleStatement} ${v.explanation}`),
            parsed.ruleOfThumb?.summary || "",
            ...(parsed.exceptions || []).map((e: any) => `${e.caseTitle} ${e.explanation}`),
          ].join(" ").split(/\s+/).filter(Boolean).length;

          return res.json({
            ruleIdentifier: parsed.ruleIdentifier.trim(),
            formalRuleStatement: parsed.formalRuleStatement.trim(),
            pedagogicalSummary: (parsed.pedagogicalSummary || "").trim(),
            structuralFormula: (parsed.structuralFormula || "").trim(),
            formulaTokens: Array.isArray(parsed.formulaTokens) ? parsed.formulaTokens : undefined,
            ruleVariations: parsed.ruleVariations,
            ruleOfThumb: parsed.ruleOfThumb || {
              title: "Rule of Thumb",
              summary: "Always check the true subject before selecting the verb form.",
            },
            exceptions: Array.isArray(parsed.exceptions) ? parsed.exceptions : [],
            teacherAnnotations: parsed.teacherAnnotations || undefined,
            wordCount,
            generationMetadata: {
              board: effectiveBoard,
              grade: effectiveGrade,
              topic: effectiveTopic,
              model: "gemini-3.8-flash",
              generatedAt: new Date().toISOString(),
            },
          });
        }
        return res.status(502).json({
          error: "AI generation failed. Your existing content has not been changed.",
        });
      } catch (geminiError: any) {
        console.log("Gemini grammar rules generation failed:", geminiError?.message || geminiError);
        return res.status(502).json({
          error: "AI generation failed. Your existing content has not been changed.",
        });
      }
    }

    return res.status(502).json({
      error: "AI generation failed. Your existing content has not been changed.",
    });
  } catch (error: any) {
    console.error("Grammar rules generation route error:", error);
    return res.status(500).json({ error: "AI generation failed. Your existing content has not been changed." });
  }
});

// ============================================================================
// GEMINI API ERROR PARSER & PEDAGOGICAL GUIDANCE
// ============================================================================
function parseGeminiApiError(err: any): { message: string; code: string; status: number } {
  if (!err) {
    return {
      message: "An unknown AI service error occurred. Please try again.",
      code: "UNKNOWN_ERROR",
      status: 502,
    };
  }

  const rawMsg = err.message || String(err);

  // Check if rawMsg contains JSON with error code/status/message
  try {
    const parsed = JSON.parse(rawMsg);
    if (parsed.error) {
      const code = parsed.error.code;
      const status = parsed.error.status;
      const innerMsg = parsed.error.message || rawMsg;

      if (code === 402 || status === "RESOURCE_EXHAUSTED" || innerMsg.includes("prepayment credits are depleted")) {
        return {
          message: "Gemini API credits depleted: Your Google AI Studio project prepayment credits are depleted. Please visit Google AI Studio (https://ai.studio/projects) to manage your project billing and prepayment credits.",
          code: "RESOURCE_EXHAUSTED",
          status: 402,
        };
      }
      if (code === 429) {
        return {
          message: "Gemini API rate limit exceeded: Quota limit reached. Please wait a moment before requesting another chapter draft.",
          code: "RATE_LIMIT_EXCEEDED",
          status: 429,
        };
      }
      if (code === 403 || code === 401) {
        return {
          message: "Gemini API authentication failed: The server GEMINI_API_KEY is invalid or lacks necessary permissions.",
          code: "AUTH_FAILED",
          status: 403,
        };
      }
      return {
        message: `Gemini API Error: ${innerMsg}`,
        code: status || "GEMINI_ERROR",
        status: 502,
      };
    }
  } catch {
    // Fallback string matching on raw message
    if (/prepayment credits are depleted|RESOURCE_EXHAUSTED/i.test(rawMsg)) {
      return {
        message: "Gemini API credits depleted: Your Google AI Studio project prepayment credits are depleted. Please visit Google AI Studio (https://ai.studio/projects) to manage your project billing and prepayment credits.",
        code: "RESOURCE_EXHAUSTED",
        status: 402,
      };
    }
    if (/quota exceeded|rate limit|429/i.test(rawMsg)) {
      return {
        message: "Gemini API rate limit exceeded: Quota limit reached. Please wait a moment before requesting another chapter draft.",
        code: "RATE_LIMIT_EXCEEDED",
        status: 429,
      };
    }
    if (/API key not valid|invalid api key|403|401/i.test(rawMsg)) {
      return {
        message: "Gemini API authentication failed: The server GEMINI_API_KEY is invalid or unauthorized.",
        code: "AUTH_FAILED",
        status: 403,
      };
    }
  }

  return {
    message: `Gemini generation failed: ${rawMsg}`,
    code: "GEMINI_ERROR",
    status: 502,
  };
}

function getPedagogicalGradeGuidance(classLevel: string): string {
  const profile = getPedagogicalClassProfile(classLevel);
  return `${profile.systemInstructionText}
- Pedagogical Tier: ${profile.tier.toUpperCase()} (${profile.label})
- Target Learner Age: ${profile.targetAge}
- Target Sentence Length: ${profile.averageSentenceWords}
- Heading & Structure Style: ${profile.headingDirectives}
- Permitted Example Domains: ${profile.exampleDomains.join('; ')}
- Strictly Prohibited Elements: ${profile.prohibitedPatterns.join('; ')}
- Core Principle: NEVER make educational writing complicated simply to make it sound intelligent or academic!`;
}

function getBoardProgrammeGuidance(board: string): string {
  const boardProfile = getCurriculumBoardProfile(board);
  return `${boardProfile.guidanceText}
- Syllabus Focus: ${boardProfile.syllabusFocus}
- Curriculum Terminology: ${boardProfile.curriculumTerminology.join(', ')}
- Key Expectations: ${boardProfile.pedagogicalExpectations.join(' ')}`;
}

app.post("/api/chapter-studio/generate-component", async (req, res) => {
  try {
    const {
      componentId,
      action = "generate",
      topic,
      classLevel,
      board,
      subject,
      curriculumFramework,
      existingCount = 0,
      currentItem,
    } = req.body || {};

    // 1. Strict neutral validation: require real context from active chapter, never invent academic defaults
    const missingFields: string[] = [];
    if (!componentId || typeof componentId !== "string" || !componentId.trim()) {
      missingFields.push("componentId (e.g. comp-9, comp-10, comp-11)");
    }
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      missingFields.push("topic (or chapter title)");
    }
    if (!classLevel || typeof classLevel !== "string" || !classLevel.trim()) {
      missingFields.push("classLevel (e.g. Class 1–12, Grade, Stage)");
    }
    if (!board || typeof board !== "string" || !board.trim()) {
      missingFields.push("board (e.g. CBSE, CISCE, Cambridge, Custom / Independent)");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required generation context: ${missingFields.join(", ")}. The component engine requires canonical project context and does not apply hardcoded defaults.`,
        missingFields,
      });
    }

    const trimmedTopic = topic.trim();
    const trimmedClass = classLevel.trim();
    const trimmedBoard = board.trim();
    const effectiveSubject = subject && typeof subject === "string" && subject.trim() ? subject.trim() : "Academic Curriculum";
    const gradeGuidance = getPedagogicalGradeGuidance(trimmedClass);
    const boardGuidance = getBoardProgrammeGuidance(trimmedBoard);

    const ai = getGenAI();
    if (!ai) {
      console.warn("AI service unavailable: GEMINI_API_KEY is not configured.");
      return res.status(503).json({
        error: "AI generation could not be completed. Your existing content has not been changed.",
      });
    }

    const systemPrompt = `You are a distinguished educational curriculum author and academic textbook creator developing content for ${effectiveSubject} for ${trimmedBoard} ${trimmedClass}.
Generate rigorous, pedagogically sound content tailored to this subject, grade level, and curriculum framework.
${gradeGuidance}
${boardGuidance}
Output strictly valid JSON with no markdown wrapping.`;

    let userPrompt = "";

    // Canonical ID dispatch: No remapping
    if (componentId === "comp-9") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 2 high-quality Worked Examples for this subject and topic, tailored to ${trimmedClass} students studying under the ${trimmedBoard} curriculum.
Each example must demonstrate clear step-by-step problem modeling, logical reasoning, and a verified final solution appropriate for ${effectiveSubject}.

Output JSON only with this structure:
{
  "items": [
    {
      "id": "we-ai-1",
      "title": "Worked Example Title",
      "problem": "Problem statement, prompt, or question for students",
      "difficulty": "Standard",
      "steps": [
        { "stepNumber": 1, "title": "Step 1 Title", "instruction": "Clear pedagogical step instruction", "sampleWork": "Modelled work or intermediate reasoning", "ruleApplied": "Rule, formula, or concept applied" },
        { "stepNumber": 2, "title": "Step 2 Title", "instruction": "Clear pedagogical step instruction", "sampleWork": "Modelled work or intermediate reasoning", "ruleApplied": "Rule, formula, or concept applied" }
      ],
      "finalAnswer": "Verified final solution or answer",
      "grammaticalRationale": "Clear pedagogical rationale explaining why this answer is correct according to the subject rules",
      "teacherNote": "Actionable classroom teaching tip, student hesitation point, or pacing guidance"
    }
  ]
}`;
    } else if (componentId === "comp-10") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 2 authentic Common Errors & Pitfalls for this subject and topic that ${trimmedClass} students frequently make under the ${trimmedBoard} curriculum.
Include contrastive incorrect vs correct formulations, the conceptual misconception causing the error, an actionable prevention rule or memory tip, and diagnostic advice for teachers.

Output JSON only with this structure:
{
  "items": [
    {
      "id": "ce-ai-1",
      "title": "Error Pattern Name",
      "incorrectSentence": "Incorrect student attempt, misconception, or error sample",
      "correctSentence": "Correct formulation, accurate solution, or standard practice",
      "mistakeType": "Category of misconception or error type",
      "explanation": "Why learners make this mistake and the underlying confusion",
      "ruleAnchor": "The authoritative rule, principle, or theorem that clarifies this",
      "preventionTip": "Practical memory hook, verification test, or mnemonic",
      "frequency": "Critical Exam Trap",
      "teacherNote": "Diagnostic classroom tip to detect and remediate this error early"
    }
  ]
}`;
    } else if (componentId === "comp-11") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 2 concise, memorable Remember / Quick Tip Callout Boxes for student textbooks on "${trimmedTopic}" for ${trimmedClass} (${trimmedBoard}).
These must provide rapid student retention, high-yield takeaways, mnemonic hooks, or quick rules.

Output JSON only with this structure:
{
  "items": [
    {
      "id": "tip-ai-1",
      "title": "Callout Box Title",
      "tipType": "golden_rule",
      "calloutText": "Clear, memorable rule statement or high-yield summary",
      "memoryHook": "Catchy mnemonic, rhythm, or memory anchor",
      "quickFormula": "Quick formula, rule pattern, or shorthand structure",
      "icon": "lightbulb",
      "importance": "high",
      "teacherNote": "Classroom emphasis note or board callout hint"
    }
  ]
}`;
    } else if (componentId === "comp-12") {
      const activePrompt = currentItem?.prompt || trimmedTopic;

      if (action === "suggest-hint") {
        userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
Problem / Question Prompt: "${activePrompt}"

Generate a targeted, supportive pedagogical hint for a student encountering this problem. The hint must guide their inquiry or point them toward the governing principle without giving away the direct answer.
Output JSON:
{
  "hint": "Clear student-facing scaffolding hint"
}`;
      } else if (action === "suggest-answer") {
        userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
Problem / Question Prompt: "${activePrompt}"

Provide the authoritative verified answer and a complete model response showing expected student step-by-step formatting.
Output JSON:
{
  "answer": "Exact verified correct answer",
  "modelResponse": "Complete model solution showing working or step formatting"
}`;
      } else if (action === "generate-feedback") {
        userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
Problem / Question Prompt: "${activePrompt}"
Answer: "${currentItem?.answer || ""}"

Generate clear diagnostic pedagogical feedback explaining why this answer is correct, how to avoid common misconceptions, and what rule governs it.
Output JSON:
{
  "explanation": "Clear pedagogical explanation and feedback"
}`;
      } else if (action === "simplify-instruction") {
        userPrompt = `Subject: "${effectiveSubject}"
Grade Level: "${trimmedClass}"
Original Instruction: "${currentItem?.instruction || "Analyze the problem and complete the required task."}"

Simplify this instruction so it is immediately accessible and concise for a ${trimmedClass} student.
Output JSON:
{
  "instruction": "Simplified, direct student instruction"
}`;
      } else if (action === "increase-difficulty") {
        userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Current Prompt: "${activePrompt}"

Elevate the cognitive rigor and analytical depth of this problem for ${trimmedClass} students, requiring multi-step reasoning or edge case consideration.
Output JSON:
{
  "prompt": "Enhanced, more rigorous problem prompt"
}`;
      } else if (action === "decrease-difficulty") {
        userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Current Prompt: "${activePrompt}"

Add scaffolding to this question prompt to make it more accessible, breaking it into smaller cognitive checkpoints or providing clearer cues.
Output JSON:
{
  "prompt": "Accessible, scaffolded problem prompt"
}`;
      } else {
        // Standard Guided Practice generation
        userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 3 high-quality Guided Practice Drill items for "${trimmedTopic}" tailored to ${trimmedClass} (${trimmedBoard}).
Guided practice serves as the low-stakes cognitive bridge between worked examples and independent exercises.
Progress the items logically:
- Item 1: High Support (clear prompt, supportive hint, modelled response)
- Item 2: Medium Support (structured guidance, guiding hint, verified answer)
- Item 3: Low Support / Transition to Independent (authentic problem, concise hint, verified answer)

Every item must have a unique stable ID (e.g. "gp-ai-1", "gp-ai-2", "gp-ai-3"), a verified answer bound strictly to that ID, pedagogical feedback, and diagnostic teacher guidance.

Output JSON only with this structure:
{
  "items": [
    {
      "id": "gp-ai-1",
      "instruction": "Specific, actionable task instruction",
      "prompt": "The core problem, question, or sentence prompt to solve",
      "stimulus": "Optional context, short passage, or problem scenario if needed",
      "hint": "Student-facing scaffolding hint or inquiry trigger",
      "scaffoldingLevel": "High Support",
      "modelResponse": "Formatted model response showing expected working",
      "answer": "Exact verified correct answer",
      "explanation": "Clear explanation of the concept, principle, method, rule, or reasoning",
      "difficulty": "Foundational",
      "teacherNote": "Diagnostic classroom tip or common student hesitation to watch for",
      "studentVisible": true,
      "teacherVisible": true
    },
    {
      "id": "gp-ai-2",
      "instruction": "Specific, actionable task instruction",
      "prompt": "The core problem, question, or sentence prompt to solve",
      "stimulus": "",
      "hint": "Student-facing scaffolding hint",
      "scaffoldingLevel": "Medium Support",
      "modelResponse": "",
      "answer": "Exact verified correct answer",
      "explanation": "Clear explanation of the concept, principle, method, rule, or reasoning",
      "difficulty": "Standard",
      "teacherNote": "Diagnostic classroom tip",
      "studentVisible": true,
      "teacherVisible": true
    },
    {
      "id": "gp-ai-3",
      "instruction": "Specific, actionable task instruction",
      "prompt": "The core problem, question, or sentence prompt to solve",
      "stimulus": "",
      "hint": "Light scaffolding hint",
      "scaffoldingLevel": "Low Support",
      "modelResponse": "",
      "answer": "Exact verified correct answer",
      "explanation": "Clear explanation of the concept, principle, method, rule, or reasoning",
      "difficulty": "Standard",
      "teacherNote": "Diagnostic classroom tip",
      "studentVisible": true,
      "teacherVisible": true
    }
  ]
}`;
      }
    } else if (componentId === "comp-13") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 5 high-quality Bloom Level 1–2 Foundational Recognition and Identification questions for Exercise A on "${trimmedTopic}".
Questions must test core recognition, identification, true/false, classification, or underlining without heavy production burden.

Every question must have a stable unique ID ("q-ex-a-1", etc.), explicit prompt/instruction, clear verified correctAnswer, concise explanation, marks (1), and difficulty ("Easy" or "Medium").
Output JSON only with this structure:
{
  "questions": [
    {
      "id": "q-ex-a-1",
      "type": "identify_underline",
      "instruction": "Identify or underline the target concept or element in the statement",
      "prompt": "Core statement or question for students",
      "correctAnswer": "Verified correct target answer",
      "explanation": "Clear explanation of the concept, principle, or rule",
      "marks": 1,
      "difficulty": "Easy",
      "cognitiveLevel": "Remembering"
    }
  ]
}`;
    } else if (componentId === "comp-14") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 5 high-quality Bloom Level 2 Understanding & Selection questions for Exercise B on "${trimmedTopic}".
Questions should focus on Fill in the Blanks with bracketed choices, cloze completion, or discrete selection.

Every question must have a stable unique ID ("q-ex-b-1", etc.), blanksSentence or prompt with bracketed choices, verified correctAnswer, acceptableAlternatives if any, concise explanation, marks (1), and difficulty ("Easy" or "Medium").
Output JSON only with this structure:
{
  "questions": [
    {
      "id": "q-ex-b-1",
      "type": "fill_in_blanks",
      "instruction": "Fill in the blank with the appropriate choice from the brackets",
      "prompt": "Statement with a blank ___ and [Option 1 / Option 2] in brackets",
      "blanksSentence": "Statement with a blank ___ and [Option 1 / Option 2] in brackets",
      "correctAnswer": "Correct choice",
      "explanation": "Clear explanation of the principle or rule",
      "marks": 1,
      "difficulty": "Medium",
      "cognitiveLevel": "Understanding"
    }
  ]
}`;
    } else if (componentId === "comp-15") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 5 high-quality Bloom Level 3–4 Application & Transformation questions for Exercise C on "${trimmedTopic}".
Questions must require structural transformation, rephrasing, or formulaic manipulation according to precise instructions without altering original meaning.

Output JSON only with this structure:
{
  "questions": [
    {
      "id": "q-ex-c-1",
      "type": "transformation",
      "instruction": "Rewrite or transform the following according to the given instruction",
      "prompt": "Original statement or equation to transform",
      "originalSentence": "Original statement or equation to transform",
      "transformationInstruction": "Specific transformation constraint or beginning words",
      "correctAnswer": "Complete transformed solution",
      "modelAnswer": "Complete transformed solution",
      "explanation": "Clear explanation of the transformation principle",
      "marks": 2,
      "difficulty": "Medium",
      "cognitiveLevel": "Applying"
    }
  ]
}`;
    } else if (componentId === "comp-16") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 5 high-quality Bloom Level 4–5 Error Correction and Editing questions for Exercise D on "${trimmedTopic}".
Items should present statements, equations, or short passages containing authentic misconceptions or errors for students to detect and rectify.

Output JSON only with this structure:
{
  "questions": [
    {
      "id": "q-ex-d-1",
      "type": "error_correction",
      "instruction": "Identify the incorrect element and provide the rectified replacement",
      "prompt": "Statement containing an intentional error or flaw",
      "errorSnippet": "Specific error portion",
      "correctionSnippet": "Correct replacement",
      "correctAnswer": "Error: [error] -> Correction: [replacement]",
      "explanation": "Clear rationale explaining why the error occurs and why the correction is valid",
      "marks": 2,
      "difficulty": "Hard",
      "cognitiveLevel": "Analyzing"
    }
  ]
}`;
    } else if (componentId === "comp-17") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 5 high-quality Bloom Level 5–6 Contextual Application and Composition problems for Exercise E on "${trimmedTopic}".
Items should present real-world scenarios, case studies, or structured reasoning challenges deploying core concepts.

Output JSON only with this structure:
{
  "questions": [
    {
      "id": "q-ex-e-1",
      "type": "open_ended",
      "instruction": "Analyze the context and compose a reasoned response adhering to core principles",
      "prompt": "Contextual scenario or multi-step reasoning problem",
      "correctAnswer": "Model solution and key criteria",
      "modelAnswer": "Model solution and key criteria",
      "markingPoints": ["Key criterion 1", "Key criterion 2"],
      "explanation": "Pedagogical marking rationale and conceptual breakdown",
      "marks": 3,
      "difficulty": "Hard",
      "cognitiveLevel": "Evaluating"
    }
  ]
}`;
    } else if (componentId === "comp-18") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 6 supplemental practice questions for Additional Practice on "${trimmedTopic}", spanning foundational (2 items), practice (2 items), and challenge (2 items).

Output JSON only with this structure:
{
  "questions": [
    {
      "id": "q-ex-extra-1",
      "type": "mcq",
      "instruction": "Select the correct response",
      "prompt": "Question prompt",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Clear explanation",
      "marks": 1,
      "difficulty": "Easy",
      "cognitiveLevel": "Remembering"
    }
  ]
}`;
    } else if (componentId === "comp-19") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate 3 high-order thinking / Olympiad / competition-level challenge problems on "${trimmedTopic}" in ${effectiveSubject} tailored for ${trimmedClass} (${trimmedBoard}).
These problems must test deep conceptual application, subtle edge cases, multi-step structural analysis, or challenging non-routine problems appropriate for ${effectiveSubject} that go beyond standard routine drills.

Output JSON only with this structure:
{
  "challengeProblems": [
    {
      "id": "chal-ai-1",
      "title": "Descriptive Challenge Title",
      "prompt": "Rigorous problem statement presenting an authentic conceptual puzzle, multi-step problem, or complex scenario",
      "hint": "Guiding analytical hint directing student attention to underlying principles, formulas, or structures",
      "modelAnswer": "Complete, verified model solution",
      "rationale": "Step-by-step conceptual or mathematical analysis and breakdown of the governing principles",
      "grammaticalRationale": "Step-by-step conceptual or mathematical analysis and breakdown of the governing principles",
      "commonPitfall": "The deceptive trap or false pattern students commonly fall into",
      "marks": 3,
      "difficulty": "Hard",
      "cognitiveLevel": "Evaluating"
    }
  ]
}`;
    } else if (componentId === "comp-20") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate a comprehensive, crystal-clear Chapter Summary and Review consolidation for "${trimmedTopic}" for ${trimmedClass} (${trimmedBoard}) in ${effectiveSubject}.
Include:
1. "rulesAtAGlance": 4–5 core rules, principles, formulas, or theorems summarizing the chapter mechanics, each with a clear rule title, rule statement, specimen example, and diagnostic trap.
2. "whatYouLearned": 4 high-yield bullet takeaways.
3. "commonMistakes": 3 authentic student errors with the mistake, the correction, and why it is wrong.
4. "keyVocabulary": 4 essential key terms or concepts for ${effectiveSubject} with definitions.
5. "quickCheckQuestions": 3 rapid self-test questions with verified answers.
6. "selfAssessmentChecklist": 4 "I can..." competency statements.

Output JSON only with this structure:
{
  "rulesAtAGlance": [
    {
      "rule": "Rule / Principle title",
      "summary": "Clear, concise principle formulation",
      "example": "Exemplary specimen illustrating the principle",
      "trap": "Common pitfall to avoid"
    }
  ],
  "whatYouLearned": [
    "Key takeaway point 1"
  ],
  "commonMistakes": [
    {
      "mistake": "Sample incorrect formulation or working",
      "correction": "Sample correct formulation or working",
      "why": "Clear pedagogical explanation of the error"
    }
  ],
  "keyVocabulary": [
    {
      "term": "Term name",
      "definition": "Clear pedagogical definition"
    }
  ],
  "quickCheckQuestions": [
    {
      "prompt": "Rapid review question prompt",
      "answer": "Verified correct answer"
    }
  ],
  "selfAssessmentChecklist": [
    {
      "statement": "I can identify and apply...",
      "canDo": true
    }
  ]
}
`;
    } else if (componentId === "comp-21") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate a rigorous, standardized 25-mark Chapter Mastery Assessment Test on "${trimmedTopic}" for ${trimmedClass} (${trimmedBoard}) in ${effectiveSubject}.
The assessment must be balanced across Bloom's Taxonomy (Remembering, Understanding, Applying, Analyzing, Evaluating) and reflect the formal examination style of ${trimmedBoard}.
Duration: 45 minutes. Total Marks: 25.

Include 3 structured sections:
- Section A: Objective & Foundational Identification (MCQs / Foundational items, 5 marks)
- Section B: Application & Problem-Solving (FIB / Structured items, 8 marks)
- Section C: Synthesis, Analysis & Detailed Solutions (Multi-step problems / Error correction / Short response, 12 marks)

Every question must have an explicit verified correctAnswer, concise explanatory rationale, marks, and difficulty.

Output JSON only with this structure:
{
  "title": "${trimmedTopic} — Mastery Assessment Test",
  "totalMarks": 25,
  "durationMinutes": 45,
  "instructions": [
    "Read each question carefully before attempting.",
    "Marks for each question are indicated against it.",
    "Write legibly and show all required reasoning or steps clearly."
  ],
  "sections": [
    {
      "id": "sec-a",
      "title": "Section A: Objective & Foundational Identification",
      "instructions": "Choose or identify the correct option.",
      "marksAllocation": 5,
      "questions": [
        {
          "id": "q-test-1",
          "type": "mcq",
          "prompt": "Question prompt",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "correctAnswer": "A) Option 1",
          "explanation": "Clear conceptual rationale",
          "marks": 1,
          "difficulty": "Easy",
          "cognitiveLevel": "Remembering"
        }
      ]
    },
    {
      "id": "sec-b",
      "title": "Section B: Conceptual Application",
      "instructions": "Complete each problem or sentence with the appropriate response.",
      "marksAllocation": 8,
      "questions": [
        {
          "id": "q-test-6",
          "type": "fill_in_blanks",
          "prompt": "Problem or statement with blank ___",
          "blanksSentence": "Problem or statement with blank ___",
          "correctAnswer": "Answer value",
          "explanation": "Clear explanation",
          "marks": 1,
          "difficulty": "Medium",
          "cognitiveLevel": "Understanding"
        }
      ]
    },
    {
      "id": "sec-c",
      "title": "Section C: Analytical Synthesis & Problem-Solving",
      "instructions": "Solve the problems, provide comprehensive explanations, or correct errors as directed.",
      "marksAllocation": 12,
      "questions": [
        {
          "id": "q-test-14",
          "type": "error_correction",
          "prompt": "Analyze the statement or problem, identify the error and provide the correct working/response: [problem with error]",
          "correctAnswer": "Corrected response or working",
          "explanation": "Rationale based on subject principles",
          "marks": 2,
          "difficulty": "Hard",
          "cognitiveLevel": "Analyzing"
        }
      ]
    }
  ]
}
`;
    } else if (componentId === "comp-22") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate a complete, authoritative Teacher's Answer Key & Subjective Evaluation Rubrics for the chapter "${trimmedTopic}" for ${trimmedClass} (${trimmedBoard}) in ${effectiveSubject}.
Provide exhaustive solutions, acceptable alternative answers, conceptual rationale, and partial credit scoring guidelines.

Output JSON only with this structure:
{
  "answerKey": [
    {
      "id": "ak-1",
      "exerciseLetterOrNumber": "Exercise A",
      "questionNumber": 1,
      "questionType": "identification",
      "promptSummary": "Summary of prompt tested",
      "correctAnswer": "Verified correct answer",
      "acceptableAlternatives": ["Valid alternative 1"],
      "rationale": "Precise conceptual, mathematical, or grammatical justification and principle reference",
      "grammarRationale": "Precise conceptual, mathematical, or grammatical justification and principle reference",
      "partialCreditGuidance": "Full credit (1.0) for completely accurate response; partial credit (0.5) for sound reasoning with minor calculation/spelling lapse."
    }
  ],
  "generalScoringRubric": {
    "fullCredit": "Accurate, comprehensive response fully satisfying all requirements and demonstrating sound principles",
    "partialCredit": "Core concept applied correctly but with minor calculation, spelling, or formatting oversight",
    "zeroCredit": "Fundamental conceptual misconception or invalid reasoning"
  }
}
`;
    } else if (componentId === "comp-23") {
      userPrompt = `Subject: "${effectiveSubject}"
Topic / Chapter: "${trimmedTopic}"
Grade Level: "${trimmedClass}"
Curriculum Board: "${trimmedBoard}"
${curriculumFramework ? `Framework Details: "${curriculumFramework}"` : ""}

Generate comprehensive, professional Teacher Guide & Lesson Pacing Notes for "${trimmedTopic}" for ${trimmedClass} (${trimmedBoard}).
Include:
1. "learningObjectives": 3 key objectives.
2. "prerequisites": Prior knowledge needed before this chapter.
3. "pacingGuide": 4-period instructional breakdown (Period 1: Discovery & Concept, Period 2: Rules & Worked Examples, Period 3: Guided & Independent Practice, Period 4: Challenge & Assessment).
4. "teachingStrategies": 3 practical instructional methods / analogies.
5. "commonMisconceptions": 3 common traps and how teachers should address them.
6. "differentiatedInstruction": Remedial support strategies and extension/enrichment activities.
7. "classroomActivities": 2 engaging oral or whiteboard activities.
8. "whiteboardLayout": Layout cues for blackboard / whiteboard summary.
9. "assessmentAdvice": Diagnostic tips for grading tests and student feedback.

Output JSON only with this structure:
{
  "learningObjectives": ["Objective 1", "Objective 2"],
  "prerequisites": "Description of prerequisite concepts",
  "pacingGuide": [
    { "period": 1, "topic": "Inductive Discovery & Core Concept", "duration": "40 mins", "activities": "Warm-up drill and inductive exploration" },
    { "period": 2, "topic": "Formal Rules & Modelled Analysis", "duration": "40 mins", "activities": "Walk through worked examples and identify traps" },
    { "period": 3, "topic": "Scaffolded & Independent Practice", "duration": "40 mins", "activities": "Exercises A–C and peer correction" },
    { "period": 4, "topic": "Olympiad Challenge & Assessment", "duration": "40 mins", "activities": "Mastery assessment test and self-reflection" }
  ],
  "teachingStrategies": ["Strategy 1", "Strategy 2"],
  "commonMisconceptions": [
    { "misconception": "Common student misunderstanding", "intervention": "Targeted corrective explanation" }
  ],
  "differentiatedInstruction": {
    "remedial": "Support strategies for struggling students",
    "extension": "Enrichment activities for advanced learners"
  },
  "classroomActivities": ["Activity 1", "Activity 2"],
  "whiteboardLayout": "Suggested whiteboard organization during direct instruction",
  "assessmentAdvice": "Key indicators of student mastery to look for"
}
`;
    } else {
      return res.status(400).json({
        error: `Unsupported componentId: "${componentId}". Supported canonical IDs are comp-9 through comp-23 (Worked Examples, Common Errors, Tips, Guided Practice, Exercises A–E, Supplemental, Challenge/Olympiad Drills, Chapter Summary, Mastery Assessment, Answer Key, and Teacher Notes).`,
      });
    }

    let parsed: any;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `${systemPrompt}\n\n${userPrompt}`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim() || "";
      if (text) {
        try {
          parsed = JSON.parse(text);
        } catch {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          }
        }
      }
    } catch (aiErr: any) {
      console.log("Gemini generation call failed:", aiErr?.message || aiErr);
      return res.status(502).json({
        error: "AI generation could not be completed. Your existing content has not been changed.",
      });
    }

    if (!parsed) {
      return res.status(502).json({
        error: "AI generation could not be completed. Your existing content has not been changed.",
      });
    }

    return res.json({ data: parsed });
  } catch (error: any) {
    console.log("Component generation route error:", error);
    return res.status(500).json({
      error: "AI generation could not be completed. Your existing content has not been changed.",
    });
  }
});

// ============================================================================
// VERITAS QUESTION AI ACTIONS: Question generation, distractor tuning & audits
// ============================================================================
app.post("/api/chapter-studio/question-ai-action", async (req, res) => {
  try {
    const {
      action,
      question,
      exerciseContext,
      topic,
      classLevel,
      board,
      subject,
      customInstructions = "",
    } = req.body || {};

    if (!action || typeof action !== "string" || !action.trim()) {
      return res.status(400).json({ error: "Action parameter is required." });
    }

    // Require canonical academic context from active project/chapter.
    // Do NOT apply silent defaults (no Class 6, no CISCE, no Academic Curriculum).
    const missingFields: string[] = [];
    if (!classLevel || typeof classLevel !== "string" || !classLevel.trim()) {
      missingFields.push("classLevel");
    }
    if (!board || typeof board !== "string" || !board.trim()) {
      missingFields.push("board");
    }
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      missingFields.push("subject");
    }
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      missingFields.push("topic");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required academic context: ${missingFields.join(", ")}. Question AI actions require real active project/chapter context (classLevel, board, subject, topic) and do not supply fallback defaults.`,
        missingFields,
      });
    }

    const trimmedTopic = topic.trim();
    const trimmedClass = classLevel.trim();
    const trimmedBoard = board.trim();
    const trimmedSubject = subject.trim();

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY is not configured." });
    }

    const gradeGuidance = getPedagogicalGradeGuidance(trimmedClass);
    const boardGuidance = getBoardProgrammeGuidance(trimmedBoard);

    const systemPrompt = `You are a distinguished academic textbook author and assessment specialist in ${trimmedSubject} for ${trimmedBoard} ${trimmedClass}.
${gradeGuidance}
${boardGuidance}
Always return strictly valid JSON matching the requested action schema.`;

    let prompt = "";

    if (action === "generate_similar") {
      prompt = `Create a parallel variant of this question for ${trimmedClass} (${trimmedBoard} curriculum in ${trimmedSubject}).
Topic: "${trimmedTopic}"
Original Question: ${JSON.stringify(question)}
Keep the same pedagogical cognitive level, format, and difficulty, but change names, numbers, contexts, or items.
Output JSON only:
{
  "question": {
    "type": "${question?.type || 'mcq'}",
    "instruction": "Instruction",
    "prompt": "New variant prompt",
    "options": ["Opt 1", "Opt 2", "Opt 3", "Opt 4"],
    "correctAnswer": "Correct answer",
    "explanation": "Clear explanation",
    "marks": ${question?.marks || 1},
    "difficulty": "${question?.difficulty || 'Medium'}",
    "cognitiveLevel": "${question?.cognitiveLevel || 'Applying'}"
  }
}`;
    } else if (action === "generate_distractors") {
      prompt = `For this Multiple Choice Question in ${trimmedSubject} (${trimmedBoard} ${trimmedClass}):
Prompt: "${question?.prompt || ''}"
Correct Answer: "${question?.correctAnswer || ''}"
Generate 3 plausible academic distractors reflecting common student misconceptions.
Output JSON only:
{
  "options": [
    "${question?.correctAnswer || 'Correct Answer'}",
    "Plausible Distractor 1",
    "Plausible Distractor 2",
    "Plausible Distractor 3"
  ],
  "distractorExplanations": [
    "Correct verified answer.",
    "Explanation why distractor 1 is incorrect.",
    "Explanation why distractor 2 is incorrect.",
    "Explanation why distractor 3 is incorrect."
  ]
}`;
    } else if (action === "generate_answer" || action === "generate_explanation") {
      prompt = `Provide an authoritative model answer and marking explanation for this question in ${trimmedSubject} (${trimmedBoard} ${trimmedClass}):
Prompt: "${question?.prompt || ''}"
Type: "${question?.type || 'short_answer'}"
${question?.options ? `Options: ${JSON.stringify(question.options)}` : ''}
Output JSON only:
{
  "correctAnswer": "Authoritative verified correct answer",
  "modelAnswer": "Detailed model response or step-by-step working if applicable",
  "explanation": "Clear pedagogical explanation citing core subject concept or principle",
  "markingPoints": ["Award 1 mark for ...", "Award 1 mark for ..."]
}`;
    } else if (action === "increase_difficulty") {
      prompt = `Increase the cognitive challenge and rigor of this question for ${trimmedClass} (${trimmedBoard} ${trimmedSubject}).
Original Prompt: "${question?.prompt || ''}"
Current Difficulty: "${question?.difficulty || 'Medium'}"
Make it higher-order (Applying, Analyzing, or Evaluating), adding subtlety, multi-step reasoning, or richer contextual constraints without creating trickery.
Output JSON only:
{
  "question": {
    "prompt": "More rigorous prompt",
    "instruction": "Clear instructions",
    "options": ${question?.options ? JSON.stringify(question.options) : '[]'},
    "correctAnswer": "Verified answer to upgraded prompt",
    "explanation": "Comprehensive explanation",
    "difficulty": "Hard",
    "cognitiveLevel": "Analyzing"
  }
}`;
    } else if (action === "decrease_difficulty") {
      prompt = `Make this question more accessible and scaffolded for ${trimmedClass} (${trimmedBoard} ${trimmedSubject}).
Original Prompt: "${question?.prompt || ''}"
Provide clear scaffolding, simplify sentence structure, and lower cognitive load to foundational level.
Output JSON only:
{
  "question": {
    "prompt": "Accessible simplified prompt",
    "instruction": "Clear simple instructions",
    "options": ${question?.options ? JSON.stringify(question.options) : '[]'},
    "correctAnswer": "Verified answer",
    "explanation": "Simple pedagogical explanation",
    "difficulty": "Easy",
    "cognitiveLevel": "Remembering"
  }
}`;
    } else if (action === "improve_question" || action === "check_ambiguity") {
      prompt = `Audit this question for editorial polish, precision, and pedagogical ambiguity in ${trimmedSubject} (${trimmedBoard} ${trimmedClass}):
Prompt: "${question?.prompt || ''}"
Type: "${question?.type || ''}"
Options: ${question?.options ? JSON.stringify(question.options) : 'None'}
Answer: "${question?.correctAnswer || ''}"
${customInstructions ? `Special Instructions: ${customInstructions}` : ''}

Evaluate:
1. Is the question completely unambiguous?
2. Does it test the intended concept cleanly?
3. Are the instructions self-contained?
4. Is there an improved prompt?

Output JSON only:
{
  "isAmbiguous": false,
  "ambiguityReport": "Audit summary",
  "improvedPrompt": "Polished, precise stem without ambiguity",
  "improvedInstruction": "Precise instruction",
  "editorialRecommendations": ["Recommendation 1", "Recommendation 2"]
}`;
    } else if (action === "generate_questions") {
      const count = req.body.count || 5;
      const qType = req.body.questionType || "mcq";
      prompt = `Generate ${count} questions of type "${qType}" for topic "${trimmedTopic}" in ${trimmedSubject} (${trimmedBoard} ${trimmedClass}).
Ensure progressive difficulty, clear rubrics, and verified model answers.
Output JSON only:
{
  "questions": [
    {
      "id": "q-gen-1",
      "type": "${qType}",
      "instruction": "Standard student instruction",
      "prompt": "Problem or question statement",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Clear explanation",
      "marks": 1,
      "difficulty": "Medium",
      "cognitiveLevel": "Understanding"
    }
  ]
}`;
    } else {
      return res.status(400).json({ error: `Unsupported question AI action: "${action}"` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${systemPrompt}\n\n${prompt}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "";
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        return res.status(502).json({ error: "Failed to parse JSON response from AI model.", raw: text });
      }
    }

    return res.json({
      ...parsed,
      data: parsed,
    });
  } catch (error: any) {
    console.log("Question AI action error:", error?.message || error);
    return res.status(500).json({ error: error.message || "Failed to process question AI action" });
  }
});

// ============================================================================
// VERITAS CHAPTER STUDIO: Humanise & Polish Manuscript Endpoint
// ============================================================================
app.post("/api/chapter-studio/humanize-manuscript", async (req, res) => {
  try {
    const {
      text,
      style = "natural",
      scope = "section",
      board,
      classLevel,
      subject,
      chapterTitle,
      customInstructions = "",
    } = req.body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ success: false, error: "No manuscript text provided to humanise." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ success: false, error: "AI service is currently unavailable. GEMINI_API_KEY is not configured." });
    }

    const effectiveClass = (typeof classLevel === "string" && classLevel.trim()) ? classLevel.trim() : "General";
    const effectiveBoard = (typeof board === "string" && board.trim()) ? board.trim() : "General Curriculum";
    const effectiveSubject = (typeof subject === "string" && subject.trim()) ? subject.trim() : "English Language & Grammar";
    const effectiveTitle = (typeof chapterTitle === "string" && chapterTitle.trim()) ? chapterTitle.trim() : "Textbook Chapter";

    const gradeGuidance = getPedagogicalGradeGuidance(effectiveClass);
    const boardGuidance = getBoardProgrammeGuidance(effectiveBoard);

    const styleDirectives: Record<string, string> = {
      natural: "Produce organic human sentence rhythm with varied cadences, natural transitions, and authentic authorial pacing. Eliminate monotonous, predictable phrasing.",
      conversational: "Adopt a direct, warm, student-friendly voice as if a brilliant, encouraging teacher is speaking directly to the student in class.",
      academic: "Elevate scholarly rigour, precise linguistic terminology, formal grammar distinctions, and analytical elegance.",
      textbook: "Deliver crisp, authoritative textbook prose with crystal-clear explanations, pedagogical definitions, and logical signposting.",
      child_friendly: "Use accessible, concrete vocabulary, vivid relatable comparisons, and supportive sentence lengths tailored for younger learners.",
      concise: "Strip away all filler, wordiness, tautologies, and bloated clauses while preserving 100% of the educational meaning and examples.",
      engaging: "Infuse dynamic energy, intellectual curiosity, vivid sentence openings, and memorable illustrations.",
      professional: "Maintain balanced, standard publishing house quality suitable for premier educational textbook publication.",
    };

    const chosenDirective = styleDirectives[style] || styleDirectives.natural;

    const systemPrompt = buildAcademicAiPromptContext({
      classLevel: effectiveClass,
      board: effectiveBoard,
      subject: effectiveSubject,
      chapterTitle: effectiveTitle,
      featureName: "Humanise & Polish Educational Manuscript",
      customInstructions: customInstructions,
    }) + `\n\nHUMANISE & POLISH OBJECTIVES:
- Polish Profile: ${chosenDirective}
- Target Scope: ${scope}
- PRESERVE TARGET CLASS LEVEL: Absolutely never inflate vocabulary or sentence complexity beyond ${effectiveClass}. Humanising Class 3 must NOT turn it into Class 8 language. Humanising Class 6 must NOT introduce university-level linguistics.
- PRESERVE PEDAGOGICAL ACCURACY: Never alter grammatical rules, definitions, correct answers, or core educational facts.
- NATURAL SENTENCE VARIATION: Vary sentence lengths (mix short punchy statements with compound explanatory thoughts).
- BAN AI CLICHÉS: Never use "dive in", "delve", "rich tapestry", "testament to", "unlock", "embark", "furthermore it is crucial to remember".
- CLEAN FORMATTING: Do not insert raw Markdown control syntax (like ### or ****). Deliver clean textbook prose.

Return strictly a JSON object with this structure (no markdown wrappers):
{
  "polishedText": "the refined, humanised manuscript text",
  "changesSummary": "one sentence summarizing the editorial improvements made (e.g. tightened syntax, enhanced conversational warmth, varied sentence length)",
  "wordCount": 120
}`;

    let polishedText = text;
    let changesSummary = "Editorial rhythm and voice refined.";
    let wordCount = text.trim().split(/\s+/).length;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Manuscript passage to polish/humanise:\n\n"""\n${text}\n"""`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
          responseMimeType: "application/json",
        },
      });

      const raw = response.text || "";
      try {
        const parsed = JSON.parse(raw);
        polishedText = cleanMarkdownSyntax(parsed.polishedText || text);
        changesSummary = parsed.changesSummary || "Editorial rhythm, syntax, and voice polished.";
        wordCount = parsed.wordCount || (parsed.polishedText ? parsed.polishedText.trim().split(/\s+/).length : 0);
      } catch {
        polishedText = cleanMarkdownSyntax(raw.trim());
        changesSummary = "Editorial rhythm and voice refined.";
        wordCount = raw.trim().split(/\s+/).length;
      }
    } catch (geminiError: any) {
      console.log("Humanise manuscript Gemini error, switching to pedagogical engine fallback:", geminiError?.message || geminiError);
      polishedText = cleanMarkdownSyntax(
        generatePedagogicalHumanizedText(
          text,
          style,
          effectiveClass,
          effectiveBoard,
          effectiveTitle
        )
      );
      changesSummary = "Refined pacing, varied sentence rhythm, and eliminated repetitive phrasing.";
      wordCount = polishedText.trim().split(/\s+/).length;
    }

    return res.json({
      success: true,
      polishedText,
      changesSummary,
      wordCount,
      fallback: true,
    });
  } catch (error: any) {
    console.log("Humanise manuscript error, switching to pedagogical fallback:", error?.message || error);
    const text = req.body?.text || "";
    const polishedText = cleanMarkdownSyntax(
      generatePedagogicalHumanizedText(
        text,
        req.body?.style || "natural",
        req.body?.classLevel || "General",
        req.body?.board || "Standard Curriculum",
        req.body?.chapterTitle || "Textbook Chapter"
      )
    );
    return res.json({
      success: true,
      polishedText,
      changesSummary: "Editorial rhythm and voice refined via pedagogical engine.",
      wordCount: polishedText.trim().split(/\s+/).length,
      fallback: true,
    });
  }
});

// ============================================================================
// VERITAS CHAPTER STUDIO: Draft Entire Grammar Chapter Endpoint
// ============================================================================
app.post("/api/chapter-studio/draft-entire-chapter", async (req, res) => {
  try {
    const {
      chapterTitle,
      classLevel,
      board,
      subject,
      instructions = "",
    } = req.body || {};

    if (!chapterTitle || typeof chapterTitle !== "string" || !chapterTitle.trim()) {
      return res.status(400).json({
        success: false,
        error: "Chapter title is required to draft a chapter. Please specify a chapter title.",
      });
    }

    const trimmedTitle = chapterTitle.trim();
    const effectiveClass = (typeof classLevel === "string" && classLevel.trim()) ? classLevel.trim() : "General";
    const effectiveBoard = (typeof board === "string" && board.trim()) ? board.trim() : "General Curriculum";
    const effectiveSubject = (typeof subject === "string" && subject.trim()) ? subject.trim() : "English Language & Grammar";

    const ai = getGenAI();
    if (!ai) {
      const fallbackDraft = generatePedagogicalChapterDraft(
        trimmedTitle,
        effectiveClass,
        effectiveBoard,
        effectiveSubject,
        instructions
      );
      return res.json({
        success: true,
        draft: fallbackDraft,
        fallback: true,
      });
    }

    const systemPrompt = buildAcademicAiPromptContext({
      classLevel: effectiveClass,
      board: effectiveBoard,
      subject: effectiveSubject,
      chapterTitle: trimmedTitle,
      featureName: "Draft Entire Chapter with AI",
      customInstructions: instructions,
    }) + `\n\nFLEXIBLE SECTION ARCHITECTURE:
- Propose a flexible chapter structure (between 3 and 7 sections) tailored specifically to this topic, grade level, and curriculum board.
- There must NEVER be a rigid or hard-coded chapter count. Propose authentic sections matching student age.
- Suggested section types may include:
  • Chapter Opener & Inquiry Discovery ("opener")
  • Core Conceptual Explanation & Foundations ("explanation")
  • Grammar Rules, Structural Formulas & Principles ("rules")
  • Exemplary Usage & Variations ("examples")
  • Common Errors & Exam Traps ("common_errors")
  • Scaffolded Practice Exercises & Answer Keys ("exercises")
  • Chapter Summary & Quick Reference ("summary")

CRITICAL FORMATTING RULES:
- Heading titles MUST be clean textbook headings without raw markdown hashes (###) or asterisks (**).
- Body content must author continuous, age-calibrated textbook reading material (minimum 100-250 words per section).
- Do not generate university-level headings for younger students.

Return strictly valid JSON with this structure:
{
  "chapterTitle": "${trimmedTitle}",
  "subtitle": "Scholarly subtitle describing the scope",
  "pedagogicalOverview": "Brief overview of how the chapter develops mastery",
  "sections": [
    {
      "id": "sec-1",
      "title": "Section Title",
      "sectionType": "explanation",
      "content": "Full drafted textbook prose with examples...",
      "rationale": "Pedagogical rationale for this section..."
    }
  ]
}`;

    try {
      const authorDirectivePrompt = instructions?.trim()
        ? `\n\nAUTHOR DIRECTIVES (MANDATORY - MUST GOVERN STRUCTURE AND PROSE):\n"${instructions.trim()}"\nIf the author asks for prerequisite definitions (e.g. definitions of subject and verb before agreement), dedicate section(s) to them before the main topic rules.`
        : "";

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Draft the complete textbook chapter: "${trimmedTitle}" for ${effectiveClass} under ${effectiveBoard}.${authorDirectivePrompt}`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.65,
          responseMimeType: "application/json",
        },
      });

      const raw = response.text || "";
      let parsed: any = null;
      if (raw.trim()) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          const m = raw.match(/\{[\s\S]*\}/);
          if (m) parsed = JSON.parse(m[0]);
        }
      }

      if (!parsed || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
        throw new Error("Invalid or empty sections in AI response");
      }

      // Sanitize titles, subtitles, and section content rigorously
      const classNum = parseClassLevelNumber(effectiveClass);
      parsed.chapterTitle = cleanHeadingTitle(parsed.chapterTitle || trimmedTitle);
      parsed.subtitle = cleanHeadingTitle(parsed.subtitle || '');
      parsed.pedagogicalOverview = cleanLeakedEditorialTerms(cleanMarkdownSyntax(parsed.pedagogicalOverview || ''), classNum);
      parsed.sections = parsed.sections.map((s: any, idx: number) => {
        const { cleanContent, extractedRationale } = sanitizeContentStrippingRationale(s.content || '');
        const finalRationale = cleanMarkdownSyntax(s.rationale || extractedRationale || '');
        const studentProse = cleanLeakedEditorialTerms(cleanContent, classNum);
        return {
          ...s,
          title: cleanHeadingTitle(s.title || `Section ${idx + 1}`),
          content: studentProse,
          rationale: finalRationale,
        };
      });

      return res.json({
        success: true,
        draft: parsed,
      });
    } catch (geminiError: any) {
      console.log("Draft entire chapter Gemini error, switching to pedagogical engine fallback:", geminiError?.message || geminiError);
      const fallbackDraft = generatePedagogicalChapterDraft(
        trimmedTitle,
        effectiveClass,
        effectiveBoard,
        effectiveSubject,
        instructions
      );
      return res.json({
        success: true,
        draft: fallbackDraft,
        fallback: true,
      });
    }
  } catch (error: any) {
    console.log("Draft entire chapter internal error, switching to pedagogical fallback:", error?.message || error);
    const trimmedTitle = (req.body?.chapterTitle || "English Grammar Chapter").trim();
    const fallbackDraft = generatePedagogicalChapterDraft(
      trimmedTitle,
      req.body?.classLevel || "General",
      req.body?.board || "Standard Curriculum",
      req.body?.subject || "English Language & Grammar",
      req.body?.instructions || ""
    );
    return res.json({
      success: true,
      draft: fallbackDraft,
      fallback: true,
    });
  }
});

// ============================================================================
// VERITAS CHAPTER STUDIO: Central AI Writing Action Endpoint
// ============================================================================
app.post("/api/chapter-studio/ai-writing-action", async (req, res) => {
  try {
    const {
      action,
      text = "",
      chapterTitle,
      sectionTitle = "",
      board,
      classLevel,
      subject,
      existingChapterContent = "",
      additionalInstructions = "",
    } = req.body || {};

    if (!action || typeof action !== "string") {
      return res.status(400).json({ error: "Missing required action parameter." });
    }

    const effectiveClass = (typeof classLevel === "string" && classLevel.trim()) ? classLevel.trim() : "General";
    const effectiveBoard = (typeof board === "string" && board.trim()) ? board.trim() : "Standard Curriculum";
    const effectiveSubject = (typeof subject === "string" && subject.trim()) ? subject.trim() : "English Language & Grammar";
    const effectiveTitle = (typeof chapterTitle === "string" && chapterTitle.trim()) ? chapterTitle.trim() : "Grammar Chapter";

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: "AI service unavailable. GEMINI_API_KEY is not configured." });
    }

    const gradeGuidance = getPedagogicalGradeGuidance(effectiveClass);
    const boardGuidance = getBoardProgrammeGuidance(effectiveBoard);

    const actionDirectives: Record<string, { label: string; prompt: string }> = {
      continue_writing: {
        label: "Continue Writing",
        prompt: `Continue the manuscript narrative and exposition naturally from the preceding text. Maintain consistent pedagogical voice, depth, and tone. Seamlessly advance the concept.`,
      },
      generate_section: {
        label: "Generate Section",
        prompt: `Draft a comprehensive, engaging textbook section for "${sectionTitle || "Grammar Concept"}" in "${chapterTitle}". Include clear conceptual explanation, authentic illustrative sentences, and pedagogical callouts.`,
      },
      expand: {
        label: "Expand Content",
        prompt: `Expand the provided text with richer explanatory depth, concrete analogies, and clearer step-by-step reasoning without fluff or empty repetition.`,
      },
      shorten: {
        label: "Shorten & Condense",
        prompt: `Condense the text into lean, punchy, student-friendly prose while retaining every core rule, definition, and essential example.`,
      },
      rewrite: {
        label: "Rewrite",
        prompt: `Rewrite the provided text with improved pedagogical clarity, crisp syntax, and heightened student engagement.`,
      },
      explain_clearly: {
        label: "Explain More Clearly",
        prompt: `Rephrase this concept with luminous clarity. Break complex grammar mechanics down into an intuitive, memorable explanation that any student can understand effortlessly.`,
      },
      simplify_grade: {
        label: `Simplify for ${classLevel}`,
        prompt: `Calibrate the vocabulary, sentence structures, and conceptual difficulty specifically for ${classLevel} students. Use relatable everyday scenarios and clear, accessible language.`,
      },
      make_advanced: {
        label: "Make More Advanced / Olympiad",
        prompt: `Deepen the academic rigor to Olympiad/advanced competitive examination level. Include syntactic edge cases, subtle inversions, parenthetical distractors, and nuanced concord challenges.`,
      },
      generate_examples: {
        label: "Generate Illustrative Examples",
        prompt: `Provide 5 authentic, culturally relevant example sentences showcasing this rule. Include contrastive pairs (Correct vs Incorrect) with brief explanations of the underlying syntactic mechanics.`,
      },
      generate_exercises: {
        label: "Generate Practice Exercises",
        prompt: `Author 6 diverse, high-quality practice questions (fill-in-the-blanks, error spotting, sentence re-writing) calibrated for ${classLevel} ${board}, complete with answer keys and explanations.`,
      },
      generate_answer_key: {
        label: "Generate Answer Key & Explanations",
        prompt: `Produce a comprehensive, rigorous answer key with step-by-step syntactic explanations and common trap alerts for the provided exercises or questions.`,
      },
      generate_learning_objectives: {
        label: "Generate Learning Objectives",
        prompt: `Formulate 4-5 measurable learning objectives based on Bloom's Revised Taxonomy (Remember, Understand, Apply, Analyze, Evaluate) specifically for "${chapterTitle}" in ${classLevel}.`,
      },
      suggest_activities: {
        label: "Suggest Classroom Activities",
        prompt: `Propose 3 engaging, collaborative classroom or individual activities (e.g. grammar games, detective error hunts, peer quiz-crafting) that reinforce this topic interactively.`,
      },
      check_grammar: {
        label: "Check Grammar & Mechanical Precision",
        prompt: `Analyze the provided text for grammatical precision, punctuation, typographical consistency, and stylistic flow. Suggest specific corrections with reasons.`,
      },
      check_consistency: {
        label: "Check Curriculum Consistency",
        prompt: `Review the chapter excerpt for consistency in terminology, grade-level vocabulary, and pedagogical progression across the curriculum framework.`,
      },
      check_age_appropriateness: {
        label: "Check Age Appropriateness",
        prompt: `Evaluate the readability, cognitive load, and age-appropriateness of this content for ${classLevel} (typical age range). Provide an assessment and recommended adjustments.`,
      },
      suggest_visual: {
        label: "Suggest Visual / Illustration Brief",
        prompt: `Design a vivid textbook visual brief (diagram, comic strip, flowchart, or infobox) that visually explains this grammatical concept to visual learners. Include layout, caption, and art instruction.`,
      },
      polish_writing: {
        label: "Polish Writing",
        prompt: `Polish the authorial prose to publication-ready textbook standard, balancing academic authority with approachable clarity.`,
      },
    };

    const config = actionDirectives[action] || {
      label: "AI Authoring Assist",
      prompt: `Assist the textbook author with: ${action}`,
    };

    const systemPrompt = buildAcademicAiPromptContext({
      classLevel: effectiveClass,
      board: effectiveBoard,
      subject: effectiveSubject,
      chapterTitle: effectiveTitle,
      featureName: config.label,
      customInstructions: additionalInstructions,
    }) + `\n\nAUTHORING TASK:
Task: ${config.prompt}
Current Section: "${sectionTitle || "Main Manuscript"}"
${additionalInstructions ? `Specific Author Instructions: ${additionalInstructions}` : ""}

CRITICAL FORMATTING & CLASS INTEGRITY:
- Vocabulary, explanations, and examples MUST strictly match ${effectiveClass}.
- Never make explanations complicated just to sound academic.
- Do NOT output raw markdown hashes (###) or bold asterisks (**) inside headings or labels.

Return strictly a JSON object with this schema (no markdown wrappers):
{
  "actionLabel": "${config.label}",
  "result": "The high quality drafted content or editorial response...",
  "rationale": "Brief pedagogical rationale for why this fits ${effectiveClass} ${effectiveBoard}."
}`;

    const userContent = `Context / Excerpt:\n"""\n${text || existingChapterContent.slice(-800) || chapterTitle}\n"""`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userContent,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
          responseMimeType: "application/json",
        },
      });

      const raw = response.text || "";
      try {
        const parsed = JSON.parse(raw);
        return res.json({
          success: true,
          actionLabel: parsed.actionLabel || config.label,
          result: cleanMarkdownSyntax(parsed.result || raw),
          rationale: parsed.rationale || "",
        });
      } catch {
        return res.json({
          success: true,
          actionLabel: config.label,
          result: cleanMarkdownSyntax(raw.trim()),
          rationale: "",
        });
      }
    } catch (geminiError: any) {
      console.log("AI writing action: Gemini quota/credits depleted, switching to pedagogical engine fallback:", geminiError?.message || geminiError);
      const fallbackResult = generatePedagogicalWritingAction(
        action,
        effectiveTitle,
        sectionTitle,
        effectiveClass,
        effectiveBoard,
        effectiveSubject,
        text,
        additionalInstructions
      );
      return res.json({
        success: true,
        actionLabel: fallbackResult.actionLabel,
        result: fallbackResult.result,
        rationale: fallbackResult.rationale,
        fallback: true,
      });
    }
  } catch (error: any) {
    console.log("AI writing action general error, switching to pedagogical fallback:", error?.message || error);
    const fallbackResult = generatePedagogicalWritingAction(
      req.body?.action || "polish_writing",
      req.body?.chapterTitle || "English Grammar",
      req.body?.sectionTitle || "",
      req.body?.classLevel || "General",
      req.body?.board || "Standard Curriculum",
      req.body?.subject || "English Language & Grammar",
      req.body?.text || "",
      req.body?.additionalInstructions || ""
    );
    return res.json({
      success: true,
      actionLabel: fallbackResult.actionLabel,
      result: fallbackResult.result,
      rationale: fallbackResult.rationale,
      fallback: true,
    });
  }
});

// ============================================================================
// VERITAS ACADEMIC EDITORIAL REVIEW: Audit Clarity for Assessments & Questions
// ============================================================================
app.post("/api/ai/audit-clarity", async (req, res) => {
  try {
    const {
      questionText,
      questionType,
      options,
      correctAnswer,
      subject,
      board,
      grade,
      chapter,
      learningObjective,
    } = req.body;

    if (!questionText || typeof questionText !== "string" || !questionText.trim()) {
      return res.status(400).json({ error: "Question text is required for clarity audit." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured on the server. Please configure GEMINI_API_KEY.",
      });
    }

    // Build rich context preserving pedagogical integrity
    const contextLines: string[] = [
      `Question Prompt / Stem: "${questionText.trim()}"`,
    ];
    if (questionType) contextLines.push(`Question Type: ${questionType}`);
    if (Array.isArray(options) && options.length > 0) {
      contextLines.push(`Answer Options:\n${options.map((opt, i) => `  ${String.fromCharCode(65 + i)}) ${opt}`).join("\n")}`);
    }
    if (correctAnswer) contextLines.push(`Designated Correct Answer: ${correctAnswer}`);
    if (grade) contextLines.push(`Target Grade / Level: ${grade}`);
    if (subject) contextLines.push(`Subject: ${subject}`);
    if (board) contextLines.push(`Curriculum Framework / Board: ${board}`);
    if (chapter) contextLines.push(`Chapter / Unit: ${chapter}`);
    if (learningObjective) contextLines.push(`Intended Concept / Learning Objective: ${learningObjective}`);

    const systemInstruction = `You are a Senior Academic Editorial Quality Assessor and Psychometrician for VERITAS Publishing.
Your task is to audit assessment and question items for genuine clarity problems before textbook/exam publication.
Do NOT automatically change the author's original question. Identify genuine clarity, linguistic, and psychometric issues without pedantic or purely subjective stylistic rewriting.

EVALUATION CRITERIA:
1. Ambiguous wording: phrasing with multiple plausible interpretations or vague directives.
2. Grammatical errors: subject-verb discord, faulty parallelism, dangling modifiers, incorrect tense/aspect, punctuation errors altering meaning.
3. Unclear pronoun or antecedent references: "it", "they", "this" without an unambiguous referent.
4. Incomplete instructions: failing to instruct the student on what form or format the response should take.
5. Unnecessarily complex wording: convoluted syntax, excessive jargon unsuitable for the targeted student level.
6. Inappropriate difficulty of language: vocabulary or sentence structures misaligned with the selected grade level.
7. Accidental clues to the answer: grammatical giveaways (e.g. "an [vowel-starting answer]"), option length disparities, echo words from the stem in the correct option.
8. Multiple potentially correct answers: more than one option that could be logically or factually defended as correct.
9. Weak or implausible MCQ distractors: options that are nonsensical, humorous, or too easily eliminated, undermining question validity.
10. Mismatch between question and intended concept/learning objective.
11. Redundant information: extraneous filler that confuses or distracts students.
12. Misleading wording: trick questions or double negatives that test reading confusion rather than subject competence.

FOR MULTIPLE CHOICE QUESTIONS (MCQs):
You MUST analyse the question stem, all options, and the designated correct answer.

STATUS CLASSIFICATION:
- "CLEAR": The question is unambiguous, grammatically sound, psychometrically robust, and grade-appropriate. No meaningful clarity problem exists. The issues array should be empty and suggestedRevision must be null.
- "MINOR_REVIEW": The question is mostly clear but contains minor punctuation, phrasing, or distractor issues that would improve readability or rigor.
- "NEEDS_REVISION": The question has substantive ambiguity, multiple correct answers, flawed instructions, severe grammatical discord, or misleading distractors that invalidate the item.

CRITICAL RULES:
- Preserve original pedagogical intention and factual meaning.
- Avoid rewriting questions that are already clear.
- Distinguish grammatical issues from pedagogical issues.
- Never silently alter the designated correct answer.
- If suggesting a revision, provide a clean, direct revised question that fixes the detected issues while preserving the teacher's core pedagogical goal.
- If status is "CLEAR", suggestedRevision MUST be null and issues array MUST be empty.
- Return structured JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Audit the clarity and psychometric validity of this assessment question:\n\n${contextLines.join("\n\n")}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              enum: ["CLEAR", "MINOR_REVIEW", "NEEDS_REVISION"],
              description: "Status classification of clarity",
            },
            issues: {
              type: Type.ARRAY,
              description: "List of detected clarity issues",
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "Category of clarity issue",
                  },
                  excerpt: {
                    type: Type.STRING,
                    description: "Problematic excerpt or option text if applicable",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Editorial explanation of the problem",
                  },
                  severity: {
                    type: Type.STRING,
                    enum: ["low", "medium", "high"],
                    description: "Severity level of this issue",
                  },
                },
                required: ["type", "explanation", "severity"],
              },
            },
            suggestedRevision: {
              type: Type.STRING,
              description: "Suggested revised question, or empty/null if CLEAR",
            },
            pedagogicalNote: {
              type: Type.STRING,
              description: "Optional pedagogical advice for the author",
            },
          },
          required: ["status", "issues"],
        },
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      return res.status(502).json({ error: "Empty model response received from Gemini." });
    }

    const parsed = JSON.parse(rawText);

    // Normalize output structure
    const status = ["CLEAR", "MINOR_REVIEW", "NEEDS_REVISION"].includes(parsed.status)
      ? parsed.status
      : "MINOR_REVIEW";

    const issues = Array.isArray(parsed.issues)
      ? parsed.issues.map((iss: any) => ({
          type: iss.type || "Clarity Issue",
          excerpt: iss.excerpt || undefined,
          explanation: iss.explanation || "",
          severity: ["low", "medium", "high"].includes(iss.severity) ? iss.severity : "medium",
        }))
      : [];

    const suggestedRevision =
      status === "CLEAR" || !parsed.suggestedRevision || parsed.suggestedRevision.trim() === ""
        ? null
        : parsed.suggestedRevision.trim();

    const pedagogicalNote = parsed.pedagogicalNote?.trim() || null;

    return res.json({
      status,
      issues,
      suggestedRevision,
      pedagogicalNote,
    });
  } catch (error: any) {
    console.error("Clarity audit endpoint error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while auditing question clarity.",
    });
  }
});

// ============================================================================
// VERITAS ACADEMIC EDITORIAL REVIEW: Audit Accuracy & Answer Key
// ============================================================================
app.post("/api/ai/audit-accuracy", async (req, res) => {
  try {
    const {
      questionText,
      questionType,
      options,
      currentAnswer,
      rationale,
      marks,
      subject,
      board,
      grade,
      chapter,
      learningObjective,
    } = req.body;

    if (!questionText || typeof questionText !== "string" || !questionText.trim()) {
      return res.status(400).json({ error: "Question text is required for accuracy audit." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured on the server. Please configure GEMINI_API_KEY.",
      });
    }

    // Build comprehensive pedagogical & curriculum context
    const contextLines: string[] = [
      `Question Prompt / Stem: "${questionText.trim()}"`,
    ];
    if (questionType) contextLines.push(`Question Type: ${questionType}`);
    if (Array.isArray(options) && options.length > 0) {
      contextLines.push(
        `Options:\n${options.map((opt, i) => `  ${String.fromCharCode(65 + i)}) ${opt}`).join("\n")}`
      );
    }
    if (currentAnswer !== undefined && currentAnswer !== null && String(currentAnswer).trim()) {
      contextLines.push(`Current Designated Answer / Key: "${String(currentAnswer).trim()}"`);
    } else {
      contextLines.push(`Current Designated Answer / Key: [None Provided]`);
    }
    if (rationale) contextLines.push(`Current Explanation / Rationale: "${rationale.trim()}"`);
    if (marks !== undefined && marks !== null) contextLines.push(`Assigned Marks: ${marks}`);
    if (grade) contextLines.push(`Target Grade / Level: ${grade}`);
    if (subject) contextLines.push(`Subject: ${subject}`);
    if (board) contextLines.push(`Curriculum Framework / Board: ${board}`);
    if (chapter) contextLines.push(`Chapter / Topic: ${chapter}`);
    if (learningObjective) contextLines.push(`Target Learning Objective: ${learningObjective}`);

    const systemInstruction = `You are a Senior Academic Subject-Matter Expert, Fact-Checker, and Chief Assessment Editor for VERITAS Academic Publishing.
Your task is to conduct an authoritative, rigorous, and non-destructive EDITORIAL ACCURACY & ANSWER KEY AUDIT on an assessment item.

CORE AUDIT DIRECTIVES:
1. Factual Accuracy: Verify that all facts, rules, scientific assertions, grammatical principles, historical details, and mathematical premises stated in the question stem and options are 100% accurate.
2. Correctness of Answer: Determine whether the currently designated answer/key is genuinely correct and whether it directly and fully answers the question stem.
3. Multiple Choice (MCQ) Rigor:
   - Verify whether the designated correct option is unequivocally correct.
   - Check whether another option is also reasonably or defensibly correct (avoiding ambiguity).
   - Check whether NO option is correct (a defective question).
   - Check whether options are logically consistent with the stem.
   - Verify that distractors do not contain unintended factual errors or misleading falsehoods stated as fact.
   - Detect whether wording in the stem or options accidentally reveals the answer.
4. Non-MCQ Item Support (Fill in the blanks, True/False, Short/Long Answer, Assertion-Reason, Match the following, Definitions, etc.):
   - Verify that the designated answer key provides an exact, definitive, and board-appropriate model answer.
   - For True/False, verify the factual truth value.
   - For Assertion-Reason, check the individual truth values of both statements AND whether the reason correctly explains the assertion.
   - For Fill-in-the-blanks, check if the designated word or phrase fits syntactically and semantically.
5. Internal Consistency: Check that the question does not contain contradictory premises.
6. Rationale Agreement: Verify that the author's explanation/rationale logically supports the designated correct answer.
7. Terminology & Context: Check that terminology is academically standard and strictly appropriate to the specified grade, subject, and curriculum board (e.g. CISCE, CBSE, Cambridge, IB).

CRITICAL UNCERTAINTY DIRECTIVE:
- Do NOT force a verdict of "VERIFIED" if the question references an unprovided reading passage, external diagram, unquoted poem, or external text not supplied in the prompt.
- If reliable verification cannot be made from the question and supplied context alone, you MUST set:
  status: "INSUFFICIENT_CONTEXT"
  answerStatus: "UNVERIFIABLE"
  confidence: "low" or "medium"
  Explain clearly what specific context or reference material is missing to make a definitive determination.
- Clearly distinguish between finding an actual factual error ("ERROR_FOUND") versus being unable to verify due to missing context ("INSUFFICIENT_CONTEXT").

STATUS DEFINITIONS:
- "VERIFIED": The question and designated answer are factually sound, correct, consistent, and board-appropriate. Confidence is high.
- "REVIEW_RECOMMENDED": The question or answer key has minor ambiguities, suboptimal terminology, or an alternate interpretation that merits editorial review, but is not outright factually false.
- "ERROR_FOUND": A clear factual error, wrong designated answer, contradiction, or question defect was identified.
- "INSUFFICIENT_CONTEXT": Missing passage, external reference, or inadequate context prevents a confident determination.

ANSWER STATUS DEFINITIONS:
- "CORRECT": The designated answer is verified correct.
- "INCORRECT": The designated answer is incorrect or the wrong option is designated.
- "AMBIGUOUS": Multiple options or interpretations could be correct.
- "NOT_APPLICABLE": Question has no designated answer key yet (e.g. open prompt).
- "UNVERIFIABLE": Cannot be verified without external passage, diagram, or additional context.

CONFIDENCE RATINGS:
- "high": Absolute subject-matter certainty based on standard academic facts.
- "medium": Probable determination, with minor contextual assumptions.
- "low": High uncertainty or missing external text/data.

IMPORTANT:
- The audit is advisory. Never assume your suggestions will automatically overwrite data.
- If status is "ERROR_FOUND" or "REVIEW_RECOMMENDED", provide:
  - suggestedAnswer: The exact corrected answer text (or option letter + text for MCQ).
  - suggestedQuestionRevision: The corrected question text if the stem contained errors or contradictions.
- If status is "VERIFIED", suggestedAnswer and suggestedQuestionRevision should be null.
- Output MUST conform to the structured JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Audit the factual accuracy, answer key correctness, and internal consistency of this assessment item:\n\n${contextLines.join("\n\n")}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              enum: ["VERIFIED", "REVIEW_RECOMMENDED", "ERROR_FOUND", "INSUFFICIENT_CONTEXT"],
              description: "Overall accuracy status of the question and answer key",
            },
            answerStatus: {
              type: Type.STRING,
              enum: ["CORRECT", "INCORRECT", "AMBIGUOUS", "NOT_APPLICABLE", "UNVERIFIABLE"],
              description: "Status of the currently designated answer key",
            },
            findings: {
              type: Type.ARRAY,
              description: "List of specific factual, pedagogical, or key issues detected",
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "Category of finding (e.g., Factual Error, Wrong Key, Multiple Correct Options, Ambiguous Stem)",
                  },
                  severity: {
                    type: Type.STRING,
                    enum: ["low", "medium", "high"],
                    description: "Severity level of this finding",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Detailed editorial explanation of the issue",
                  },
                  excerpt: {
                    type: Type.STRING,
                    description: "Specific problematic text excerpt from stem or options if applicable",
                  },
                },
                required: ["type", "severity", "explanation"],
              },
            },
            currentAnswer: {
              type: Type.STRING,
              description: "The evaluated current answer key, or null if none",
            },
            suggestedAnswer: {
              type: Type.STRING,
              description: "Suggested corrected answer key if current is wrong or suboptimal, otherwise null",
            },
            suggestedQuestionRevision: {
              type: Type.STRING,
              description: "Suggested revised question stem if stem contains errors or contradictions, otherwise null",
            },
            explanation: {
              type: Type.STRING,
              description: "Comprehensive summary of the accuracy and key audit findings",
            },
            confidence: {
              type: Type.STRING,
              enum: ["high", "medium", "low"],
              description: "Confidence level of the audit determination",
            },
            editorialNote: {
              type: Type.STRING,
              description: "Optional professional guidance or academic reference note for the editor",
            },
          },
          required: ["status", "answerStatus", "findings", "explanation", "confidence"],
        },
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      return res.status(502).json({ error: "Empty model response received from Gemini." });
    }

    const parsed = JSON.parse(rawText);

    // Defensive normalization
    const validStatuses = ["VERIFIED", "REVIEW_RECOMMENDED", "ERROR_FOUND", "INSUFFICIENT_CONTEXT"];
    const status = validStatuses.includes(parsed.status) ? parsed.status : "REVIEW_RECOMMENDED";

    const validAnswerStatuses = ["CORRECT", "INCORRECT", "AMBIGUOUS", "NOT_APPLICABLE", "UNVERIFIABLE"];
    const answerStatus = validAnswerStatuses.includes(parsed.answerStatus)
      ? parsed.answerStatus
      : "UNVERIFIABLE";

    const validConfidence = ["high", "medium", "low"];
    const confidence = validConfidence.includes(parsed.confidence) ? parsed.confidence : "medium";

    const findings = Array.isArray(parsed.findings)
      ? parsed.findings.map((f: any) => ({
          type: f.type || "Accuracy Finding",
          severity: ["low", "medium", "high"].includes(f.severity) ? f.severity : "medium",
          explanation: f.explanation || "",
          excerpt: f.excerpt || undefined,
        }))
      : [];

    const suggestedAnswer =
      status === "VERIFIED" || !parsed.suggestedAnswer || !parsed.suggestedAnswer.trim()
        ? null
        : parsed.suggestedAnswer.trim();

    const suggestedQuestionRevision =
      status === "VERIFIED" ||
      !parsed.suggestedQuestionRevision ||
      !parsed.suggestedQuestionRevision.trim()
        ? null
        : parsed.suggestedQuestionRevision.trim();

    return res.json({
      status,
      answerStatus,
      findings,
      currentAnswer: currentAnswer || parsed.currentAnswer || null,
      suggestedAnswer,
      suggestedQuestionRevision,
      explanation: parsed.explanation || "Audit completed.",
      confidence,
      editorialNote: parsed.editorialNote?.trim() || null,
    });
  } catch (error: any) {
    console.error("Accuracy audit endpoint error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while auditing question accuracy and answer key.",
    });
  }
});

// 2. AI Detector Risk & Narrative Quality Analysis
app.post("/api/gemini/analyze-detector-risk", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required for analysis." });
    }

    const ai = getGenAI();
    if (!ai) {
      // Algorithmic fallback if key not configured
      const words = text.trim().split(/\s+/);
      const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
      const sentenceLengths = sentences.map((s: string) => s.trim().split(/\s+/).length);
      const avgLength = sentenceLengths.reduce((a: number, b: number) => a + b, 0) / (sentenceLengths.length || 1);
      const variance = sentenceLengths.reduce((acc: number, len: number) => acc + Math.pow(len - avgLength, 2), 0) / (sentenceLengths.length || 1);
      const stdDev = Math.sqrt(variance);

      // Higher stdDev = higher burstiness = more human
      const burstinessRatio = Math.min(100, Math.round((stdDev / (avgLength || 1)) * 100));
      const humanScore = Math.min(96, Math.max(52, Math.round(55 + burstinessRatio * 0.4)));

      return res.json({
        humanProbability: humanScore,
        burstinessScore: burstinessRatio,
        perplexityGrade: "Moderate",
        flaggedSegments: [],
        pacingAssessment: "Heuristic evaluation based on sentence variance and cadence.",
        recommendations: [
          "Vary short punchy sentences with longer descriptive sentences.",
          "Ground scenes with concrete sensory anchors.",
        ],
      });
    }

    const prompt = `You are a forensic computational linguist and expert novel editor specializing in AI detection mechanics (evaluating burstiness, perplexity, syntactical predictability, and uniform token distribution).
Analyze the following creative writing excerpt and return a valid JSON object with the exact structure below. Do not wrap in markdown quotes if possible, or use standard json.

Excerpt:
"""
${text.slice(0, 4000)}
"""

JSON Structure:
{
  "humanProbability": <number from 0 to 100 where 100 is completely indistinguishable from authentic human writing>,
  "burstinessScore": <number from 0 to 100 measuring sentence length and syntactic variation>,
  "perplexityGrade": "<'Low' | 'Moderate' | 'High' | 'Natural Human'>",
  "pacingAssessment": "<concise 2-sentence breakdown of sentence cadence and narrative flow>",
  "flaggedSegments": [
    {
      "text": "<specific phrase or sentence that risks AI detection flag>",
      "reason": "<why it flags: e.g. uniform clause length, generic transition, cliché>",
      "humanizedAlternative": "<suggested human rewrite with punchy or sensory cadence>"
    }
  ],
  "recommendations": [
    "<recommendation 1>",
    "<recommendation 2>",
    "<recommendation 3>"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI detector risk analysis error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze AI risk." });
  }
});

// 3. AI Art & Visual Generation API (Character Portraits, Scene Artwork, Book Covers)
app.post("/api/gemini/generate-art", async (req, res) => {
  try {
    const { prompt, type, style, aspectRatio = "1:1" } = req.body;
    // type: 'cover' | 'character' | 'scene'

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    let enhancedPrompt = prompt;
    if (type === "cover") {
      enhancedPrompt = `Book cover design, stunning literary typography and composition, ${style || "cinematic"}: ${prompt}. High quality, elegant book illustration.`;
    } else if (type === "character") {
      enhancedPrompt = `Character concept art portrait, expressive eyes and attire, ${style || "digital painting"}: ${prompt}. Masterpiece character design.`;
    } else if (type === "scene") {
      enhancedPrompt = `Key novel scene visual, immersive atmosphere, dynamic lighting, ${style || "concept art"}: ${prompt}. Dramatic storytelling moment.`;
    }

    // Try generating image with imagen-3.0-generate-002 or gemini-3.1-flash-lite-image
    let imageDataUrl: string | null = null;
    try {
      const imgRes = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio as any,
        },
      });

      const b64 = imgRes.generatedImages?.[0]?.image?.imageBytes;
      if (b64) {
        imageDataUrl = `data:image/jpeg;base64,${b64}`;
      }
    } catch (imgErr: any) {
      console.warn("Imagen generation failed, trying gemini-3.1-flash-lite-image...", imgErr?.message);
      try {
        const fallbackRes = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: (aspectRatio === "16:9" ? "16:9" : aspectRatio === "3:4" ? "3:4" : "1:1") as any,
            },
          },
        });

        for (const part of fallbackRes.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageDataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (fbErr: any) {
        console.warn("Gemini flash image also failed:", fbErr?.message);
      }
    }

    if (imageDataUrl) {
      return res.json({ imageUrl: imageDataUrl, prompt: enhancedPrompt });
    } else {
      return res.status(422).json({
        error: "Image generation model currently unavailable or quota reached. You can use our integrated SVG Cover Designer or provide custom artwork.",
      });
    }
  } catch (error: any) {
    console.error("Art generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate visual asset" });
  }
});

// 3b. AI Educational Visual & Illustration Studio Generator (Phase 4E-2)
app.post("/api/gemini/generate-educational-art", async (req, res) => {
  try {
    const { brief, title, concept, style, aspectRatio = "16:9" } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const enhancedPrompt = `Educational textbook illustration for academic publishing. Subject: ${title || concept}. Scene: ${brief?.description || concept}. Required elements: ${(brief?.requiredElements || []).join(", ")}. Avoid: ${(brief?.elementsToAvoid || []).join(", ")}. Style: ${style || "Clean editorial textbook line art with soft watercolor tints, high clarity, culturally respectful, print-ready, zero distracting noise"}.`;

    let imageDataUrl: string | null = null;
    try {
      const imgRes = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio as any,
        },
      });

      const b64 = imgRes.generatedImages?.[0]?.image?.imageBytes;
      if (b64) {
        imageDataUrl = `data:image/jpeg;base64,${b64}`;
      }
    } catch (imgErr: any) {
      console.warn("Educational Imagen generation failed, trying gemini-3.1-flash-lite-image...", imgErr?.message);
      try {
        const fallbackRes = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: (aspectRatio === "16:9" ? "16:9" : aspectRatio === "3:4" ? "3:4" : "1:1") as any,
            },
          },
        });

        for (const part of fallbackRes.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageDataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (fbErr: any) {
        console.warn("Gemini flash image fallback failed:", fbErr?.message);
      }
    }

    if (imageDataUrl) {
      return res.json({ imageUrl: imageDataUrl, prompt: enhancedPrompt });
    } else {
      return res.status(422).json({
        error: "AI image generator unavailable; using high-fidelity vector SVG engine.",
      });
    }
  } catch (error: any) {
    console.error("Educational art generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate educational visual asset" });
  }
});

// 4. Cloud Sync & End-to-End Encrypted Storage Endpoints
app.post("/api/cloud/sync", (req, res) => {
  const { projectId, encryptedData, iv, version, author, authorEmail, metadata, auditLog } = req.body;

  if (!projectId || !encryptedData) {
    return res.status(400).json({ error: "Missing required sync parameters (projectId, encryptedData)." });
  }

  const payload: CloudProjectPayload = {
    projectId,
    encryptedData,
    iv: iv || "",
    version: version || 1,
    author: author || "Anonymous Author",
    authorEmail: authorEmail || "",
    timestamp: new Date().toISOString(),
    metadata: metadata || {
      title: "Untitled Novel",
      wordCount: 0,
      chapterCount: 0,
      characterCount: 0,
    },
    auditLog: auditLog || [],
  };

  if (!cloudStorage[projectId]) {
    cloudStorage[projectId] = [];
  }
  cloudStorage[projectId].unshift(payload);

  // Keep max 50 versions in cloud history
  if (cloudStorage[projectId].length > 50) {
    cloudStorage[projectId].pop();
  }

  // Record audit log
  const logEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    user: author || "Author",
    action: "CLOUD_SYNC",
    details: `Encrypted cloud snapshot saved (v${payload.version}, ${payload.metadata.wordCount} words)`,
  };
  globalAuditLogs.unshift(logEntry);

  res.json({
    success: true,
    version: payload.version,
    timestamp: payload.timestamp,
    message: "Encrypted snapshot successfully synchronized to cloud.",
  });
});

app.get("/api/cloud/project/:projectId", (req, res) => {
  const { projectId } = req.params;
  const projectHistory = cloudStorage[projectId];
  if (!projectHistory || projectHistory.length === 0) {
    return res.status(404).json({ error: "Project not found in cloud backup." });
  }
  res.json({
    latest: projectHistory[0],
    versionsCount: projectHistory.length,
    versions: projectHistory.map((v) => ({
      version: v.version,
      timestamp: v.timestamp,
      author: v.author,
      metadata: v.metadata,
    })),
  });
});

app.get("/api/cloud/audit-logs", (_req, res) => {
  res.json({ logs: globalAuditLogs.slice(0, 100) });
});

// 5. Grammar Book Series & LMS Exercise/Test AI Generator
app.post("/api/gemini/grammar", async (req, res) => {
  try {
    const {
      mode = "exercises", // 'definitions' | 'exercises' | 'test_series' | 'from_pdf'
      classLevel = "Class 6",
      topic = "Subject-Verb Agreement",
      instructions = "",
      questionTypes = ["mcq", "fill_in_blanks", "match_column"],
      count = 5,
      difficulty = "Medium",
      pdfBase64,
      pdfMimeType = "application/pdf",
      extractedText = "",
    } = req.body;

    const ai = getGenAI();

    // Pedagogical instructions per class band
    const classBandGuidance = `
PEDAGOGICAL CALIBRATION FOR ${classLevel}:
- Class 3 to 5 (Primary): Concrete everyday vocabulary, simple single-clause sentences, relatable themes (animals, family, school, sports), gentle hints, playful context.
- Class 6 to 8 (Middle School): Compound sentences, clause awareness, foundational rules (tenses, active/passive, prepositions, subject-verb concord), medium difficulty distractors.
- Class 9 to 10 (Secondary / Board Exams): Complex sentences, nuanced exceptions, error-spotting, formal transformation of sentences, synthesis, real-world formal English.
- Class 11 to 12 (Senior Secondary / Competitive Prep): Advanced syntax, subjunctive mood, conditionals, inversion, idiom subtleties, stylistic clarity, rigorous academic precision.
`;

    if (!ai) {
      return res.status(503).json({
        error: "AI generation failed. Your existing content has not been changed.",
      });
    }

    // Build Gemini AI Prompt
    const parts: any[] = [];

    if (pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: pdfMimeType || "application/pdf",
          data: pdfBase64,
        },
      });
    }

    let promptSystem = `You are a distinguished K-12 English Language & Grammar textbook author and Learning Management System (LMS / Moodle) assessment architect.
${classBandGuidance}
Target Class Level: ${classLevel}
Grammar Topic: ${topic}
Target Difficulty: ${difficulty}
Requested Question Count: ${count}
Question Types to Generate: ${Array.isArray(questionTypes) ? questionTypes.join(", ") : questionTypes}
Additional User Instructions:
"""
${instructions || "Follow modern communicative and structural English syllabus standards."}
"""
${extractedText ? `Attached Source Reference Text:\n"""\n${extractedText.slice(0, 5000)}\n"""\n` : ""}`;

    if (mode === "definitions") {
      promptSystem += `\nTask: Draft a complete, comprehensive, age-appropriate textbook lesson unit for "${topic}" in ${classLevel}.
Return a JSON object strictly matching this schema:
{
  "definitions": [
    {
      "id": "def-1",
      "term": "${topic}",
      "partOfSpeechOrCategory": "<grammar category>",
      "ageAppropriateExplanation": "<crystal-clear explanation tailored specifically for ${classLevel}>",
      "formulaOrSyntax": "<syntactic formula e.g. Subject + Auxiliary + Main Verb>",
      "rules": ["<Rule 1>", "<Rule 2>", "<Rule 3>"],
      "examples": [
        { "sentence": "<example sentence>", "highlightWord": "<key word>", "note": "<why it follows the rule>" },
        { "sentence": "<example sentence 2>", "highlightWord": "<key word 2>", "note": "<explanation>" }
      ],
      "exceptions": ["<exception 1>", "<exception 2>"],
      "commonMistakes": [
        { "incorrect": "<common student error>", "correct": "<corrected sentence>", "reason": "<grammatical explanation>" }
      ]
    }
  ],
  "notesAndTheoryMarkdown": "<comprehensive markdown textbook chapter lesson, including introductory context, step-by-step rules, handy memory tips/mnemonics, and a summary box suitable for ${classLevel}>"
}`;
    } else if (mode === "test_series") {
      promptSystem += `\nTask: Generate a comprehensive, professional Examination / Test Series Paper for ${classLevel} on "${topic}".
Include sections: Section A (MCQs), Section B (Fill in the blanks), Section C (Match the columns or Error Spotting), Section D (Transformation / Sentence synthesis).
Return a JSON object strictly matching:
{
  "title": "<e.g. Unit Test Paper: ${topic} - ${classLevel}>",
  "classLevel": "${classLevel}",
  "totalMarks": 25,
  "durationMinutes": 45,
  "instructions": [
    "All questions are compulsory.",
    "Read instructions for each section carefully before answering."
  ],
  "sections": [
    {
      "id": "sec-a",
      "title": "Section A: Multiple Choice Questions",
      "description": "Choose the most appropriate option.",
      "questions": [
        {
          "id": "q-1",
          "type": "mcq",
          "prompt": "<Question prompt>",
          "instruction": "<Instruction>",
          "difficulty": "${difficulty}",
          "marks": 1,
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A) ...",
          "explanation": "<Pedagogical explanation>"
        }
      ]
    },
    {
      "id": "sec-b",
      "title": "Section B: Fill in the Blanks",
      "description": "Supply the suitable grammatical form.",
      "questions": [
        {
          "id": "q-2",
          "type": "fill_in_blanks",
          "prompt": "<Sentence prompt>",
          "blanksSentence": "The train ___ (arrive) before we reached the station.",
          "hints": "arrive / had arrived",
          "acceptableAnswers": ["had arrived"],
          "correctAnswer": "had arrived",
          "difficulty": "${difficulty}",
          "marks": 1,
          "explanation": "<Explanation>"
        }
      ]
    },
    {
      "id": "sec-c",
      "title": "Section C: Match the Column",
      "description": "Match items of Column A with Column B.",
      "questions": [
        {
          "id": "q-3",
          "type": "match_column",
          "prompt": "Match Column A with Column B",
          "marks": 4,
          "difficulty": "${difficulty}",
          "columnA": [{ "id": "a1", "text": "..." }, { "id": "a2", "text": "..." }, { "id": "a3", "text": "..." }, { "id": "a4", "text": "..." }],
          "columnB": [{ "id": "b1", "text": "..." }, { "id": "b2", "text": "..." }, { "id": "b3", "text": "..." }, { "id": "b4", "text": "..." }],
          "matchPairs": [{ "aId": "a1", "bId": "b1" }, { "aId": "a2", "bId": "b2" }, { "aId": "a3", "bId": "b3" }, { "aId": "a4", "bId": "b4" }],
          "correctAnswer": "1-A, 2-B, 3-C, 4-D",
          "explanation": "<Explanation>"
        }
      ]
    },
    {
      "id": "sec-d",
      "title": "Section D: Sentence Transformation & Error Spotting",
      "description": "Rewrite or correct sentences as directed.",
      "questions": [
        {
          "id": "q-4",
          "type": "error_correction",
          "prompt": "Identify and correct the error:",
          "originalSentence": "<Sentence with error>",
          "correctedSentence": "<Corrected sentence>",
          "marks": 2,
          "difficulty": "${difficulty}",
          "correctAnswer": "<Correction>",
          "explanation": "<Explanation>"
        }
      ]
    }
  ]
}`;
    } else {
      // Default: exercises
      promptSystem += `\nTask: Generate ${count} high-quality grammar exercise questions for ${classLevel} on "${topic}".
Ensure variety across requested question types: MCQ, Fill in the blanks, Match the column, Error correction, and Transformation.
Return a JSON object strictly matching:
{
  "title": "${topic} Exercises - ${classLevel}",
  "instructions": "Attempt all questions. Apply grammatical rules carefully.",
  "questions": [
    {
      "id": "q-1",
      "type": "<'mcq' | 'fill_in_blanks' | 'match_column' | 'error_correction' | 'transformation'>",
      "prompt": "<Question prompt>",
      "instruction": "<Instruction>",
      "difficulty": "${difficulty}",
      "marks": 1,
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "<Exact correct answer>",
      "blanksSentence": "<Sentence with blank for fill_in_blanks>",
      "acceptableAnswers": ["<acceptable answer>"],
      "hints": "<optional hint or word bank>",
      "columnA": [{ "id": "a1", "text": "..." }, { "id": "a2", "text": "..." }],
      "columnB": [{ "id": "b1", "text": "..." }, { "id": "b2", "text": "..." }],
      "matchPairs": [{ "aId": "a1", "bId": "b1" }],
      "originalSentence": "<Sentence to transform or correct>",
      "correctedSentence": "<Corrected sentence>",
      "explanation": "<Crystal clear pedagogical explanation for teachers and students>"
    }
  ]
}`;
    }

    parts.push({ text: promptSystem });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: parts,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Grammar AI generator error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate grammar exercises." });
  }
});

// 7. Sentence Diagrammer & Clause Visualizer AI Parser
app.post("/api/gemini/parse-sentence", async (req, res) => {
  try {
    const { sentence, targetClass } = req.body;
    if (!sentence || typeof sentence !== "string" || !sentence.trim()) {
      return res.status(400).json({ error: "Please provide a valid sentence to diagram." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        suggestion: "Please configure your Gemini API key in Settings.",
      });
    }

    const promptSystem = `You are an expert K-12 English Linguist and Grammarian specializing in Traditional Reed-Kellogg diagramming and modern Constituent Syntax Tree parsing.
Sentence to diagram: "${sentence.trim()}"
${targetClass ? `Target Level: ${targetClass}` : ""}

Analyze the sentence thoroughly and return a JSON object with this exact structure:
{
  "classification": "simple" | "compound" | "complex" | "compound-complex",
  "classLevelRecommendation": "Class 3" through "Class 12",
  "strand": "e.g., Simple Subject & Predicate | Compound Coordination | Adverbial Subordination | Relative Clause Architecture | Noun Clause Embeddings",
  "pedagogicalNotes": "A clear 2-3 sentence explanation of the sentence's syntactic architecture, clause relationships, and key teaching takeaway.",
  "clauses": [
    {
      "id": "c-1",
      "type": "principal" | "subordinate_noun" | "subordinate_adverb" | "subordinate_relative" | "coordinate",
      "typeName": "Principal Clause" | "Subordinate Adverbial Clause of Time" | etc.,
      "color": "indigo" | "emerald" | "amber" | "rose" | "cyan",
      "text": "<full clause substring>",
      "conjunction": "<subordinating or coordinating conjunction if present>",
      "functionInSentence": "<e.g., Acts as the main independent thought | Modifies the verb 'reached' by expressing condition>",
      "subject": {
        "text": "<subject phrase>",
        "headNoun": "<core subject noun/pronoun>",
        "modifiers": ["<modifier words>"]
      },
      "predicate": {
        "verbPhrase": "<finite verb or verb group>",
        "tense": "<e.g., Simple Past Active>",
        "transitivity": "transitive" | "intransitive" | "linking",
        "directObject": "<direct object if transitive>",
        "indirectObject": "<indirect object if ditransitive>",
        "complement": "<subject or object complement if linking/factitive>",
        "adverbials": ["<adverbial modifiers or prepositional phrases>"]
      }
    }
  ],
  "tokens": [
    {
      "id": "t-1",
      "word": "<individual token without punctuation>",
      "pos": "noun" | "pronoun" | "verb" | "adjective" | "adverb" | "preposition" | "conjunction" | "determiner" | "interjection",
      "role": "subject" | "predicate_verb" | "auxiliary_verb" | "direct_object" | "indirect_object" | "subject_complement" | "object_complement" | "preposition" | "object_of_preposition" | "adjective_modifier" | "adverb_modifier" | "determiner" | "coordinating_conjunction" | "subordinating_conjunction",
      "roleLabel": "e.g. Subject Head | Finite Transitive Verb | Direct Object | Preposition | Object of Preposition | Definite Article",
      "clauseId": "c-1",
      "clauseName": "Principal Clause",
      "modifiesTarget": "<the word it modifies, if applicable>"
    }
  ],
  "reedKellogg": [
    {
      "clauseId": "c-1",
      "clauseType": "principal",
      "conjunctionToParent": {
        "word": "<conjunction word if subordinate/coordinate>",
        "dashedConnectorText": "<relationship>"
      },
      "subject": "<Head Subject>",
      "subjectModifiers": [{ "word": "The", "type": "determiner" }],
      "verb": "<Main Verb>",
      "verbModifiers": [{ "word": "diligently", "type": "adverb" }],
      "objectOrComplement": "<Object or Complement if present>",
      "complementType": "direct_object" | "subject_complement_noun" | "subject_complement_adj" | "object_complement",
      "objectModifiers": [{ "word": "a", "type": "determiner" }],
      "prepPhrases": [
        {
          "preposition": "in",
          "object": "the garden",
          "attachesTo": "verb" | "subject" | "object",
          "modifiers": ["the"]
        }
      ]
    }
  ],
  "syntaxTree": {
    "id": "node-root",
    "label": "S",
    "fullLabel": "Sentence",
    "category": "clause",
    "text": "${sentence.trim()}",
    "children": [
      {
        "id": "node-np-1",
        "label": "NP",
        "fullLabel": "Noun Phrase (Subject)",
        "category": "phrase",
        "children": [...]
      },
      {
        "id": "node-vp-1",
        "label": "VP",
        "fullLabel": "Verb Phrase (Predicate)",
        "category": "phrase",
        "children": [...]
      }
    ]
  }
}`;

    let responseText: string | null = null;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: promptSystem }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      responseText = response.text || null;
    } catch (primaryErr: any) {
      console.warn("Primary model gemini-3.8-flash retry:", primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: promptSystem }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });
      responseText = fallbackResponse.text || null;
    }

    const parsed = JSON.parse(responseText || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Sentence diagrammer AI parser error:", error);
    return res.status(500).json({ error: error.message || "Failed to diagram sentence." });
  }
});

// AI Flashcard Generator for Spaced Repetition (Irregular Verbs, Idioms, Grammar Rules)
app.post("/api/gemini/generate-flashcards", async (req, res) => {
  try {
    const { domain = "irregular_verbs", classLevel = "Class 7", topic = "General high-yield", count = 4 } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        suggestion: "Please configure your Gemini API key in Settings.",
      });
    }

    const promptSystem = `You are a master English linguist and K-12 curriculum author.
Create ${count} high-yield, pedagogically rigorous spaced-repetition flashcards for students at the ${classLevel} level.
Target Domain: ${domain} (Allowed: irregular_verbs, idioms, grammar_rules).
Specific Focus / Topic: ${topic}

Domain specific instructions:
1. If domain is 'irregular_verbs':
   - Pick verbs with frequent spelling mistakes, vowel shifts (ablaut), confusion pairs (lie/lay, hang/hung/hanged), or invariant forms.
   - Supply V1 (base), V2 (past simple), V3 (past participle), V-ing, 3rd person singular, IPA phonetics, and a warning if easily confused.
   - Provide a cloze test sentence where the student must supply the correct form in context.

2. If domain is 'idioms':
   - Provide the idiom, clear figurative meaning, literal meaning (if applicable), fascinating etymology/historical origin, authentic dialogue example, register (informal/formal/literary), and a cloze sentence.

3. If domain is 'grammar_rules':
   - Provide the rule name, category, an incorrect sentence exhibiting the common pitfall (❌), the corrected sentence (✅), a detailed explanation of the grammatical principle, an unforgettable mnemonic or heuristic trick, and a cloze question.

Format your response strictly as JSON with this exact schema:
{
  "flashcards": [
    {
      "id": "generated-fc-1",
      "domain": "${domain}",
      "classLevel": "${classLevel}",
      "title": "Title of the card",
      "frontPrompt": "The question or challenge on the front of the card",
      "backAnswer": "The thorough pedagogical explanation and answer on the back",
      "clozeSentence": "Sentence with ___ for testing recall",
      "clozeAnswer": "The exact word or phrase that fills the blank",
      "exampleSentence": "A polished exemplar sentence demonstrating standard usage",
      "tags": ["tag1", "tag2"],
      "difficulty": "medium",
      "irregularVerbDetails": {
        "v1": "base",
        "v2": "past",
        "v3": "participle",
        "vIng": "participle_ing",
        "v3rd": "third_person",
        "phoneticV1": "/.../",
        "phoneticV2": "/.../",
        "phoneticV3": "/.../",
        "confusionWarning": "Warning note"
      },
      "idiomDetails": {
        "idiom": "The idiom",
        "figurativeMeaning": "Meaning",
        "literalMeaning": "Literal",
        "originOrEtymology": "Origin",
        "dialogueExample": "\\"Dialogue line\\"",
        "register": "conversational"
      },
      "grammarRuleDetails": {
        "ruleName": "Rule name",
        "category": "Category",
        "incorrectExample": "Incorrect sentence",
        "correctExample": "Correct sentence",
        "explanation": "Explanation",
        "mnemonic": "Mnemonic trick",
        "examTrapNote": "Exam tip"
      }
    }
  ]
}`;

    let responseText: string | null = null;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: promptSystem }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });
      responseText = response.text || null;
    } catch (primaryErr: any) {
      console.warn("Primary model busy for flashcard gen, retrying gemini-3.8-flash:", primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: promptSystem }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });
      responseText = fallbackResponse.text || null;
    }

    const parsed = JSON.parse(responseText || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Flashcard generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate flashcards." });
  }
});

// AI Composition & Writing Skills Evaluator against Curriculum Rubrics
app.post("/api/grammar/grade-composition", async (req, res) => {
  try {
    const { genre = "formal_letter", subCategory = "letter_to_editor", classLevel = "Class 8", studentText = "", rubric = {} } = req.body;

    if (!studentText.trim()) {
      return res.status(400).json({ error: "No text provided for composition grading." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        suggestion: "Please configure your Gemini API key in Settings.",
      });
    }

    const totalMarks = rubric.totalMarks || 5;
    const formatMarks = rubric.formatMarks || 1;
    const contentMarks = rubric.contentMarks || 2;
    const expressionMarks = rubric.expressionMarks || 2;

    const gradingSystemPrompt = `You are a Chief Examiner and Master English Pedagogy Evaluator for K-12 English Language curricula (CBSE / ICSE / Cambridge).
Evaluate the following student composition draft with rigorous adherence to official board marking criteria and rubrics.

TARGET DETAILS:
- Genre: ${genre} (Formal Letter or Notice Writing)
- Sub-category: ${subCategory}
- Student Class Level: ${classLevel}
- Total Marks: ${totalMarks} (Format: ${formatMarks}, Content: ${contentMarks}, Expression: ${expressionMarks})

STUDENT DRAFT TEXT:
"""
${studentText}
"""

MARKING SCHEME RULES TO APPLY:
1. FORMAT (${formatMarks} marks):
   - For Formal Letters: Verify Sender's Address, Date in expanded format, Receiver's official designation & address, Subject line, Salutation, 3 distinct body paragraphs, Complimentary Close, and Signatory Name/Designation.
   - For Notice Writing: Verify Name of issuing authority/school at top, bold 'NOTICE', Date of issue, concise Headline, Signatory Name & Designation at bottom, and whether it is structured for a rectangular box frame. Strict 50-word adherence.
2. CONTENT (${contentMarks} marks):
   - For Formal Letters: Clear statement of purpose/hook in Para 1, detailed ground reality and consequences in Para 2, constructive appeal/actionable remedies in Para 3.
   - For Notice: Complete coverage of all 5 Ws: What (event/item), When (date & time), Where (venue), Who (target class/eligibility), Whom to contact (deadline/designation).
3. EXPRESSION (${expressionMarks} marks):
   - Grammatical accuracy, formal institutional register, sophisticated transitional connectors, sentence variety, absence of casual slang or shorthand.
4. ACCURACY & WORD COUNT:
   - Calculate actual words. Notice benchmark: 40-55 words (50 target). Formal letter: 120-150 words. Apply penalties (-0.5 to -1.0) if significantly deviated.

OUTPUT FORMAT: Return STRICT JSON matching this schema:
{
  "totalScore": number (0 to ${totalMarks}, round to 0.5 increments),
  "maxScore": ${totalMarks},
  "percentage": number (0 to 100),
  "letterGrade": "A+" | "A" | "B+" | "B" | "C" | "Needs Revision",
  "wordCount": {
    "actual": number,
    "recommendedMin": number,
    "recommendedMax": number,
    "status": "under" | "optimal" | "over",
    "penalty": number
  },
  "criteriaBreakdown": [
    {
      "criterion": "Format",
      "scoredMarks": number,
      "maxMarks": ${formatMarks},
      "rubricExpectations": ["string", "string"],
      "assessedFeedback": "string"
    },
    {
      "criterion": "Content",
      "scoredMarks": number,
      "maxMarks": ${contentMarks},
      "rubricExpectations": ["string", "string"],
      "assessedFeedback": "string"
    },
    {
      "criterion": "Expression",
      "scoredMarks": number,
      "maxMarks": ${expressionMarks},
      "rubricExpectations": ["string", "string"],
      "assessedFeedback": "string"
    }
  ],
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "annotatedObservations": [
    {
      "targetText": "string",
      "annotationType": "format" | "grammar" | "vocabulary" | "praise",
      "comment": "string"
    }
  ],
  "overallComments": "string"
}`;

    let responseText: string | null = null;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: gradingSystemPrompt }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      responseText = response.text || null;
    } catch (primaryErr: any) {
      console.warn("Primary model error for composition grading, retrying gemini-3.8-flash:", primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: gradingSystemPrompt }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });
      responseText = fallbackResponse.text || null;
    }

    const parsed = JSON.parse(responseText || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Composition grading error:", error);
    return res.status(500).json({ error: error.message || "Failed to grade composition." });
  }
});

// AI Composition Prompt Generator
app.post("/api/grammar/generate-composition-prompt", async (req, res) => {
  try {
    const { genre = "formal_letter", classLevel = "Class 8", topic = "Road safety and pedestrian crossings" } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        suggestion: "Please configure your Gemini API key in Settings.",
      });
    }

    const promptSystem = `You are a senior curriculum developer for K-12 English Language and Literature.
Formulate a highly authentic, examination-grade writing prompt for ${classLevel} students.
Target Genre: ${genre} (Allowed: formal_letter or notice).
Target Scenario Theme: ${topic}.

OUTPUT FORMAT: Return STRICT JSON matching this schema:
{
  "id": "prompt_${Date.now()}",
  "title": "string (Concise title)",
  "genre": "${genre}",
  "subCategory": "string",
  "classLevels": ["${classLevel}"],
  "scenarioDescription": "string (Clear problem context or event description naming the student persona, school/city, and required task)",
  "inputNotes": ["string", "string", "string"],
  "prescribedWordCount": { "min": number, "max": number, "target": number },
  "maxMarks": 5,
  "rubric": {
    "formatMarks": 1,
    "contentMarks": 2,
    "expressionMarks": 2,
    "accuracyPenaltyNotes": "string",
    "guidelines": ["string", "string"]
  },
  "sampleSolution": {
    "modelText": "string (Full exemplary text following standard board layout)",
    "markingAnnotations": [
      { "element": "string", "marksEarned": "string", "note": "string" }
    ]
  }
}`;

    let responseText: string | null = null;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: promptSystem }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });
      responseText = response.text || null;
    } catch (primaryErr: any) {
      console.warn("Primary model error for prompt gen, falling back to gemini-3.8-flash:", primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: promptSystem }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });
      responseText = fallbackResponse.text || null;
    }

    const parsed = JSON.parse(responseText || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Composition prompt generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate composition prompt." });
  }
});

// Start server with Vite middleware in dev or static files in prod + WebSocket Live API
async function startServer() {
  const server = http.createServer(app);

  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    try {
      const host = request.headers.host || `localhost:${PORT}`;
      const url = new URL(request.url || "", `http://${host}`);
      if (url.pathname === "/api/live" || url.pathname === "/live") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      }
    } catch (err: any) {
      console.warn("WebSocket upgrade error:", err?.message || err);
    }
  });

  // Handle client WebSocket connection for real-time voice with gemini-3.8-live
  wss.on("connection", async (clientWs: WebSocket, req: http.IncomingMessage) => {
    console.log("[Live API] Client connected to WebSocket");
    const ai = getGenAI();
    if (!ai) {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            status: "closed",
            error: "GEMINI_API_KEY is not configured on the server. Please configure your API key in Settings.",
          })
        );
        try {
          clientWs.close(1008, "Missing API Key");
        } catch {}
      }
      return;
    }

    let session: any = null;
    let isClosed = false;

    // Optional voice preference from URL query: ?voice=Zephyr / Kore / Puck / Charon / Fenrir
    let voiceName = "Zephyr";
    try {
      const host = req.headers.host || `localhost:${PORT}`;
      const url = new URL(req.url || "", `http://${host}`);
      const v = url.searchParams.get("voice");
      if (v && ["Puck", "Charon", "Kore", "Fenrir", "Zephyr"].includes(v)) {
        voiceName = v;
      }
    } catch {}

    try {
      clientWs.send(
        JSON.stringify({
          status: "connecting",
          model: "gemini-3.8-live",
          voice: voiceName,
        })
      );

      session = await ai.live.connect({
        model: "gemini-3.8-live",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          },
          systemInstruction:
            "You are an intelligent, expressive voice companion and creative writing & grammar mentor for the Novel Organizer & Humanized Writer studio. Converse naturally and helpfully in real-time with the author or educator. Keep answers engaging, thoughtful, conversational, and direct.",
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

            // Model audio parts
            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
              if (part.text) {
                clientWs.send(JSON.stringify({ text: part.text }));
              }
            }

            // Output transcription if model provided text
            if ((message.serverContent as any)?.outputAudioTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  text: (message.serverContent as any).outputAudioTranscription.text,
                })
              );
            }

            // User audio transcription if provided
            if ((message.serverContent as any)?.inputAudioTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  userText: (message.serverContent as any).inputAudioTranscription.text,
                })
              );
            }

            // Model turn interrupted by user speaking (barge-in)
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }

            // Turn completed
            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ turnComplete: true }));
            }
          },
          onerror: (err: any) => {
            console.warn("[Live API] Notice from Gemini Live session:", err?.message || err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  error: err?.message || "Gemini Live session notice.",
                  status: "error",
                })
              );
            }
          },
          onclose: (closeEvent?: any) => {
            console.log("[Live API] Gemini Live session closed", closeEvent?.code, closeEvent?.reason);
            const isCreditsIssue =
              closeEvent?.code === 1011 ||
              (closeEvent?.reason && /credit|prepayment|depleted|billing|exhaust/i.test(closeEvent.reason));

            const friendlyReason = isCreditsIssue
              ? "Gemini API prepayment credits are depleted for real-time streaming audio. You can use Speech & Chat companion mode."
              : (closeEvent?.reason || "Live session disconnected.");

            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  status: "closed",
                  error: friendlyReason,
                  isQuotaOrCreditIssue: isCreditsIssue,
                  code: closeEvent?.code,
                })
              );
              try {
                clientWs.close(1000, "Session closed cleanly");
              } catch {}
            }
          },
        },
      });

      console.log("[Live API] Connected to gemini-3.8-live");
      clientWs.send(
        JSON.stringify({
          status: "connected",
          model: "gemini-3.8-live",
          voice: voiceName,
        })
      );

      clientWs.on("message", (raw) => {
        if (isClosed || !session) return;
        try {
          const payload = JSON.parse(raw.toString());
          if (payload.audio) {
            // Raw 16kHz linear PCM 16-bit little-endian
            session.sendRealtimeInput({
              audio: { data: payload.audio, mimeType: "audio/pcm;rate=16000" },
            });
          } else if (payload.text) {
            // Optional text input prompt to live session
            session.sendRealtimeInput({
              text: payload.text,
            });
          }
        } catch (err: any) {
          console.warn("[Live API] Error handling incoming client payload:", err?.message);
        }
      });

      clientWs.on("close", () => {
        isClosed = true;
        console.log("[Live API] Client disconnected");
        try {
          if (session && typeof session.close === "function") {
            session.close();
          }
        } catch {}
      });

      clientWs.on("error", (err) => {
        console.warn("[Live API] Client socket notice:", err.message);
        isClosed = true;
        try {
          if (session && typeof session.close === "function") {
            session.close();
          }
        } catch {}
      });
    } catch (err: any) {
      console.warn("[Live API] Failed to initialize live session:", err?.message || err);
      if (clientWs.readyState === WebSocket.OPEN) {
        const isQuota = /prepayment|credit|depleted|429|quota|billing/i.test(err?.message || "");
        clientWs.send(
          JSON.stringify({
            status: "closed",
            error: isQuota
              ? "Gemini API prepayment credits are depleted for streaming voice. You can use Speech & Chat companion mode."
              : (err.message || "Failed to initialize Live API session with gemini-3.8-live"),
            isQuotaOrCreditIssue: isQuota,
          })
        );
        try {
          clientWs.close(1000, "Initialization ended");
        } catch {}
      }
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
