"use client";
import { useState } from "react";
import Link from "next/link";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

const CATEGORIES = [
  { name: "추천", icon: "🏆" },
  { name: "프로필", icon: "📸" },
  { name: "바디프로필", icon: "💪" },
  { name: "웨딩", icon: "💍" },
  { name: "돌잔치", icon: "🎂" },
  { name: "제품", icon: "📦" },
  { name: "영상", icon: "🎬" },
  { name: "기타", icon: "✨" },
];

const KEYWORDS = ["강남 프로필", "성수 바디프로필", "웨딩 스냅", "증명사진", "제품 촬영", "유튜브 스튜디오"];

const STUDIOS = [
  { id: 1, name: "루미에르 스튜디오", cat: "프로필", desc: "프로필촬영, 증명사진, 프로필영상, 이력서사진", area: "서울 강남구", price: "50,000", discount: "", rating: 4.8, reviews: 124, badge: "best" as const },
  { id: 2, name: "선셋 포토랩", cat: "바디프로필", desc: "바디프로필, 커플촬영, 다이어트기록, 운동기록", area: "서울 성수동", price: "80,000", discount: "30%", rating: 4.9, reviews: 89, badge: "best" as const },
  { id: 3, name: "블룸 웨딩 스튜디오", cat: "웨딩", desc: "웨딩스냅, 본식촬영, 야외웨딩, 스몰웨딩", area: "서울 잠실", price: "200,000", discount: "", rating: 4.7, reviews: 56, badge: "hot" as const },
  { id: 4, name: "미니미 키즈포토", cat: "돌잔치", desc: "돌잔치촬영, 백일사진, 가족사진, 만삭촬영", area: "경기 판교", price: "120,000", discount: "15%", rating: 4.6, reviews: 34, badge: "hot" as const },
  { id: 5, name: "프로덕트 랩", cat: "제품", desc: "제품촬영, 음식사진, 상세페이지, 스틸컷", area: "서울 홍대", price: "40,000", discount: "", rating: 4.5, reviews: 67, badge: "best" as const },
  { id: 6, name: "무브 필름랩", cat: "영상", desc: "유튜브촬영, 광고영상, 인터뷰, 브이로그", area: "서울 합정", price: "60,000", discount: "20%", rating: 4.7, reviews: 45, badge: "hot" as const },
];

type Screen = "home" | "search" | "like" | "myBookings" | "detail" | "booking" | "done" | "mypage";
type Sort = "popular" | "nearby" | "reviews";

