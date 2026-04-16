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
  createdAt: string;
  processed: boolean;
};

type Props = { pageUrl: string };

export default function FeedbackOverlay({ pageUrl }: Props) {
  const [mode, setMode] = useState<"off" | "placing">("off");
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number; pageX: number; pageY: number } | null>(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);

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

  // Click handler for placing points
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (mode !== "placing") return;
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPoint({ x: xPct, y: yPct, pageX: e.clientX, pageY: e.clientY });
    setMode("off");
  };

  const submit = async () => {
    if (!pendingPoint || !comment.trim()) return;
    try {
      setLoading(true);
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

  return (
    <>
      {/* Overlay for placing points - full screen catcher */}
      {mode === "placing" && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[9998] cursor-crosshair bg-purple-500/5"
          style={{ pointerEvents: "auto" }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            원하는 위치를 클릭하세요 · ESC로 취소
          </div>
        </div>
      )}

      {/* Overlay container for pins - always on */}
      <div className="fixed inset-0 pointer-events-none z-[9997]">
        {items.map((f) => (
          <button
            key={f.id}
            onClick={() => setFocusedId(focusedId === f.id ? null : f.id)}
            className="absolute pointer-events-auto transition-transform hover:scale-110"
            style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translate(-50%, -100%)" }}
          >
            <div className="relative">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg border-2 border-white ${f.processed ? "bg-green-500" : "bg-primary"}`}>
                {items.filter(x => x.createdAt <= f.createdAt).length}
              </div>
              <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -bottom-1 ${f.processed ? "bg-green-500" : "bg-primary"}`} />
            </div>
            {focusedId === f.id && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-64 text-left" style={{ zIndex: 10 }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-bold text-gray-800 flex-1">{f.title || "(제목 없음)"}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${f.processed ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                    {f.processed ? "Notion 전송됨" : "대기중"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 whitespace-pre-wrap">{f.comment}</p>
                <p className="text-[9px] text-gray-400 mt-2">{f.author} · {new Date(f.createdAt).toLocaleString("ko-KR")}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Input modal after placing */}
      {pendingPoint && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4" onClick={cancel}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">💬 피드백 남기기</h3>
              <button onClick={cancel} className="text-gray-400 text-xl">✕</button>
            </div>
            <p className="text-[10px] text-gray-400 mb-3">
              위치: {pendingPoint.x.toFixed(1)}%, {pendingPoint.y.toFixed(1)}% · {pageUrl}
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="제목 (선택)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200"
                autoFocus
              />
              <textarea
                placeholder="어떤 부분인가요? 개선 제안, 버그, 질문 등"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 resize-none"
              />
              <input
                type="text"
                placeholder="작성자 (선택)"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={cancel} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">취소</button>
              <button onClick={submit} disabled={!comment.trim() || loading}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${comment.trim() && !loading ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                {loading ? "저장중..." : "등록"}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">등록하면 10분 이내 Notion 티켓으로 자동 생성됩니다</p>
          </div>
        </div>
      )}

      {/* FAB (Floating Action Button) */}
      <div className="fixed bottom-4 right-4 z-[9996] flex flex-col items-end gap-2">
        {showList && items.length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-72 max-h-80 overflow-y-auto">
            <p className="text-xs font-bold mb-2">이 화면의 피드백 {items.length}개</p>
            {items.map((f, idx) => (
              <div key={f.id} onClick={() => setFocusedId(f.id)}
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

      {/* ESC to cancel placing */}
      <EscHandler onEscape={() => { setMode("off"); cancel(); setFocusedId(null); }} />
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
