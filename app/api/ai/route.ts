import { NextRequest, NextResponse } from "next/server";
import { mockReply } from "@/lib/mock";
import { allow } from "@/lib/rate";

export const runtime = "nodejs";
export const maxDuration = 60;

type Turn = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 60;
const MAX_CHARS = 20_000;

function pickJson(text: string): unknown {
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("no json");
  return JSON.parse(text.slice(a, b + 1));
}

function clean(raw: unknown): Turn[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_TURNS) return null;
  const out: Turn[] = [];
  let chars = 0;
  for (const t of raw) {
    if (!t || (t.role !== "user" && t.role !== "assistant") || typeof t.content !== "string") return null;
    chars += t.content.length;
    out.push({ role: t.role, content: t.content });
  }
  if (chars > MAX_CHARS || out[0].role !== "user" || out[out.length - 1].role !== "user") return null;
  return out;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!allow(ip, Number(process.env.AI_RATE_LIMIT) || 120)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  let body: { turns?: unknown; tier?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const turns = clean(body.turns);
  if (!turns) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const review = body.tier === "default";

  const gkey = process.env.GEMINI_API_KEY;
  if (gkey) {
    // Same conversion as public/game/ai.js: the first turn is the character's rules (system instruction).
    let sys: string | null = null;
    const contents: { role: string; parts: { text: string }[] }[] = [];
    turns.forEach((t, i) => {
      if (i === 0 && t.role === "user" && turns.length > 1) { sys = t.content; return; }
      const role = t.role === "assistant" ? "model" : "user";
      const last = contents[contents.length - 1];
      if (last && last.role === role) last.parts.push({ text: t.content });
      else contents.push({ role, parts: [{ text: t.content }] });
    });
    const gmodel = review ? process.env.AI_MODEL_DEFAULT || "gemini-3.8-flash" : process.env.AI_MODEL_QUICK || "gemini-3.5-flash-lite";
    const gbody: Record<string, unknown> = { contents, generationConfig: { responseMimeType: "application/json", maxOutputTokens: review ? 8192 : 2048 } };
    if (sys) gbody.systemInstruction = { parts: [{ text: sys }] };
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(gmodel)}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": gkey },
        body: JSON.stringify(gbody),
        signal: AbortSignal.timeout(55_000),
      });
      if (r.status === 429) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
      if (!r.ok) {
        console.error("gemini error", r.status, gmodel, (await r.text()).slice(0, 300));
        return NextResponse.json({ error: "upstream" }, { status: 502 });
      }
      const data = await r.json();
      const text: string = (data.candidates?.[0]?.content?.parts || []).map((c: { text?: string }) => c.text || "").join("");
      return NextResponse.json(pickJson(text), { headers: { "x-ai-mode": "live" } });
    } catch (e) {
      console.error("gemini route failed", e instanceof Error ? e.message : e);
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    // Demo mode
    return NextResponse.json(mockReply(turns, review), { headers: { "x-ai-mode": "demo" } });
  }

  const model = review ? process.env.AI_MODEL_DEFAULT || "claude-sonnet-5-5" : process.env.AI_MODEL_QUICK || "claude-haiku-5-5";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: review ? 1400 : 600, temperature: review ? 0.3 : 0.9, messages: turns }),
      signal: AbortSignal.timeout(50_000),
    });
    if (r.status === 429) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    if (!r.ok) {
      console.error("anthropic error", r.status, (await r.text()).slice(0, 300));
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    const data = await r.json();
    const text: string = (data.content || []).map((c: { type: string; text?: string }) => (c.type === "text" ? c.text : "")).join("");
    return NextResponse.json(pickJson(text), { headers: { "x-ai-mode": "live" } });
  } catch (e) {
    console.error("ai route failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
