"use client";
import { useEffect, useRef, useState } from "react";

type Feedback = {
  id: string;
  pageUrl: string;
  x: number;
  y: number;
  title: string;
  comment: string;
  author: string;
  nearbyText?: string;
  createdAt: string;
  updatedAt?: string;
  processed: boolean;
};

type Props = { pageUrl: string };

// 클릭 지점 근처 요소에서 의미있는 텍스트 추출
function getNearbyText(el: HTMLElement | null): string {
  if (!el) return "";
  // 본인 또는 가장 가까운 상위 요소에서 텍스트 찾기
  let cur: HTMLElement | null = el;
  let depth = 0;
  while (cur && depth < 5) {
    const t = cur.innerText?.trim().replace(/\s+/g, " ") || "";
    if (t && t.length > 0 && t.length < 80) return t;
    if (t && t.length >= 80) return t.slice(0, 80);
    cur = cur.parentElement;
    depth++;
  }
  return "";
}

export default function FeedbackOverlay({ pageUrl }: Props) {
  const [mode, setMode] = useState<"off" | "placing">("off");
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number; nearbyText: string } | null>(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Feedback | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/feedback`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "load failed");
      const filtered = (data.items as Feedback[]).filter(f => f.pageUrl === pageUrl);
      setItems(filtered);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [pageUrl]);

  // URL 파라미터로 딥링크 처리: ?fb=xxx → 해당 핀 자동 포커스 & 스크롤
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fbId = params.get("fb");
    if (!fbId || items.length === 0) return;
    const target = items.find(f => f.id === fbId);
    if (!target) return;
    // 해당 위치로 스크롤
    const docHeight = document.documentElement.scrollHeight;
    const targetY = (target.y / 100) * docHeight;
    window.scrollTo({ top: Math.max(0, targetY - window.innerHeight / 2), behavior: "smooth" });
    setFocusedId(target.id);
  }, [items]);

  // placing 모드에서 전역 클릭 가로채기
  useEffect(() => {
    if (mode !== "placing") return;
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const docWidth = document.documentElement.scrollWidth;
      const docHeight = document.documentElement.scrollHeight;
      const xPct = ((e.pageX) / docWidth) * 100;
      const yPct = ((e.pageY) / docHeight) * 100;
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const nearbyText = getNearbyText(el);
      setPendingPoint({ x: xPct, y: yPct, nearbyText });
      setMode("off");
    };
    window.addEventListener("click", handler, { capture: true });
    return () => window.removeEventListener("click", handler, { capture: true } as unknown as EventListenerOptions);
  }, [mode]);

  const submit = async () => {
    if (!pendingPoint || !comment.trim()) return;
    try {
      setLoading(true);
      const deepLink = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
      const res = await fetch(`/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageUrl,
          x: pendingPoint.x,
          y: pendingPoint.y,
          title: title.trim(),
          comment: comment.trim(),
          author: author.trim() || "익명",
          nearbyText: pendingPoint.nearbyText,
          deepLink,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "저장 실패");
      setPendingPoint(null);
      setTitle(""); setComment(""); setAuthor("");
      await load();
    } catch (e) {
      alert(`저장 실패: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    setPendingPoint(null);
    setTitle(""); setComment(""); setAuthor("");
  };

  const deleteItem = async (id: string) => {
    if (!confirm("이 피드백을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/feedback?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      setFocusedId(null);
      await load();
    } catch (e) {
      alert(String(e));
    }
  };

  const startEdit = (item: Feedback) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditComment(item.comment);
    setFocusedId(null);
  };

  const saveEdit = async () => {
    if (!editingItem || !editComment.trim()) return;
    try {
      const res = await fetch(`/api/feedback`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingItem.id, title: editTitle.trim(), comment: editComment.trim() }),
      });
      if (!res.ok) throw new Error("수정 실패");
      setEditingItem(null);
      await load();
    } catch (e) {
      alert(String(e));
    }
  };

  // 드래그로 핀 이동
  const startDrag = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingId(id);
    setFocusedId(null);
  };

  useEffect(() => {
    if (!draggingId) return;
    const onMove = (e: PointerEvent) => {
      const docWidth = document.documentElement.scrollWidth;
      const docHeight = document.documentElement.scrollHeight;
      const xPct = ((e.pageX) / docWidth) * 100;
      const yPct = ((e.pageY) / docHeight) * 100;
      setItems(prev => prev.map(f => f.id === draggingId ? { ...f, x: xPct, y: yPct } : f));
    };
    const onUp = async () => {
      const moved = items.find(f => f.id === draggingId);
      setDraggingId(null);
      if (moved) {
        // 이동 확정 API 호출
        try {
          await fetch(`/api/feedback`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: moved.id, x: moved.x, y: moved.y }),
          });
        } catch {}
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [draggingId, items]);

  // 문서 높이를 기준으로 핀을 절대 위치에 배치
  const PinContainer = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 9997 }}>
        {children}
      </div>
    );
  };

  return (
    <>
      {/* Placing 모드 오버레이 (크로스헤어) */}
      {mode === "placing" && (
        <div className="fixed inset-0 z-[9998] cursor-crosshair pointer-events-none">
          <div className="sticky top-4 mx-auto bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg w-fit">
            💬 원하는 위치를 클릭 · ESC 취소
          </div>
        </div>
      )}

      {/* 핀들 — 페이지 전체 문서 기준 절대 위치 */}
      <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ zIndex: 9997, height: "100%" }}>
        {items.map((f, idx) => (
          <div
            key={f.id}
            className="absolute pointer-events-auto"
            style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translate(-50%, -100%)" }}
          >
            <button
              onPointerDown={(e) => startDrag(f.id, e)}
              onClick={(e) => { e.stopPropagation(); if (!draggingId) setFocusedId(focusedId === f.id ? null : f.id); }}
              className={`transition-transform ${draggingId === f.id ? "scale-125 cursor-grabbing" : "hover:scale-110 cursor-grab"}`}
              title="드래그로 이동 · 클릭으로 내용 보기"
            >
              <div className="relative">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg border-2 border-white ${f.processed ? "bg-green-500" : "bg-primary"}`}>
                  {items.findIndex(x => x.id === f.id) + 1}
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -bottom-1 ${f.processed ? "bg-green-500" : "bg-primary"}`} />
              </div>
            </button>

            {focusedId === f.id && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-72" style={{ zIndex: 10 }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-bold text-gray-800 flex-1">{f.title || "(제목 없음)"}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${f.processed ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                    {f.processed ? "Notion 전송됨" : "대기중"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 whitespace-pre-wrap">{f.comment}</p>
                {f.nearbyText && <p className="text-[9px] text-gray-400 mt-1.5 bg-gray-50 px-2 py-1 rounded">📍 근처: {f.nearbyText}</p>}
                <p className="text-[9px] text-gray-400 mt-2">{f.author} · {new Date(f.createdAt).toLocaleString("ko-KR")}{f.updatedAt && " (수정됨)"}</p>
                <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                  <button onClick={() => startEdit(f)} className="flex-1 text-[10px] text-gray-600 bg-gray-100 py-1 rounded">수정</button>
                  <button onClick={() => deleteItem(f.id)} className="flex-1 text-[10px] text-red-500 bg-red-50 py-1 rounded">삭제</button>
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 text-center">💡 핀을 드래그하면 위치를 옮길 수 있어요</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 새 피드백 입력 모달 */}
      {pendingPoint && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4" onClick={cancel}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">💬 피드백 남기기</h3>
              <button onClick={cancel} className="text-gray-400 text-xl">✕</button>
            </div>
            {pendingPoint.nearbyText && (
              <div className="bg-gray-50 rounded-lg p-2 mb-3">
                <p className="text-[10px] text-gray-500">📍 위치: {pendingPoint.nearbyText}</p>
              </div>
            )}
            <div className="space-y-2">
              <input type="text" placeholder="제목 (선택)" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200" autoFocus />
              <textarea placeholder="어떤 부분인가요? 개선 제안, 버그, 질문 등" value={comment} onChange={e => setComment(e.target.value)} rows={4}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 resize-none" />
              <input type="text" placeholder="작성자 (선택)" value={author} onChange={e => setAuthor(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={cancel} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">취소</button>
              <button onClick={submit} disabled={!comment.trim() || loading}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${comment.trim() && !loading ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                {loading ? "저장중..." : "등록"}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">등록하면 1시간 이내 Notion 티켓으로 자동 생성</p>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingItem && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">✏️ 피드백 수정</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="space-y-2">
              <input type="text" placeholder="제목" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200" />
              <textarea placeholder="코멘트" value={editComment} onChange={e => setEditComment(e.target.value)} rows={4}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 resize-none" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditingItem(null)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">취소</button>
              <button onClick={saveEdit} disabled={!editComment.trim()}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${editComment.trim() ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-4 right-4 z-[9996] flex flex-col items-end gap-2">
        {showList && items.length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-72 max-h-80 overflow-y-auto">
            <p className="text-xs font-bold mb-2">이 화면의 피드백 {items.length}개</p>
            {items.map((f, idx) => (
              <div key={f.id} onClick={() => {
                setFocusedId(f.id);
                // 스크롤 이동
                const docHeight = document.documentElement.scrollHeight;
                const targetY = (f.y / 100) * docHeight;
                window.scrollTo({ top: Math.max(0, targetY - window.innerHeight / 2), behavior: "smooth" });
                setShowList(false);
              }}
                className="flex gap-2 py-2 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-1 px-1 rounded">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${f.processed ? "bg-green-500" : "bg-primary"}`}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium truncate">{f.title || f.comment.slice(0, 30)}</p>
                  <p className="text-[9px] text-gray-400">{f.author} · {new Date(f.createdAt).toLocaleDateString("ko-KR")}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {items.length > 0 && (
            <button onClick={() => setShowList(s => !s)}
              className="bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 text-xs font-medium flex items-center gap-1">
              📋 <span>{items.length}</span>
            </button>
          )}
          <button
            onClick={() => { setMode(mode === "placing" ? "off" : "placing"); setShowList(false); setFocusedId(null); }}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all ${mode === "placing" ? "bg-red-500 text-white" : "bg-primary text-white"}`}
          >
            {mode === "placing" ? "✕" : "💬"}
          </button>
        </div>

        {error && <p className="text-[10px] text-red-500 bg-white px-2 py-1 rounded shadow">⚠ {error}</p>}
      </div>

      <EscHandler onEscape={() => { setMode("off"); cancel(); setFocusedId(null); setEditingItem(null); }} />
    </>
  );
}

function EscHandler({ onEscape }: { onEscape: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onEscape(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onEscape]);
  return null;
}
