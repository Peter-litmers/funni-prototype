"use client";
import { useState } from "react";
import Link from "next/link";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

type Tab = "dashboard" | "businesses" | "settlement" | "ads" | "members" | "categories" | "banners" | "bookings" | "payments" | "reviews";

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
              { key: "categories" as Tab, label: "카테고리" },
              { key: "banners" as Tab, label: "배너" },
              { key: "bookings" as Tab, label: "예약" },
              { key: "payments" as Tab, label: "결제" },
              { key: "reviews" as Tab, label: "리뷰" },
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
          { key: "categories" as Tab, label: "카테고리" },
          { key: "banners" as Tab, label: "배너" },
          { key: "bookings" as Tab, label: "예약" },
          { key: "payments" as Tab, label: "결제" },
          { key: "reviews" as Tab, label: "리뷰" },
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
            {/* Stats (REQ-122) — 소비자/업체 회원, 스튜디오 수, 예약 수, 매출, 수수료 수익 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "총 회원 (소비자/업체)", value: "3,891 / 42", icon: "👥" },
                { label: "총 스튜디오", value: "58", icon: "🏢" },
                { label: "이번 달 예약", value: "142", icon: "📅" },
                { label: "이번 달 매출", value: "₩12.4M", icon: "💰", sub: "수수료 수익 ₩1.24M" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  {s.sub && <p className="text-[10px] text-primary font-medium mt-1">{s.sub}</p>}
                </div>
              ))}
            </div>

            {/* Monthly Trend (REQ-122: 월별 예약 수 + 월별 매출·수수료 수익) */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-bold mb-5">월별 집계</h3>

              {/* 월별 예약 수 */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2 font-medium">월별 예약 수</p>
                <div className="flex items-end gap-3" style={{ height: 90 }}>
                  {[
                    { month: "1월", v: 82 },
                    { month: "2월", v: 95 },
                    { month: "3월", v: 118 },
                    { month: "4월", v: 142 },
                  ].map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full flex justify-center" style={{ height: 60 }}>
                        <div className="w-8 bg-primary rounded-t self-end" style={{ height: `${(m.v / 142) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1.5">{m.month}</p>
                      <p className="text-xs font-bold">{m.v}건</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 월별 매출 · 수수료 수익 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 font-medium">월별 매출 · 수수료 수익</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block" /> 매출</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> 수수료 수익</span>
                  </div>
                </div>
                <div className="flex items-end gap-3" style={{ height: 110 }}>
                  {[
                    { month: "1월", rev: 6.2, fee: 0.62 },
                    { month: "2월", rev: 7.8, fee: 0.78 },
                    { month: "3월", rev: 9.6, fee: 0.96 },
                    { month: "4월", rev: 12.4, fee: 1.24 },
                  ].map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="flex gap-1 items-end w-full justify-center" style={{ height: 70 }}>
                        <div className="w-5 bg-green-400 rounded-t" style={{ height: `${(m.rev / 12.4) * 100}%` }} />
                        <div className="w-5 bg-amber-400 rounded-t" style={{ height: `${(m.fee / 12.4) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1.5">{m.month}</p>
                      <p className="text-[10px] text-green-600 font-medium">₩{m.rev}M</p>
                      <p className="text-[10px] text-amber-600">+₩{m.fee}M</p>
                    </div>
                  ))}
                </div>
              </div>
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
              <p className="text-xs text-gray-400 mt-2">어드민에서 직접 수정 가능 (확정) · 업체별 개별 수수료는 업체 상세에서 설정 (REQ-119)</p>
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
                    { name: "루미에르 스튜디오", cats: "프로필, 바디프로필", area: "강남", status: "운영중", photos: 24 },
                    { name: "선셋 포토랩", cats: "바디프로필", area: "성수", status: "승인대기", photos: 12 },
                    { name: "블룸 웨딩홀", cats: "웨딩, 돌잔치", area: "잠실", status: "운영중", photos: 30 },
                    { name: "프로덕트 랩", cats: "제품", area: "홍대", status: "정지", photos: 18 },
                    { name: "무브 필름랩", cats: "영상", area: "합정", status: "운영중", photos: 15 },
                  ].map((b, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{b.name}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{b.cats}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{b.area}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          b.status === "운영중" ? "bg-green-100 text-green-700" : b.status === "정지" ? "bg-red-100 text-red-500" : "bg-yellow-100 text-yellow-700"
                        }`}>{b.status}</span>
                      </td>
                      <td className="p-4">
                        {b.status === "승인대기" ? (
                          <div className="flex gap-1 flex-wrap">
                            <button className="text-xs bg-primary text-white px-3 py-1 rounded-lg">승인</button>
                            <button className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-lg">거절</button>
                            <button className="text-xs text-primary px-2 py-1">📷 사진({b.photos})</button>
                          </div>
                        ) : b.status === "정지" ? (
                          <div className="flex gap-1">
                            <button className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded">해제</button>
                            <button className="text-xs text-gray-400 px-2 py-1">📅 달력</button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">상세</button>
                            <button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">정지</button>
                            <button className="text-xs text-gray-400 px-2 py-1">📅 달력</button>
                          </div>
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
                      <th className="p-3 text-left font-medium text-gray-500">총액 (촬영+옵션)</th>
                      <th className="p-3 text-left font-medium text-gray-500">수수료율</th>
                      <th className="p-3 text-left font-medium text-gray-500">정산액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "루미에르 스튜디오", count: 8, base: "₩580,000", options: "₩100,000", total: "₩680,000", customFee: "", fee: "10%", net: "₩612,000" },
                      { name: "블룸 웨딩홀", count: 3, base: "₩450,000", options: "₩70,000", total: "₩520,000", customFee: "8%", fee: "8%", net: "₩478,400" },
                      { name: "프로덕트 랩", count: 12, base: "₩340,000", options: "₩0", total: "₩340,000", customFee: "", fee: "10%", net: "₩306,000" },
                    ].map((s, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="p-3"><input type="checkbox" /></td>
                        <td className="p-3">
                          <p className="font-medium">{s.name}</p>
                          {s.customFee && <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">개별 {s.customFee}</span>}
                        </td>
                        <td className="p-3">{s.count}건</td>
                        <td className="p-3">
                          <p>{s.total}</p>
                          <p className="text-[9px] text-gray-400">촬영 {s.base} + 옵션 {s.options}</p>
                        </td>
                        <td className="p-3 text-primary font-medium">{s.fee}</td>
                        <td className="p-3 font-bold">{s.net}</td>
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
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <input type="text" placeholder="이름, 닉네임, 이메일 검색..." className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm" />
                {["전체", "소비자", "업체"].map(f => (
                  <button key={f} className={`px-3 py-2 rounded-lg text-xs font-medium ${f === "전체" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{f}</button>
                ))}
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">이름</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">닉네임</th>
                    <th className="text-left p-4 font-medium text-gray-500">유형</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">가입일</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">예약 수</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                    <th className="text-left p-4 font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "김퍼니", nick: "퍼니유저", type: "소비자", date: "2026.04.10", bookings: 5, status: "활성" },
                    { name: "이촬영", nick: "촬영러버", type: "소비자", date: "2026.04.08", bookings: 2, status: "활성" },
                    { name: "박스튜", nick: "스튜디오박", type: "소비자", date: "2026.04.05", bookings: 0, status: "활성" },
                    { name: "루미에르(주)", nick: "-", type: "업체", date: "2026.03.20", bookings: 0, status: "활성" },
                    { name: "선셋포토(주)", nick: "-", type: "업체", date: "2026.04.01", bookings: 0, status: "차단" },
                  ].map((m, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{m.name}</td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{m.nick}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${m.type === "소비자" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{m.type}</span></td>
                      <td className="p-4 text-gray-500 hidden md:table-cell text-xs">{m.date}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{m.bookings}건</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${m.status === "활성" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>{m.status}</span></td>
                      <td className="p-4">{m.status === "활성" ? <button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">차단</button> : <button className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded">해제</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== CATEGORIES (REQ-116) ===== */}
        {tab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">카테고리 관리</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">+ 카테고리 추가</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-bold mb-3">종류별 카테고리</h3>
                {["웨딩", "프로필", "바디프로필", "돌잔치", "제품", "영상", "기타"].map((c, i) => (
                  <div key={c} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                      <span className="text-sm">{c}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="text-[10px] text-gray-400 px-2 py-1">▲</button>
                      <button className="text-[10px] text-gray-400 px-2 py-1">▼</button>
                      <button className="text-[10px] text-gray-400 px-2 py-1">수정</button>
                      <button className="text-[10px] text-red-400 px-2 py-1">삭제</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-bold mb-3">지역별 카테고리</h3>
                {["서울 강남", "서울 성수", "서울 잠실", "서울 홍대", "서울 합정", "경기 판교", "경기 분당"].map((c, i) => (
                  <div key={c} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                      <span className="text-sm">{c}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="text-[10px] text-gray-400 px-2 py-1">수정</button>
                      <button className="text-[10px] text-red-400 px-2 py-1">삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== BANNERS (REQ-117) ===== */}
        {tab === "banners" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">배너 관리</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">+ 배너 등록</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">미리보기</th>
                    <th className="text-left p-4 font-medium text-gray-500">제목</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">위치</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">기간</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                    <th className="text-left p-4 font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: "프로필 촬영 특가", position: "메인 상단", period: "04.01~04.30", status: "노출중" },
                    { title: "바디프로필 시즌", position: "카테고리", period: "04.15~05.15", status: "노출중" },
                    { title: "웨딩 촬영 패키지", position: "메인 중간", period: "05.01~05.31", status: "대기" },
                  ].map((b, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4"><div className="w-16 h-10 bg-gradient-to-r from-violet-200 to-purple-200 rounded" /></td>
                      <td className="p-4 font-medium">{b.title}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{b.position}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell text-xs">{b.period}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${b.status === "노출중" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{b.status}</span></td>
                      <td className="p-4"><div className="flex gap-1"><button className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">수정</button><button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">삭제</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== BOOKINGS (REQ-118) ===== */}
        {tab === "bookings" && (
          <div>
            <h2 className="text-xl font-bold mb-6">예약 관리</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <input type="text" placeholder="소비자명, 업체명 검색..." className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm" />
                {["전체", "예정", "완료", "취소"].map(f => (
                  <button key={f} className={`px-3 py-2 rounded-lg text-xs font-medium ${f === "전체" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{f}</button>
                ))}
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">예약번호</th>
                    <th className="text-left p-4 font-medium text-gray-500">소비자</th>
                    <th className="text-left p-4 font-medium text-gray-500">업체</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">날짜</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">금액</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "B-2026-0142", consumer: "김퍼니", studio: "루미에르", date: "05.10 14:00", amount: "₩100,000", status: "확정" },
                    { id: "B-2026-0141", consumer: "이촬영", studio: "선셋 포토랩", date: "05.18 10:00", amount: "₩160,000", status: "확정" },
                    { id: "B-2026-0140", consumer: "박스튜", studio: "블룸 웨딩", date: "05.25 10:00", amount: "₩800,000", status: "대기" },
                    { id: "B-2026-0135", consumer: "최민지", studio: "프로덕트 랩", date: "04.20 13:00", amount: "₩80,000", status: "완료" },
                    { id: "B-2026-0130", consumer: "한소희", studio: "무브 필름랩", date: "04.15 15:00", amount: "₩120,000", status: "취소" },
                  ].map((b, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-400">{b.id}</td>
                      <td className="p-4">{b.consumer}</td>
                      <td className="p-4">{b.studio}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell text-xs">{b.date}</td>
                      <td className="p-4 font-medium hidden md:table-cell">{b.amount}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${b.status === "확정" ? "bg-green-100 text-green-700" : b.status === "완료" ? "bg-gray-200 text-gray-500" : b.status === "취소" ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-700"}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== PAYMENTS (REQ-118) ===== */}
        {tab === "payments" && (
          <div>
            <h2 className="text-xl font-bold mb-6">결제 관리</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <input type="text" placeholder="소비자명, 업체명 검색..." className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">결제번호</th>
                    <th className="text-left p-4 font-medium text-gray-500">소비자</th>
                    <th className="text-left p-4 font-medium text-gray-500">업체</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">결제일</th>
                    <th className="text-left p-4 font-medium text-gray-500">금액</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                    <th className="text-left p-4 font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "P-0142", consumer: "김퍼니", studio: "루미에르", date: "05.08", amount: "₩100,000", status: "결제완료" },
                    { id: "P-0141", consumer: "이촬영", studio: "선셋 포토랩", date: "05.05", amount: "₩160,000", status: "결제완료" },
                    { id: "P-0140", consumer: "박스튜", studio: "블룸 웨딩", date: "04.03", amount: "₩800,000", status: "결제완료" },
                    { id: "P-0135", consumer: "최민지", studio: "프로덕트 랩", date: "04.18", amount: "₩80,000", status: "결제완료" },
                    { id: "P-0130", consumer: "한소희", studio: "무브 필름랩", date: "04.13", amount: "₩120,000", status: "환불완료" },
                  ].map((p, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-400">{p.id}</td>
                      <td className="p-4">{p.consumer}</td>
                      <td className="p-4">{p.studio}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell text-xs">{p.date}</td>
                      <td className={`p-4 font-medium ${p.status === "환불완료" ? "text-red-500" : ""}`}>{p.status === "환불완료" ? "-" : ""}{p.amount}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${p.status === "결제완료" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>{p.status}</span></td>
                      <td className="p-4">{p.status === "결제완료" && <button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">환불</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== REVIEWS (REQ-120) ===== */}
        {tab === "reviews" && (
          <div>
            <h2 className="text-xl font-bold mb-6">리뷰 관리</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <input type="text" placeholder="스튜디오명, 작성자 검색..." className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">스튜디오</th>
                    <th className="text-left p-4 font-medium text-gray-500">작성자</th>
                    <th className="text-left p-4 font-medium text-gray-500">별점</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">내용</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">작성일</th>
                    <th className="text-left p-4 font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { studio: "루미에르", author: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다", date: "04.10" },
                    { studio: "루미에르", author: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요", date: "04.08" },
                    { studio: "선셋 포토랩", author: "박**", rating: 5, text: "바디프로필 전문! 조명이 정말 좋습니다", date: "04.05" },
                    { studio: "블룸 웨딩", author: "최**", rating: 3, text: "가격 대비 보통이었어요", date: "04.02" },
                    { studio: "프로덕트 랩", author: "한**", rating: 5, text: "제품 사진 퀄리티가 기대 이상이에요", date: "03.28" },
                  ].map((r, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{r.studio}</td>
                      <td className="p-4">{r.author}</td>
                      <td className="p-4 text-yellow-500 text-xs">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell max-w-[200px] truncate">{r.text}</td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{r.date}</td>
                      <td className="p-4"><div className="flex gap-1"><button className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">숨김</button><button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">삭제</button></div></td>
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