const TIMES = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export default function ConsumerApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCat, setSelectedCat] = useState("추천");
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0]);
  const [tab, setTab] = useState<"home" | "search" | "booking" | "my">("home");
  const [sort, setSort] = useState<Sort>("popular");
  const [liked, setLiked] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [selectedDate, setSelectedDate] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [mainTab, setMainTab] = useState<"촬영" | "장소대관">("촬영");

  // Filtering
  const filtered = selectedCat === "추천" ? STUDIOS : STUDIOS.filter(s => s.cat === selectedCat);

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "popular") return b.rating * b.reviews - a.rating * a.reviews;
    if (sort === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  // Search
  const searchResults = searchText
    ? STUDIOS.filter(s => s.name.includes(searchText) || s.desc.includes(searchText) || s.area.includes(searchText) || s.cat.includes(searchText))
    : STUDIOS;

  // Like toggle
  const toggleLike = (id: number) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const likedStudios = STUDIOS.filter(s => liked.includes(s.id));

  // Calculate booking hours
  const timeIdx = TIMES.indexOf(selectedTime);
  const endTime = TIMES[Math.min(timeIdx + 2, TIMES.length - 1)] || "22:00";
  const bookingPrice = parseInt(selectedStudio.price.replace(",", "")) * 2;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <Link href="/" className="text-sm text-primary mb-4 hover:underline">← 메인으로</Link>
      <h2 className="text-xl font-bold mb-6 text-gray-900">소비자 화면</h2>

      <div className="w-[375px] bg-white rounded-[40px] border-[8px] border-gray-900 overflow-hidden shadow-2xl relative" style={{ height: 780 }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-gray-900 rounded-b-2xl z-20" />

        {/* Header */}
        <div className="relative z-10 bg-white pt-10 px-4 pb-0">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => { setScreen("home"); setTab("home"); }} className="text-xl font-bold text-primary">퍼니</button>
            <div className="flex items-center gap-3">
              <button onClick={() => { setScreen("search"); setTab("search"); }} className="text-gray-400 text-lg">🔍</button>
              <button onClick={() => { setScreen("mypage"); setTab("my"); }} className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">MY</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto bg-white" style={{ height: "calc(780px - 84px - 56px)" }}>

          {/* ===== HOME ===== */}
          {screen === "home" && (
            <div>
              {/* Main Tab: 촬영 / 장소대관 */}
              <div className="border-b border-gray-100 px-4">
                <div className="flex gap-6">
                  {(["촬영", "장소대관"] as const).map(t => (
                    <button key={t} onClick={() => setMainTab(t)}
                      className={`pb-2 text-sm ${mainTab === t ? "border-b-2 border-primary text-primary font-bold" : "text-gray-400"}`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {mainTab === "장소대관" ? (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <span className="text-4xl mb-4">🏠</span>
                  <p className="text-sm font-medium text-gray-500">장소대관 서비스 준비 중</p>
                  <p className="text-xs text-gray-400 mt-1">촬영 없이 공간만 대여하는 서비스</p>
                </div>
              ) : (
                <>
                  {/* Category Icons */}
                  <div className="policy-area mx-4 mt-3 p-2">
                    <PolicyBadge label="카테고리 목록 미확정" />
                    <div className="flex gap-3 overflow-x-auto py-2 mt-1">
                      {CATEGORIES.map(c => (
                        <button key={c.name} onClick={() => setSelectedCat(c.name)}
                          className="flex flex-col items-center gap-1 min-w-[56px]">
                          <div className={`cat-circle ${selectedCat === c.name ? "active" : ""}`}>{c.icon}</div>
                          <span className={`text-[10px] ${selectedCat === c.name ? "text-primary font-bold" : "text-gray-500"}`}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex gap-2 overflow-x-auto px-4 py-3">
                    <span className="text-xs text-gray-400 whitespace-nowrap py-1">인기 키워드</span>
                    {KEYWORDS.map(k => (
                      <button key={k} onClick={() => { setSearchText(k.split(" ")[1] || k); setScreen("search"); setTab("search"); }}
                        className="keyword-pill cursor-pointer hover:bg-primary/5">{k}</button>
                    ))}
                  </div>

                  {/* Section Title + Sort */}
                  <div className="px-4 mb-2">
                    <p className="font-bold text-base mb-2">&lsquo;{selectedCat}&rsquo; 스튜디오</p>
                    <div className="flex gap-2">
                      {([
                        { key: "popular" as Sort, icon: "🔄", label: "인기순" },
                        { key: "nearby" as Sort, icon: "📍", label: "내 주변" },
                        { key: "reviews" as Sort, icon: "💬", label: "리뷰많은순" },
                      ]).map(s => (
                        <button key={s.key} onClick={() => setSort(s.key)}
                          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs border transition-all ${
                            sort === s.key ? "border-primary bg-primary/5 text-primary font-medium" : "border-gray-200 text-gray-500"
                          }`}>
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ad Banner */}
                  <div className="policy-area mx-4 mb-3 p-2">
                    <PolicyBadge label="광고 정책 미확정" />
                    <div className="bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl p-4 mt-1 text-white">
                      <p className="text-xs opacity-80">AD</p>
                      <p className="font-bold text-sm mt-1">스튜디오 상단 노출 배너</p>
                      <p className="text-xs opacity-70 mt-0.5">구좌 수 · 기간 · 과금 → 미확정</p>
                      <div className="text-right text-xs opacity-60 mt-2">1 / 5</div>
                    </div>
                  </div>

                  {/* Studio List */}
                  <div className="px-4">
                    {sorted.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-sm">해당 카테고리에 등록된 스튜디오가 없습니다</p>
                      </div>
                    ) : sorted.map(s => (
                      <button key={s.id} onClick={() => { setSelectedStudio(s); setScreen("detail"); }}
                        className="w-full flex gap-3 py-4 border-b border-gray-50 text-left">
                        <div className="relative w-[88px] h-[88px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl shrink-0">
                          📷
                          <span className={`absolute top-1 left-1 ${s.badge === "best" ? "badge-best" : "badge-hot"}`}>
                            {s.badge === "best" ? "BEST" : "HOT"}
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); toggleLike(s.id); }}
                            className="absolute top-1 right-1 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-xs">
                            {liked.includes(s.id) ? "❤️" : "🤍"}
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{s.desc}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{s.area}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            {s.discount && <span className="text-xs font-bold text-red-500">{s.discount}</span>}
                            <span className="text-sm font-bold text-gray-900">₩{s.price}</span>
                            <span className="text-xs text-gray-400">VAT 포함</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-yellow-500">★ {s.rating}</span>
                            <span className="text-xs text-gray-400">({s.reviews})</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== SEARCH ===== */}
          {screen === "search" && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <span className="text-gray-400 text-sm">🔍</span>
                  <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
                    placeholder="스튜디오, 지역, 카테고리 검색" className="bg-transparent text-sm w-full outline-none" autoFocus />
                  {searchText && <button onClick={() => setSearchText("")} className="text-gray-400 text-xs">✕</button>}
                </div>
                <button onClick={() => { setScreen("home"); setTab("home"); setSearchText(""); }} className="text-sm text-gray-400">취소</button>
              </div>

              {!searchText ? (
                <div>
                  <p className="text-xs text-gray-400 mb-3">최근 검색어</p>
                  <div className="flex flex-wrap gap-2">
                    {["프로필", "강남", "바디프로필", "웨딩"].map(k => (
                      <button key={k} onClick={() => setSearchText(k)} className="bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600">{k}</button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mb-3 mt-6">인기 검색어</p>
                  {["프로필 촬영", "바디프로필", "증명사진", "웨딩 스냅"].map((k, i) => (
                    <button key={k} onClick={() => setSearchText(k)} className="flex items-center gap-3 py-2.5 w-full text-left">
                      <span className="text-xs text-primary font-bold w-5">{i + 1}</span>
                      <span className="text-sm">{k}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-400 mb-3">&lsquo;{searchText}&rsquo; 검색 결과 {searchResults.length}건</p>
                  {searchResults.map(s => (
                    <button key={s.id} onClick={() => { setSelectedStudio(s); setScreen("detail"); }}
                      className="w-full flex gap-3 py-3 border-b border-gray-50 text-left">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">📷</div>
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.cat} · {s.area}</p>
                        <p className="text-xs font-bold text-gray-900 mt-0.5">₩{s.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== LIKE (찜) ===== */}
          {screen === "like" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">찜한 스튜디오</h2>
              {likedStudios.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-4xl mb-4">♡</span>
                  <p className="text-sm text-gray-400">아직 찜한 스튜디오가 없어요</p>
                  <p className="text-xs text-gray-300 mt-1">마음에 드는 스튜디오에 ♡를 눌러보세요</p>
                  <button onClick={() => { setScreen("home"); setTab("home"); }} className="mt-4 text-sm text-primary font-medium">스튜디오 보러가기 →</button>
                </div>
              ) : likedStudios.map(s => (
                <button key={s.id} onClick={() => { setSelectedStudio(s); setScreen("detail"); }}
                  className="w-full flex gap-3 py-3 border-b border-gray-50 text-left">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    📷
                    <button onClick={e => { e.stopPropagation(); toggleLike(s.id); }}
                      className="absolute -top-1 -right-1 text-sm">❤️</button>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.cat} · {s.area}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {s.discount && <span className="text-xs font-bold text-red-500">{s.discount}</span>}
                      <span className="text-sm font-bold">₩{s.price}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ===== DETAIL ===== */}
          {screen === "detail" && (
            <div>
              <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-6xl relative">
                📷
                <button onClick={() => { if (tab === "search") setScreen("search"); else setScreen("home"); }}
                  className="absolute top-3 left-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-sm shadow">←</button>
                <button onClick={() => toggleLike(selectedStudio.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-sm shadow">
                  {liked.includes(selectedStudio.id) ? "❤️" : "🤍"}
                </button>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-0.5">{selectedStudio.name}</h2>
                <p className="text-xs text-gray-400">{selectedStudio.area}</p>
                <div className="flex items-center gap-2 mt-1 mb-4">
                  <span className="text-xs text-yellow-500">★ {selectedStudio.rating}</span>
                  <span className="text-xs text-gray-400">리뷰 {selectedStudio.reviews}개</span>
                </div>

                {/* Price */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">촬영 가격</p>
                  <div className="flex items-center gap-2">
                    {selectedStudio.discount && <span className="text-sm font-bold text-red-500">{selectedStudio.discount}</span>}
                    <span className="text-lg font-bold">₩{selectedStudio.price}</span>
                    <span className="text-xs text-gray-400">/ 시간 · VAT 포함</span>
                  </div>
                </div>

                {/* Photos */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">포트폴리오 (최대 30장)</p>
                  <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-square bg-gray-100" />
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="policy-area mb-4 p-3">
                  <PolicyBadge label="예약 단위 미확정" />
                  <div className="mt-2">
                    {/* Mini Date Picker */}
                    <p className="text-sm font-medium mb-2">날짜 선택</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {[8,9,10,11,12,13,14].map(d => (
                        <button key={d} onClick={() => setSelectedDate(d)}
                          className={`flex flex-col items-center min-w-[44px] py-2 rounded-xl transition-all ${
                            selectedDate === d ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                          <span className="text-[10px]">{["목","금","토","일","월","화","수"][d - 8]}</span>
                          <span className="text-sm font-bold">{d}</span>
                        </button>
                      ))}
                    </div>

                    {/* Time Selection */}
                    <p className="text-sm font-medium mb-2 mt-3">시간 선택</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {TIMES.map(t => (
                        <button key={t} onClick={() => setSelectedTime(t)}
                          className={`rounded-lg py-2 text-center text-xs transition-all ${
                            selectedTime === t ? "bg-primary text-white font-bold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}>{t}</button>
                      ))}
                    </div>
                    <p className="text-[10px] text-amber-600 mt-2">1시간 단위? 반일/종일? 업체 자유설정? → 미확정</p>
                  </div>
                </div>

                {/* Reviews */}
                <div className="policy-area mb-4 p-3">
                  <PolicyBadge label="리뷰 정책 미확정" />
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">리뷰 {selectedStudio.reviews}개</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다" },
                        { name: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요" },
                      ].map((r, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{r.name}</span>
                            <span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                          </div>
                          <p className="text-xs text-gray-600">{r.text}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-amber-600 mt-2">사진 첨부 · 작성 기간 · 업체 답글 → 미확정</p>
                  </div>
                </div>

                {/* CTA */}
                <button onClick={() => setScreen("booking")}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">
                  예약하기
                </button>
              </div>
            </div>
          )}

          {/* ===== BOOKING ===== */}
          {screen === "booking" && (
            <div className="p-4">
              <button onClick={() => setScreen("detail")} className="flex items-center gap-1 text-sm text-gray-400 mb-4">← 돌아가기</button>
              <h2 className="text-lg font-bold mb-4">예약 확인</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="font-bold text-sm">{selectedStudio.name}</p>
                <p className="text-xs text-gray-400 mt-1">{selectedStudio.cat} · {selectedStudio.area}</p>
              </div>

              <div className="space-y-3 mb-4 px-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">날짜</span>
                  <span className="font-medium">2026.05.{selectedDate} ({["목","금","토","일","월","화","수"][selectedDate - 8]})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">시간</span>
                  <span className="font-medium">{selectedTime} ~ {endTime} (2시간)</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                  <span className="text-gray-500">금액</span>
                  <span className="font-bold text-primary text-base">₩{bookingPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="policy-area mb-4 p-3">
                <PolicyBadge label="취소/환불 정책 미확정" />
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs text-amber-700 font-medium">취소/환불 규칙</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                    <span>7일 전 취소</span><span className="text-amber-600 font-medium">→ ?% 환불</span>
                    <span>3일 전 취소</span><span className="text-amber-600 font-medium">→ ?% 환불</span>
                    <span>당일 취소</span><span className="text-amber-600 font-medium">→ ?% 환불</span>
                    <span>노쇼</span><span className="text-amber-600 font-medium">→ ?</span>
                  </div>
                </div>
              </div>

              <div className="policy-area mb-4 p-3">
                <PolicyBadge label="예약 확정 방식 미확정" />
                <p className="text-xs text-amber-700 mt-2">즉시 확정 vs 업체 수락 후 확정?</p>
              </div>

              <button onClick={() => setScreen("done")}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">
                결제하기 · 토스페이먼츠
              </button>
            </div>
          )}

          {/* ===== DONE ===== */}
          {screen === "done" && (
            <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 500 }}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-4">✅</div>
              <h2 className="text-lg font-bold mb-1">예약 완료!</h2>
              <p className="text-sm text-gray-500">{selectedStudio.name}</p>
              <p className="text-xs text-gray-400 mb-6">2026.05.{selectedDate} {selectedTime} ~ {endTime}</p>
              <div className="bg-primary/5 rounded-xl p-4 w-full mb-4 border border-primary/10">
                <p className="text-xs text-primary font-medium">토스페이먼츠 결제 완료</p>
                <p className="text-sm font-bold text-gray-900 mt-1">₩{bookingPrice.toLocaleString()}</p>
              </div>
              <button onClick={() => { setScreen("mypage"); setTab("my"); }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm mb-2">예약 내역 확인</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm">홈으로</button>
            </div>
          )}

          {/* ===== MY BOOKINGS (예약 탭) ===== */}
          {screen === "myBookings" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">내 예약</h2>

              <div className="flex gap-2 mb-4">
                {["예정", "완료", "취소"].map((f, i) => (
                  <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    i === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                  }`}>{f}</button>
                ))}
              </div>

              {[
                { studio: "루미에르 스튜디오", date: "2026.05.10 (토)", time: "14:00~16:00", cat: "프로필", price: "₩100,000", status: "확정" },
                { studio: "선셋 포토랩", date: "2026.05.18 (일)", time: "10:00~12:00", cat: "바디프로필", price: "₩160,000", status: "확정" },
              ].map((b, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold">{b.studio}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.cat} · {b.date}</p>
                      <p className="text-xs text-gray-400">{b.time}</p>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{b.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold">{b.price}</span>
                    <div className="flex gap-2">
                      <div className="policy-area px-2 py-1">
                        <span className="text-[10px] text-amber-700">취소 정책 미확정</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gray-50 rounded-xl p-4 mb-3 opacity-60">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold">프로덕트 랩</p>
                    <p className="text-xs text-gray-400 mt-0.5">제품 · 2026.04.20 (일)</p>
                    <p className="text-xs text-gray-400">13:00~15:00</p>
                  </div>
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-2.5 py-1 rounded-full font-medium">완료</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                  <span className="text-sm font-bold">₩80,000</span>
                  <button className="text-xs text-primary font-medium">리뷰 작성 →</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== MY PAGE ===== */}
          {screen === "mypage" && (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-2xl">👤</div>
                <div>
                  <p className="font-bold">김퍼니</p>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">💬 카카오</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">🟢 네이버</span>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-sm mb-3">예약 내역</h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">루미에르 스튜디오</p>
                    <p className="text-xs text-gray-400 mt-0.5">2026.05.10 (토) 14:00~16:00</p>
                    <p className="text-xs text-gray-400">프로필 촬영</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">확정</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">선셋 포토랩</p>
                    <p className="text-xs text-gray-400 mt-0.5">2026.04.20 (일) 10:00~12:00</p>
                    <p className="text-xs text-gray-400">바디프로필</p>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full font-medium">완료</span>
                </div>
              </div>

              {/* Business Mode Switch */}
              <Link href="/business"
                className="flex items-center justify-between w-full bg-primary/5 border border-primary/20 rounded-xl p-4 mt-2 mb-4">
                <div>
                  <p className="text-sm font-bold text-primary">업체 모드로 전환</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">스튜디오 등록·예약 관리·정산</p>
                </div>
                <span className="text-primary text-sm">→</span>
              </Link>

              <div className="space-y-0">
                {[
                  { label: "내 리뷰 관리" },
                  { label: "찜 목록", action: "like" },
                  { label: "결제 내역" },
                  { label: "알림 설정" },
                  { label: "고객센터" },
                  { label: "로그아웃" },
                ].map(m => (
                  <button key={m.label} onClick={() => { if (m.action === "like") { setScreen("like"); setTab("my"); } }}
                    className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                    <span className="text-sm">{m.label}</span>
                    <span className="text-gray-300 text-xs">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Tab - 통합 네비게이션 (홈/탐색/예약/MY) */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-100 flex items-center z-10">
          {[
            { key: "home" as const, icon: "🏠", label: "홈", s: "home" as Screen },
            { key: "search" as const, icon: "🔍", label: "탐색", s: "search" as Screen },
            { key: "booking" as const, icon: "📅", label: "예약", s: "myBookings" as Screen },
            { key: "my" as const, icon: "👤", label: "MY", s: "mypage" as Screen },
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
