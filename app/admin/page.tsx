"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, Building2, Calendar, DollarSign, ImageIcon, X } from "lucide-react";
import PolicyForm from "../components/PolicyForm";
import { useCategories, useRegions, useFeeRate, useBusinessFees, getFeeForBusiness, usePolicies, useHomeKeywords } from "../lib/admin-store";
import { POLICY_CATALOG, formatTimestamp } from "../lib/policy-catalog";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

type Tab = "dashboard" | "businesses" | "settlement" | "ads" | "members" | "categories" | "banners" | "bookings" | "payments" | "reviews" | "policies";

export default function AdminWeb() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [bizDetail, setBizDetail] = useState<null | { name: string; cats: string; area: string; status: string; photos: number }>(null);
  const [bizDetailView, setBizDetailView] = useState<"info" | "portfolio" | "calendar">("info");
  const [categories, setCategories] = useCategories();
  const [regions, setRegions] = useRegions();
  const [homeKeywords, setHomeKeywords] = useHomeKeywords();
  const [feeRate, setFeeRate] = useFeeRate();
  const [bizFees, setBizFees] = useBusinessFees();
  const [policies, updatePolicy, resetPolicy] = usePolicies();
  const [policyEdit, setPolicyEdit] = useState<{ id: string; value: string } | null>(null);
  const [policyHistoryId, setPolicyHistoryId] = useState<string | null>(null);
  const [policySection, setPolicySection] = useState<string>(POLICY_CATALOG[0].id);

  const updateCategory = (idx: number, next: string) => {
    const updated = [...categories];
    updated[idx] = next;
    setCategories(updated);
  };
  const removeCategory = (idx: number) => setCategories(categories.filter((_, i) => i !== idx));
  const addCategory = () => {
    const name = prompt("새 카테고리 이름을 입력하세요");
    if (name && name.trim()) setCategories([...categories, name.trim()]);
  };
  const moveCategory = (idx: number, dir: -1 | 1) => {
    const next = [...categories];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setCategories(next);
  };

  const updateRegion = (idx: number, next: string) => {
    const updated = [...regions];
    updated[idx] = next;
    setRegions(updated);
  };
  const removeRegion = (idx: number) => setRegions(regions.filter((_, i) => i !== idx));
  const addRegion = () => {
    const name = prompt("새 지역 이름을 입력하세요 (예: 서울 마포)");
    if (name && name.trim()) setRegions([...regions, name.trim()]);
  };

  const updateHomeKeywordLabel = (idx: number, label: string) => {
    const updated = [...homeKeywords];
    updated[idx] = { ...updated[idx], label };
    setHomeKeywords(updated);
  };
  const updateHomeKeywordAliases = (idx: number, raw: string) => {
    const aliases = raw.split(",").map(s => s.trim()).filter(Boolean);
    const updated = [...homeKeywords];
    updated[idx] = { ...updated[idx], aliases };
    setHomeKeywords(updated);
  };
  const removeHomeKeyword = (idx: number) => setHomeKeywords(homeKeywords.filter((_, i) => i !== idx));
  const addHomeKeyword = () => {
    const label = prompt("새 추천 검색어 라벨을 입력하세요 (예: 주말 웨딩, 증명사진)");
    if (!label || !label.trim()) return;
    const aliasesRaw =
      prompt(
        "매칭할 별칭(검색 단어)을 쉼표로 구분해 입력하세요\n예) 증명사진, 이력서, 취업 프로필\n\n※ 각 별칭 안의 공백은 AND 매칭, 별칭 간에는 OR 매칭.\n※ 비워두면 라벨 자체로만 매칭합니다 (카테고리명과 일치하면 카테고리 필터).",
      ) || "";
    const aliases = aliasesRaw.split(",").map(s => s.trim()).filter(Boolean);
    setHomeKeywords([...homeKeywords, { label: label.trim(), aliases }]);
  };
  const moveHomeKeyword = (idx: number, dir: -1 | 1) => {
    const next = [...homeKeywords];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setHomeKeywords(next);
  };

  const setBizFeeOverride = (name: string, rate: number | null) => {
    const next = { ...bizFees };
    if (rate === null) delete next[name];
    else next[name] = rate;
    setBizFees(next);
  };

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
              { key: "policies" as Tab, label: "정책" },
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
                  <label className="text-xs text-gray-500 block mb-1">기본 수수료율 (전체 업체 적용)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={feeRate}
                      onChange={(e) => setFeeRate(Number(e.target.value) || 0)}
                      className="bg-gray-100 rounded-xl px-4 py-3 text-lg font-bold w-24 text-center"
                    />
                    <span className="text-lg font-bold">%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">실시간 저장 · 업체별 개별 수수료 override는 아래 표에서 관리</p>

              {/* Per-Business Fee Overrides */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold">업체별 수수료 개별 설정 (Override)</h4>
                  <span className="text-[10px] text-gray-400">빈 값 = 기본값 적용</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left font-medium text-gray-500 text-xs">업체</th>
                        <th className="p-2 text-left font-medium text-gray-500 text-xs">적용 수수료율</th>
                        <th className="p-2 text-left font-medium text-gray-500 text-xs">상태</th>
                        <th className="p-2 text-left font-medium text-gray-500 text-xs">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["루미에르 스튜디오", "블룸 웨딩홀", "브랜드컷 스튜디오", "선셋 포토랩", "펫모먼츠 스튜디오"].map((bizName) => {
                        const { rate, isOverride } = getFeeForBusiness(bizName, feeRate, bizFees);
                        return (
                          <tr key={bizName} className="border-t border-gray-50">
                            <td className="p-2 font-medium">{bizName}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={isOverride ? rate : ""}
                                  placeholder={`${feeRate}`}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    if (v === "") setBizFeeOverride(bizName, null);
                                    else setBizFeeOverride(bizName, Number(v));
                                  }}
                                  className="bg-gray-50 rounded-lg px-2 py-1 text-sm w-16 text-center border border-gray-100"
                                />
                                <span className="text-xs">%</span>
                              </div>
                            </td>
                            <td className="p-2">
                              {isOverride ? (
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">개별 적용</span>
                              ) : (
                                <span className="text-[10px] text-gray-400">기본값 {feeRate}%</span>
                              )}
                            </td>
                            <td className="p-2">
                              {isOverride && (
                                <button onClick={() => setBizFeeOverride(bizName, null)}
                                  className="text-[10px] text-red-400 px-2 py-1">기본값으로 초기화</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">※ 변경 즉시 업체 대시보드 &apos;적용 수수료율&apos; 및 정산 계산에 반영됩니다.</p>
              </div>
            </div>

            {/* 운영 정책 기준치 (미확정 항목 — 대표 확인 대기) */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">운영 정책 기준치</h3>
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">대표 확인 대기</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">미승인 자동취소 대기시간</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={48} className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold w-16 text-center border border-gray-100" />
                    <span className="text-xs">시간</span>
                    <select defaultValue="business" className="bg-gray-50 rounded-lg px-2 py-2 text-xs border border-gray-100 outline-none">
                      <option value="business">영업일 기준</option>
                      <option value="calendar">달력일 기준</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">소비자 노쇼 누적 → 경고</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={3} className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold w-16 text-center border border-gray-100" />
                    <span className="text-xs">회부터 경고</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">업체 취소 누적 → 이용정지</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={5} className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold w-16 text-center border border-gray-100" />
                    <span className="text-xs">회부터 정지</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">소비자 CS 누적 → 정지 검토</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={5} className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold w-16 text-center border border-gray-100" />
                    <span className="text-xs">건</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">최소 정산 금액</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">₩</span>
                    <input type="text" defaultValue="50,000" className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold w-full text-right border border-gray-100" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">최대 정산 금액 (1회)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">₩</span>
                    <input type="text" defaultValue="10,000,000" className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold w-full text-right border border-gray-100" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[10px] text-gray-400">※ 기본값은 업계 표준 기준 임시 세팅. 대표 확인 후 확정.</p>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium">저장</button>
              </div>
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
              <PolicyBadge label="입점 정책 반영" />
              <p className="text-[10px] text-gray-500 mt-1">• 입점 방식: 관리자 수동 검토 (REQ-115 확정)</p>
              <p className="text-[10px] text-gray-500">• 필수 서류: 사업자등록번호 + 포트폴리오 사진 (REQ-102 확정)</p>
              <p className="text-[10px] text-gray-500">• 승인 거절 사유 전달: 이메일 + 앱 알림 (확정)</p>
              <p className="text-[10px] text-gray-500">• 재신청: 횟수/대기기간 없이 관리자 재차단 가능</p>
              <p className="text-[10px] text-gray-500">• 이용정지·퇴점 기준: 운영 초기 정책 수립 후 반영 (임시: 노쇼·소비자 CS 누적 시 어드민 재량 정지)</p>
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
              <p className="text-[10px] text-gray-500">• 환불 반영: 정산 완료 전 발생 건은 정산액에서 차감, 정산 완료 후 발생 건은 다음 정산에서 차감 (대표 확인 대기)</p>
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
                      { name: "루미에르 스튜디오", count: 8, base: 580000, options: 100000 },
                      { name: "블룸 웨딩홀", count: 3, base: 450000, options: 70000 },
                      { name: "브랜드컷 스튜디오", count: 12, base: 340000, options: 0 },
                    ].map((s, i) => {
                      const total = s.base + s.options;
                      const { rate, isOverride } = getFeeForBusiness(s.name, feeRate, bizFees);
                      const net = Math.round(total * (1 - rate / 100));
                      return (
                        <tr key={i} className="border-t border-gray-50">
                          <td className="p-3"><input type="checkbox" /></td>
                          <td className="p-3">
                            <p className="font-medium">{s.name}</p>
                            {isOverride && <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">개별 {rate}%</span>}
                          </td>
                          <td className="p-3">{s.count}건</td>
                          <td className="p-3">
                            <p>₩{total.toLocaleString()}</p>
                            <p className="text-[9px] text-gray-400">촬영 ₩{s.base.toLocaleString()} + 옵션 ₩{s.options.toLocaleString()}</p>
                          </td>
                          <td className="p-3 text-primary font-medium">{rate}%</td>
                          <td className="p-3 font-bold">₩{net.toLocaleString()}</td>
                        </tr>
                      );
                    })}
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
              <p className="text-[10px] text-gray-500 mt-1">• 광고 배너: 정사각형 3개 × 3페이지 = 총 9구좌</p>
              <p className="text-[10px] text-gray-500">• 노출 기간: 월간(기본), 시작일/종료일 상세 설정 가능</p>
              <p className="text-[10px] text-gray-500">• 배너 순서: 로테이션 (9구좌가 순환 노출)</p>
            </div>

            {/* 광고 노출 기간 단위 설정 */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">광고 노출 기간 기본값</h3>
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">대표 확인 대기</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">기본 노출 단위</label>
                  <select defaultValue="monthly" className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-100 outline-none">
                    <option value="weekly">주간 (7일)</option>
                    <option value="monthly">월간 (30일)</option>
                    <option value="custom">건별 (시작일/종료일 직접 설정)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">최소 광고 단가 (월간 기준)</label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">₩</span>
                    <input type="text" defaultValue="300,000" className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-right border border-gray-100" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">※ 개별 광고 등록 시 세부 시작일/종료일 지정 가능. 본 설정은 기본값.</p>
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
              <span className="text-[11px] text-gray-500">※ 수정 시 소비자·업체 화면에 즉시 반영</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">종류별 카테고리</h3>
                  <button onClick={addCategory} className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium">+ 추가</button>
                </div>
                {categories.map((c, i) => (
                  <div key={`${c}-${i}`} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => updateCategory(i, e.target.value)}
                        className="text-sm bg-transparent outline-none border-b border-transparent focus:border-primary flex-1"
                      />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => moveCategory(i, -1)} disabled={i === 0}
                        className="text-[10px] text-gray-400 px-2 py-1 disabled:opacity-30">▲</button>
                      <button onClick={() => moveCategory(i, 1)} disabled={i === categories.length - 1}
                        className="text-[10px] text-gray-400 px-2 py-1 disabled:opacity-30">▼</button>
                      <button onClick={() => removeCategory(i)}
                        className="text-[10px] text-red-400 px-2 py-1">삭제</button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">카테고리가 없습니다. + 추가 버튼을 눌러 생성하세요.</p>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">지역별 카테고리</h3>
                  <button onClick={addRegion} className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium">+ 추가</button>
                </div>
                {regions.map((c, i) => (
                  <div key={`${c}-${i}`} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => updateRegion(i, e.target.value)}
                        className="text-sm bg-transparent outline-none border-b border-transparent focus:border-primary flex-1"
                      />
                    </div>
                    <button onClick={() => removeRegion(i)}
                      className="text-[10px] text-red-400 px-2 py-1">삭제</button>
                  </div>
                ))}
                {regions.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">지역이 없습니다.</p>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold">홈 추천 검색어</h3>
                <button onClick={addHomeKeyword} className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium">+ 추가</button>
              </div>
              <p className="text-[11px] text-gray-500 mb-3">
                소비자 홈 상단 검색창 아래 칩으로 노출됩니다. 칩 클릭 시 카테고리 탭으로 이동하며,
                <b> 라벨</b>이 카테고리명과 일치하면 카테고리 필터, 아니면 <b>별칭</b>으로 자유 검색합니다.
                <br />
                <span className="text-gray-400">※ 별칭 안 공백은 AND · 별칭 간 OR · 비워두면 라벨 단독 매칭</span>
              </p>
              <div className="space-y-2">
                {homeKeywords.map((k, i) => (
                  <div key={`${k.label}-${i}`} className="border border-gray-100 rounded-lg p-3 bg-gray-50/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                      <input
                        type="text"
                        value={k.label}
                        onChange={(e) => updateHomeKeywordLabel(i, e.target.value)}
                        placeholder="라벨 (예: 증명사진)"
                        className="text-sm font-semibold bg-transparent outline-none border-b border-transparent focus:border-primary flex-1"
                      />
                      {k.aliases.length === 0 && categories.includes(k.label) ? (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">카테고리</span>
                      ) : k.aliases.length > 0 ? (
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">별칭 {k.aliases.length}</span>
                      ) : (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">라벨 단독</span>
                      )}
                      <div className="flex gap-1">
                        <button onClick={() => moveHomeKeyword(i, -1)} disabled={i === 0}
                          className="text-[10px] text-gray-400 px-2 py-1 disabled:opacity-30">▲</button>
                        <button onClick={() => moveHomeKeyword(i, 1)} disabled={i === homeKeywords.length - 1}
                          className="text-[10px] text-gray-400 px-2 py-1 disabled:opacity-30">▼</button>
                        <button onClick={() => removeHomeKeyword(i)}
                          className="text-[10px] text-red-400 px-2 py-1">삭제</button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-start gap-3">
                      <span className="text-[10px] text-gray-400 w-5 pt-1.5">↳</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={k.aliases.join(", ")}
                          onChange={(e) => updateHomeKeywordAliases(i, e.target.value)}
                          placeholder="별칭 쉼표 구분 (예: 증명사진, 이력서, 취업 프로필)"
                          className="w-full text-xs bg-white outline-none border border-gray-200 focus:border-primary rounded px-2 py-1"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                          각 별칭은 스튜디오명·설명·지역·카테고리에서 검색됩니다. 공백 있는 별칭(예: &ldquo;취업 프로필&rdquo;)은 두 단어 모두 포함돼야 매칭.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {homeKeywords.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">
                  추천 검색어가 없습니다. 비워두면 홈 상단 칩 영역이 숨겨집니다.
                </p>
              )}
              <p className="mt-3 text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2">
                💡 업체가 별도 태그를 달지 않아도 운영자가 별칭만 관리하면 관련 스튜디오가 자동 노출됩니다.
                시즌 프로모션(5월 가족 · 6월 웨딩) · 지역 조합(성수 프로필) · 상황(당일 예약) 모두 여기서 편성.
              </p>
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

        {/* ===== POLICIES ===== */}
        {tab === "policies" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">정책 관리</h2>
              <span className="text-[11px] text-gray-400">문서 DRAFT · 실서비스 즉시 반영 X</span>
            </div>

            {/* 안내 배너 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800">
              <p className="font-bold mb-1">⚠️ 본 페이지는 정책 문서 관리 영역입니다.</p>
              <p>• 편집 내용은 DRAFT로 저장되며 실서비스에는 즉시 반영되지 않습니다.</p>
              <p>• 운영 배포 시 개발팀이 최종 DRAFT를 기준으로 시스템에 반영합니다.</p>
              <p>• 각 정책별 변경 이력을 추적할 수 있습니다.</p>
            </div>

            {/* 섹션 네비 */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto">
              {POLICY_CATALOG.map(sec => (
                <button key={sec.id} onClick={() => setPolicySection(sec.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    policySection === sec.id ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200"
                  }`}>
                  <span className="mr-1">{sec.icon}</span>{sec.title}
                </button>
              ))}
            </div>

            {/* 정책 카드 리스트 */}
            {POLICY_CATALOG.filter(s => s.id === policySection).map(section => (
              <div key={section.id} className="space-y-3">
                {section.items.map(item => {
                  const entry = policies[item.id];
                  const currentValue = entry?.value ?? item.defaultValue;
                  const isEdited = !!entry;
                  const historyCount = entry?.history.length ?? 0;
                  return (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                            {isEdited && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">DRAFT 수정됨</span>
                            )}
                            {item.note && (
                              <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{item.note}</span>
                            )}
                          </div>
                          {isEdited && (
                            <p className="text-[10px] text-gray-400">마지막 수정: {formatTimestamp(entry.updatedAt)}</p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => setPolicyEdit({ id: item.id, value: currentValue })}
                            className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium hover:bg-gray-200">
                            편집
                          </button>
                          {historyCount > 0 && (
                            <button
                              onClick={() => setPolicyHistoryId(item.id)}
                              className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium hover:bg-gray-200">
                              히스토리 ({historyCount})
                            </button>
                          )}
                          {isEdited && (
                            <button
                              onClick={() => { if (confirm("이 정책을 기본값으로 되돌립니다. 히스토리는 유지됩니다. 진행할까요?")) resetPolicy(item.id); }}
                              className="text-[11px] text-red-400 px-2.5 py-1 rounded-lg font-medium hover:bg-red-50">
                              초기화
                            </button>
                          )}
                        </div>
                      </div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-3">{currentValue}</pre>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ===== 정책 편집 모달 ===== */}
      {policyEdit && (() => {
        const item = POLICY_CATALOG.flatMap(s => s.items).find(i => i.id === policyEdit.id);
        if (!item) return null;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPolicyEdit(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold">정책 편집 · {item.title}</h3>
                <button onClick={() => setPolicyEdit(null)} className="text-gray-400"><X size={18} /></button>
              </div>
              <p className="text-[11px] text-amber-600 mb-2">※ DRAFT에만 저장됩니다. 실서비스에는 즉시 반영되지 않습니다.</p>
              <textarea
                value={policyEdit.value}
                onChange={(e) => setPolicyEdit({ ...policyEdit, value: e.target.value })}
                rows={8}
                className="w-full bg-gray-50 rounded-xl p-3 text-sm border border-gray-200 outline-none focus:border-primary resize-y font-mono leading-relaxed"
              />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setPolicyEdit(null)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium">취소</button>
                <button
                  onClick={() => { updatePolicy(policyEdit.id, policyEdit.value); setPolicyEdit(null); }}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-bold">DRAFT 저장</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== 정책 히스토리 모달 ===== */}
      {policyHistoryId && (() => {
        const item = POLICY_CATALOG.flatMap(s => s.items).find(i => i.id === policyHistoryId);
        const entry = policies[policyHistoryId];
        if (!item || !entry) return null;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPolicyHistoryId(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
                <h3 className="text-base font-bold">변경 이력 · {item.title}</h3>
                <button onClick={() => setPolicyHistoryId(null)} className="text-gray-400"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3">
                {/* 현재 값 */}
                <div className="border-l-4 border-primary bg-primary/5 rounded-r-lg p-3">
                  <p className="text-[10px] font-bold text-primary mb-1">현재 DRAFT · {formatTimestamp(entry.updatedAt)}</p>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{entry.value}</pre>
                </div>

                {/* 히스토리 (최신순) */}
                {entry.history.map((h, i) => (
                  <div key={i} className="border-l-4 border-gray-200 bg-gray-50 rounded-r-lg p-3">
                    <p className="text-[10px] text-gray-500 mb-1">{formatTimestamp(h.updatedAt)} · {h.editor}</p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">{h.value}</pre>
                  </div>
                ))}

                {/* 기본값 */}
                <div className="border-l-4 border-gray-100 bg-white rounded-r-lg p-3">
                  <p className="text-[10px] text-gray-400 mb-1">기본값 (카탈로그)</p>
                  <pre className="text-xs text-gray-500 whitespace-pre-wrap font-sans">{item.defaultValue}</pre>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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

                  {/* 스튜디오 소개 */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 mb-1">스튜디오 소개</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{bizDetail.area}에 위치한 {bizDetail.cats} 전문 스튜디오. 업체가 등록한 소개 문구가 여기에 표시됩니다. (어드민은 조회만, 수정은 업체 측에서 직접)</p>
                  </div>

                  {/* 수수료율 Override */}
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-700">수수료율 설정</p>
                      {(() => {
                        const { isOverride } = getFeeForBusiness(bizDetail.name, feeRate, bizFees);
                        return isOverride ? (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">개별 적용 중</span>
                        ) : (
                          <span className="text-[10px] text-gray-500">기본값 {feeRate}% 적용</span>
                        );
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={bizFees[bizDetail.name] ?? ""}
                        placeholder={`${feeRate}`}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") setBizFeeOverride(bizDetail.name, null);
                          else setBizFeeOverride(bizDetail.name, Number(v));
                        }}
                        className="bg-white rounded-lg px-3 py-2 text-sm w-20 text-center border border-gray-200"
                      />
                      <span className="text-sm">%</span>
                      <button onClick={() => setBizFeeOverride(bizDetail.name, null)}
                        className="text-[10px] text-gray-400 px-2 py-1">기본값</button>
                      <p className="text-[10px] text-gray-500 ml-auto">실시간 적용 · 업체 대시보드 반영</p>
                    </div>
                  </div>

                  {/* 위반/페널티 누적 지표 */}
                  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
                    <p className="text-xs font-bold text-gray-700 mb-2">위반/페널티 누적 (임시 기준)</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">업체 취소</p>
                        <p className="text-sm font-bold text-red-500">2회</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">미승인 취소</p>
                        <p className="text-sm font-bold text-orange-500">0회</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">CS 접수</p>
                        <p className="text-sm font-bold text-yellow-600">1건</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">누적 경고</p>
                        <p className="text-sm font-bold text-gray-600">1회</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">※ 정지 기준은 운영 초기 수립 후 본 영역에 연동 (킥오프: 대표 확인 대기)</p>
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
