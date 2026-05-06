"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function FeedbackAdmin() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [screenFilter, setScreenFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Feedback | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/feedback", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleProcessed = async (item: Feedback) => {
    await fetch("/api/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, processed: !item.processed }),
    });
    await load();
    if (selected?.id === item.id) setSelected({ ...item, processed: !item.processed });
  };

  const deleteItem = async (id: string) => {
    if (!confirm("이 피드백을 삭제하시겠습니까?")) return;
    await fetch(`/api/feedback?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setSelected(null);
    await load();
  };

  const copyDeepLink = (item: Feedback) => {
    const [page] = item.pageUrl.split("/");
    const url = `${window.location.origin}/${page}?fb=${item.id}`;
    navigator.clipboard.writeText(url);
    alert("딥링크가 복사되었습니다!");
  };

  // 화면 목록 추출
  const screens = Array.from(new Set(items.map(f => f.pageUrl))).sort();

  // 필터 적용
  const filtered = items.filter(f => {
    if (filter === "pending" && f.processed) return false;
    if (filter === "done" && !f.processed) return false;
    if (screenFilter !== "all" && f.pageUrl !== screenFilter) return false;
    return true;
  });

  const totalCount = items.length;
  const pendingCount = items.filter(f => !f.processed).length;
  const doneCount = items.filter(f => f.processed).length;
  const todayCount = items.filter(f => f.createdAt.startsWith(new Date().toISOString().slice(0, 10))).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">피드백 관리</h1>
          <span className="text-xs text-gray-400">프로토타입 피드백 대시보드</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            새로고침
          </button>
          <Link href="/" className="text-xs text-gray-400 hover:text-white">← 메인으로</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">전체</p>
            <p className="text-2xl font-bold">{totalCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">미처리</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">처리완료</p>
            <p className="text-2xl font-bold text-green-600">{doneCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">오늘 등록</p>
            <p className="text-2xl font-bold text-primary">{todayCount}</p>
          </div>
        </div>

        {/* 필터 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex gap-1">
            {([["all", "전체"], ["pending", "미처리"], ["done", "처리완료"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === key ? "bg-primary text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <select
            value={screenFilter}
            onChange={e => setScreenFilter(e.target.value)}
            className="bg-gray-200 text-gray-600 text-xs rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="all">모든 화면</option>
            {screens.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center text-gray-400">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center text-gray-400">피드백이 없습니다</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 font-medium">
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">화면</th>
                  <th className="text-left px-4 py-3">제목</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">코멘트</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">작성자</th>
                  <th className="text-left px-4 py-3">등록일</th>
                  <th className="text-left px-4 py-3">상태</th>
                  <th className="text-left px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, idx) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelected(selected?.id === f.id ? null : f)}
                    className={`border-t border-gray-50 cursor-pointer transition-colors ${
                      selected?.id === f.id ? "bg-primary/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{f.pageUrl}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">{f.title || "(제목 없음)"}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell truncate max-w-[200px]">{f.comment}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{f.author}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString("ko-KR")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        f.processed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {f.processed ? "처리완료" : "대기중"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleProcessed(f)}
                          className={`text-[10px] px-2 py-1 rounded ${
                            f.processed ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {f.processed ? "되돌리기" : "처리완료"}
                        </button>
                        <button onClick={() => copyDeepLink(f)} className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-600">
                          링크
                        </button>
                        <button onClick={() => deleteItem(f.id)} className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-500">
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 상세 패널 */}
        {selected && (
          <div className="mt-4 bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold">{selected.title || "(제목 없음)"}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400">화면</p>
                <p className="text-sm font-medium">{selected.pageUrl}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400">작성자</p>
                <p className="text-sm font-medium">{selected.author}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400">등록일</p>
                <p className="text-sm font-medium">{new Date(selected.createdAt).toLocaleString("ko-KR")}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400">좌표</p>
                <p className="text-sm font-medium">x: {selected.x.toFixed(1)}%, y: {selected.y.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-[10px] text-gray-400 mb-1">코멘트</p>
              <p className="text-sm whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{selected.comment}</p>
            </div>
            {selected.nearbyText && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-400 mb-1">근처 텍스트</p>
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">{selected.nearbyText}</p>
              </div>
            )}
            {selected.updatedAt && (
              <p className="text-[10px] text-gray-400">마지막 수정: {new Date(selected.updatedAt).toLocaleString("ko-KR")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
