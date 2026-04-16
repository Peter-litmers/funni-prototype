"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import FeedbackOverlay from "../components/FeedbackOverlay";
import {
  Sparkles, Camera, Dumbbell, Heart, Cake, Package, Video, MoreHorizontal,
  Home, LayoutGrid, User, Bell, Phone, MapPin, Calendar,
  DollarSign, BarChart3, Building2, ImageIcon, X, Star
} from "lucide-react";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

type Screen = "home" | "category" | "detail" | "register" | "bookings" | "bookingDetail" | "settlement" | "notifications" | "studioView" | "mypage" | "bizSignup" | "approvalWaiting" | "dashboard" | "bizInfo" | "reviews";
type BookingFilter = "전체" | "확정" | "취소요청" | "완료";
type Tab = "home" | "category" | "my";

// Studio browsing data — 소비자와 동일한 탐색 화면
const CATEGORIES = [
  { name: "추천", Icon: Sparkles },
  { name: "프로필", Icon: Camera },
  { name: "바디프로필", Icon: Dumbbell },
  { name: "웨딩", Icon: Heart },
  { name: "돌잔치", Icon: Cake },
  { name: "제품", Icon: Package },
  { name: "영상", Icon: Video },
  { name: "기타", Icon: MoreHorizontal },
];

const STUDIOS = [
  { id: 1, name: "루미에르 스튜디오", cat: "프로필", desc: "프로필촬영, 증명사진, 프로필영상", area: "서울 강남구", price: "50,000", rating: 4.8, reviews: 124, phone: "02-1234-5678" },
  { id: 2, name: "선셋 포토랩", cat: "바디프로필", desc: "바디프로필, 커플촬영, 운동기록", area: "서울 성수동", price: "80,000", rating: 4.9, reviews: 89, phone: "02-2345-6789" },
  { id: 3, name: "블룸 웨딩 스튜디오", cat: "웨딩", desc: "웨딩스냅, 본식촬영, 야외웨딩", area: "서울 잠실", price: "200,000", rating: 4.7, reviews: 56, phone: "02-3456-7890" },
  { id: 4, name: "미니미 키즈포토", cat: "돌잔치", desc: "돌잔치촬영, 백일사진, 가족사진", area: "경기 판교", price: "120,000", rating: 4.6, reviews: 34, phone: "031-456-7890" },
  { id: 5, name: "프로덕트 랩", cat: "제품", desc: "제품촬영, 음식사진, 상세페이지", area: "서울 홍대", price: "40,000", rating: 4.5, reviews: 67, phone: "02-4567-8901" },
  { id: 6, name: "무브 필름랩", cat: "영상", desc: "유튜브촬영, 광고영상, 인터뷰", area: "서울 합정", price: "60,000", rating: 4.7, reviews: 45, phone: "02-5678-9012" },
];

const KEYWORDS = ["강남 프로필", "성수 바디프로필", "웨딩 스냅", "증명사진", "제품 촬영"];

const ALL_BOOKINGS = [
  { id: 1, date: 10, name: "김철수", cat: "프로필", time: "10:00~12:00", price: 100000, status: "확정" },
  { id: 2, date: 10, name: "이영희", cat: "바디프로필", time: "14:00~16:00", price: 160000, status: "확정" },
  { id: 3, date: 10, name: "박지민", cat: "프로필", time: "17:00~19:00", price: 100000, status: "확정" },
  { id: 4, date: 11, name: "최수현", cat: "프로필", time: "10:00~12:00", price: 100000, status: "취소요청" },
  { id: 5, date: 11, name: "정다은", cat: "바디프로필", time: "13:00~15:00", price: 160000, status: "확정" },
  { id: 6, date: 12, name: "한소희", cat: "프로필", time: "15:00~17:00", price: 100000, status: "완료" },
  { id: 7, date: 13, name: "오진우", cat: "바디프로필", time: "10:00~13:00", price: 240000, status: "확정" },
  { id: 8, date: 15, name: "윤서연", cat: "프로필", time: "11:00~13:00", price: 100000, status: "확정" },
  { id: 9, date: 20, name: "강민지", cat: "바디프로필", time: "14:00~16:00", price: 160000, status: "취소요청" },
  { id: 10, date: 25, name: "임재현", cat: "프로필", time: "16:00~18:00", price: 100000, status: "확정" },
];

