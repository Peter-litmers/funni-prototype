"use client";
import { useEffect, useState } from "react";
import { MessageSquarePlus, Send, X, Check, Pencil, Trash2, RotateCcw } from "lucide-react";

type PolicyAnswer = {
  id: string;
  question: string;
  answer: string;
  screen: string;
  area: string;
  author: string;
  createdAt: string;
};

type Props = {
  question: string;
  screen: string;
  area: string;
};

export default function PolicyForm({ question, screen, area }: Props) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<PolicyAnswer[]>([]);
  const [showAnswers, setShowAnswers] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [questionText, setQuestionText] = useState(question);
  const [hidden, setHidden] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/policy-answer/question?screen=${encodeURIComponent(screen)}&area=${encodeURIComponent(area)}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.question) setQuestionText(data.question);
        if (data.hidden === true) setHidden(true);
      } catch {} finally {
        setInitialLoaded(true);
      }
    };
    load();
  }, [screen, area]);

  const saveQuestion = async () => {
    try {
      await fetch("/api/policy-answer/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screen, area, question: questionText.trim() }),
      });
      setEditingQuestion(false);
    } catch (e) {
      alert(String(e));
    }
  };

  const hideQuestion = async () => {
    try {
      await fetch("/api/policy-answer/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screen, area, hidden: true }),
      });
      setHidden(true);
    } catch (e) {
      alert(String(e));
    }
  };

  const restoreQuestion = async () => {
    try {
      await fetch("/api/policy-answer/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screen, area, hidden: false }),
      });
      setHidden(false);
    } catch (e) {
      alert(String(e));
    }
  };

  const loadAnswers = async () => {
    try {
      const res = await fetch("/api/policy-answer", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const filtered = (data.items as PolicyAnswer[]).filter(
        a => a.area === area && a.screen === screen
      );
      setAnswers(filtered);
    } catch {}
  };

  useEffect(() => { loadAnswers(); }, [area, screen]);

  const submit = async () => {
    if (!answer.trim()) return;
    try {
      setLoading(true);
      const res = await fetch("/api/policy-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText, answer: answer.trim(), screen, area, author: author.trim() || "익명" }),
      });
      if (!res.ok) throw new Error("저장 실패");
      setAnswer(""); setAuthor(""); setOpen(false);
      await loadAnswers();
    } catch (e) {
      alert(String(e));
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (a: PolicyAnswer) => { setEditingId(a.id); setEditText(a.answer); };
  const cancelEdit = () => { setEditingId(null); setEditText(""); };

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    try {
      setLoading(true);
      const res = await fetch("/api/policy-answer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, answer: editText.trim() }),
      });
      if (!res.ok) throw new Error("수정 실패");
      setEditingId(null); setEditText("");
      await loadAnswers();
    } catch (e) { alert(String(e)); } finally { setLoading(false); }
  };

  const deleteAnswer = async (id: string) => {
    if (!confirm("이 답변을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/policy-answer?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      await loadAnswers();
    } catch (e) { alert(String(e)); }
  };

  if (!initialLoaded) return null;

  // 숨겨진 질문 — 복구 버튼만 표시
  if (hidden) {
    return (
      <div className="mt-1.5 flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-200 border-dashed">
        <Trash2 size={10} strokeWidth={1.5} className="text-gray-400 shrink-0" />
        <span className="text-[10px] text-gray-400 flex-1 line-through">{questionText}</span>
        <button onClick={restoreQuestion}
          className="flex items-center gap-0.5 text-[10px] text-primary hover:text-primary/80 font-medium shrink-0">
          <RotateCcw size={10} strokeWidth={1.5} /> 복구
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {/* 질문 텍스트 — 클릭으로 수정 + 삭제 버튼 */}
      <div className="flex items-start gap-1 mb-1">
        {editingQuestion ? (
          <div className="flex-1 flex gap-1">
            <input type="text" value={questionText} onChange={e => setQuestionText(e.target.value)}
              className="flex-1 text-xs bg-white border border-primary rounded px-2 py-1 outline-none" autoFocus
              onKeyDown={e => { if (e.key === "Enter") saveQuestion(); if (e.key === "Escape") { setQuestionText(question); setEditingQuestion(false); } }} />
            <button onClick={saveQuestion} className="text-[10px] bg-primary text-white px-2 py-1 rounded">저장</button>
            <button onClick={() => { setQuestionText(question); setEditingQuestion(false); }} className="text-[10px] text-gray-400 px-1">취소</button>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <button onClick={() => setEditingQuestion(true)}
              className="text-xs text-gray-700 font-medium text-left hover:text-primary transition-colors group flex items-center gap-1 flex-1 min-w-0">
              <span className="truncate">{questionText}</span>
              <Pencil size={9} strokeWidth={1.5} className="text-gray-300 group-hover:text-primary shrink-0" />
            </button>
            <button onClick={hideQuestion} className="text-gray-300 hover:text-red-400 transition-colors p-0.5 shrink-0" title="질문 숨기기">
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* 기존 답변 표시 */}
      {answers.length > 0 && (
        <div className="mb-1.5">
          <button onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-1 text-[10px] text-green-700 font-medium">
            <Check size={10} strokeWidth={2} />
            {answers.length}개 답변 등록됨
          </button>
          {showAnswers && (
            <div className="mt-1.5 space-y-1.5">
              {answers.map(a => (
                <div key={a.id} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  {editingId === a.id ? (
                    <div>
                      <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2}
                        className="w-full bg-white rounded px-2 py-1 text-xs outline-none border border-green-300 resize-none" autoFocus />
                      <div className="flex justify-end gap-1 mt-1.5">
                        <button onClick={cancelEdit} className="text-[10px] text-gray-500 px-2 py-0.5">취소</button>
                        <button onClick={() => saveEdit(a.id)} disabled={!editText.trim() || loading}
                          className={`text-[10px] px-2 py-0.5 rounded ${editText.trim() && !loading ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                          {loading ? "..." : "저장"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-green-800 font-medium flex-1 whitespace-pre-wrap">{a.answer}</p>
                        <div className="flex gap-0.5 shrink-0">
                          <button onClick={() => startEdit(a)} className="text-green-600 hover:text-green-800 p-0.5" title="수정"><Pencil size={10} strokeWidth={1.5} /></button>
                          <button onClick={() => deleteAnswer(a.id)} className="text-red-400 hover:text-red-600 p-0.5" title="삭제"><Trash2 size={10} strokeWidth={1.5} /></button>
                        </div>
                      </div>
                      <p className="text-[9px] text-green-600 mt-1">
                        {a.author} · {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 답변이 없을 때만 '이 항목에 답변하기' 버튼 표시 */}
      {answers.length === 0 && !open && (
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-[10px] text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5 transition-all">
          <MessageSquarePlus size={12} strokeWidth={1.5} /> 이 항목에 답변하기
        </button>
      )}

      {/* 답변 입력 폼 */}
      {open && (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-gray-500 font-medium">정책 답변</p>
            <button onClick={() => setOpen(false)} className="text-gray-400"><X size={14} strokeWidth={1.5} /></button>
          </div>
          <p className="text-xs text-gray-700 font-medium mb-2 bg-gray-50 rounded p-2">{questionText}</p>
          <textarea
            value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="답변을 입력하세요 (예: 즉시 확정)" rows={2}
            className="w-full bg-gray-50 rounded-lg px-3 py-2 text-xs outline-none border border-gray-200 resize-none mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <input type="text" placeholder="작성자 (선택)" value={author} onChange={e => setAuthor(e.target.value)}
              className="flex-1 bg-gray-50 rounded-lg px-3 py-1.5 text-[10px] outline-none border border-gray-200" />
            <button onClick={submit} disabled={!answer.trim() || loading}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium ${answer.trim() && !loading ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
              <Send size={10} strokeWidth={2} /> {loading ? "..." : "등록"}
            </button>
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5">클라우드 저장 · 재부팅해도 유지</p>
        </div>
      )}
    </div>
  );
}
