"use client";
import { useState } from "react";
import Link from "next/link";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

type Screen = "home" | "register" | "bookings" | "bookingDetail" | "settlement" | "notifications" | "studioView" | "mypage" | "bizSignup" | "approvalWaiting";
type BookingFilter = "전체" | "확정" | "취소요청" | "완료";

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
  const [tab, setTab] = useState<"home" | "search" | "booking" | "my">("home");
  const [selectedCats, setSelectedCats] = useState<string[]>(["프로필", "바디프로필"]);
  const [calDate, setCalDate] = useState(10);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("전체");
  const [selectedBooking, setSelectedBooking] = useState(ALL_BOOKINGS[0]);
  const [bookings, setBookings] = useState(ALL_BOOKINGS);
  const [registered, setRegistered] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const [settlementMonth, setSettlementMonth] = useState("4월");

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
            <button onClick={() => { setScreen("home"); setTab("home"); }} className="text-xl font-bold text-gray-900">
              퍼니 <span className="text-primary text-sm font-medium">비즈니스</span>
            </button>
            <button onClick={() => { setScreen("notifications"); setHasNotif(false); }} className="relative">
              <span className="text-gray-400 text-lg">🔔</span>
              {hasNotif && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto bg-white" style={{ height: "calc(780px - 76px - 56px)" }}>

          {/* ===== HOME ===== */}
          {screen === "home" && (
            <div className="p-4">
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
                <button onClick={() => { setScreen("bookings"); setTab("booking"); setBookingFilter("취소요청"); }}
                  className="bg-red-50 rounded-2xl p-3 border border-red-100 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">취소 요청</p>
                  <p className="text-xl font-bold text-red-500">{bookings.filter(b => b.status === "취소요청").length}</p>
                </button>
              </div>

              {/* Today's Timeline */}
              <h3 className="font-bold text-sm mb-3">오늘의 예약</h3>
              {todayBookings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl mb-4">
                  <p className="text-sm text-gray-400">오늘 예약이 없습니다</p>
                </div>
              ) : todayBookings.map(b => (
                <button key={b.id} onClick={() => { setSelectedBooking(b); setScreen("bookingDetail"); }}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2 text-left">
                  <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center text-lg">📷</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.cat} · {b.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                      b.status === "취소요청" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>{b.status}</span>
                    <p className="text-xs font-bold mt-1">₩{b.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}

              {/* Upcoming */}
              <h3 className="font-bold text-sm mb-3 mt-5">다가오는 예약</h3>
              {bookings.filter(b => b.date > 10 && b.date <= 15 && b.status === "확정").slice(0, 3).map(b => (
                <button key={b.id} onClick={() => { setSelectedBooking(b); setScreen("bookingDetail"); }}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2 text-left">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                    5/{b.date}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.cat} · {b.time}</p>
                  </div>
                  <span className="text-xs text-gray-400">›</span>
                </button>
              ))}

              {/* Settlement */}
              <div className="policy-area mt-5 p-3">
                <PolicyBadge label="정산 정책 미확정" />
                <div className="mt-2 bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">미정산 금액</p>
                      <p className="text-xl font-bold text-primary mt-0.5">₩{pendingAmount.toLocaleString()}</p>
                    </div>
                    <button onClick={() => { setScreen("settlement"); setTab("my"); }}
                      className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium">상세 →</button>
                  </div>
                  <p className="text-[10px] text-amber-600 mt-2">정산 대상 기준 · 단위 · 수수료 차감 → 미확정</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {screen === "notifications" && (
            <div className="p-4">
              <button onClick={() => setScreen("home")} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
              <h2 className="text-base font-bold mb-4">알림</h2>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="flex gap-3 py-3 border-b border-gray-50">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    n.type === "booking" ? "bg-primary/10" : n.type === "cancel" ? "bg-red-50" : n.type === "review" ? "bg-yellow-50" : "bg-green-50"
                  }`}>
                    {n.type === "booking" ? "📅" : n.type === "cancel" ? "❌" : n.type === "review" ? "⭐" : "💰"}
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

                {/* Photos */}
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">포트폴리오 (최대 30장, 동영상 불가)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={`aspect-square rounded-lg flex items-center justify-center ${
                        i < 6 ? "bg-gray-200" : "bg-white border-2 border-dashed border-gray-200 text-gray-300 text-lg cursor-pointer hover:border-primary hover:text-primary"
                      }`}>
                        {i >= 6 && "+"}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">6 / 30장</p>
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

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-40 flex items-center justify-center text-5xl mb-4">📷</div>

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
                <button onClick={() => {/* 수기 일정 추가 모달 - 프로토타입 */}}
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

              {/* Quick Menu */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => { setScreen("register"); setTab("home"); }}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <span className="text-xl">🏠</span>
                  <p className="text-sm font-medium mt-1">스튜디오 관리</p>
                  <p className="text-[10px] text-gray-400">정보 수정·사진 관리</p>
                </button>
                <button onClick={() => setScreen("settlement")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <span className="text-xl">💰</span>
                  <p className="text-sm font-medium mt-1">정산</p>
                  <p className="text-[10px] text-gray-400">정산 내역 확인</p>
                </button>
              </div>

              <div className="space-y-0">
                {[
                  { label: "리뷰 관리", action: () => {} },
                  { label: "사업자 정보", action: () => {} },
                  { label: "업체 가입 신청 (데모)", action: () => setScreen("bizSignup") },
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

        {/* Bottom Tab - IA 기준 3탭: 홈/카테고리/마이페이지 */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-100 flex items-center z-10">
          {[
            { key: "home" as const, icon: "🏠", label: "홈", s: "home" as Screen },
            { key: "booking" as const, icon: "📅", label: "예약관리", s: "bookings" as Screen },
            { key: "my" as const, icon: "👤", label: "마이페이지", s: "mypage" as Screen },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setScreen(t.s); }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${
                tab === t.key ? "text-primary" : "text-gray-400"
              }`}>
              <span className="text-base">{t.icon}</span>
              <span className="text-[10px]">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
