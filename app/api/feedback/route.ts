import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Feedback = {
  id: string;
  pageUrl: string;        // 어느 화면인지 (consumer/business/admin/main)
  x: number;              // 0~100 (% of viewport width)
  y: number;              // 0~100 (% of viewport height)
  title: string;
  comment: string;
  author: string;
  createdAt: string;      // ISO
  processed: boolean;
  notionPageId?: string;
};

const KEY_INDEX = "feedback:index"; // list of all ids
const itemKey = (id: string) => `feedback:item:${id}`;

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// GET /api/feedback?processed=false
export async function GET(req: NextRequest) {
  if (!isKvConfigured()) {
    return NextResponse.json({ error: "KV not configured", hint: "Set KV_REST_API_URL & KV_REST_API_TOKEN in Vercel" }, { status: 503 });
  }
  const processedParam = req.nextUrl.searchParams.get("processed");
  const ids = (await kv.lrange<string>(KEY_INDEX, 0, -1)) || [];
  const items: Feedback[] = [];
  for (const id of ids) {
    const item = await kv.get<Feedback>(itemKey(id));
    if (!item) continue;
    if (processedParam === "false" && item.processed) continue;
    if (processedParam === "true" && !item.processed) continue;
    items.push(item);
  }
  // Most recent first
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ items, count: items.length });
}

// POST /api/feedback  body: { pageUrl, x, y, title, comment, author }
export async function POST(req: NextRequest) {
  if (!isKvConfigured()) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { pageUrl, x, y, title, comment, author } = body || {};
    if (typeof x !== "number" || typeof y !== "number" || !comment) {
      return NextResponse.json({ error: "x, y, comment are required" }, { status: 400 });
    }
    const id = `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const item: Feedback = {
      id,
      pageUrl: pageUrl || "",
      x: Math.max(0, Math.min(100, Number(x))),
      y: Math.max(0, Math.min(100, Number(y))),
      title: (title || "").slice(0, 200),
      comment: String(comment).slice(0, 2000),
      author: (author || "익명").slice(0, 50),
      createdAt: new Date().toISOString(),
      processed: false,
    };
    await kv.set(itemKey(id), item);
    await kv.lpush(KEY_INDEX, id);
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }
}

// PATCH /api/feedback  body: { id, processed?, notionPageId? }
export async function PATCH(req: NextRequest) {
  if (!isKvConfigured()) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { id, processed, notionPageId } = body || {};
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const item = await kv.get<Feedback>(itemKey(id));
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated: Feedback = {
      ...item,
      ...(typeof processed === "boolean" ? { processed } : {}),
      ...(notionPageId ? { notionPageId } : {}),
    };
    await kv.set(itemKey(id), updated);
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }
}

// DELETE /api/feedback?id=xxx  (optional housekeeping)
export async function DELETE(req: NextRequest) {
  if (!isKvConfigured()) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await kv.del(itemKey(id));
  await kv.lrem(KEY_INDEX, 0, id);
  return NextResponse.json({ ok: true });
}
