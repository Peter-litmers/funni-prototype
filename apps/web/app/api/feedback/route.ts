import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Feedback = {
  id: string;
  pageUrl: string;        // 어느 화면인지 (consumer/home, business/dashboard 등)
  x: number;              // 0~100 (% of document width)
  y: number;              // 0~100 (% of document height)
  title: string;
  comment: string;
  author: string;
  nearbyText?: string;    // 클릭 지점 근처 DOM 요소의 텍스트
  createdAt: string;      // ISO
  updatedAt?: string;     // ISO (위치/내용 수정 시)
  processed: boolean;
  notionPageId?: string;
};

const KEY_INDEX = "feedback:index"; // list of all ids
const itemKey = (id: string) => `feedback:item:${id}`;

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// --- 로컬 개발용 인메모리 스토어 (KV 없을 때 폴백) ---
const memStore = new Map<string, Feedback>();
const memIndex: string[] = [];

// GET /api/feedback?processed=false
export async function GET(req: NextRequest) {
  const processedParam = req.nextUrl.searchParams.get("processed");
  let items: Feedback[] = [];

  if (isKvConfigured()) {
    const ids = (await kv.lrange<string>(KEY_INDEX, 0, -1)) || [];
    for (const id of ids) {
      const item = await kv.get<Feedback>(itemKey(id));
      if (!item) continue;
      if (processedParam === "false" && item.processed) continue;
      if (processedParam === "true" && !item.processed) continue;
      items.push(item);
    }
  } else {
    items = Array.from(memStore.values()).filter(item => {
      if (processedParam === "false" && item.processed) return false;
      if (processedParam === "true" && !item.processed) return false;
      return true;
    });
  }

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ items, count: items.length });
}

// POST /api/feedback  body: { pageUrl, x, y, title, comment, author }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageUrl, x, y, title, comment, author, nearbyText } = body || {};
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
      nearbyText: (nearbyText || "").slice(0, 200),
      createdAt: new Date().toISOString(),
      processed: false,
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
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }
}

// PATCH /api/feedback  body: { id, processed?, notionPageId? }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, processed, notionPageId, x, y, title, comment, nearbyText } = body || {};
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    let item: Feedback | null = null;
    if (isKvConfigured()) {
      item = await kv.get<Feedback>(itemKey(id));
    } else {
      item = memStore.get(id) ?? null;
    }
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isEdit = typeof x === "number" || typeof y === "number" || typeof title === "string" || typeof comment === "string" || typeof nearbyText === "string";
    const updated: Feedback = {
      ...item,
      ...(typeof processed === "boolean" ? { processed } : {}),
      ...(notionPageId ? { notionPageId } : {}),
      ...(typeof x === "number" ? { x: Math.max(0, Math.min(100, x)) } : {}),
      ...(typeof y === "number" ? { y: Math.max(0, Math.min(100, y)) } : {}),
      ...(typeof title === "string" ? { title: title.slice(0, 200) } : {}),
      ...(typeof comment === "string" ? { comment: comment.slice(0, 2000) } : {}),
      ...(typeof nearbyText === "string" ? { nearbyText: nearbyText.slice(0, 200) } : {}),
      ...(isEdit ? { updatedAt: new Date().toISOString() } : {}),
    };

    if (isKvConfigured()) {
      await kv.set(itemKey(id), updated);
    } else {
      memStore.set(id, updated);
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request", detail: String(e) }, { status: 400 });
  }
}

// DELETE /api/feedback?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (isKvConfigured()) {
    await kv.del(itemKey(id));
    await kv.lrem(KEY_INDEX, 0, id);
  } else {
    memStore.delete(id);
    const idx = memIndex.indexOf(id);
    if (idx !== -1) memIndex.splice(idx, 1);
  }
  return NextResponse.json({ ok: true });
}
