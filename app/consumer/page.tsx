"use client";
import { useState, useRef } from "react";
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
  { id: 1, name: "루미에르 스튜디오", cat: "프로필", desc: "프로필촬영, 증명사진, 프로필영상, 이력서사진", area: "서울 강남구", price: "50,000", discount: "", rating: 4.8, reviews: 124, badge: "best" as const, distance: 1.2 },
  { id: 2, name: "선셋 포토랩", cat: "바디프로필", desc: "바디프로필, 커플촬영, 다이어트기록, 운동기록", area: "서울 성수동", price: "80,000", discount: "30%", rating: 4.9, reviews: 89, badge: "best" as const, distance: 3.5 },
  { id: 3, name: "블룸 웨딩 스튜디오", cat: "웨딩", desc: "웨딩스냅, 본식촬영, 야외웨딩, 스몰웨딩", area: "서울 잠실", price: "200,000", discount: "", rating: 4.7, reviews: 56, badge: "hot" as const, distance: 5.8 },
  { id: 4, name: "미니미 키즈포토", cat: "돌잔치", desc: "돌잔치촬영, 백일사진, 가족사진, 만삭촬영", area: "경기 판교", price: "120,000", discount: "15%", rating: 4.6, reviews: 34, badge: "hot" as const, distance: 15.2 },
  { id: 5, name: "프로덕트 랩", cat: "제품", desc: "제품촬영, 음식사진, 상세페이지, 스틸컷", area: "서울 홍대", price: "40,000", discount: "", rating: 4.5, reviews: 67, badge: "best" as const, distance: 2.1 },
  { id: 6, name: "무브 필름랩", cat: "영상", desc: "유튜브촬영, 광고영상, 인터뷰, 브이로그", area: "서울 합정", price: "60,000", discount: "20%", rating: 4.7, reviews: 45, badge: "hot" as const, distance: 2.8 },
];

const VENUES = [
  { id: 101, name: "스튜디오 이음", desc: "세미나, 워크샵, 소규모 행사", area: "서울 강남구", price: "30,000", rating: 4.6, reviews: 45 },
  { id: 102, name: "라운지 505", desc: "파티, 생일, 소모임", area: "서울 성수동", price: "50,000", rating: 4.8, reviews: 32 },
  { id: 103, name: "갤러리 스페이스", desc: "전시, 팝업스토어, 촬영 공간", area: "서울 홍대", price: "80,000", rating: 4.4, reviews: 28 },
  { id: 104, name: "옥상 라운지 루프", desc: "야외촬영, 루프탑 파티, 영상촬영", area: "서울 이태원", price: "100,000", rating: 4.3, reviews: 19 },
];

const AD_BANNERS = [
  { title: "프로필 촬영 특가", desc: "강남 인기 스튜디오 20% 할인", gradient: "from-violet-400 to-purple-500" },
  { title: "바디프로필 시즌", desc: "여름 맞이 바디프로필 이벤트", gradient: "from-pink-400 to-rose-500" },
  { title: "웨딩 촬영 패키지", desc: "본식+스냅 올인원 패키지", gradient: "from-amber-400 to-orange-500" },
];

