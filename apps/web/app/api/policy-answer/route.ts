import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PolicyAnswer = {
  id: string;
  question: string;
  answer: string;
  screen: string;
  area: string;
  author: string;
  createdAt: string;
};

const KEY_INDEX = "policy:index";
const itemKey = (id: string) => `policy:item:${id}`;

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

const memStore = new Map<string, PolicyAnswer>();
const memIndex: string[] = [];

export async function GET() {
  let items: PolicyAnswer[] = [];

  if (isKvConfigured()) {
    const ids = (await kv.lrange<string>(KEY_INDEX, 0, -1)) || [];
    for (const id of ids) {
      const item = await kv.get<PolicyAnswer>(itemKey(id));
      if (item) items.push(item);
    }
  } else {
    items = Array.from(memStore.values());
  }

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ items, count: items.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, answer, screen, area, author } = body || {};
    if (!question || !answer) return NextResponse.json({ error: "question & answer required" }, { status: 400 });
    const id = `pa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const item: PolicyAnswer = {
      id, question: String(question).slice(0, 500), answer: String(answer).slice(0, 2000),
      screen: screen || "", area: area || "", author: (author || "익명").slice(0, 50),
      createdAt: new Date().toISOString(),
    };
    if (isKvConfigured()) {
      await kv.set(itemKey(id), item);
      await kv.lpush(KEY_INDEX, id);
    } else {
      memStore.set(id, item);
      memIndex.unshift(id);
    }
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isKvConfigured()) return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const item = await kv.get<PolicyAnswer>(itemKey(id));
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await kv.del(itemKey(id));
    await kv.lrem(KEY_INDEX, 0, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, answer } = body || {};
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    let item: PolicyAnswer | null = null;
    if (isKvConfigured()) {
      item = await kv.get<PolicyAnswer>(itemKey(id));
    } else {
      item = memStore.get(id) ?? null;
    }
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = { ...item, ...(answer ? { answer: String(answer).slice(0, 2000) } : {}) };
    if (isKvConfigured()) {
      await kv.set(itemKey(id), updated);
    } else {
      memStore.set(id, updated);
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
