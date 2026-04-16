"use client";
import { useEffect, useState } from "react";
import { MessageSquarePlus, Send, X, Check, ChevronDown, ChevronUp } from "lucide-react";

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
  const [showAnswers, setShowAnswers] = useState(false);

  // 기존 답변 로드
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
        body: JSON.stringify({ question, answer: answer.trim(), screen, area, author: author.trim() || "익명" }),
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

  return (
    <div className="mt-2">
      {/* 기존 답변 표시 */}
      {answers.length > 0 && (
        <div className="mb-1.5">
          <button onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-1 text-[10px] text-green-700 font-medium">
            <Check size={10} strokeWidth={2} />
            {answers.length}개 답변 등록됨
            {showAnswers ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
          {showAnswers && (
            <div className="mt-1.5 space-y-1.5">
              {answers.map(a => (
                <div key={a.id} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-green-800 font-medium">{a.answer}</p>
                  <p className="text-[9px] text-green-600 mt-1">
                    {a.author} · {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 답변 입력 */}
      {!open ? (
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-[10px] text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5 transition-all">
          <MessageSquarePlus size={12} strokeWidth={1.5} />
          {answers.length > 0 ? "답변 추가" : "이 항목에 답변하기"}
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-gray-500 font-medium">정책 답변</p>
            <button onClick={() => setOpen(false)} className="text-gray-400"><X size={14} strokeWidth={1.5} /></button>
          </div>
          <p className="text-xs text-gray-700 font-medium mb-2 bg-gray-50 rounded p-2">{question}</p>
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
          <p className="text-[9px] text-gray-400 mt-1.5">클라우드 저장 · 재부팅해도 유지 · Notion 자동 동기화</p>
        </div>
      )}
    </div>
  );
}
