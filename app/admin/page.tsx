"use client";
import { useState } from "react";
import Link from "next/link";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

type Tab = "dashboard" | "businesses" | "settlement" | "ads" | "members";

export default function AdminWeb() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold">퍼니 Admin</h1>
          <div className="hidden md:flex gap-1">
            {[
              { key: "dashboard" as Tab, label: "대시보드" },
              { key: "businesses" as Tab, label: "업체 관리" },
              { key: "settlement" as Tab, label: "정산" },
              { key: "ads" as Tab, label: "광고" },
              { key: "members" as Tab, label: "회원" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  tab === t.key ? "bg-white/20 font-medium" : "hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-white">← 메인으로</Link>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto bg-gray-800 px-4 gap-1">
        {[
          { key: "dashboard" as Tab, label: "대시보드" },
          { key: "businesses" as Tab, label: "업체" },
          { key: "settlement" as Tab, label: "정산" },
          { key: "ads" as Tab, label: "광고" },
          { key: "members" as Tab, label: "회원" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-xs whitespace-nowrap ${
              tab === t.key ? "text-white border-b-2 border-white font-medium" : "text-gray-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {tab === "dashboard" && (
          <div>
            <h2 className="text-xl font-bold mb-6">대시보드</h2>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "총 업체", value: "42", icon: "🏢" },
                { label: "총 예약", value: "1,284", icon: "📅" },
                { label: "이번 달 매출", value: "₩12.4M", icon: "💰" },
                { label: "총 회원", value: "3,891", icon: "👥" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Fee Rate */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-bold mb-4">수수료율 설정</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">현재 수수료율</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={10}
                      className="bg-gray-100 rounded-xl px-4 py-3 text-lg font-bold w-24 text-center"
                    />
                    <span className="text-lg font-bold">%</span>
                  </div>
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium">저장</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">어드민에서 직접 수정 가능 (확정)</p>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">최근 활동</h3>
              <div className="space-y-3">
                {[
                  { action: "새 업체 가입 요청", detail: "선셋 포토랩", time: "10분 전" },
                  { action: "예약 취소", detail: "김철수 → 루미에르", time: "30분 전" },
                  { action: "리뷰 신고", detail: "부적절한 내용", time: "1시간 전" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{a.action}</p>
                      <p className="text-xs text-gray-400">{a.detail}</p>
                    </div>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "businesses" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">업체 관리</h2>
            </div>

            <div className="policy-area p-4 mb-6">
              <PolicyBadge label="입점 정책 미확정" />
              <p className="text-sm text-amber-700 mt-2">입점 방식(자동 vs 검토) · 필요 서류 · 퇴점 기준 미확정</p>
            </div>

            {/* Business List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">업체명</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">카테고리</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">지역</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                    <th className="text-left p-4 font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "루미에르 스튜디오", cats: "프로필, 바디프로필", area: "강남", status: "운영중" },
                    { name: "선셋 포토랩", cats: "바디프로필", area: "성수", status: "승인대기" },
                    { name: "블룸 웨딩홀", cats: "웨딩, 돌잔치", area: "잠실", status: "운영중" },
                    { name: "프로덕트 랩", cats: "제품", area: "홍대", status: "운영중" },
                  ].map((b, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{b.name}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{b.cats}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{b.area}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          b.status === "운영중" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{b.status}</span>
                      </td>
                      <td className="p-4">
                        {b.status === "승인대기" ? (
                          <div className="flex gap-1">
                            <button className="text-xs bg-primary text-white px-3 py-1 rounded-lg">승인</button>
                            <button className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-lg">거절</button>
                          </div>
                        ) : (
                          <button className="text-xs text-gray-400">상세</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "settlement" && (
          <div>
            <h2 className="text-xl font-bold mb-6">정산 관리</h2>

            <div className="policy-area p-4 mb-6">
              <PolicyBadge label="정산 정책 미확정" />
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">정산 대상 조회 기준</p>
                  <p className="text-sm text-amber-700 font-medium">미확정</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">정산 단위</p>
                  <p className="text-sm text-amber-700 font-medium">업체별 일괄 vs 건별 선택 → 미확정</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">수수료 차감 방식</p>
                  <p className="text-sm text-amber-700 font-medium">자동 차감 vs 운영자 입력 → 미확정</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">정산 후 환불 처리</p>
                  <p className="text-sm text-amber-700 font-medium">다음 정산 차감 vs 별도 → 미확정</p>
                </div>
              </div>
            </div>

            {/* Settlement Table */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">미정산 목록</h3>
                <div className="flex gap-2">
                  <button className="text-xs bg-gray-100 px-3 py-2 rounded-lg">전체 선택</button>
                  <button className="text-xs bg-primary text-white px-4 py-2 rounded-lg font-medium">
                    선택 정산 실행
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">관리자가 버튼을 눌러 수동으로 정산합니다 (확정)</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left"><input type="checkbox" /></th>
                      <th className="p-3 text-left font-medium text-gray-500">업체</th>
                      <th className="p-3 text-left font-medium text-gray-500">예약건수</th>
                      <th className="p-3 text-left font-medium text-gray-500">총 금액</th>
                      <th className="p-3 text-left font-medium text-gray-500">수수료</th>
                      <th className="p-3 text-left font-medium text-gray-500">정산액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "루미에르 스튜디오", count: 8, total: "₩680,000", fee: "?%", net: "?" },
                      { name: "블룸 웨딩홀", count: 3, total: "₩520,000", fee: "?%", net: "?" },
                      { name: "프로덕트 랩", count: 12, total: "₩340,000", fee: "?%", net: "?" },
                    ].map((s, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="p-3"><input type="checkbox" /></td>
                        <td className="p-3 font-medium">{s.name}</td>
                        <td className="p-3">{s.count}건</td>
                        <td className="p-3">{s.total}</td>
                        <td className="p-3 text-amber-600">{s.fee}</td>
                        <td className="p-3 font-bold text-amber-600">{s.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "ads" && (
          <div>
            <h2 className="text-xl font-bold mb-6">광고 관리</h2>

            <div className="policy-area p-4 mb-6">
              <PolicyBadge label="광고 정책 미확정" />
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">상단 노출 구좌 수</p>
                  <p className="text-sm text-amber-700 font-medium">미확정</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">광고 기간 단위</p>
                  <p className="text-sm text-amber-700 font-medium">주간/월간 → 미확정</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">과금 방식</p>
                  <p className="text-sm text-amber-700 font-medium">고정금액 vs 입찰 → 미확정</p>
                </div>
              </div>
            </div>

            {/* Ad Slots Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold mb-4">광고 구좌 미리보기</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-2xl mb-2">📢</p>
                    <p className="text-sm font-medium text-gray-400">광고 구좌 #{i}</p>
                    <p className="text-xs text-gray-300 mt-1">정책 확정 후 관리 가능</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "members" && (
          <div>
            <h2 className="text-xl font-bold mb-6">회원 관리</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="이름, 이메일 검색..."
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">이름</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">가입일</th>
                    <th className="text-left p-4 font-medium text-gray-500">로그인</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">예약 수</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "김퍼니", date: "2026.04.10", login: "카카오+네이버", bookings: 5, status: "활성" },
                    { name: "이촬영", date: "2026.04.08", login: "카카오", bookings: 2, status: "활성" },
                    { name: "박스튜", date: "2026.04.05", login: "네이버", bookings: 0, status: "활성" },
                  ].map((m, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{m.name}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{m.date}</td>
                      <td className="p-4 text-xs">
                        <div className="flex gap-1">
                          {m.login.includes("카카오") && <span className="bg-yellow-100 px-2 py-0.5 rounded-full">카카오</span>}
                          {m.login.includes("네이버") && <span className="bg-green-100 px-2 py-0.5 rounded-full">네이버</span>}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{m.bookings}건</td>
                      <td className="p-4">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{m.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
