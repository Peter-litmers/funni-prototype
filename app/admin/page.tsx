"use client";
import { Fragment, useState } from "react";
import Link from "next/link";
import { Users, Building2, Calendar, DollarSign, ImageIcon, X } from "lucide-react";
import PolicyForm from "../components/PolicyForm";
import {
  useCategories,
  useRegions,
  useFeeRate,
  useBusinessFees,
  getFeeForBusiness,
  usePolicies,
  useHomeKeywords,
  useDismissed,
  useAds,
  useBanners,
  useBlockedMembers,
  useHiddenReviews,
  useReviewDeleteRequests,
  useBookingActions,
  useRefundMatrix,
  useCategoryIcons,
  useNoShowReports,
  useSettlementRequests,
  countNoShowsFor,
  REFUND_PERIOD_LABELS,
  type RefundPeriod,
  type AdEntry,
  type BannerEntry,
} from "../lib/admin-store";
import { ICON_OPTIONS, DEFAULT_CAT_ICON_KEY, getIconByKey } from "../lib/category-icons";
import { POLICY_CATALOG, formatTimestamp } from "../lib/policy-catalog";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

// 닫을 수 있는 "대표 확인 대기" 등 노트 배지. key로 dismiss 상태 저장.
function DismissibleNote({
  id,
  children,
  dismissed,
  onDismiss,
  className = "text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium inline-flex items-center gap-1.5",
}: {
  id: string;
  children: React.ReactNode;
  dismissed: Set<string>;
  onDismiss: (key: string) => void;
  className?: string;
}) {
  if (dismissed.has(id)) return null;
  return (
    <span className={className}>
      {children}
      <button
        onClick={() => onDismiss(id)}
        className="text-yellow-600 hover:text-yellow-900 leading-none"
        title="확인 완료로 표시"
        aria-label="닫기"
      >
        <X size={10} strokeWidth={2} />
      </button>
    </span>
  );
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
  const [dismissed, dismissNote] = useDismissed();
  const [ads, setAds] = useAds();
  const [banners, setBanners] = useBanners();
  const [blockedMembers, blockMember, unblockMember] = useBlockedMembers();
  const [hiddenReviews, hideReview, unhideReview] = useHiddenReviews();
  const [deleteRequests, decideDeleteRequest] = useReviewDeleteRequests();
  const [bookingActions, updateBookingAction] = useBookingActions();
  const [refundMatrix, setRefundMatrix] = useRefundMatrix();
  const [categoryIcons, setCategoryIcons] = useCategoryIcons();
  const [iconPickerFor, setIconPickerFor] = useState<string | null>(null);
  const [noShowReports, , setNoShowResolved] = useNoShowReports();
  const [settlementRequests, , setSettlementRequestStatus] = useSettlementRequests();

  const [adModal, setAdModal] = useState<AdEntry | null>(null);
  const [adModalMode, setAdModalMode] = useState<"create" | "edit">("edit");
  const [bannerModal, setBannerModal] = useState<BannerEntry | null>(null);
  const [bannerModalMode, setBannerModalMode] = useState<"create" | "edit">("edit");
  const [bookingDetail, setBookingDetail] = useState<null | { id: string; consumer: string; studio: string; date: string; amount: string; status: string }>(null);
  const [settlementFilter, setSettlementFilter] = useState<"미정산" | "정산 완료">("미정산");
  const [settledRowIds, setSettledRowIds] = useState<Record<string, number>>({}); // rowId → 정산 처리 시각
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("전체");
  const [memberSearch, setMemberSearch] = useState("");
  const [memberDetail, setMemberDetail] = useState<null | { name: string; type: string; joined: string; status: string }>(null);
  const [reviewSearch, setReviewSearch] = useState("");
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

  const upsertAd = (ad: AdEntry) => {
    if (ads.some(a => a.id === ad.id)) {
      setAds(ads.map(a => (a.id === ad.id ? ad : a)));
    } else {
      setAds([...ads, ad]);
    }
  };
  const removeAd = (id: string) => setAds(ads.filter(a => a.id !== id));
  const moveAd = (idx: number, dir: -1 | 1) => {
    const cat = ads[idx]?.cat;
    if (!cat) return;
    const next = [...ads];
    let target = idx + dir;
    while (target >= 0 && target < next.length && next[target].cat !== cat) {
      target += dir;
    }
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setAds(next);
  };
  const toggleAdStatus = (id: string) => {
    setAds(ads.map(a => (a.id === id ? { ...a, status: a.status === "진행중" ? "대기" : "진행중" } : a)));
  };

  const upsertBanner = (b: BannerEntry) => {
    if (banners.some(x => x.id === b.id)) {
      setBanners(banners.map(x => (x.id === b.id ? b : x)));
    } else {
      setBanners([...banners, b]);
    }
  };
  const removeBanner = (id: string) => setBanners(banners.filter(b => b.id !== id));

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
              <p className="text-xs text-gray-400 mt-2">실시간 저장 · 업체별 개별 수수료는 아래 표에서 관리</p>

              {/* Per-Business Fee Overrides */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold">업체별 수수료 개별 설정</h4>
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
                <DismissibleNote id="admin.settlement-guidelines" dismissed={dismissed} onDismiss={dismissNote}>
                  대표 확인 대기
                </DismissibleNote>
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

            {/* Business List — 한 아이디에 여러 스튜디오 개별 등록 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-500">업체 (아이디-스튜디오)</th>
                    <th className="text-left p-4 font-medium text-gray-500">카테고리</th>
                    <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">지역</th>
                    <th className="text-left p-4 font-medium text-gray-500">상태</th>
                    <th className="text-left p-4 font-medium text-gray-500">정보</th>
                    <th className="text-left p-4 font-medium text-gray-500">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { account: "lumiere_biz", studio: "루미에르 스튜디오", category: "프로필", area: "강남", status: "운영중", photos: 18 },
                    { account: "lumiere_biz", studio: "루미에르 비즈컷", category: "비즈니스", area: "강남", status: "운영중", photos: 12 },
                    { account: "sunset_lab", studio: "선셋 포토랩", category: "바디프로필", area: "성수", status: "승인대기", photos: 12 },
                    { account: "bloom_wedding", studio: "블룸 웨딩홀", category: "웨딩", area: "잠실", status: "운영중", photos: 24 },
                    { account: "brandcut", studio: "브랜드컷 스튜디오", category: "비즈니스", area: "합정", status: "정지", photos: 18 },
                    { account: "petmoments", studio: "펫모먼츠 스튜디오", category: "반려동물", area: "망원", status: "운영중", photos: 15 },
                  ].map((b, i) => {
                    // bizDetail 모달 호환성 위해 cats 필드 채움
                    const bForModal = { name: b.studio, cats: b.category, area: b.area, status: b.status, photos: b.photos };
                    return (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-4">
                        <p className="font-medium">
                          <span className="text-gray-400 font-mono text-xs">{b.account}</span>
                          <span className="text-gray-300 mx-1">-</span>
                          <span>{b.studio}</span>
                        </p>
                      </td>
                      <td className="p-4"><span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{b.category}</span></td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{b.area}</td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${
                          b.status === "운영중" ? "text-green-700" : b.status === "정지" ? "text-red-500" : "text-yellow-700"
                        }`}>{b.status}</span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => { setBizDetail(bForModal); setBizDetailView("info"); }} className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">상세보기</button>
                      </td>
                      <td className="p-4">
                        {b.status === "승인대기" ? (
                          <div className="flex gap-1 flex-wrap">
                            <button className="text-xs bg-primary text-white px-3 py-1 rounded-lg">승인</button>
                            <button className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-lg">거절</button>
                            <button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">정지</button>
                          </div>
                        ) : b.status === "정지" ? (
                          <button className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded">해제</button>
                        ) : (
                          <button className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">정지</button>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[11px] text-gray-400 p-3 border-t border-gray-50">💡 한 아이디에 여러 스튜디오를 개별 등록할 수 있습니다. 심사·정지는 스튜디오 단위로 적용.</p>
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
              <p className="text-[10px] text-gray-500">• 수수료 차등: 기본 10%, 업체별 개별 설정 가능</p>
              <div className="text-[10px] text-gray-500 flex flex-wrap items-center gap-2">
                <span>• 환불 반영: 정산 완료 전 발생 건은 정산액에서 차감, 정산 완료 후 발생 건은 다음 정산에서 차감</span>
                <DismissibleNote id="admin.settlement-refund-note" dismissed={dismissed} onDismiss={dismissNote}
                  className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                  대표 확인 대기
                </DismissibleNote>
              </div>
            </div>

            {/* Settlement Table — 통합 (정산 안한 것 / 정산 완료 필터) */}
            {(() => {
              const SETTLEMENT_ROWS = [
                { account: "lumiere_biz", studio: "루미에르 스튜디오", category: "프로필", count: 8, base: 580000, options: 100000 },
                { account: "lumiere_biz", studio: "루미에르 비즈컷", category: "비즈니스", count: 4, base: 210000, options: 30000 },
                { account: "bloom_wedding", studio: "블룸 웨딩홀", category: "웨딩", count: 3, base: 450000, options: 70000 },
                { account: "brandcut", studio: "브랜드컷 스튜디오", category: "비즈니스", count: 12, base: 340000, options: 0 },
              ];
              const PERIOD = "2026년 4월";
              const rowId = (s: typeof SETTLEMENT_ROWS[number]) => `${s.account}__${s.studio}`;
              const isSettled = (id: string) => id in settledRowIds;
              const visibleRows = SETTLEMENT_ROWS.filter(s => settlementFilter === "정산 완료" ? isSettled(rowId(s)) : !isSettled(rowId(s)));
              const pendingCount = SETTLEMENT_ROWS.filter(s => !isSettled(rowId(s))).length;
              const completedCount = SETTLEMENT_ROWS.filter(s => isSettled(rowId(s))).length;

              return (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">정산 관리</h3>
                    <p className="text-[11px] text-gray-400">관리자가 업체에 직접 이체 후 &lsquo;정산 완료 처리&rsquo; 클릭</p>
                  </div>

                  {/* 필터 토글 */}
                  <div className="flex gap-1 mb-4">
                    <button onClick={() => setSettlementFilter("미정산")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        settlementFilter === "미정산" ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      정산 전 ({pendingCount})
                    </button>
                    <button onClick={() => setSettlementFilter("정산 완료")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        settlementFilter === "정산 완료" ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      정산 완료 ({completedCount})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">업체 (아이디-스튜디오)</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">카테고리</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">기간</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">예약건수</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">총액 (촬영+옵션)</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">수수료율</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">정산액</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">요청 시각</th>
                          <th className="p-3 text-left font-medium text-gray-500 text-xs">처리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.length === 0 ? (
                          <tr><td colSpan={9} className="p-6 text-center text-xs text-gray-400">
                            {settlementFilter === "미정산" ? "정산할 건이 없습니다." : "정산 완료된 건이 없습니다."}
                          </td></tr>
                        ) : visibleRows.map((s) => {
                          const id = rowId(s);
                          const total = s.base + s.options;
                          const { rate } = getFeeForBusiness(s.studio, feeRate, bizFees);
                          const net = Math.round(total * (1 - rate / 100));
                          const matchedRequest = settlementRequests.find(r => r.account === s.account && r.period === PERIOD);
                          const settledAt = settledRowIds[id];
                          return (
                            <tr key={id} className="border-t border-gray-50">
                              <td className="p-3">
                                <p className="font-medium">
                                  <span className="text-gray-400 font-mono text-xs">{s.account}</span>
                                  <span className="text-gray-300 mx-1">-</span>
                                  <span>{s.studio}</span>
                                </p>
                              </td>
                              <td className="p-3"><span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{s.category}</span></td>
                              <td className="p-3 text-xs text-gray-600">{PERIOD}</td>
                              <td className="p-3">{s.count}건</td>
                              <td className="p-3">
                                <p>₩{total.toLocaleString()}</p>
                                <p className="text-[9px] text-gray-400">촬영 ₩{s.base.toLocaleString()} + 옵션 ₩{s.options.toLocaleString()}</p>
                              </td>
                              <td className="p-3 text-primary font-medium">{rate}%</td>
                              <td className="p-3 font-bold">₩{net.toLocaleString()}</td>
                              <td className="p-3">
                                {matchedRequest ? (
                                  <p className="text-[11px] text-gray-600">{new Date(matchedRequest.requestedAt).toLocaleString("ko-KR")}</p>
                                ) : (
                                  <span className="text-[10px] text-gray-300">—</span>
                                )}
                              </td>
                              <td className="p-3">
                                {settledAt ? (
                                  <div>
                                    <span className="text-[10px] text-green-700 font-medium">정산 완료</span>
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(settledAt).toLocaleString("ko-KR")}</p>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const now = Date.now();
                                      setSettledRowIds(prev => ({ ...prev, [id]: now }));
                                      if (matchedRequest && matchedRequest.status === "대기") {
                                        setSettlementRequestStatus(matchedRequest.id, "정산 완료");
                                      }
                                    }}
                                    className="text-[10px] text-green-700 px-2.5 py-1.5 bg-green-50 rounded hover:bg-green-100 font-medium">
                                    정산 완료 처리
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {tab === "ads" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">광고 관리 (상단 노출)</h2>
              <button
                onClick={() => {
                  setAdModalMode("create");
                  setAdModal({
                    id: `ad-${Date.now()}`,
                    studio: "",
                    cat: categories[0] ?? "프로필",
                    periodStart: "",
                    periodEnd: "",
                    status: "대기",
                  });
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + 광고 업체 추가
              </button>
            </div>

            <div className="policy-area p-4 mb-6">
              <PolicyBadge label="광고 정책 반영" />
              <p className="text-[10px] text-gray-500 mt-1">• 추천 슬롯: 카테고리당 최대 2개 (총 카테고리수 × 2)</p>
              <p className="text-[10px] text-gray-500">• 노출 기간: 월간(기본), 시작일/종료일 상세 설정 가능</p>
              <p className="text-[10px] text-gray-500">• 노출 순서: 카테고리 내 ▲▼로 어드민 직접 조정</p>
            </div>

            {/* 광고 노출 기간 단위 설정 */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">광고 노출 기간 기본값</h3>
                <DismissibleNote id="admin.ads-period-default" dismissed={dismissed} onDismiss={dismissNote}>
                  대표 확인 대기
                </DismissibleNote>
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

            {/* 현재 노출 중인 광고 스튜디오 — 카테고리별 노출 슬롯 2개씩 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-sm">카테고리별 추천 슬롯</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">카테고리당 <b>진행중</b> 광고 상위 2개가 소비자 홈 &lsquo;요즘 추천하는 스튜디오&rsquo;에 노출됩니다. ▲▼로 카테고리 내 순서 조정.</p>
              </div>
              {ads.length === 0 ? (
                <p className="p-6 text-center text-xs text-gray-400">등록된 광고가 없습니다. &lsquo;+ 광고 업체 추가&rsquo;로 편성하세요.</p>
              ) : (
                <table className="w-full text-sm table-fixed">
                  <colgroup>
                    <col className="w-24" />
                    <col className="w-14" />
                    <col />
                    <col className="w-32" />
                    <col className="w-20" />
                    <col className="w-28" />
                  </colgroup>
                  <tbody>
                    {categories.map((catName, catIdx) => {
                      const catAds = ads.map((a, globalIdx) => ({ a, globalIdx })).filter(x => x.a.cat === catName);
                      if (catAds.length === 0) return null;
                      const liveCount = catAds.filter(x => x.a.status === "진행중").length;
                      let liveSlotN = 0;
                      return (
                        <Fragment key={catName}>
                          <tr className="bg-gray-50 border-t-2 border-gray-100">
                            <td colSpan={6} className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-0.5">
                                  <button onClick={() => moveCategory(catIdx, -1)} disabled={catIdx === 0} className="text-[10px] text-gray-400 disabled:opacity-30">▲</button>
                                  <button onClick={() => moveCategory(catIdx, 1)} disabled={catIdx === categories.length - 1} className="text-[10px] text-gray-400 disabled:opacity-30">▼</button>
                                </div>
                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{catName}</span>
                                <span className="text-[10px] text-gray-500">노출 슬롯 {Math.min(liveCount, 2)}/2</span>
                              </div>
                            </td>
                          </tr>
                          {catAds.map(({ a, globalIdx }, idxInCat) => {
                            const period = a.periodStart && a.periodEnd
                              ? `${a.periodStart.slice(5).replace("-", ".")}~${a.periodEnd.slice(5).replace("-", ".")}`
                              : "기간 미설정";
                            const isLive = a.status === "진행중";
                            if (isLive) liveSlotN += 1;
                            const slotLabel = isLive
                              ? (liveSlotN <= 2 ? `슬롯 #${liveSlotN}` : `대기 (슬롯 초과)`)
                              : "—";
                            const isFirst = idxInCat === 0;
                            const isLast = idxInCat === catAds.length - 1;
                            return (
                              <tr key={a.id} className={`border-t border-gray-50 ${isLive && liveSlotN <= 2 ? "bg-primary/5" : ""}`}>
                                <td className="px-3 py-2.5 align-middle">
                                  <span className={`font-mono text-[10px] ${isLive && liveSlotN <= 2 ? "text-primary font-semibold" : "text-gray-400"}`}>{slotLabel}</span>
                                </td>
                                <td className="px-2 py-2.5 align-middle">
                                  <div className="flex flex-col gap-0.5">
                                    <button onClick={() => moveAd(globalIdx, -1)} disabled={isFirst} className="text-[10px] text-gray-400 disabled:opacity-30">▲</button>
                                    <button onClick={() => moveAd(globalIdx, 1)} disabled={isLast} className="text-[10px] text-gray-400 disabled:opacity-30">▼</button>
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 font-medium align-middle truncate">{a.studio}</td>
                                <td className="px-3 py-2.5 text-gray-500 text-xs align-middle">{period}</td>
                                <td className="px-3 py-2.5 align-middle">
                                  <button onClick={() => toggleAdStatus(a.id)}
                                    className={`text-xs px-2 py-1 rounded-full ${isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                    title="클릭해서 상태 전환">{a.status}</button>
                                </td>
                                <td className="px-3 py-2.5 align-middle">
                                  <div className="flex gap-1">
                                    <button onClick={() => { setAdModalMode("edit"); setAdModal({ ...a }); }}
                                      className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">수정</button>
                                    <button onClick={() => { if (confirm(`'${a.studio}' 광고를 삭제할까요?`)) removeAd(a.id); }}
                                      className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded hover:bg-red-100">삭제</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                    {(() => {
                      const allAds = ads.map((a, globalIdx) => ({ a, globalIdx })).filter(x => x.a.cat === "전체");
                      const liveCount = allAds.filter(x => x.a.status === "진행중").length;
                      let liveSlotN = 0;
                      return (
                        <Fragment key="전체-section">
                          <tr className="bg-gray-50 border-t-2 border-gray-100">
                            <td colSpan={6} className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">전체</span>
                                <span className="text-[10px] text-gray-500">노출 슬롯 {Math.min(liveCount, 2)}/2 — 스튜디오 → 전체 페이지 노출</span>
                              </div>
                            </td>
                          </tr>
                          {allAds.length === 0 ? (
                            <tr className="border-t border-gray-50">
                              <td colSpan={6} className="px-3 py-3 text-[11px] text-gray-400 text-center">&lsquo;전체&rsquo; 페이지 광고가 없습니다. + 광고 업체 추가 → 카테고리에서 &lsquo;전체&rsquo; 선택.</td>
                            </tr>
                          ) : allAds.map(({ a, globalIdx }, idxInCat) => {
                            const period = a.periodStart && a.periodEnd
                              ? `${a.periodStart.slice(5).replace("-", ".")}~${a.periodEnd.slice(5).replace("-", ".")}`
                              : "기간 미설정";
                            const isLive = a.status === "진행중";
                            if (isLive) liveSlotN += 1;
                            const slotLabel = isLive
                              ? (liveSlotN <= 2 ? `슬롯 #${liveSlotN}` : `대기 (슬롯 초과)`)
                              : "—";
                            const isFirst = idxInCat === 0;
                            const isLast = idxInCat === allAds.length - 1;
                            return (
                              <tr key={a.id} className={`border-t border-gray-50 ${isLive && liveSlotN <= 2 ? "bg-primary/5" : ""}`}>
                                <td className="px-3 py-2.5 align-middle"><span className={`font-mono text-[10px] ${isLive && liveSlotN <= 2 ? "text-primary font-semibold" : "text-gray-400"}`}>{slotLabel}</span></td>
                                <td className="px-2 py-2.5 align-middle">
                                  <div className="flex flex-col gap-0.5">
                                    <button onClick={() => moveAd(globalIdx, -1)} disabled={isFirst} className="text-[10px] text-gray-400 disabled:opacity-30">▲</button>
                                    <button onClick={() => moveAd(globalIdx, 1)} disabled={isLast} className="text-[10px] text-gray-400 disabled:opacity-30">▼</button>
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 font-medium align-middle truncate">{a.studio}</td>
                                <td className="px-3 py-2.5 text-gray-500 text-xs align-middle">{period}</td>
                                <td className="px-3 py-2.5 align-middle"><button onClick={() => toggleAdStatus(a.id)} className={`text-xs px-2 py-1 rounded-full ${isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.status}</button></td>
                                <td className="px-3 py-2.5 align-middle">
                                  <div className="flex gap-1">
                                    <button onClick={() => { setAdModalMode("edit"); setAdModal({ ...a }); }} className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">수정</button>
                                    <button onClick={() => { if (confirm(`'${a.studio}' 광고를 삭제할까요?`)) removeAd(a.id); }} className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded hover:bg-red-100">삭제</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </Fragment>
                      );
                    })()}
                    {(() => {
                      const knownCats = new Set([...categories, "전체"]);
                      const orphanAds = ads.map((a, globalIdx) => ({ a, globalIdx })).filter(x => !knownCats.has(x.a.cat));
                      if (orphanAds.length === 0) return null;
                      return (
                        <Fragment key="orphan-section">
                          <tr className="bg-gray-100 border-t-2 border-gray-200">
                            <td colSpan={6} className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">분류 없음</span>
                                <span className="text-[10px] text-gray-400">카테고리 미지정 광고</span>
                              </div>
                            </td>
                          </tr>
                          {orphanAds.map(({ a, globalIdx }) => (
                            <tr key={a.id} className="border-t border-gray-50">
                              <td className="px-3 py-2.5 align-middle"><span className="text-[10px] text-gray-400">—</span></td>
                              <td className="px-2 py-2.5 align-middle">—</td>
                              <td className="px-3 py-2.5 font-medium align-middle truncate">{a.studio}</td>
                              <td className="px-3 py-2.5 text-gray-500 text-xs align-middle">{a.cat || "(미지정)"}</td>
                              <td className="px-3 py-2.5 align-middle"><button onClick={() => toggleAdStatus(a.id)} className={`text-xs px-2 py-1 rounded-full ${a.status === "진행중" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.status}</button></td>
                              <td className="px-3 py-2.5 align-middle">
                                <div className="flex gap-1">
                                  <button onClick={() => { setAdModalMode("edit"); setAdModal({ ...a }); }} className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">수정</button>
                                  <button onClick={() => { if (confirm(`'${a.studio}' 광고를 삭제할까요?`)) removeAd(a.id); }} className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded hover:bg-red-100">삭제</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      );
                    })()}
                  </tbody>
                </table>
              )}
            </div>

            {/* 미리보기 — 현재 진행중 광고 기반 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">유저 앱 프리미엄 영역 미리보기</h3>
                <span className="text-[10px] text-gray-400">소비자 홈 &lsquo;지금 추천하는 스튜디오&rsquo;에 실시간 반영</span>
              </div>
              {ads.filter(a => a.status === "진행중").length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">&lsquo;진행중&rsquo; 상태 광고가 없습니다. 위 테이블에서 상태를 전환하세요.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ads.filter(a => a.status === "진행중").map((a, i) => (
                    <div key={a.id} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 relative">
                      <span className="absolute top-2 left-2 bg-primary/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">AD #{i + 1}</span>
                      <div className="flex items-center gap-3 mt-6">
                        <div className="w-12 h-12 bg-white/60 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={18} strokeWidth={1.5} /></div>
                        <div>
                          <p className="text-xs font-bold">{a.studio}</p>
                          <p className="text-[10px] text-gray-500">{a.cat} · 프리미엄 구좌</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "members" && (() => {
          const MEMBERS = [
            { name: "김포토", nick: "포토팟유저", type: "소비자", date: "2026.04.10", bookings: 5 },
            { name: "이촬영", nick: "촬영러버", type: "소비자", date: "2026.04.08", bookings: 2 },
            { name: "박스튜", nick: "스튜디오박", type: "소비자", date: "2026.04.05", bookings: 0 },
            { name: "루미에르(주)", nick: "-", type: "업체", date: "2026.03.20", bookings: 0 },
            { name: "선셋포토(주)", nick: "-", type: "업체", date: "2026.04.01", bookings: 0 },
          ];
          const q = memberSearch.trim().toLowerCase();
          const filtered = MEMBERS.filter(m => {
            if (q && !(m.name.toLowerCase().includes(q) || m.nick.toLowerCase().includes(q))) return false;
            return true;
          });
          const pendingNoShows = noShowReports.filter(r => !r.resolved);
          return (
          <div>
            <h2 className="text-xl font-bold mb-6">회원 관리</h2>

            {/* 노쇼 신고 알림 — 업체가 접수한 신고 자동 집계 */}
            <div className="mb-5 bg-white border border-amber-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">노쇼 신고 접수함</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">업체가 &lsquo;노쇼 처리&rsquo;한 건이 자동 누적됩니다. 누적 수는 아래 회원 이름 옆 칩으로 즉시 표시.</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">대기 {pendingNoShows.length}건</span>
              </div>
              {pendingNoShows.length === 0 ? (
                <p className="p-5 text-center text-xs text-gray-400">대기 중인 노쇼 신고가 없습니다.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingNoShows.slice(0, 5).map(r => {
                    const count = countNoShowsFor(noShowReports, r.consumerName);
                    return (
                    <div key={r.id} className="p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-bold">{r.consumerName}</span>
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">노쇼 누적 {count}회</span>
                          <span className="text-[10px] text-gray-400">{new Date(r.reportedAt).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-[11px] text-gray-500">{r.studioName} · 예약 {r.bookingId}</p>
                        {r.reason && <p className="text-[11px] text-gray-700 mt-0.5 bg-gray-50 rounded px-2 py-1">사유: {r.reason}</p>}
                      </div>
                      <button onClick={() => setNoShowResolved(r.id, true)}
                        className="text-xs bg-primary text-white px-3 py-1.5 rounded hover:bg-primary/90 shrink-0">확인</button>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="이름, 닉네임 검색..."
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                />
                {memberSearch && (
                  <button onClick={() => setMemberSearch("")} className="text-xs text-gray-400 px-2">지우기</button>
                )}
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
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-xs text-gray-400">검색 결과가 없습니다.</td></tr>
                  )}
                  {filtered.map((m) => {
                    const isBlocked = blockedMembers.has(m.name);
                    const status = isBlocked ? "차단" : "활성";
                    const noShowCount = m.type === "소비자" ? countNoShowsFor(noShowReports, m.name) : 0;
                    return (
                    <tr key={m.name} className="border-t border-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium">{m.name}</span>
                          {noShowCount > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${noShowCount >= 3 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                              노쇼 {noShowCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{m.nick}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${m.type === "소비자" ? "bg-blue-100 text-blue-700" : "bg-primary/10 text-primary"}`}>{m.type}</span></td>
                      <td className="p-4 text-gray-500 hidden md:table-cell text-xs">{m.date}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{m.bookings}건</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${status === "활성" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>{status}</span></td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button onClick={() => setMemberDetail({ name: m.name, type: m.type, joined: m.date, status })}
                            className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">상세</button>
                          {isBlocked ? (
                            <button onClick={() => unblockMember(m.name)}
                              className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded hover:bg-green-100">차단 해제</button>
                          ) : (
                            <button onClick={() => { if (confirm(`${m.name} 계정을 차단할까요?`)) blockMember(m.name); }}
                              className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded hover:bg-red-100">차단</button>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          );
        })()}

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
                {categories.map((c, i) => {
                  const currentKey = categoryIcons[c] ?? DEFAULT_CAT_ICON_KEY[c] ?? "image";
                  const CurrentIcon = getIconByKey(currentKey);
                  const isOpen = iconPickerFor === c;
                  return (
                  <div key={`${c}-${i}`} className="border-b border-gray-50 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                        <button
                          onClick={() => setIconPickerFor(isOpen ? null : c)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${isOpen ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-gray-50 text-gray-600 hover:border-primary"}`}
                          title="아이콘 변경"
                        >
                          <CurrentIcon size={16} strokeWidth={1.5} />
                        </button>
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
                    {isOpen && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] text-gray-500 font-medium">아이콘 선택 — &lsquo;{c}&rsquo;</p>
                          <button onClick={() => setIconPickerFor(null)} className="text-[10px] text-gray-400">닫기</button>
                        </div>
                        <div className="grid grid-cols-8 gap-1.5">
                          {ICON_OPTIONS.map(opt => {
                            const OptIcon = opt.Icon;
                            const active = currentKey === opt.key;
                            return (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  setCategoryIcons({ ...categoryIcons, [c]: opt.key });
                                  setIconPickerFor(null);
                                }}
                                title={opt.label}
                                className={`aspect-square rounded-lg flex items-center justify-center border transition-all ${active ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-500 hover:border-primary hover:text-primary"}`}
                              >
                                <OptIcon size={16} strokeWidth={1.5} />
                              </button>
                            );
                          })}
                        </div>
                        {categoryIcons[c] && (
                          <button
                            onClick={() => {
                              const next = { ...categoryIcons };
                              delete next[c];
                              setCategoryIcons(next);
                              setIconPickerFor(null);
                            }}
                            className="text-[10px] text-gray-400 mt-2 hover:text-red-400"
                          >
                            기본값으로 되돌리기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}
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
              <button
                onClick={() => {
                  setBannerModalMode("create");
                  setBannerModal({
                    id: `bn-${Date.now()}`,
                    title: "",
                    position: "메인 상단",
                    periodStart: "",
                    periodEnd: "",
                    status: "대기",
                  });
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + 배너 등록
              </button>
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
                  {banners.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-xs text-gray-400">등록된 배너가 없습니다.</td></tr>
                  )}
                  {banners.map((b) => {
                    const period = b.periodStart && b.periodEnd
                      ? `${b.periodStart.slice(5).replace("-", ".")}~${b.periodEnd.slice(5).replace("-", ".")}`
                      : "기간 미설정";
                    return (
                    <tr key={b.id} className="border-t border-gray-50">
                      <td className="p-4"><div className="w-16 h-10 bg-gradient-to-r from-rose-200 to-pink-200 rounded" /></td>
                      <td className="p-4 font-medium">{b.title}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{b.position}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell text-xs">{period}</td>
                      <td className="p-4">
                        <button
                          onClick={() => upsertBanner({ ...b, status: b.status === "진행중" ? "대기" : "진행중" })}
                          className={`text-xs px-2 py-1 rounded-full ${b.status === "진행중" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          title="클릭해서 상태 전환"
                        >{b.status}</button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button onClick={() => { setBannerModalMode("edit"); setBannerModal({ ...b }); }}
                            className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">수정</button>
                          <button onClick={() => { if (confirm(`'${b.title}' 배너를 삭제할까요?`)) removeBanner(b.id); }}
                            className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded hover:bg-red-100">삭제</button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== BOOKINGS (REQ-118) ===== */}
        {tab === "bookings" && (() => {
          const BOOKINGS = [
            { id: "B-2026-0142", consumer: "김포토", studio: "루미에르", date: "05.10 14:00", amount: "₩100,000", status: "확정" },
            { id: "B-2026-0141", consumer: "이촬영", studio: "선셋 포토랩", date: "05.18 10:00", amount: "₩160,000", status: "확정" },
            { id: "B-2026-0140", consumer: "박스튜", studio: "블룸 웨딩", date: "05.25 10:00", amount: "₩800,000", status: "대기" },
            { id: "B-2026-0135", consumer: "최민지", studio: "브랜드컷 스튜디오", date: "04.20 13:00", amount: "₩80,000", status: "완료" },
            { id: "B-2026-0130", consumer: "한소희", studio: "펫모먼츠 스튜디오", date: "04.15 15:00", amount: "₩120,000", status: "취소" },
          ];
          const statusToFilter: Record<string, string> = { 확정: "예정", 대기: "예정", 완료: "완료", 취소: "취소" };
          const q = bookingSearch.trim().toLowerCase();
          const filtered = BOOKINGS.filter(b => {
            if (q && !(b.consumer.toLowerCase().includes(q) || b.studio.toLowerCase().includes(q) || b.id.toLowerCase().includes(q))) return false;
            if (bookingStatusFilter !== "전체" && statusToFilter[b.status] !== bookingStatusFilter) return false;
            return true;
          });
          return (
          <div>
            <h2 className="text-xl font-bold mb-6">예약 관리</h2>
            <div className="mb-4 rounded-xl bg-amber-50 p-4 text-[11px] text-amber-700">
              <p>업체 취소는 100% 환불 대상이며, 취소 날짜와 누적 횟수를 어드민에서 추적합니다.</p>
              <p className="mt-1">노쇼 건도 동일하게 날짜/횟수 단위로 기록해 추후 이용정지 정책에 활용할 수 있습니다.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex gap-2 flex-wrap">
                <input type="text" value={bookingSearch} onChange={e => setBookingSearch(e.target.value)}
                  placeholder="소비자명, 업체명, 예약번호 검색..." className="flex-1 min-w-[180px] bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none" />
                {["전체", "예정", "완료", "취소"].map(f => (
                  <button key={f} onClick={() => setBookingStatusFilter(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium ${bookingStatusFilter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{f}</button>
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
                    <th className="text-left p-4 font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-xs text-gray-400">검색 결과가 없습니다.</td></tr>
                  )}
                  {filtered.map((b) => {
                    const action = bookingActions[b.id] ?? {};
                    return (
                    <tr key={b.id} className="border-t border-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-400">{b.id}</td>
                      <td className="p-4">{b.consumer}</td>
                      <td className="p-4">{b.studio}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell text-xs">{b.date}</td>
                      <td className="p-4 font-medium hidden md:table-cell">{b.amount}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${b.status === "확정" ? "bg-green-100 text-green-700" : b.status === "완료" ? "bg-gray-200 text-gray-500" : b.status === "취소" ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-700"}`}>{b.status}</span>
                          {action.refunded && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">환불됨</span>}
                          {action.noShow && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">노쇼</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          <button onClick={() => setBookingDetail(b)}
                            className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">상세</button>
                          {!action.refunded && b.status !== "완료" && (
                            <button onClick={() => { if (confirm(`${b.id} 건을 환불 처리할까요? (토스 환불 API 호출 시뮬)`)) updateBookingAction(b.id, { refunded: true }); }}
                              className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded hover:bg-red-100">환불</button>
                          )}
                          {!action.noShow && (
                            <button onClick={() => updateBookingAction(b.id, { noShow: !action.noShow })}
                              className="text-xs text-amber-700 px-2 py-1 bg-amber-50 rounded hover:bg-amber-100">노쇼 표시</button>
                          )}
                          {action.noShow && (
                            <button onClick={() => updateBookingAction(b.id, { noShow: false })}
                              className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">노쇼 취소</button>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          );
        })()}

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
        {tab === "reviews" && (() => {
          const REVIEWS = [
            { id: "rv-001", studio: "루미에르", author: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다", date: "04.10" },
            { id: "rv-002", studio: "루미에르", author: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요", date: "04.08" },
            { id: "rv-003", studio: "선셋 포토랩", author: "박**", rating: 5, text: "바디프로필 전문! 조명이 정말 좋습니다", date: "04.05" },
            { id: "rv-004", studio: "블룸 웨딩", author: "최**", rating: 3, text: "가격 대비 보통이었어요", date: "04.02" },
            { id: "rv-005", studio: "브랜드컷 스튜디오", author: "한**", rating: 5, text: "팀 프로필 결과물이 기대 이상이에요", date: "03.28" },
          ];
          const q = reviewSearch.trim().toLowerCase();
          const filtered = REVIEWS.filter(r => {
            if (!q) return true;
            return r.studio.toLowerCase().includes(q) || r.author.toLowerCase().includes(q) || r.text.toLowerCase().includes(q);
          });
          const pendingRequests = deleteRequests.filter(r => r.status === "대기");
          const processedRequests = deleteRequests.filter(r => r.status !== "대기");
          return (
          <div>
            <h2 className="text-xl font-bold mb-6">리뷰 관리</h2>

            {/* 삭제 요청 별도 카드 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-amber-200">
              <div className="p-4 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">리뷰 삭제 요청</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">소비자가 사유와 함께 제출. 관리자 승인 시 실제 삭제 · 거절 시 유지</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">대기 {pendingRequests.length}건</span>
              </div>
              {pendingRequests.length === 0 ? (
                <p className="p-6 text-center text-xs text-gray-400">대기 중인 삭제 요청이 없습니다.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="p-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold">{req.studio}</span>
                          <span className="text-[10px] text-gray-400">{req.author}</span>
                          <span className="text-yellow-500 text-[10px]">{"★".repeat(req.rating)}{"☆".repeat(5 - req.rating)}</span>
                          <span className="text-[10px] text-gray-400">{new Date(req.requestedAt).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-xs text-gray-700 bg-gray-50 rounded p-2 mb-2">&ldquo;{req.text}&rdquo;</p>
                        <p className="text-[11px] text-amber-800"><span className="font-bold">요청 사유:</span> {req.reason}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { if (confirm("이 리뷰를 삭제할까요?")) { decideDeleteRequest(req.id, "승인"); hideReview(req.reviewId); } }}
                          className="text-xs bg-primary text-white px-3 py-1.5 rounded hover:bg-primary/90">승인 (삭제)</button>
                        <button onClick={() => decideDeleteRequest(req.id, "거절")}
                          className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">거절 (유지)</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {processedRequests.length > 0 && (
                <details className="border-t border-gray-100">
                  <summary className="p-3 text-[11px] text-gray-500 cursor-pointer hover:bg-gray-50">처리 완료 요청 {processedRequests.length}건 펼치기</summary>
                  <div className="divide-y divide-gray-100">
                    {processedRequests.map(req => (
                      <div key={req.id} className="p-3 flex items-center gap-3 text-[11px]">
                        <span className={`px-2 py-0.5 rounded-full ${req.status === "승인" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>{req.status}</span>
                        <span className="flex-1 text-gray-500 truncate">{req.studio} · {req.author} · {req.reason}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>

            {/* 전체 리뷰 관리 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex gap-2">
                <input type="text" value={reviewSearch} onChange={e => setReviewSearch(e.target.value)}
                  placeholder="스튜디오명, 작성자, 내용 검색..." className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none" />
                {reviewSearch && (<button onClick={() => setReviewSearch("")} className="text-xs text-gray-400 px-2">지우기</button>)}
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
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-xs text-gray-400">검색 결과가 없습니다.</td></tr>
                  )}
                  {filtered.map((r) => {
                    const isHidden = hiddenReviews.has(r.id);
                    return (
                    <tr key={r.id} className={`border-t border-gray-50 ${isHidden ? "opacity-50" : ""}`}>
                      <td className="p-4 font-medium">{r.studio}</td>
                      <td className="p-4">{r.author}</td>
                      <td className="p-4 text-yellow-500 text-xs">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell max-w-[200px] truncate">{r.text}</td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{r.date}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {isHidden ? (
                            <button onClick={() => unhideReview(r.id)} className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded hover:bg-green-100">복구</button>
                          ) : (
                            <button onClick={() => hideReview(r.id)} className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">숨김</button>
                          )}
                          <button onClick={() => alert("삭제는 소비자의 '삭제 요청' 후 본 어드민에서 승인하는 방식입니다 (위 카드에서 처리).")}
                            className="text-xs text-gray-400 px-2 py-1 bg-gray-50 rounded" title="소비자 삭제 요청 → 어드민 승인 정책">직접 삭제 불가</button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          );
        })()}

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
                {/* 취소·환불 섹션: 카테고리별 환불율 매트릭스 (실반영 설정) */}
                {section.id === "cancel" && (
                  <div className="bg-white rounded-xl shadow-sm border border-primary/20 p-4">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          카테고리별 환불율 매트릭스
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">실반영</span>
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          촬영일까지 남은 일수 구간별로 카테고리마다 환불율을 다르게 설정할 수 있습니다. 저장 즉시 소비자 취소 계산에 반영.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (!confirm("매트릭스를 기본값으로 초기화합니다. 진행할까요?")) return;
                          const next: typeof refundMatrix = {};
                          for (const c of categories) {
                            next[c] = c === "웨딩"
                              ? { d7: 100, d3to6: 50, d1to2: 0, sameDay: 0 }
                              : { d7: 100, d3to6: 80, d1to2: 50, sameDay: 20 };
                          }
                          setRefundMatrix(next);
                        }}
                        className="text-[11px] text-gray-500 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200"
                      >기본값으로 초기화</button>
                    </div>

                    <div className="overflow-x-auto mt-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="p-2 text-left font-medium text-gray-500 text-xs w-28">카테고리</th>
                            {(["d7", "d3to6", "d1to2", "sameDay"] as RefundPeriod[]).map(p => (
                              <th key={p} className="p-2 text-center font-medium text-gray-500 text-xs">
                                {REFUND_PERIOD_LABELS[p]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(cat => {
                            const row = refundMatrix[cat] ?? { d7: 100, d3to6: 80, d1to2: 50, sameDay: 20 };
                            return (
                              <tr key={cat} className="border-b border-gray-50">
                                <td className="p-2 font-medium text-gray-700">{cat}</td>
                                {(["d7", "d3to6", "d1to2", "sameDay"] as RefundPeriod[]).map(p => (
                                  <td key={p} className="p-2">
                                    <div className="flex items-center justify-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={row[p]}
                                        onChange={e => {
                                          const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                                          setRefundMatrix({
                                            ...refundMatrix,
                                            [cat]: { ...row, [p]: v },
                                          });
                                        }}
                                        className="w-14 bg-gray-50 rounded-lg px-2 py-1 text-sm text-center border border-gray-200 focus:border-primary outline-none"
                                      />
                                      <span className="text-xs text-gray-400">%</span>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                          {categories.length === 0 && (
                            <tr><td colSpan={5} className="p-4 text-center text-xs text-gray-400">카테고리가 없습니다. 카테고리 탭에서 먼저 추가하세요.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 bg-amber-50 rounded-lg p-2.5 text-[11px] text-amber-800 leading-relaxed">
                      💡 예: 웨딩 = 3~6일 전 취소 시 <b>50%</b> 환불 (48시간 이내 드레스·스태프 일정이 들어가서 타이트함). 프로필 = 같은 시점에도 <b>80%</b> 환불 가능 (준비 리소스 상대적으로 적음). <br />
                      ※ 업체별 개별 환불율 오버라이드는 본 계약 범위 외 — 통일 매트릭스 정책입니다.
                    </div>
                  </div>
                )}

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
                              <DismissibleNote
                                id={`policy.note.${item.id}`}
                                dismissed={dismissed}
                                onDismiss={dismissNote}
                                className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                              >
                                {item.note}
                              </DismissibleNote>
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

                  {/* 수수료율 개별 설정 */}
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
                    <div className="text-[10px] text-gray-400 mt-2 flex flex-wrap items-center gap-2">
                      <span>※ 정지 기준은 운영 초기 수립 후 본 영역에 연동</span>
                      <DismissibleNote id="admin.biz-suspend-criteria" dismissed={dismissed} onDismiss={dismissNote}
                        className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                        대표 확인 대기
                      </DismissibleNote>
                    </div>
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

      {/* ===== 광고 편집/추가 모달 ===== */}
      {adModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setAdModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base">{adModalMode === "create" ? "광고 업체 추가" : "광고 수정"}</h3>
              <button onClick={() => setAdModal(null)} className="text-gray-400"><X size={18} strokeWidth={1.5} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">스튜디오명</label>
                <input type="text" value={adModal.studio}
                  onChange={e => setAdModal({ ...adModal, studio: e.target.value })}
                  placeholder="예: 루미에르 스튜디오"
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">카테고리</label>
                <select value={adModal.cat}
                  onChange={e => setAdModal({ ...adModal, cat: e.target.value })}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="전체">전체 (스튜디오 → 전체 페이지 노출)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">※ &lsquo;전체&rsquo; 선택 시 스튜디오 탭 &lsquo;전체&rsquo; 페이지 추천 슬롯에 노출됩니다.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">노출 시작</label>
                  <input type="date" value={adModal.periodStart}
                    onChange={e => setAdModal({ ...adModal, periodStart: e.target.value })}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">노출 종료</label>
                  <input type="date" value={adModal.periodEnd}
                    onChange={e => setAdModal({ ...adModal, periodEnd: e.target.value })}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">상태</label>
                <div className="flex gap-2">
                  {(["진행중", "대기", "종료"] as const).map(s => (
                    <button key={s} onClick={() => setAdModal({ ...adModal, status: s })}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${adModal.status === s ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400">※ 저장 시 소비자 홈 &lsquo;요즘 추천하는 스튜디오&rsquo; 섹션에 &lsquo;진행중&rsquo; 광고가 카테고리당 상위 2개씩 즉시 반영됩니다.</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setAdModal(null)} className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">취소</button>
              <button
                onClick={() => { if (!adModal.studio.trim()) { alert("스튜디오명을 입력하세요"); return; } upsertAd(adModal); setAdModal(null); }}
                disabled={!adModal.studio.trim()}
                className={`text-xs px-4 py-2 rounded-lg font-medium ${adModal.studio.trim() ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}
              >저장</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 배너 편집/추가 모달 ===== */}
      {bannerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBannerModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base">{bannerModalMode === "create" ? "배너 등록" : "배너 수정"}</h3>
              <button onClick={() => setBannerModal(null)} className="text-gray-400"><X size={18} strokeWidth={1.5} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">제목</label>
                <input type="text" value={bannerModal.title}
                  onChange={e => setBannerModal({ ...bannerModal, title: e.target.value })}
                  placeholder="예: 프로필 촬영 특가"
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">노출 위치</label>
                <select value={bannerModal.position}
                  onChange={e => setBannerModal({ ...bannerModal, position: e.target.value })}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary">
                  {["메인 상단", "메인 중간", "카테고리", "상세 하단"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">노출 시작</label>
                  <input type="date" value={bannerModal.periodStart}
                    onChange={e => setBannerModal({ ...bannerModal, periodStart: e.target.value })}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">노출 종료</label>
                  <input type="date" value={bannerModal.periodEnd}
                    onChange={e => setBannerModal({ ...bannerModal, periodEnd: e.target.value })}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">상태</label>
                <div className="flex gap-2">
                  {(["진행중", "대기", "종료"] as const).map(s => (
                    <button key={s} onClick={() => setBannerModal({ ...bannerModal, status: s })}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${bannerModal.status === s ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setBannerModal(null)} className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">취소</button>
              <button
                onClick={() => { if (!bannerModal.title.trim()) { alert("제목을 입력하세요"); return; } upsertBanner(bannerModal); setBannerModal(null); }}
                disabled={!bannerModal.title.trim()}
                className={`text-xs px-4 py-2 rounded-lg font-medium ${bannerModal.title.trim() ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}
              >저장</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 예약 상세 모달 ===== */}
      {bookingDetail && (() => {
        const action = bookingActions[bookingDetail.id] ?? {};
        return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBookingDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-gray-400">{bookingDetail.id}</p>
                <h3 className="font-bold text-base">{bookingDetail.consumer} → {bookingDetail.studio}</h3>
              </div>
              <button onClick={() => setBookingDetail(null)} className="text-gray-400"><X size={18} strokeWidth={1.5} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">일시</p><p className="text-sm font-medium">{bookingDetail.date}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">결제 금액</p><p className="text-sm font-medium">{bookingDetail.amount}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">상태</p><p className="text-sm font-medium">{bookingDetail.status}</p></div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">플래그</p>
                  <p className="text-sm font-medium">
                    {action.refunded && <span className="text-red-500">환불됨</span>}
                    {action.noShow && <span className="text-amber-700 ml-1">노쇼</span>}
                    {!action.refunded && !action.noShow && <span className="text-gray-400">없음</span>}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">어드민 메모</label>
                <textarea rows={3} value={action.note ?? ""}
                  onChange={e => updateBookingAction(bookingDetail.id, { note: e.target.value })}
                  placeholder="예: 업체 요청으로 취소 처리 / CS 통화 내용 요약"
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-xs border border-gray-200 outline-none focus:border-primary resize-none" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setBookingDetail(null)} className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">닫기</button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ===== 회원 상세 모달 ===== */}
      {memberDetail && (() => {
        const isBlocked = blockedMembers.has(memberDetail.name);
        return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setMemberDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{memberDetail.name}</h3>
                <p className="text-[10px] text-gray-400">{memberDetail.type} · 가입 {memberDetail.joined}</p>
              </div>
              <button onClick={() => setMemberDetail(null)} className="text-gray-400"><X size={18} strokeWidth={1.5} /></button>
            </div>
            <div className="p-5 space-y-3 text-xs text-gray-600">
              <p>• 최근 로그인: 2026.04.22 18:42 (iOS)</p>
              <p>• 누적 결제: ₩320,000 · 5건</p>
              <p>• 누적 리뷰: 3건 (평균 4.7)</p>
              <p>• 누적 CS: 1건</p>
              <p>• 계정 상태: {isBlocked ? <span className="text-red-500 font-bold">차단됨</span> : <span className="text-green-600 font-bold">활성</span>}</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              {isBlocked ? (
                <button onClick={() => { unblockMember(memberDetail.name); setMemberDetail(null); }}
                  className="text-xs text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100">차단 해제</button>
              ) : (
                <button onClick={() => { if (confirm(`${memberDetail.name} 계정을 차단할까요?`)) { blockMember(memberDetail.name); setMemberDetail(null); } }}
                  className="text-xs text-red-500 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100">차단</button>
              )}
              <button onClick={() => setMemberDetail(null)} className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">닫기</button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
