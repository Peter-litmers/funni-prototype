import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const questionKey = (screen: string, area: string) => `policy:question:${screen}:${area}`;

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

const memQuestions = new Map<string, string>();

export async function GET(req: NextRequest) {
  const screen = req.nextUrl.searchParams.get("screen") || "";
  const area = req.nextUrl.searchParams.get("area") || "";
  if (!screen || !area) return NextResponse.json({ question: null });

  let question: string | null = null;
  if (isKvConfigured()) {
    question = await kv.get<string>(questionKey(screen, area));
  } else {
    question = memQuestions.get(questionKey(screen, area)) ?? null;
  }
  return NextResponse.json({ question });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { screen, area, question } = body || {};
    if (!screen || !area || !question) return NextResponse.json({ error: "screen, area, question required" }, { status: 400 });

    if (isKvConfigured()) {
      await kv.set(questionKey(screen, area), String(question).slice(0, 500));
    } else {
      memQuestions.set(questionKey(screen, area), String(question).slice(0, 500));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
