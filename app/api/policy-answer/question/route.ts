import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const questionKey = (screen: string, area: string) => `policy:question:${screen}:${area}`;
const hiddenKey = (screen: string, area: string) => `policy:hidden:${screen}:${area}`;
const hiddenListKey = (screen: string) => `policy:hidden-list:${screen}`;

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

const memQuestions = new Map<string, string>();
const memHidden = new Map<string, boolean>();

export async function GET(req: NextRequest) {
  const screen = req.nextUrl.searchParams.get("screen") || "";
  const area = req.nextUrl.searchParams.get("area") || "";
  const action = req.nextUrl.searchParams.get("action") || "";

  // 숨긴 질문 목록 조회
  if (action === "hidden-list" && screen) {
    let hiddenAreas: string[] = [];
    if (isKvConfigured()) {
      hiddenAreas = (await kv.lrange<string>(hiddenListKey(screen), 0, -1)) || [];
    } else {
      for (const [k, v] of memHidden) {
        if (v && k.startsWith(`policy:hidden:${screen}:`)) {
          hiddenAreas.push(k.replace(`policy:hidden:${screen}:`, ""));
        }
      }
    }
    return NextResponse.json({ hiddenAreas });
  }

  if (!screen || !area) return NextResponse.json({ question: null, hidden: false });

  let question: string | null = null;
  let hidden = false;

  if (isKvConfigured()) {
    question = await kv.get<string>(questionKey(screen, area));
    hidden = (await kv.get<boolean>(hiddenKey(screen, area))) === true;
  } else {
    question = memQuestions.get(questionKey(screen, area)) ?? null;
    hidden = memHidden.get(hiddenKey(screen, area)) === true;
  }
  return NextResponse.json({ question, hidden });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { screen, area, question, hidden } = body || {};
    if (!screen || !area) return NextResponse.json({ error: "screen, area required" }, { status: 400 });

    // 질문 텍스트 저장
    if (question) {
      if (isKvConfigured()) {
        await kv.set(questionKey(screen, area), String(question).slice(0, 500));
      } else {
        memQuestions.set(questionKey(screen, area), String(question).slice(0, 500));
      }
    }

    // 숨김 상태 저장
    if (typeof hidden === "boolean") {
      if (isKvConfigured()) {
        await kv.set(hiddenKey(screen, area), hidden);
        if (hidden) {
          // 중복 방지 후 추가
          await kv.lrem(hiddenListKey(screen), 0, area);
          await kv.lpush(hiddenListKey(screen), area);
        } else {
          await kv.lrem(hiddenListKey(screen), 0, area);
        }
      } else {
        memHidden.set(hiddenKey(screen, area), hidden);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
