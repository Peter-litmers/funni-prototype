"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, Building2, Calendar, DollarSign, ImageIcon, X } from "lucide-react";
import PolicyForm from "../components/PolicyForm";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

type Tab = "dashboard" | "businesses" | "settlement" | "ads" | "members" | "categories" | "banners" | "bookings" | "payments" | "reviews";

export default function AdminWeb() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [bizDetail, setBizDetail] = useState<null | { name: string; cats: string; area: string; status: string; photos: number }>(null);
  const [bizDetailView, setBizDetailView] = useState<"info" | "portfolio" | "calendar">("info");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold">포토팟 Admin</h1>
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
                { label: "총 회원 (소비자/업체)", value: "3,891 / 42", Icon: Users },
                { label: "총 스튜디오", value: "58", Icon: Building2 },
                { label: "이번 달 예약", value: "142", Icon: Calendar },
                { label: "이번 달 매출", value: "₩12.4M", Icon: DollarSign, sub: "수수료 수익 ₩1.24M" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <s.Icon size={18} strokeWidth={1.5} className="text-gray-500" />
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

              {(() => {
                const MONTHLY = [
                  { month: "1월", v: 62, rev: 4.8 },
                  { month: "2월", v: 71, rev: 5.6 },
                  { month: "3월", v: 88, rev: 7.1 },
                  { month: "4월", v: 95, rev: 7.8 },
                  { month: "5월", v: 112, rev: 9.2 },
                  { month: "6월", v: 105, rev: 8.6 },
                  { month: "7월", v: 128, rev: 10.4 },
                  { month: "8월", v: 142, rev: 12.4 },
                  { month: "9월", v: 135, rev: 11.2 },
                  { month: "10월", v: 156, rev: 13.8 },
                  { month: "11월", v: 168, rev: 15.2 },
                  { month: "12월", v: 185, rev: 17.6 },
                ];
                // Y축 최대값은 보기 좋은 수로 올림 처리
                const maxV = 200;
                const maxR = 20;
                const yBookings = [0, 50, 100, 150, 200];
                const yRevenue = [0, 5, 10, 15, 20];
                const chartH = 180;
                return (
                  <>
                    {/* 월별 예약 수 */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-gray-500 font-medium">월별 예약 수</p>
                        <p className="text-[10px] text-gray-400">2026년 · 총 {MONTHLY.reduce((s, m) => s + m.v, 0).toLocaleString()}건</p>
                      </div>
                      <div className="flex gap-2">
                        {/* Y축 */}
                        <div className="relative text-[9px] text-gray-400 pr-1 shrink-0" style={{ height: chartH, width: 32 }}>
                          {yBookings.slice().reverse().map((y, i) => (
                            <div key={y} className="absolute right-1 -translate-y-1/2" style={{ top: `${(i / (yBookings.length - 1)) * 100}%` }}>{y}</div>
                          ))}
                        </div>
                        {/* 차트 영역 */}
                        <div className="flex-1 relative">
                          {/* 가이드라인 */}
                          {yBookings.slice().reverse().map((y, i) => (
                            <div key={y} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: `${(i / (yBookings.length - 1)) * 100}%`, height: 1 }} />
                          ))}
                          <div className="flex items-end gap-1.5 relative" style={{ height: chartH }}>
                            {MONTHLY.map((m, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end group h-full">
                                {/* 값 레이블 (막대 위) */}
                                <span className="text-[10px] font-bold text-gray-700 mb-0.5">{m.v}</span>
                                <div className="w-full bg-primary rounded-t transition-all group-hover:bg-primary-dark" style={{ height: `${(m.v / maxV) * 100}%` }} title={`${m.v}건`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* X축 레이블 */}
                      <div className="flex gap-2 mt-1">
                        <div className="shrink-0" style={{ width: 32 }} />
                        <div className="flex-1 flex gap-1.5">
                          {MONTHLY.map(m => (
                            <div key={m.month} className="flex-1 text-center">
                              <p className="text-[9px] text-gray-400">{m.month}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 월별 매출 · 수수료 수익 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-500 font-medium">월별 매출 · 수수료 수익</p>
                          <p className="text-[10px] text-gray-400">총 매출 ₩{MONTHLY.reduce((s, m) => s + m.rev, 0).toFixed(1)}M</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block" /> 매출</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> 수수료 수익</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Y축 */}
                        <div className="relative text-[9px] text-gray-400 pr-1 shrink-0" style={{ height: chartH, width: 32 }}>
                          {yRevenue.slice().reverse().map((y, i) => (
                            <div key={y} className="absolute right-1 -translate-y-1/2" style={{ top: `${(i / (yRevenue.length - 1)) * 100}%` }}>₩{y}M</div>
                          ))}
                        </div>
                        {/* 차트 영역 */}
                        <div className="flex-1 relative">
                          {yRevenue.slice().reverse().map((y, i) => (
                            <div key={y} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: `${(i / (yRevenue.length - 1)) * 100}%`, height: 1 }} />
                          ))}
                          <div className="flex items-end gap-1.5 relative" style={{ height: chartH }}>
                            {MONTHLY.map((m, i) => {
                              const revH = (m.rev / maxR) * chartH * 0.8;
                              const feeH = (m.rev * 0.1 / maxR) * chartH * 0.8;
                              return (
                                <div key={i} className="flex-1 flex items-end group h-full">
                                  <div className="flex gap-0.5 items-end w-full">
                                    {/* 매출 막대 + 레이블 */}
                                    <div className="flex-1 flex flex-col items-center justify-end">
                                      <span className="text-[9px] font-bold text-green-600 mb-0.5">₩{m.rev}M</span>
                                      <div className="w-full bg-green-400 rounded-t transition-all group-hover:bg-green-500" style={{ height: `${revH}px` }} title={`매출 ₩${m.rev}M`} />
                                    </div>
                                    {/* 수수료 막대 + 레이블 */}
                                    <div className="flex-1 flex flex-col items-center justify-end">
                                      <span className="text-[9px] font-bold text-amber-600 mb-0.5">₩{(m.rev * 0.1).toFixed(2)}M</span>
                                      <div className="w-full bg-amber-400 rounded-t transition-all group-hover:bg-amber-500" style={{ height: `${feeH}px` }} title={`수수료 ₩${(m.rev * 0.1).toFixed(2)}M`} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {/* X축 레이블 */}
                      <div className="flex gap-2 mt-1">
                        <div className="shrink-0" style={{ width: 32 }} />
                        <div className="flex-1 flex gap-1.5">
                          {MONTHLY.map(m => (
                            <div key={m.month} className="flex-1 text-center">
                              <p className="text-[9px] text-gray-400">{m.month}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
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
                  { action: "업체 취소 기록", detail: "블룸 웨딩 스튜디오 · 2026.04.18 · 누적 2회", time: "50분 전" },
                  { action: "노쇼 기록", detail: "펫모먼츠 스튜디오 · 2026.04.12 · 소비자 1회", time: "55분 전" },
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
              <p className="text-[10px] text-gray-500 mt-1">• 입점 방식: 관리자 수동 검토 (REQ-115 확정)</p>
              <p className="text-[10px] text-gray-500">• 필수 서류: 사업자등록번호 + 포트폴리오 사진 (REQ-102 확정)</p>
              <p className="text-[10px] text-gray-500">• 승인 거절 사유 전달: 이메일 + 앱 알림</p>
              <p className="text-[10px] text-gray-500">• 재신청 제한: 횟수/대기기간 없이 차단 여부 운영 검토</p>
              <PolicyForm question="퇴점(입점 해제) 기준은? (위반 횟수, 경고 절차)" screen="어드민" area="퇴점 기준" />
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
                    { name: "블룸 웨딩홀", cats: "웨딩, 커플", area: "잠실", status: "운영중", photos: 30 },
                    { name: "브랜드컷 스튜디오", cats: "비즈니스", area: "홍대", status: "정지", photos: 18 },
                    { name: "펫모먼츠 스튜디오", cats: "반려동물, 가족", area: "합정", status: "운영중", photos: 15 },
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
                            <button onClick={() => { setBizDetail(b); setBizDetailView("portfolio"); }} className="text-xs text-primary px-2 py-1"><ImageIcon size={12} strokeWidth={1.5} className="inline" /> 사진({b.photos})</button>
                          </div>
                        ) : b.status === "정지" ? (
                          <div className="flex gap-1">
                            <button className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded">해제</button>
                            <button onClick={() => { setBizDetail(b); setBizDetailView("calendar"); }} className="text-xs text-gray-400 px-2 py-1"><Calendar size={12} strokeWidth={1.5} className="inline" /> 달력</button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button onClick={() => { setBizDetail(b); setBizDetailView("info"); }} className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">상세</button>
                            <button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">정지</button>
                            <button onClick={() => { setBizDetail(b); setBizDetailView("calendar"); }} className="text-xs text-gray-400 px-2 py-1"><Calendar size={12} strokeWidth={1.5} className="inline" /> 달력</button>
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
              <PolicyBadge label="정산 정책 반영" />
              <p className="text-[10px] text-gray-500 mt-1">• 정산 대상: 예약 시 받은 예약금 포함</p>
              <p className="text-[10px] text-gray-500">• 정산 기준: 월별 기준, 주별 조회 가능</p>
              <p className="text-[10px] text-gray-500">• 정산 단위: 업체별 일괄 정산</p>
              <p className="text-[10px] text-gray-500">• 수수료 차등: 기본 10%, 업체별 override</p>
              <p className="text-[10px] text-gray-500">• 환불 반영: 토스페이먼츠 결제 방식별 정책 정리 후 반영 예정</p>
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
                      { name: "브랜드컷 스튜디오", count: 12, base: "₩340,000", options: "₩0", total: "₩340,000", customFee: "", fee: "10%", net: "₩306,000" },
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">광고 관리 (상단 노출)</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">+ 광고 업체 추가</button>
            </div>

            <div className="policy-area p-4 mb-6">
              <PolicyBadge label="광고 정책 반영" />
              <p className="text-[10px] text-gray-500 mt-1">• 프리미엄 영역: 정사각형 3개 × 3페이지</p>
              <p className="text-[10px] text-gray-500">• 노출 기간: 월간, 시작일/종료일 상세 설정</p>
              <p className="text-[10px] text-gray-500">• 배너 순서: 로테이션</p>
            </div>

            {/* 현재 노출 중인 광고 스튜디오 (REQ-112 상단 노출) */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-sm">현재 노출 중인 스튜디오 (프리미엄 영역)</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">메인 홈 상단 · 카테고리 페이지 상단에 &lsquo;광고&rsquo; 라벨로 노출</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">순서</th>
                    <th className="text-left p-4 font-medium text-gray-500">스튜디오</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">카테고리</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">기간</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                    <th className="text-left p-4 font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { order: 1, studio: "루미에르 스튜디오", cat: "프로필", period: "04.01~04.30", status: "노출중" },
                    { order: 2, studio: "선셋 포토랩", cat: "바디프로필", period: "04.15~05.15", status: "노출중" },
                    { order: 3, studio: "블룸 웨딩 스튜디오", cat: "웨딩", period: "04.10~05.10", status: "노출중" },
                    { order: 4, studio: "브랜드컷 스튜디오", cat: "비즈니스", period: "05.01~05.31", status: "대기" },
                  ].map((a, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4"><div className="flex items-center gap-1"><span className="font-mono text-xs text-gray-400">#{a.order}</span><button className="text-[10px] text-gray-400">▲</button><button className="text-[10px] text-gray-400">▼</button></div></td>
                      <td className="p-4 font-medium">{a.studio}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell"><span className="bg-gray-100 text-xs px-2 py-0.5 rounded">{a.cat}</span></td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{a.period}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${a.status === "노출중" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.status}</span></td>
                      <td className="p-4"><div className="flex gap-1"><button className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">수정</button><button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">중지</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 미리보기 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold mb-4 text-sm">유저 앱 프리미엄 영역 미리보기</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["루미에르 스튜디오", "선셋 포토랩", "블룸 웨딩 스튜디오"].map((name, i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 relative">
                    <span className="absolute top-2 left-2 bg-primary/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">AD</span>
                    <div className="flex items-center gap-3 mt-6">
                      <div className="w-12 h-12 bg-white/60 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={18} strokeWidth={1.5} /></div>
                      <div>
                        <p className="text-xs font-bold">{name}</p>
                        <p className="text-[10px] text-gray-500">서울 · 프리미엄 구좌 #{i + 1}</p>
                      </div>
                    </div>
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
                    { name: "김포토", nick: "포토팟유저", type: "소비자", date: "2026.04.10", bookings: 5, status: "활성" },
                    { name: "이촬영", nick: "촬영러버", type: "소비자", date: "2026.04.08", bookings: 2, status: "활성" },
                    { name: "박스튜", nick: "스튜디오박", type: "소비자", date: "2026.04.05", bookings: 0, status: "활성" },
                    { name: "루미에르(주)", nick: "-", type: "업체", date: "2026.03.20", bookings: 0, status: "활성" },
                    { name: "선셋포토(주)", nick: "-", type: "업체", date: "2026.04.01", bookings: 0, status: "차단" },
                  ].map((m, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4 font-medium">{m.name}</td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{m.nick}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${m.type === "소비자" ? "bg-blue-100 text-blue-700" : "bg-primary/10 text-primary"}`}>{m.type}</span></td>
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
                {["프로필", "바디프로필", "웨딩", "가족", "반려동물", "비즈니스", "커플", "우정"].map((c, i) => (
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
                    { title: "반려동물 촬영전", position: "카테고리", period: "04.15~05.15", status: "노출중" },
                    { title: "웨딩 촬영 패키지", position: "메인 중간", period: "05.01~05.31", status: "대기" },
                  ].map((b, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4"><div className="w-16 h-10 bg-gradient-to-r from-rose-200 to-pink-200 rounded" /></td>
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
            <div className="mb-4 rounded-xl bg-amber-50 p-4 text-[11px] text-amber-700">
              <p>업체 취소는 100% 환불 대상이며, 취소 날짜와 누적 횟수를 어드민에서 추적합니다.</p>
              <p className="mt-1">노쇼 건도 동일하게 날짜/횟수 단위로 기록해 추후 이용정지 정책에 활용할 수 있습니다.</p>
            </div>

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
                    { id: "B-2026-0142", consumer: "김포토", studio: "루미에르", date: "05.10 14:00", amount: "₩100,000", status: "확정" },
                    { id: "B-2026-0141", consumer: "이촬영", studio: "선셋 포토랩", date: "05.18 10:00", amount: "₩160,000", status: "확정" },
                    { id: "B-2026-0140", consumer: "박스튜", studio: "블룸 웨딩", date: "05.25 10:00", amount: "₩800,000", status: "대기" },
                    { id: "B-2026-0135", consumer: "최민지", studio: "브랜드컷 스튜디오", date: "04.20 13:00", amount: "₩80,000", status: "완료" },
                    { id: "B-2026-0130", consumer: "한소희", studio: "펫모먼츠 스튜디오", date: "04.15 15:00", amount: "₩120,000", status: "취소" },
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
                    { id: "P-0142", consumer: "김포토", studio: "루미에르", date: "05.08", amount: "₩100,000", status: "결제완료" },
                    { id: "P-0141", consumer: "이촬영", studio: "선셋 포토랩", date: "05.05", amount: "₩160,000", status: "결제완료" },
                    { id: "P-0140", consumer: "박스튜", studio: "블룸 웨딩", date: "04.03", amount: "₩800,000", status: "결제완료" },
                    { id: "P-0135", consumer: "최민지", studio: "브랜드컷 스튜디오", date: "04.18", amount: "₩80,000", status: "결제완료" },
                    { id: "P-0130", consumer: "한소희", studio: "펫모먼츠 스튜디오", date: "04.13", amount: "₩120,000", status: "환불완료" },
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
                    { studio: "브랜드컷 스튜디오", author: "한**", rating: 5, text: "팀 프로필 결과물이 기대 이상이에요", date: "03.28" },
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

      {/* ===== 업체 상세 모달 (REQ-115) ===== */}
      {bizDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBizDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{bizDetail.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{bizDetail.cats} · {bizDetail.area}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${bizDetail.status === "운영중" ? "bg-green-100 text-green-700" : bizDetail.status === "정지" ? "bg-red-100 text-red-500" : "bg-yellow-100 text-yellow-700"}`}>{bizDetail.status}</span>
                  <button onClick={() => setBizDetail(null)} className="text-gray-400 ml-2"><X size={18} strokeWidth={1.5} /></button>
                </div>
              </div>
              {/* View Tabs */}
              <div className="flex gap-2 mt-4">
                {([
                  { key: "info" as const, label: "기본정보" },
                  { key: "portfolio" as const, label: `포트폴리오 (${bizDetail.photos}장)` },
                  { key: "calendar" as const, label: "예약 달력" },
                ]).map(v => (
                  <button key={v.key} onClick={() => setBizDetailView(v.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${bizDetailView === v.key ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{v.label}</button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {bizDetailView === "info" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">사업자등록번호</p><p className="text-sm font-medium">123-45-67890</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">대표자명</p><p className="text-sm font-medium">김대표</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">연락처</p><p className="text-sm font-medium">02-1234-5678</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">이메일</p><p className="text-sm font-medium">biz@example.com</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">카테고리</p><p className="text-sm font-medium">{bizDetail.cats}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">지역</p><p className="text-sm font-medium">{bizDetail.area}</p></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {bizDetail.status === "운영중" && <button className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">정지</button>}
                    {bizDetail.status === "정지" && <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm">해제</button>}
                    {bizDetail.status === "승인대기" && <><button className="bg-primary text-white px-4 py-2 rounded-lg text-sm">승인</button><button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm">거절</button></>}
                  </div>
                </div>
              )}

              {bizDetailView === "portfolio" && (
                <div>
                  <p className="text-sm font-bold mb-3">가입 시 제출한 포트폴리오 사진</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: bizDetail.photos }).map((_, i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={22} strokeWidth={1.5} /></div>
                    ))}
                  </div>
                </div>
              )}

              {bizDetailView === "calendar" && (
                <div>
                  <p className="text-sm font-bold mb-3">업체 예약 달력 (2026년 5월)</p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 mb-2">
                      {["일","월","화","수","목","금","토"].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: 31 }).map((_, i) => {
                        const hasBooking = [5, 8, 10, 11, 12, 13, 15, 18, 20, 25].includes(i + 1);
                        const isManual = [6, 14, 22].includes(i + 1);
                        return (
                          <div key={i} className={`py-1.5 rounded text-xs ${hasBooking ? "bg-primary/10 text-primary font-bold" : isManual ? "bg-amber-50 text-amber-600 font-medium" : "text-gray-500"}`}>
                            {i + 1}
                            {hasBooking && <span className="block text-[7px]">예약</span>}
                            {isManual && <span className="block text-[7px]">수기</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-3 mt-3 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary/10 rounded inline-block" /> 앱 예약</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-50 rounded inline-block" /> 수기 일정</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
