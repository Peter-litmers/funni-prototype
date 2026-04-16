"use client";
import { useState } from "react";
import { MessageSquarePlus, Send, X } from "lucide-react";

type Props = {
  question: string;
  screen: string;    // 소비자/업체/어드민
  area: string;      // 영역명
};

export default function PolicyForm({ question, screen, area }: Props) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [author, setAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setSubmitted(true);
      setTimeout(() => { setOpen(false); setSubmitted(false); setAnswer(""); }, 2000);
    } catch (e) {
      alert(String(e));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-[10px] text-green-700 flex items-center gap-1">
        <span>✓</span> 답변이 저장되었습니다. Notion에 자동 반영됩니다.
      </div>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="mt-1.5 flex items-center gap-1 text-[10px] text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5 transition-all">
        <MessageSquarePlus size={12} strokeWidth={1.5} /> 이 항목에 답변하기
      </button>
    );
  }

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-gray-500 font-medium">정책 답변</p>
        <button onClick={() => setOpen(false)} className="text-gray-400"><X size={14} strokeWidth={1.5} /></button>
      </div>
      <p className="text-xs text-gray-700 font-medium mb-2 bg-gray-50 rounded p-2">{question}</p>
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="답변을 입력하세요 (예: 즉시 확정)"
        rows={2}
        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-xs outline-none border border-gray-200 resize-none mb-2"
      />
      <div className="flex gap-2">
        <input type="text" placeholder="작성자 (선택)" value={author} onChange={e => setAuthor(e.target.value)}
          className="flex-1 bg-gray-50 rounded-lg px-3 py-1.5 text-[10px] outline-none border border-gray-200" />
        <button onClick={submit} disabled={!answer.trim() || loading}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium ${answer.trim() && !loading ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
          <Send size={10} strokeWidth={2} /> {loading ? "..." : "등록"}
        </button>
      </div>
    </div>
  );
}