const NOTIFICATIONS = [
  { id: 1, type: "booking", text: "김철수님이 5/10 프로필 촬영을 예약했습니다", time: "10분 전" },
  { id: 2, type: "cancel", text: "최수현님이 5/11 예약 취소를 요청했습니다", time: "30분 전" },
  { id: 3, type: "review", text: "한소희님이 리뷰를 작성했습니다 ★★★★★", time: "2시간 전" },
  { id: 4, type: "settlement", text: "4월 2주차 정산이 완료되었습니다 (₩450,000)", time: "1일 전" },
  { id: 5, type: "booking", text: "오진우님이 5/13 바디프로필 촬영을 예약했습니다", time: "2일 전" },
];

const SETTLEMENTS = [
  { id: 1, date: "2026.04.10", period: "4월 2주차", count: 8, total: 680000, fee: "?%", net: "?", status: "완료" },
  { id: 2, date: "2026.04.03", period: "4월 1주차", count: 5, total: 450000, fee: "?%", net: "?", status: "완료" },
  { id: 3, date: "2026.03.27", period: "3월 4주차", count: 6, total: 520000, fee: "?%", net: "?", status: "완료" },
  { id: 4, date: "2026.03.20", period: "3월 3주차", count: 4, total: 320000, fee: "?%", net: "?", status: "완료" },
];

