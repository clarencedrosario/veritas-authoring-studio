// ai/free-ai.ts
// Drop-in replacement for @google/genai that routes calls to any
// OpenAI-compatible provider: Groq, Ollama, OpenRouter, etc.

type ContentPart = { text?: string; inlineData?: { mimeType: string; data: string } };
type ContentInput =
  | string
  | { role?: string; parts: ContentPart[] }
  | Array<{ role?: string; parts?: ContentPart[] } | { text: string }>;

interface GenerateConfig {
  systemInstruction?: string;
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  responseSchema?: unknown;
}

export class FreeAIProvider {
  models: FreeAIModels;
  live: { connect: (...args: any[]) => Promise<never> };

  constructor(opts: { baseUrl: string; apiKey: string; defaultModel: string }) {
    this.models = new FreeAIModels(opts.baseUrl, opts.apiKey, opts.defaultModel);

    // Live streaming voice is Gemini-only. Endpoints that call this
    // will throw and your existing try/catch will surface the error.
    this.live = {
      connect: async () => {
        throw new Error(
          "Live voice streaming requires the Gemini API. Use Speech & Chat companion mode instead."
        );
      },
    };
  }
}

class FreeAIModels {
  constructor(
    private baseUrl: string,
    private apiKey: string,
    private defaultModel: string
  ) {}

  async generateContent(args: {
    model?: string;
    contents: ContentInput;
    config?: GenerateConfig;
  }): Promise<{ text: string }> {
    const cfg = args.config || {};
    const { system, user } = this.extractMessages(args.contents, cfg.systemInstruction);

    const body: Record<string, unknown> = {
      model: this.defaultModel, // Gemini model names are ignored; env var decides.
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: user },
      ],
      temperature: cfg.temperature ?? 0.7,
      top_p: cfg.topP ?? 0.95,
      max_tokens: cfg.maxOutputTokens ?? 2048,
    };

    // JSON mode
    if (cfg.responseMimeType === "application/json") {
      body.response_format = { type: "json_object" };
    }

    const resp = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      throw new Error(`AI provider ${resp.status}: ${errText || resp.statusText}`);
    }

    const json = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return { text: json?.choices?.[0]?.message?.content || "" };
  }

  async generateImages(): Promise<never> {
    throw new Error(
      "Image generation is not supported by the free provider. Falling back to SVG engine."
    );
  }

  private extractMessages(contents: ContentInput, systemInstruction?: string) {
    let system = systemInstruction || "";
    let user = "";

    if (typeof contents === "string") {
      user = contents;
    } else if (Array.isArray(contents)) {
      const parts: string[] = [];
      for (const c of contents as any[]) {
        if (typeof c === "string") {
          parts.push(c);
        } else if (c?.parts && Array.isArray(c.parts)) {
          for (const p of c.parts) {
            if (p.text) parts.push(p.text);
            if (p.inlineData) parts.push(`[Attached binary: ${p.inlineData.mimeType}]`);
          }
        } else if (typeof c?.text === "string") {
          parts.push(c.text);
        }
      }
      user = parts.join("\n\n");
    } else if (contents && typeof contents === "object" && "parts" in contents) {
      user = (contents as any).parts
        .map((p: any) => p.text || "")
        .filter(Boolean)
        .join("\n\n");
    }

    return { system, user };
  }
}