const UPCOMING_BOOKINGS = [
  { studio: "루미에르 스튜디오", date: "2026.05.10 (토)", time: "14:00~16:00", cat: "프로필", price: "₩100,000", status: "확정" },
  { studio: "선셋 포토랩", date: "2026.05.18 (일)", time: "10:00~12:00", cat: "바디프로필", price: "₩160,000", status: "확정" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.05.25 (일)", time: "10:00~14:00", cat: "웨딩", price: "₩800,000", status: "대기" },
];

const COMPLETED_BOOKINGS = [
  { studio: "프로덕트 랩", date: "2026.04.20 (일)", time: "13:00~15:00", cat: "제품", price: "₩80,000", status: "완료", canReview: true },
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.05 (토)", time: "10:00~14:00", cat: "웨딩", price: "₩800,000", status: "완료", canReview: false },
  { studio: "미니미 키즈포토", date: "2026.03.22 (토)", time: "10:00~12:00", cat: "돌잔치", price: "₩240,000", status: "완료", canReview: false },
];

const CANCELLED_BOOKINGS = [
  { studio: "무브 필름랩", date: "2026.04.15 (화)", time: "15:00~17:00", cat: "영상", price: "₩120,000", status: "취소됨", reason: "소비자 취소" },
  { studio: "루미에르 스튜디오", date: "2026.03.28 (금)", time: "10:00~12:00", cat: "프로필", price: "₩100,000", status: "취소됨", reason: "업체 사유" },
];

const MY_REVIEWS_DATA = [
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.06", rating: 5, text: "정말 만족스러운 촬영이었습니다. 결과물도 훌륭해요!" },
  { studio: "미니미 키즈포토", date: "2026.03.23", rating: 4, text: "아이가 편안하게 촬영할 수 있었어요. 스태프가 친절합니다." },
  { studio: "프로덕트 랩", date: "2026.03.10", rating: 5, text: "제품 사진 퀄리티가 기대 이상이에요. 재방문 예정!" },
];

const PAYMENT_HISTORY = [
  { studio: "루미에르 스튜디오", date: "2026.05.08", amount: "₩100,000", method: "카드", status: "결제완료" },
  { studio: "선셋 포토랩", date: "2026.05.05", amount: "₩160,000", method: "카드", status: "결제완료" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.03", amount: "₩800,000", method: "카카오페이", status: "결제완료" },
  { studio: "프로덕트 랩", date: "2026.04.18", amount: "₩80,000", method: "카드", status: "결제완료" },
  { studio: "무브 필름랩", date: "2026.04.13", amount: "₩120,000", method: "카드", status: "환불완료" },
];

const ALL_MY_BOOKINGS_FOR_MYPAGE = [
  { studio: "루미에르 스튜디오", date: "2026.05.10 (토) 14:00~16:00", cat: "프로필 촬영", status: "확정" },
  { studio: "선셋 포토랩", date: "2026.05.18 (일) 10:00~12:00", cat: "바디프로필", status: "확정" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.05.25 (일) 10:00~14:00", cat: "웨딩", status: "대기" },
  { studio: "프로덕트 랩", date: "2026.04.20 (일) 13:00~15:00", cat: "제품", status: "완료" },
  { studio: "미니미 키즈포토", date: "2026.04.12 (토) 10:00~12:00", cat: "돌잔치", status: "완료" },
  { studio: "무브 필름랩", date: "2026.04.05 (토) 15:00~17:00", cat: "영상", status: "취소" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.03.22 (토) 10:00~14:00", cat: "웨딩", status: "완료" },
];

type Screen = "home" | "search" | "like" | "myBookings" | "detail" | "booking" | "done" | "mypage" | "reviewWrite" | "myReviews" | "paymentHistory";
type Sort = "popular" | "nearby" | "reviews";
type BookingFilter = "예정" | "완료" | "취소";

const TIMES = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export default function ConsumerApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [prevScreenRef, setPrevScreenRef] = useState<Screen>("home");
  const [selectedCat, setSelectedCat] = useState("추천");
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0]);
  const [tab, setTab] = useState<"home" | "search" | "booking" | "my">("home");
  const [sort, setSort] = useState<Sort>("popular");
  const [liked, setLiked] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [selectedDate, setSelectedDate] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [mainTab, setMainTab] = useState<"촬영" | "장소대관">("촬영");
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("예정");
  const [adIdx, setAdIdx] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewTarget, setReviewTarget] = useState("");
  const [myBookingPage, setMyBookingPage] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState("김퍼니");

  const touchStartX = useRef(0);

  // Navigation
  const navigate = (to: Screen) => {
    setPrevScreenRef(screen);
    setScreen(to);
  };

  const goBack = () => {
    if (screen === "home") return;
    const backMap: Record<string, { screen: Screen; tab: "home" | "search" | "booking" | "my" }> = {
      search: { screen: "home", tab: "home" },
      myBookings: { screen: "home", tab: "home" },
      mypage: { screen: "home", tab: "home" },
      detail: { screen: prevScreenRef === "search" ? "search" : "home", tab: prevScreenRef === "search" ? "search" : "home" },
      booking: { screen: "detail", tab: tab },
      done: { screen: "home", tab: "home" },
      like: { screen: "mypage", tab: "my" },
      reviewWrite: { screen: "myBookings", tab: "booking" },
      myReviews: { screen: "mypage", tab: "my" },
      paymentHistory: { screen: "mypage", tab: "my" },
    };
    const target = backMap[screen] || { screen: "home" as Screen, tab: "home" as const };
    setScreen(target.screen);
    setTab(target.tab);
  };

  // Filtering & Sorting
  const filtered = selectedCat === "추천" ? STUDIOS : STUDIOS.filter(s => s.cat === selectedCat);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "popular") return b.rating * b.reviews - a.rating * a.reviews;
    if (sort === "reviews") return b.reviews - a.reviews;
    if (sort === "nearby") return a.distance - b.distance;
    return 0;
  });

  // Search
  const searchResults = searchText
    ? STUDIOS.filter(s => s.name.includes(searchText) || s.desc.includes(searchText) || s.area.includes(searchText) || s.cat.includes(searchText))
    : STUDIOS;

  const toggleLike = (id: number) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const likedStudios = STUDIOS.filter(s => liked.includes(s.id));

  // Booking price calc
  const timeIdx = TIMES.indexOf(selectedTime);
  const endTime = TIMES[Math.min(timeIdx + 2, TIMES.length - 1)] || "22:00";
  const bookingPrice = parseInt(selectedStudio.price.replace(",", "")) * 2;

  // Ad swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setAdIdx(prev => Math.min(prev + 1, AD_BANNERS.length - 1));
    if (diff < -50) setAdIdx(prev => Math.max(prev - 1, 0));
  };

  // Mypage booking pagination
  const BOOKINGS_PER_PAGE = 3;
  const totalBookingPages = Math.ceil(ALL_MY_BOOKINGS_FOR_MYPAGE.length / BOOKINGS_PER_PAGE);
  const pagedBookings = ALL_MY_BOOKINGS_FOR_MYPAGE.slice(myBookingPage * BOOKINGS_PER_PAGE, (myBookingPage + 1) * BOOKINGS_PER_PAGE);

  // Booking filter data
  const filteredBookings = bookingFilter === "예정" ? UPCOMING_BOOKINGS : bookingFilter === "완료" ? COMPLETED_BOOKINGS : CANCELLED_BOOKINGS;

  const statusColor = (s: string) => {
    if (s === "확정" || s === "대기") return "bg-green-100 text-green-700";
    if (s === "완료") return "bg-gray-200 text-gray-500";
    if (s === "취소됨" || s === "취소") return "bg-red-100 text-red-500";
    return "bg-gray-100 text-gray-500";
  };

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
            <div className="flex items-center gap-2">
              {screen !== "home" && (
                <button onClick={goBack} className="text-gray-500 text-lg w-7 h-7 flex items-center justify-center">‹</button>
              )}
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="text-xl font-bold text-primary">퍼니</button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { navigate("search"); setTab("search"); }} className="text-gray-400 text-lg">🔍</button>
              <button onClick={() => { navigate("mypage"); setTab("my"); }} className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
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
                <div>
                  <div className="px-4 pt-4 pb-2">
                    <p className="font-bold text-base mb-1">장소대관</p>
                    <p className="text-xs text-gray-400">촬영 없이 공간만 대여하는 서비스</p>
                  </div>
                  <div className="px-4">
                    {VENUES.map(v => (
                      <div key={v.id} className="flex gap-3 py-4 border-b border-gray-50">
                        <div className="w-[88px] h-[88px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl shrink-0">🏠</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900">{v.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{v.desc}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{v.area}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="text-sm font-bold text-gray-900">₩{v.price}</span>
                            <span className="text-xs text-gray-400">/ 시간</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-yellow-500">★ {v.rating}</span>
                            <span className="text-xs text-gray-400">({v.reviews})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Category Icons - no scrollbar, touch swipe */}
                  <div className="policy-area mx-4 mt-3 p-2">
                    <PolicyBadge label="카테고리 목록 미확정" />
                    <div className="flex gap-3 overflow-x-auto py-2 mt-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                      {CATEGORIES.map(c => (
                        <button key={c.name} onClick={() => setSelectedCat(c.name)}
                          className="flex flex-col items-center gap-1 min-w-[56px]">
                          <div className={`cat-circle ${selectedCat === c.name ? "active" : ""}`}>{c.icon}</div>
                          <span className={`text-[10px] ${selectedCat === c.name ? "text-primary font-bold" : "text-gray-500"}`}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Keywords - no scrollbar */}
                  <div className="flex gap-2 overflow-x-auto px-4 py-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                    <span className="text-xs text-gray-400 whitespace-nowrap py-1">인기 키워드</span>
                    {KEYWORDS.map(k => (
                      <button key={k} onClick={() => { setSearchText(k.split(" ")[1] || k); navigate("search"); setTab("search"); }}
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

                  {/* Ad Banner - swipeable */}
                  <div className="policy-area mx-4 mb-3 p-2">
                    <PolicyBadge label="광고 정책 미확정" />
                    <div className="mt-1 overflow-hidden rounded-xl" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                      <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${adIdx * 100}%)` }}>
                        {AD_BANNERS.map((ad, i) => (
                          <div key={i} className={`min-w-full bg-gradient-to-r ${ad.gradient} rounded-xl p-4 text-white`}>
                            <p className="text-xs opacity-80">AD</p>
                            <p className="font-bold text-sm mt-1">{ad.title}</p>
                            <p className="text-xs opacity-70 mt-0.5">{ad.desc}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center gap-1.5 mt-2">
                        {AD_BANNERS.map((_, i) => (
                          <button key={i} onClick={() => setAdIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === adIdx ? "bg-primary w-4" : "bg-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Studio List - fixed: div instead of nested buttons */}
                  <div className="px-4">
                    {sorted.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-sm">해당 카테고리에 등록된 스튜디오가 없습니다</p>
                      </div>
                    ) : sorted.map(s => (
                      <div key={s.id} onClick={() => { setSelectedStudio(s); navigate("detail"); }}
                        className="w-full flex gap-3 py-4 border-b border-gray-50 text-left cursor-pointer">
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
                          <p className="text-xs text-gray-400 mt-0.5">{s.area}{sort === "nearby" ? ` · ${s.distance}km` : ""}</p>
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
                      </div>
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
                    <div key={s.id} onClick={() => { setSelectedStudio(s); navigate("detail"); }}
                      className="w-full flex gap-3 py-3 border-b border-gray-50 text-left cursor-pointer">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">📷</div>
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.cat} · {s.area}</p>
                        <p className="text-xs font-bold text-gray-900 mt-0.5">₩{s.price}</p>
                      </div>
                    </div>
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
                <div key={s.id} onClick={() => { setSelectedStudio(s); navigate("detail"); }}
                  className="w-full flex gap-3 py-3 border-b border-gray-50 text-left cursor-pointer">
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
                </div>
              ))}
            </div>
          )}

          {/* ===== DETAIL ===== */}
          {screen === "detail" && (
            <div>
              <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-6xl relative">
                📷
                <button onClick={goBack}
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

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">촬영 가격</p>
                  <div className="flex items-center gap-2">
                    {selectedStudio.discount && <span className="text-sm font-bold text-red-500">{selectedStudio.discount}</span>}
                    <span className="text-lg font-bold">₩{selectedStudio.price}</span>
                    <span className="text-xs text-gray-400">/ 시간 · VAT 포함</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">포트폴리오 (최대 30장)</p>
                  <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-square bg-gray-100" />
                    ))}
                  </div>
                </div>

                <div className="policy-area mb-4 p-3">
                  <PolicyBadge label="예약 단위 미확정" />
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">날짜 선택</p>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
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

                <button onClick={() => navigate("booking")}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">
                  예약하기
                </button>
              </div>
            </div>
          )}

          {/* ===== BOOKING ===== */}
          {screen === "booking" && (
            <div className="p-4">
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

              <button onClick={() => navigate("done")}
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
              <button onClick={() => { setScreen("myBookings"); setTab("booking"); }}
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
                {(["예정", "완료", "취소"] as BookingFilter[]).map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    bookingFilter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                  }`}>{f} {f === "예정" ? UPCOMING_BOOKINGS.length : f === "완료" ? COMPLETED_BOOKINGS.length : CANCELLED_BOOKINGS.length}</button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">해당 예약이 없습니다</p>
                </div>
              ) : filteredBookings.map((b, i) => (
                <div key={i} className={`bg-gray-50 rounded-xl p-4 mb-3 ${bookingFilter === "취소" ? "opacity-60" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold">{b.studio}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.cat} · {b.date}</p>
                      <p className="text-xs text-gray-400">{b.time}</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold">{b.price}</span>
                    {bookingFilter === "예정" && (
                      <div className="policy-area px-2 py-1">
                        <span className="text-[10px] text-amber-700">취소 정책 미확정</span>
                      </div>
                    )}
                    {bookingFilter === "완료" && "canReview" in b && b.canReview && (
                      <button onClick={() => { setReviewTarget(b.studio); setReviewRating(5); setReviewText(""); navigate("reviewWrite"); }}
                        className="text-xs text-primary font-medium">리뷰 작성 →</button>
                    )}
                    {bookingFilter === "취소" && "reason" in b && (
                      <span className="text-[10px] text-gray-400">{b.reason}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== REVIEW WRITE ===== */}
          {screen === "reviewWrite" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">리뷰 작성</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-bold">{reviewTarget}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium mb-3">별점</p>
                <div className="flex gap-2 justify-center">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className="text-3xl">
                      {star <= reviewRating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">{reviewRating}점</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium mb-2">리뷰 내용</p>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="촬영 경험을 공유해주세요"
                  className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none resize-none border border-gray-200 focus:border-primary"
                  rows={5}
                />
                <p className="text-right text-[10px] text-gray-400 mt-1">{reviewText.length}/500</p>
              </div>

              <button onClick={() => { setScreen("myBookings"); setTab("booking"); }}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">
                리뷰 등록
              </button>
            </div>
          )}

          {/* ===== MY REVIEWS ===== */}
          {screen === "myReviews" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">내 리뷰 관리</h2>

              {MY_REVIEWS_DATA.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">작성한 리뷰가 없습니다</p>
                </div>
              ) : MY_REVIEWS_DATA.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold">{r.studio}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                    </div>
                    <span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  <p className="text-xs text-gray-600">{r.text}</p>
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button className="text-[10px] text-gray-400 px-2 py-1">수정</button>
                    <button className="text-[10px] text-red-400 px-2 py-1">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== PAYMENT HISTORY ===== */}
          {screen === "paymentHistory" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">결제 내역</h2>

              {PAYMENT_HISTORY.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium">{p.studio}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.date} · {p.method}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${p.status === "환불완료" ? "text-red-500" : "text-gray-900"}`}>
                      {p.status === "환불완료" ? "-" : ""}{p.amount}
                    </p>
                    <p className={`text-[10px] ${p.status === "환불완료" ? "text-red-400" : "text-green-500"}`}>{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== MY PAGE ===== */}
          {screen === "mypage" && (
            <div className="p-4">
              {/* Profile - editable name & photo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-2xl">👤</div>
                  <button onClick={() => setIsEditingProfile(true)}
                    className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white shadow">📷</button>
                </div>
                <div className="flex-1">
                  {isEditingProfile ? (
                    <div className="flex items-center gap-2">
                      <input type="text" value={userName} onChange={e => setUserName(e.target.value)}
                        className="text-sm font-bold border-b border-primary outline-none bg-transparent w-24" autoFocus />
                      <button onClick={() => setIsEditingProfile(false)} className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-1 rounded">완료</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{userName}</p>
                      <button onClick={() => setIsEditingProfile(true)} className="text-gray-400 text-xs">✏️</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking History with Pagination */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">예약 내역</h3>
                  {totalBookingPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => setMyBookingPage(p => Math.max(0, p - 1))} disabled={myBookingPage === 0}
                        className={`text-sm ${myBookingPage === 0 ? "text-gray-300" : "text-gray-500"}`}>‹</button>
                      <span className="text-xs text-gray-400">{myBookingPage + 1}/{totalBookingPages}</span>
                      <button onClick={() => setMyBookingPage(p => Math.min(totalBookingPages - 1, p + 1))} disabled={myBookingPage === totalBookingPages - 1}
                        className={`text-sm ${myBookingPage === totalBookingPages - 1 ? "text-gray-300" : "text-gray-500"}`}>›</button>
                    </div>
                  )}
                </div>
                {pagedBookings.map((b, i) => (
                  <div key={i} className={`bg-gray-50 rounded-xl p-4 mb-2 ${b.status === "취소" ? "opacity-50" : ""}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{b.studio}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{b.date}</p>
                        <p className="text-xs text-gray-400">{b.cat}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(b.status)}`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Menu Items */}
              <div className="space-y-0">
                {[
                  { label: "내 리뷰 관리", action: () => navigate("myReviews") },
                  { label: "찜 목록", action: () => { setScreen("like"); } },
                  { label: "결제 내역", action: () => navigate("paymentHistory") },
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
        </div>

        {/* Bottom Tab */}
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