export default function BusinessApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tab, setTab] = useState<Tab>("home");
  const [selectedCats, setSelectedCats] = useState<string[]>(["프로필", "바디프로필"]);
  const [calDate, setCalDate] = useState(10);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("전체");
  const [selectedBooking, setSelectedBooking] = useState(ALL_BOOKINGS[0]);
  const [bookings, setBookings] = useState(ALL_BOOKINGS);
  const [registered, setRegistered] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const [settlementMonth, setSettlementMonth] = useState("4월");
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0]);
  const [categoryCat, setCategoryCat] = useState("추천");
  const [adIdx, setAdIdx] = useState(0);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [manualMemo, setManualMemo] = useState("");
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setAdIdx(prev => Math.min(prev + 1, 2));
    if (diff < -50) setAdIdx(prev => Math.max(prev - 1, 0));
  };

  const catFiltered = categoryCat === "추천" ? STUDIOS : STUDIOS.filter(s => s.cat === categoryCat);

  const toggleCat = (c: string) => {
    setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const todayBookings = bookings.filter(b => b.date === 10 && b.status !== "완료");
  const dateBookings = bookings.filter(b => b.date === calDate);
  const filteredBookings = bookingFilter === "전체" ? dateBookings : dateBookings.filter(b => b.status === bookingFilter);
  const datesWithBookings = [...new Set(bookings.map(b => b.date))];

  const totalRevenue = bookings.filter(b => b.status === "완료" || b.status === "확정").reduce((s, b) => s + b.price, 0);
  const pendingAmount = bookings.filter(b => b.status === "확정").reduce((s, b) => s + b.price, 0);

  const handleBookingAction = (id: number, action: "accept" | "reject") => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action === "accept" ? "확정" : "취소완료" } : b));
    setScreen("bookings");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <Link href="/" className="text-sm text-primary mb-4 hover:underline">← 메인으로</Link>
      <h2 className="text-xl font-bold mb-6 text-gray-900">업체 화면</h2>

      <div className="w-[375px] bg-white rounded-[40px] border-[8px] border-gray-900 overflow-hidden shadow-2xl relative" style={{ height: 780 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-gray-900 rounded-b-2xl z-20" />

        {/* Header */}
        <div className="relative z-10 bg-white pt-10 px-4 pb-2 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <button onClick={() => { setScreen("home"); setTab("home"); }} className="flex items-center gap-1.5">
              <img src="/funni-logo.png" alt="퍼니" className="w-10 h-10" />
              <span className="text-xl font-bold text-gray-900">퍼니</span>
              <span className="text-primary text-sm font-medium">비즈니스</span>
            </button>
            <button onClick={() => { setScreen("notifications"); setHasNotif(false); }} className="relative text-gray-500 p-1">
              <Bell size={20} strokeWidth={1.5} />
              {hasNotif && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto bg-white" style={{ height: "calc(780px - 76px - 56px)" }}>

          {/* ===== HOME (IA-010: 소비자와 동일한 스튜디오 탐색) ===== */}
          {screen === "home" && (
            <div>
              {/* 업체 모드 토스트 */}
              <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] text-primary font-medium">🏢 업체 계정 · 탐색만 가능 (예약·결제 불가)</span>
                <button onClick={() => { setScreen("dashboard"); setTab("my"); }} className="text-[10px] text-primary underline">내 대시보드 →</button>
              </div>

              {/* 프리미엄 광고 (REQ-112) */}
              <div className="policy-area mx-4 mt-3 p-2">
                <PolicyBadge label="광고 정책 미확정" />
                <div className="mt-1 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${adIdx * 100}%)` }}>
                    {STUDIOS.slice(0, 3).map((s, i) => (
                      <div key={i} onClick={() => { setSelectedStudio(s); setScreen("detail"); }} className="min-w-full cursor-pointer">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 flex gap-3 items-center relative">
                          <span className="absolute top-2 left-2 bg-primary/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">AD</span>
                          <div className="w-16 h-16 bg-white/60 rounded-lg flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={24} strokeWidth={1.5} /></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{s.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{s.cat} · {s.area}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs font-bold">₩{s.price}</span>
                              <span className="text-[10px] text-yellow-600">★ {s.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1.5 mt-2">
                    {[0,1,2].map(i => (
                      <button key={i} onClick={() => setAdIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === adIdx ? "bg-primary w-4" : "bg-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 추천 스튜디오 */}
              <div className="px-4 mt-3 mb-2">
                <p className="font-bold text-base mb-2">추천 스튜디오</p>
              </div>
              <div className="px-4">
                {STUDIOS.map(s => (
                  <div key={s.id} onClick={() => { setSelectedStudio(s); setScreen("detail"); }}
                    className="w-full flex gap-3 py-4 border-b border-gray-50 cursor-pointer">
                    <div className="relative w-[88px] h-[88px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0 text-gray-400">
                      <ImageIcon size={28} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{s.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.area}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-sm font-bold">₩{s.price}</span>
                        <span className="text-xs text-gray-400">VAT 포함</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-yellow-500">★ {s.rating}</span>
                        <span className="text-xs text-gray-400">({s.reviews})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CATEGORY (IA-011) ===== */}
          {screen === "category" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">카테고리</h2>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {CATEGORIES.map(c => (
                  <button key={c.name} onClick={() => setCategoryCat(c.name)}
                    className="flex flex-col items-center gap-1.5 py-2">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${categoryCat === c.name ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-white text-gray-600"}`}>
                      <c.Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[10px] ${categoryCat === c.name ? "text-primary font-semibold" : "text-gray-600"}`}>{c.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm font-bold mb-3">&lsquo;{categoryCat}&rsquo; 스튜디오 {catFiltered.length}곳</p>
              {catFiltered.map(s => (
                <div key={s.id} onClick={() => { setSelectedStudio(s); setScreen("detail"); }}
                  className="flex gap-3 py-3 border-b border-gray-50 cursor-pointer">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={22} strokeWidth={1.5} /></div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.cat} · {s.area}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold">₩{s.price}</span>
                      <span className="text-xs text-yellow-500">★ {s.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== DETAIL (IA-012: 업체는 조회만, 예약 불가) ===== */}
          {screen === "detail" && (
            <div>
              <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative text-gray-400">
                <ImageIcon size={56} strokeWidth={1} />
                <button onClick={() => setScreen("home")}
                  className="absolute top-3 left-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-sm shadow text-gray-700">‹</button>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-0.5">{selectedStudio.name}</h2>
                <p className="text-xs text-gray-400">{selectedStudio.area}</p>
                <div className="flex items-center gap-2 mt-1 mb-4">
                  <span className="text-xs text-yellow-500">★ {selectedStudio.rating}</span>
                  <span className="text-xs text-gray-400">리뷰 {selectedStudio.reviews}개</span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">촬영 가격</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₩{selectedStudio.price}</span>
                    <span className="text-xs text-gray-400">/ 시간 · VAT 포함</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">포트폴리오</p>
                  <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">{[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-gray-100" />)}</div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">리뷰</p>
                  <div className="space-y-2">
                    {[{ name: "김**", rating: 5, text: "분위기 너무 좋아요!" }, { name: "이**", rating: 4, text: "시설이 깔끔해요" }].map((r, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium">{r.name}</span><span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div>
                        <p className="text-xs text-gray-600">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 업체 계정 예약 제한 (REQ-107) */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-amber-700">🏢 업체 계정 안내</p>
                  <p className="text-[10px] text-amber-600 mt-1">업체 계정은 스튜디오 탐색·조회만 가능합니다. 예약은 소비자 계정으로만 가능합니다.</p>
                </div>

                <div className="flex gap-2">
                  <a href={`tel:${selectedStudio.phone}`} className="flex items-center justify-center w-14 h-12 border border-gray-300 rounded-xl text-gray-500 shrink-0"><Phone size={18} strokeWidth={1.5} /></a>
                  <button disabled className="flex-1 bg-gray-200 text-gray-400 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed">예약 불가 (업체 계정)</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== DASHBOARD (IA-063 실적 대시보드) ===== */}
          {screen === "dashboard" && (
            <div className="p-4">
              <button onClick={() => { setScreen("mypage"); setTab("my"); }} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
              <h2 className="text-base font-bold mb-4">실적 대시보드</h2>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">오늘 예약</p>
                  <p className="text-xl font-bold text-primary">{todayBookings.length}</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-3 border border-green-100 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">이번 달</p>
                  <p className="text-xl font-bold text-green-600">₩{(totalRevenue / 10000).toFixed(0)}<span className="text-xs">만</span></p>
                </div>
                <button onClick={() => { setScreen("bookings"); setBookingFilter("취소요청"); }}
                  className="bg-red-50 rounded-2xl p-3 border border-red-100 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">취소 요청</p>
                  <p className="text-xl font-bold text-red-500">{bookings.filter(b => b.status === "취소요청").length}</p>
                </button>
              </div>

              {/* 월별 통계 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold mb-3">월별 실적</p>
                <div className="space-y-2">
                  {[{m: "2026.05", bk: 12, rv: 1400000, rating: 4.8}, {m: "2026.04", bk: 18, rv: 2200000, rating: 4.7}, {m: "2026.03", bk: 15, rv: 1800000, rating: 4.6}].map((s, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-xs text-gray-500">{s.m}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span>{s.bk}건</span>
                        <span className="font-bold">₩{(s.rv / 10000).toFixed(0)}만</span>
                        <span className="text-yellow-500">★ {s.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-sm mb-3">오늘의 예약</h3>
              {todayBookings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl mb-4"><p className="text-sm text-gray-400">오늘 예약이 없습니다</p></div>
              ) : todayBookings.map(b => (
                <button key={b.id} onClick={() => { setSelectedBooking(b); setScreen("bookingDetail"); }}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2 text-left">
                  <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Camera size={18} strokeWidth={1.5} /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.cat} · {b.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${b.status === "취소요청" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{b.status}</span>
                    <p className="text-xs font-bold mt-1">₩{b.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ===== BIZ INFO (IA-065 업체 기본정보 수정) ===== */}
          {screen === "bizInfo" && (
            <div className="p-4">
              <button onClick={() => { setScreen("mypage"); setTab("my"); }} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
              <h2 className="text-base font-bold mb-4">업체 기본정보 수정</h2>
              <div className="space-y-3">
                <div><p className="text-xs text-gray-500 mb-1">업체명</p><input type="text" defaultValue="루미에르 스튜디오" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">대표자명</p><input type="text" defaultValue="김사장" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">사업자등록번호</p><input type="text" defaultValue="123-45-67890" disabled className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 text-gray-500" /></div>
                <div><p className="text-xs text-gray-500 mb-1">연락처</p><input type="tel" defaultValue="02-1234-5678" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">이메일</p><input type="email" defaultValue="lumiere@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mt-6">저장</button>
            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {screen === "notifications" && (
            <div className="p-4">
              <button onClick={() => setScreen("home")} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
              <h2 className="text-base font-bold mb-4">알림</h2>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="flex gap-3 py-3 border-b border-gray-50">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === "booking" ? "bg-primary/10 text-primary" : n.type === "cancel" ? "bg-red-50 text-red-500" : n.type === "review" ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                  }`}>
                    {n.type === "booking" ? <Calendar size={16} strokeWidth={1.5} /> : n.type === "cancel" ? <X size={16} strokeWidth={1.5} /> : n.type === "review" ? <Star size={16} strokeWidth={1.5} /> : <DollarSign size={16} strokeWidth={1.5} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== STUDIO REGISTER ===== */}
          {screen === "register" && !registered && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">스튜디오 등록</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">스튜디오 이름</label>
                  <input type="text" defaultValue="루미에르 스튜디오" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">주소</label>
                  <input type="text" defaultValue="서울시 강남구 역삼동 123-4" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">연락처</label>
                  <input type="text" defaultValue="02-1234-5678" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 outline-none focus:border-primary" />
                </div>

                {/* Categories - Toggle */}
                <div className="policy-area p-3">
                  <PolicyBadge label="카테고리 목록 미확정" />
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium mt-1">카테고리 (복수 선택)</label>
                  <div className="flex flex-wrap gap-2">
                    {["프로필", "바디프로필", "웨딩", "돌잔치", "제품", "영상"].map(c => (
                      <button key={c} onClick={() => toggleCat(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedCats.includes(c) ? "bg-primary text-white border-primary" : "bg-white text-gray-400 border-gray-200"
                        }`}>
                        {selectedCats.includes(c) ? "✓ " : ""}{c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per-Category Price */}
                {selectedCats.length > 0 && (
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block font-medium">카테고리별 가격 · 설명</label>
                    {selectedCats.map((c, i) => (
                      <div key={c} className="bg-primary/5 rounded-xl p-3 mb-2 border border-primary/10">
                        <p className="text-sm font-bold text-gray-900 mb-2">{c} 촬영</p>
                        <input type="text" defaultValue={`₩${(i + 1) * 30000 + 20000} / 시간`}
                          className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-100 mb-1.5 outline-none focus:border-primary" />
                        <input type="text" placeholder={`${c} 촬영 설명을 입력하세요...`}
                          className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-gray-100 outline-none focus:border-primary text-gray-500" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 카테고리별 포트폴리오 업로드 (REQ-103 / IA-060) */}
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">카테고리별 포트폴리오 (카테고리당 최대 30장, 동영상 불가)</label>
                  {selectedCats.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400">카테고리를 먼저 선택하세요</p>
                    </div>
                  ) : selectedCats.map((c, catIdx) => (
                    <div key={c} className="bg-gray-50 rounded-xl p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold">{c} 포트폴리오</p>
                        <span className="text-[10px] text-gray-400">{catIdx === 0 ? 6 : catIdx === 1 ? 4 : 0} / 30장</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {(() => {
                          const count = catIdx === 0 ? 6 : catIdx === 1 ? 4 : 0;
                          return Array.from({ length: Math.min(count + 1, 10) }).map((_, i) => (
                            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center ${
                              i < count ? "bg-gray-200" : "bg-white border-2 border-dashed border-gray-300 text-gray-300 text-lg cursor-pointer hover:border-primary hover:text-primary"
                            }`}>
                              {i >= count && "+"}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 헤어/메이크업 옵션 3종 (REQ-103) */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium mb-2">헤어 / 메이크업 옵션 설정</p>
                  {[
                    { name: "헤어 메이크업", defaultPrice: "30,000" },
                    { name: "얼굴 메이크업", defaultPrice: "50,000" },
                    { name: "세트 (헤어+얼굴)", defaultPrice: "70,000" },
                  ].map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 accent-[#7C3AED]" />
                      <span className="text-xs flex-1">{opt.name}</span>
                      <input type="text" defaultValue={`₩${opt.defaultPrice}`} className="w-24 bg-white rounded-lg px-2 py-1.5 text-xs border border-gray-200 text-right outline-none" />
                    </div>
                  ))}
                </div>

                {/* 출장 가능 + 부가세 (REQ-103) */}
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 flex-1 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#7C3AED]" />
                    <span className="text-xs">🚗 출장 가능</span>
                  </label>
                  <label className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 flex-1 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#7C3AED]" />
                    <span className="text-xs">💰 VAT 포함</span>
                  </label>
                </div>

                {/* Schedule */}
                <div className="policy-area p-3">
                  <PolicyBadge label="예약 단위 미확정" />
                  <p className="text-xs font-medium text-gray-700 mt-1 mb-2">운영 시간 설정</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg px-3 py-2.5 text-sm text-center border border-gray-100">09:00 시작</div>
                    <div className="bg-white rounded-lg px-3 py-2.5 text-sm text-center border border-gray-100">22:00 종료</div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">휴무일</p>
                    <div className="flex gap-1.5">
                      {["월","화","수","목","금","토","일"].map((d, i) => (
                        <button key={d} className={`w-9 h-9 rounded-lg text-xs font-medium ${
                          i === 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                        }`}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-600 mt-2">예약 단위 · 최소 시간 · 버퍼 → 미확정</p>
                </div>

                <button onClick={() => setRegistered(true)}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">등록하기</button>
              </div>
            </div>
          )}

          {/* Studio Registered */}
          {screen === "register" && registered && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold">내 스튜디오</h2>
                <button onClick={() => setRegistered(false)} className="text-xs text-primary font-medium">수정</button>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-40 flex items-center justify-center text-gray-400 mb-4"><ImageIcon size={48} strokeWidth={1} /></div>

              <h3 className="text-lg font-bold mb-1">루미에르 스튜디오</h3>
              <p className="text-xs text-gray-400 mb-3">서울시 강남구 역삼동 123-4</p>

              <div className="flex gap-2 mb-4">
                {selectedCats.map(c => (
                  <span key={c} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">{c}</span>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                {selectedCats.map((c, i) => (
                  <div key={c} className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                    <span className="text-sm">{c} 촬영</span>
                    <span className="text-sm font-bold">₩{((i + 1) * 30000 + 20000).toLocaleString()} / 시간</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-500 mb-2">포트폴리오</p>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">6 / 30장</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-xl p-3 text-center border border-primary/10">
                  <p className="text-[10px] text-gray-500">총 예약</p>
                  <p className="text-lg font-bold text-primary">{bookings.length}건</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
                  <p className="text-[10px] text-gray-500">평균 평점</p>
                  <p className="text-lg font-bold text-yellow-600">4.8 ★</p>
                </div>
              </div>
            </div>
          )}

          {screen === "studioView" && (
            <div />
          )}

          {/* ===== BOOKINGS ===== */}
          {screen === "bookings" && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold">예약 관리</h2>
                <button onClick={() => setShowManualModal(true)}
                  className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-medium">
                  ✏️ 수기 일정 추가
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 mb-3">
                {(["전체", "확정", "취소요청", "완료"] as BookingFilter[]).map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      bookingFilter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                    {f} {f !== "전체" && <span className="ml-0.5">{bookings.filter(b => b.date === calDate && b.status === f).length}</span>}
                  </button>
                ))}
              </div>

              {/* Calendar */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">2026년 5월</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {["일", "월", "화", "수", "목", "금", "토"].map(d => <span key={d} className="text-gray-400 py-1">{d}</span>)}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const d = i + 1;
                    const hasBooking = datesWithBookings.includes(d);
                    const isSelected = calDate === d;
                    return (
                      <button key={i} onClick={() => setCalDate(d)}
                        className={`py-1 rounded-lg relative transition-all ${
                          isSelected ? "bg-primary text-white font-bold" :
                          hasBooking ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-100"
                        }`}>
                        {d}
                        {hasBooking && !isSelected && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Bookings */}
              <p className="text-xs text-gray-500 mb-2 font-medium">5월 {calDate}일 예약 ({filteredBookings.length}건)</p>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-400">해당 날짜에 예약이 없습니다</p>
                </div>
              ) : (
                <div className="policy-area p-2">
                  {bookingFilter === "취소요청" && <PolicyBadge label="취소/환불 정책 미확정" />}
                  <div className="mt-1 space-y-2">
                    {filteredBookings.map(b => (
                      <button key={b.id} onClick={() => { setSelectedBooking(b); setScreen("bookingDetail"); }}
                        className="w-full bg-white rounded-xl p-3 border border-gray-100 flex justify-between items-center text-left">
                        <div>
                          <p className="text-sm font-medium">{b.name}</p>
                          <p className="text-xs text-gray-400">{b.cat} · {b.time}</p>
                          <p className="text-xs font-bold mt-0.5">₩{b.price.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                            b.status === "취소요청" ? "bg-red-100 text-red-700" :
                            b.status === "완료" ? "bg-gray-200 text-gray-500" :
                            b.status === "취소완료" ? "bg-gray-200 text-gray-400" :
                            "bg-green-100 text-green-700"
                          }`}>{b.status}</span>
                          <span className="text-xs text-gray-300">›</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== BOOKING DETAIL ===== */}
          {screen === "bookingDetail" && (
            <div className="p-4">
              <button onClick={() => setScreen("bookings")} className="text-sm text-gray-400 mb-3">← 예약 관리</button>
              <h2 className="text-base font-bold mb-4">예약 상세</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">👤</div>
                  <div>
                    <p className="text-base font-bold">{selectedBooking.name}</p>
                    <p className="text-xs text-gray-400">고객</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">촬영 종류</span>
                    <span className="font-medium">{selectedBooking.cat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">날짜</span>
                    <span className="font-medium">2026.05.{selectedBooking.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">시간</span>
                    <span className="font-medium">{selectedBooking.time}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                    <span className="text-gray-500">금액</span>
                    <span className="font-bold text-primary">₩{selectedBooking.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">상태</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      selectedBooking.status === "취소요청" ? "bg-red-100 text-red-700" :
                      selectedBooking.status === "완료" ? "bg-gray-200 text-gray-500" :
                      "bg-green-100 text-green-700"
                    }`}>{selectedBooking.status}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.status === "취소요청" && (
                <div className="policy-area p-3 mb-4">
                  <PolicyBadge label="취소/환불 정책 미확정" />
                  <p className="text-sm font-medium mt-2 mb-2 text-red-700">고객이 취소를 요청했습니다</p>
                  <p className="text-xs text-amber-600 mb-3">취소 수락 시 환불 금액 및 페널티 → 미확정</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleBookingAction(selectedBooking.id, "reject")}
                      className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium">거절</button>
                    <button onClick={() => handleBookingAction(selectedBooking.id, "accept")}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium">취소 수락</button>
                  </div>
                </div>
              )}

              {selectedBooking.status === "확정" && (
                <div className="space-y-2">
                  <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl text-sm font-medium">고객에게 메시지 보내기</button>
                </div>
              )}
            </div>
          )}

          {/* ===== MY PAGE (업체) ===== */}
          {screen === "mypage" && (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-2xl">🏢</div>
                <div>
                  <p className="font-bold">루미에르 스튜디오</p>
                  <p className="text-xs text-gray-400">김사장님</p>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">업체 모드</span>
                  </div>
                </div>
              </div>

              {/* Consumer Mode Switch */}
              <Link href="/consumer"
                className="flex items-center justify-between w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">소비자 모드로 전환</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">스튜디오 탐색·예약·결제</p>
                </div>
                <span className="text-gray-400 text-sm">→</span>
              </Link>

              {/* Quick Menu — 업체 마이페이지 전용 메뉴 (IA Group 07) */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button onClick={() => { setScreen("register"); }}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <Home size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">내 스튜디오 관리</p>
                  <p className="text-[10px] text-gray-400">IA-060 · 등록/수정/삭제</p>
                </button>
                <button onClick={() => { setScreen("bookings"); }}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <Calendar size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">내 예약 달력</p>
                  <p className="text-[10px] text-gray-400">IA-061 · 예약·수기 일정</p>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button onClick={() => setScreen("dashboard")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <BarChart3 size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">실적 대시보드</p>
                  <p className="text-[10px] text-gray-400">IA-063 · 월별 예약·매출</p>
                </button>
                <button onClick={() => setScreen("settlement")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <DollarSign size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">정산 내역</p>
                  <p className="text-[10px] text-gray-400">IA-064 · 월별 정산</p>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => setScreen("bizInfo")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <Building2 size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">업체 기본정보</p>
                  <p className="text-[10px] text-gray-400">IA-065 · 기본정보 수정</p>
                </button>
                <button onClick={() => setScreen("notifications")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <Bell size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">알림</p>
                  <p className="text-[10px] text-gray-400">{hasNotif ? "새 알림" : "확인 완료"}</p>
                </button>
              </div>

              <div className="space-y-0">
                {[
                  { label: "리뷰 관리", action: () => setScreen("reviews") },
                  { label: "고객센터", action: () => {} },
                  { label: "로그아웃", action: () => {} },
                ].map(m => (
                  <button key={m.label} onClick={m.action}
                    className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                    <span className="text-sm">{m.label}</span>
                    <span className="text-gray-300 text-xs">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== SETTLEMENT ===== */}
          {screen === "settlement" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">정산 내역</h2>

              {/* Period Filter */}
              <div className="flex gap-2 mb-4">
                {["4월", "3월", "전체"].map(m => (
                  <button key={m} onClick={() => setSettlementMonth(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      settlementMonth === m ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    }`}>{m}</button>
                ))}
              </div>

              <div className="policy-area p-3 mb-4">
                <PolicyBadge label="정산 정책 미확정" />
                <div className="mt-2 bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500">미정산 금액</p>
                  <p className="text-2xl font-bold text-primary mt-0.5">₩{pendingAmount.toLocaleString()}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-400">수수료율</span><br/><span className="text-amber-600 font-medium">어드민 설정 (?%)</span></div>
                    <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-400">차감 방식</span><br/><span className="text-amber-600 font-medium">자동 vs 수동 → 미확정</span></div>
                    <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-400">정산 단위</span><br/><span className="text-amber-600 font-medium">건별 vs 일괄 → 미확정</span></div>
                    <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-400">환불 후 처리</span><br/><span className="text-amber-600 font-medium">차감 vs 별도 → 미확정</span></div>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-medium text-gray-500 mb-2">정산 기록</h3>
              {SETTLEMENTS
                .filter(s => settlementMonth === "전체" || s.period.includes(settlementMonth))
                .map(s => (
                <div key={s.id} className="bg-white rounded-xl p-4 border border-gray-100 mb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium">{s.period}</p>
                      <p className="text-[10px] text-gray-400">{s.date} · {s.count}건</p>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{s.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      총 ₩{s.total.toLocaleString()} → 수수료 {s.fee}
                    </div>
                    <p className="text-sm font-bold text-amber-600">정산액 {s.net}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== REVIEWS (REQ-111 업체 리뷰 답변) ===== */}
          {screen === "reviews" && (
            <div className="p-4">
              <button onClick={() => { setScreen("mypage"); setTab("my"); }} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
              <h2 className="text-base font-bold mb-4">리뷰 관리</h2>

              {[
                { author: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다", date: "2026.04.10", replied: true, reply: "감사합니다! 다음에도 좋은 촬영 하겠습니다." },
                { author: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요", date: "2026.04.08", replied: false },
                { author: "한**", rating: 5, text: "결과물 퀄리티가 정말 좋습니다. 재방문 예정!", date: "2026.03.28", replied: true, reply: "좋은 리뷰 감사합니다! 또 뵙겠습니다." },
                { author: "박**", rating: 3, text: "가격 대비 보통이었어요", date: "2026.03.20", replied: false },
              ].map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-medium">{r.author}</span>
                      <span className="text-xs text-yellow-500 ml-2">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{r.text}</p>
                  {r.replied && r.reply ? (
                    <div className="bg-white rounded-lg p-2.5 border border-gray-100">
                      <p className="text-[10px] text-primary font-medium mb-1">업체 답변</p>
                      <p className="text-xs text-gray-600">{r.reply}</p>
                    </div>
                  ) : (
                    <button className="w-full bg-white border border-gray-200 rounded-lg py-2 text-xs text-gray-500 hover:border-primary hover:text-primary transition-all">
                      답글 작성
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ===== BIZ SIGNUP (IA-002) ===== */}
          {screen === "bizSignup" && (
            <div className="p-4">
              <button onClick={() => setScreen("mypage")} className="text-sm text-gray-400 mb-4">← 돌아가기</button>
              <h2 className="text-base font-bold mb-1">업체 회원가입</h2>
              <p className="text-xs text-gray-400 mb-6">사업자 계정 · 승인 후 이용 가능</p>

              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-gray-500 mb-1">사업자등록번호</p><input type="text" placeholder="000-00-00000" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">대표자명</p><input type="text" placeholder="홍길동" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">상호명</p><input type="text" placeholder="스튜디오명" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">연락처</p><input type="tel" placeholder="02-0000-0000" className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" /></div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">포트폴리오 사진 업로드 (최대 30장)</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300"><span className="text-xl text-gray-400">+</span></div>
                  {[1,2,3].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl" />)}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">사진만 가능 · 동영상 불가</p>
              </div>

              <button onClick={() => setScreen("approvalWaiting")} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mb-3">가입 신청</button>
            </div>
          )}

          {/* ===== APPROVAL WAITING ===== */}
          {screen === "approvalWaiting" && (
            <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 450 }}>
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-4xl mb-4">⏳</div>
              <h2 className="text-lg font-bold mb-2">승인 대기 중</h2>
              <p className="text-sm text-gray-500 text-center mb-6">제출하신 정보를 검토 중입니다</p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 w-full mb-6">
                <p className="text-xs font-bold text-amber-700 mb-2">📋 심사 안내</p>
                <div className="space-y-1.5 text-[10px] text-amber-600">
                  <p>• 사업자등록번호 및 포트폴리오를 검토합니다</p>
                  <p>• 영업일 기준 1~3일 소요됩니다</p>
                  <p>• 결과는 등록하신 이메일로 안내됩니다</p>
                  <p>• 승인 완료 후 스튜디오 등록이 가능합니다</p>
                </div>
              </div>

              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm">홈으로 돌아가기</button>
            </div>
          )}
        </div>

        {/* ===== 수기 일정 추가 모달 (IA-062 / REQ-104) ===== */}
        {showManualModal && (
          <div className="absolute inset-0 bg-black/50 z-30 flex items-end">
            <div className="w-full bg-white rounded-t-3xl p-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">수기 일정 추가</h3>
                <button onClick={() => setShowManualModal(false)} className="text-gray-400 text-xl">✕</button>
              </div>
              <p className="text-[10px] text-gray-400 mb-4">앱 외부로 받은 예약을 달력에 수기로 추가합니다</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">날짜</label>
                  <input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">시간</label>
                  <input type="time" value={manualTime} onChange={e => setManualTime(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">메모</label>
                  <textarea value={manualMemo} onChange={e => setManualMemo(e.target.value)}
                    placeholder="예약자명, 연락처, 특이사항 등" rows={3}
                    className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 resize-none" />
                </div>
              </div>
              <button onClick={() => { setShowManualModal(false); setManualDate(""); setManualTime(""); setManualMemo(""); }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mt-4">일정 추가</button>
            </div>
          </div>
        )}

        {/* Bottom Tab - 소비자 앱과 동일 3탭: 홈/카테고리/마이페이지 (마이페이지만 업체 전용) */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-100 flex items-center z-10">
          {[
            { key: "home" as Tab, Icon: Home, label: "홈", s: "home" as Screen },
            { key: "category" as Tab, Icon: LayoutGrid, label: "카테고리", s: "category" as Screen },
            { key: "my" as Tab, Icon: User, label: "마이페이지", s: "mypage" as Screen },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setScreen(t.s); }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${
                tab === t.key ? "text-primary" : "text-gray-400"
              }`}>
              <t.Icon size={20} strokeWidth={1.5} />
              <span className="text-[10px]">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay pageUrl="business" />
    </div>
  );
}
