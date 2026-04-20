"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import PolicyForm from "../components/PolicyForm";
import {
  Camera, Dumbbell, Heart, Cake, Package, Video, MoreHorizontal,
  Home, LayoutGrid, User, Bell, Phone, MapPin, Star, Pencil, Check,
  CheckCircle2, ImageIcon, Calendar, Clock
} from "lucide-react";

function PolicyBadge({ label }: { label: string }) {
  return <span className="policy-badge">⚠️ {label}</span>;
}

const CATEGORIES = [
  { name: "전체", Icon: LayoutGrid },
  { name: "프로필", Icon: Camera },
  { name: "바디프로필", Icon: Dumbbell },
  { name: "웨딩", Icon: Heart },
  { name: "돌잔치", Icon: Cake },
  { name: "제품", Icon: Package },
  { name: "영상", Icon: Video },
  { name: "기타", Icon: MoreHorizontal },
];

// 카테고리별 포트폴리오 (REQ-106: 탐색 경로의 카테고리에 맞는 사진만 표시)
type StudioCategoryPortfolio = Record<string, number[]>;

const STUDIOS: {
  id: number; name: string; cats: string[]; desc: string; area: string;
  price: number; rating: number; reviews: number; phone: string;
  createdAt: string; location: string;
  portfolios: StudioCategoryPortfolio;
}[] = [
  { id: 1, name: "루미에르 스튜디오", cats: ["프로필"], desc: "프로필촬영, 증명사진, 프로필영상, 이력서사진", area: "서울 강남구", price: 50000, rating: 4.8, reviews: 124, phone: "02-1234-5678", createdAt: "2026-04-10", location: "서울특별시 강남구 역삼동 123-4",
    portfolios: { "프로필": [1,2,3,4,5,6] } },
  { id: 2, name: "선셋 포토랩", cats: ["바디프로필"], desc: "바디프로필, 커플촬영, 다이어트기록", area: "서울 성수동", price: 80000, rating: 4.9, reviews: 89, phone: "02-2345-6789", createdAt: "2026-03-28", location: "서울특별시 성동구 성수동 45-6",
    portfolios: { "바디프로필": [1,2,3,4,5,6] } },
  { id: 3, name: "블룸 웨딩 스튜디오", cats: ["웨딩"], desc: "웨딩스냅, 본식촬영, 야외웨딩", area: "서울 잠실", price: 200000, rating: 4.7, reviews: 56, phone: "02-3456-7890", createdAt: "2026-04-05", location: "서울특별시 송파구 잠실동 78-9",
    portfolios: { "웨딩": [1,2,3,4,5,6] } },
  { id: 4, name: "미니미 키즈포토", cats: ["돌잔치"], desc: "돌잔치촬영, 백일사진, 가족사진", area: "경기 판교", price: 120000, rating: 4.6, reviews: 34, phone: "031-456-7890", createdAt: "2026-03-15", location: "경기도 성남시 분당구 판교동 12-3",
    portfolios: { "돌잔치": [1,2,3,4,5,6] } },
  { id: 5, name: "프로덕트 랩", cats: ["제품"], desc: "제품촬영, 음식사진, 상세페이지, 스틸컷", area: "서울 홍대", price: 40000, rating: 4.5, reviews: 67, phone: "02-4567-8901", createdAt: "2026-04-12", location: "서울특별시 마포구 홍대입구 45-6",
    portfolios: { "제품": [1,2,3,4,5,6] } },
  { id: 6, name: "무브 필름랩", cats: ["영상"], desc: "유튜브촬영, 광고영상, 인터뷰", area: "서울 합정", price: 60000, rating: 4.7, reviews: 45, phone: "02-5678-9012", createdAt: "2026-04-08", location: "서울특별시 마포구 합정동 78-9",
    portfolios: { "영상": [1,2,3,4,5,6] } },
];

const HAIR_MAKEUP_OPTIONS = [
  { id: 1, name: "헤어 메이크업", price: 30000 },
  { id: 2, name: "얼굴 메이크업", price: 50000 },
  { id: 3, name: "세트 (헤어+얼굴)", price: 70000 },
];

const REGIONS = ["전체", "서울 강남", "서울 성수", "서울 잠실", "서울 홍대", "서울 합정", "경기 판교"];
const PRICE_RANGES = [
  { key: "all", label: "전체", min: 0, max: Infinity },
  { key: "low", label: "5만원 이하", min: 0, max: 50000 },
  { key: "mid", label: "5~10만원", min: 50001, max: 100000 },
  { key: "high", label: "10~20만원", min: 100001, max: 200000 },
  { key: "premium", label: "20만원 이상", min: 200001, max: Infinity },
];

const BOOKED_TIMES = ["10:00", "11:00", "15:00"];

const CONSUMER_NOTIFICATIONS = [
  { id: 1, type: "booking", text: "루미에르 스튜디오 예약이 확정되었습니다", time: "10분 전", read: false },
  { id: 2, type: "remind", text: "내일 선셋 포토랩 촬영이 있습니다", time: "1시간 전", read: false },
  { id: 3, type: "review", text: "프로덕트 랩 촬영은 어떠셨나요? 리뷰를 남겨주세요", time: "3시간 전", read: true },
  { id: 4, type: "booking", text: "블룸 웨딩 스튜디오 예약이 확정되었습니다", time: "1일 전", read: true },
  { id: 5, type: "system", text: "퍼니 앱이 업데이트되었습니다", time: "3일 전", read: true },
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

type Screen = "home" | "category" | "myBookings" | "detail" | "booking" | "done" | "mypage" | "reviewWrite" | "myReviews" | "paymentHistory" | "login" | "signup" | "bizSignup" | "forgotPassword" | "notifications";
type Sort = "newest" | "rating" | "priceAsc";
type BookingFilter = "예정" | "완료" | "취소";
type Tab = "home" | "category" | "mypage";

const TIMES = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export default function ConsumerApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [prevScreenRef, setPrevScreenRef] = useState<Screen>("home");
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0]);
  const [tab, setTab] = useState<Tab>("home");
  const [sort, setSort] = useState<Sort>("newest");
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [selectedDate, setSelectedDate] = useState(10);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("예정");
  const [adIdx, setAdIdx] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewTarget, setReviewTarget] = useState("");
  const [myBookingPage, setMyBookingPage] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState("김퍼니");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [categoryCat, setCategoryCat] = useState("프로필");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [customPriceMin, setCustomPriceMin] = useState<string>("");
  const [customPriceMax, setCustomPriceMax] = useState<string>("");
  const [detailEntryCat, setDetailEntryCat] = useState<string>(""); // 탐색 진입 카테고리
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const touchStartX = useRef(0);
  const historyStack = useRef<{ s: Screen; t: Tab }[]>([]);

  const navigate = (to: Screen) => {
    historyStack.current.push({ s: screen, t: tab });
    setPrevScreenRef(screen);
    setScreen(to);
  };
  const goBack = () => {
    if (screen === "home") return;
    const prev = historyStack.current.pop();
    if (prev) {
      setScreen(prev.s);
      setTab(prev.t);
    } else {
      setScreen("home");
      setTab("home");
    }
  };

  // 홈: 지역 + 가격대 필터 + 정렬
  const homeFiltered = STUDIOS
    .filter(s => {
      if (selectedRegion === "전체" || !selectedRegion.trim()) return true;
      const kw = selectedRegion.trim().toLowerCase();
      return s.area.toLowerCase().includes(kw);
    })
    .filter(s => {
      // 커스텀 범위 우선 (원 단위)
      const cmin = customPriceMin ? parseInt(customPriceMin) : null;
      const cmax = customPriceMax ? parseInt(customPriceMax) : null;
      if (cmin !== null || cmax !== null) {
        if (cmin !== null && s.price < cmin) return false;
        if (cmax !== null && s.price > cmax) return false;
        return true;
      }
      const pr = PRICE_RANGES.find(p => p.key === selectedPriceRange);
      if (!pr) return true;
      return s.price >= pr.min && s.price <= pr.max;
    });
  const homeSorted = [...homeFiltered].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "priceAsc") return a.price - b.price;
    // newest
    return b.createdAt.localeCompare(a.createdAt);
  });

  // 카테고리 탭: 카테고리 + 지역
  const catFiltered = STUDIOS
    .filter(s => categoryCat === "전체" || s.cats.includes(categoryCat))
    .filter(s => {
      if (selectedRegion === "전체" || !selectedRegion.trim()) return true;
      const kw = selectedRegion.trim().toLowerCase();
      return s.area.toLowerCase().includes(kw);
    });

  const toggleOption = (id: number) => setSelectedOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const timeIdx = TIMES.indexOf(selectedTime);
  const endTime = TIMES[Math.min(timeIdx + 2, TIMES.length - 1)] || "22:00";
  const basePrice = selectedStudio.price * 2;
  const optionsTotal = selectedOptions.reduce((sum, id) => sum + (HAIR_MAKEUP_OPTIONS.find(o => o.id === id)?.price || 0), 0);
  const totalPrice = basePrice + optionsTotal;

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setAdIdx(prev => Math.min(prev + 1, 2));
    if (diff < -50) setAdIdx(prev => Math.max(prev - 1, 0));
  };

  const BOOKINGS_PER_PAGE = 3;
  const totalBookingPages = Math.ceil(ALL_MY_BOOKINGS_FOR_MYPAGE.length / BOOKINGS_PER_PAGE);
  const pagedBookings = ALL_MY_BOOKINGS_FOR_MYPAGE.slice(myBookingPage * BOOKINGS_PER_PAGE, (myBookingPage + 1) * BOOKINGS_PER_PAGE);
  const filteredBookings = bookingFilter === "예정" ? UPCOMING_BOOKINGS : bookingFilter === "완료" ? COMPLETED_BOOKINGS : CANCELLED_BOOKINGS;

  const statusColor = (s: string) => {
    if (s === "확정" || s === "대기") return "bg-green-100 text-green-700";
    if (s === "완료") return "bg-gray-200 text-gray-500";
    return "bg-red-100 text-red-500";
  };

  // 상세 화면에서 표시할 포트폴리오 (IA-012: 카테고리별 갤러리)
  const detailPortfolio = (() => {
    if (detailEntryCat && selectedStudio.portfolios[detailEntryCat]) {
      return { cat: detailEntryCat, photos: selectedStudio.portfolios[detailEntryCat] };
    }
    const firstCat = selectedStudio.cats[0];
    return { cat: firstCat, photos: selectedStudio.portfolios[firstCat] || [] };
  })();

  const authScreens: Screen[] = ["login", "signup", "bizSignup", "forgotPassword"];
  const showHeader = !authScreens.includes(screen);

  const openDetail = (s: typeof STUDIOS[0], fromCat?: string) => {
    setSelectedStudio(s);
    setSelectedOptions([]);
    setDetailEntryCat(fromCat || "");
    navigate("detail");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <Link href="/" className="text-sm text-primary mb-4 hover:underline">← 메인으로</Link>
      <h2 className="text-xl font-bold mb-6 text-gray-900">소비자 화면</h2>

      <div className="w-[375px] bg-white rounded-[40px] border-[8px] border-gray-900 overflow-hidden shadow-2xl relative" style={{ height: 780 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-gray-900 rounded-b-2xl z-20" />

        {/* Header */}
        {showHeader && (
          <div className="relative z-10 bg-white pt-10 pl-2 pr-4 pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {screen !== "home" && <button onClick={goBack} className="text-gray-500 text-lg flex items-center justify-center -mr-1">‹</button>}
                <button onClick={() => { setScreen("home"); setTab("home"); }} className="flex items-center">
                  <img src="/funni-logo.png" alt="퍼니" className="w-12 h-12" />
                  <span className="text-xl font-bold text-primary -ml-1.5">퍼니</span>
                </button>
              </div>
              <button onClick={() => navigate("notifications")} className="text-gray-500 relative p-1">
                <Bell size={20} strokeWidth={1.5} />
                {CONSUMER_NOTIFICATIONS.some(n => !n.read) && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto bg-white" style={{ height: showHeader ? "calc(780px - 84px - 56px)" : "calc(780px - 28px - 56px)" }}>

          {/* ===== HOME (IA-010) ===== */}
          {screen === "home" && (
            <div>
              {/* 프리미엄 영역 — 광고 스튜디오 (REQ-112) */}
              <div className="policy-area mx-4 mt-3 p-2">
                <PolicyBadge label="광고 세부 규칙 미확정" />
                <div className="mt-1 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${adIdx * 100}%)` }}>
                    {STUDIOS.slice(0, 3).map((s, i) => (
                      <div key={i} onClick={() => openDetail(s)} className="min-w-full cursor-pointer">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 flex gap-3 items-center relative">
                          <span className="absolute top-2 left-2 bg-primary/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">AD</span>
                          <div className="w-16 h-16 bg-white/60 rounded-lg flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={24} strokeWidth={1.5} /></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{s.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{s.cats.join(", ")} · {s.area}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs font-bold">₩{s.price.toLocaleString()}</span>
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
                <PolicyForm question="프리미엄 영역 구좌 수는?" screen="소비자" area="광고 구좌 수" />
                <PolicyForm question="광고 노출 기간 단위는? (주간 / 월간 / 건별)" screen="소비자" area="광고 기간 단위" />
                <PolicyForm question="광고 과금 방식은? (고정가 / 입찰)" screen="소비자" area="광고 과금 방식" />
                <PolicyForm question="배너 노출 순서는? (로테이션 / 고정)" screen="소비자" area="배너 노출 순서" />
              </div>

              {/* Filters + Sort (REQ-106) */}
              <div className="px-4 mt-3 mb-2">
                <p className="font-bold text-base mb-2">추천 스튜디오</p>
                {/* 정렬: 최신등록순 · 평점순 · 가격순 */}
                <div className="flex gap-2 mb-2">
                  {([
                    { key: "newest" as Sort, label: "최신등록순" },
                    { key: "rating" as Sort, label: "평점순" },
                    { key: "priceAsc" as Sort, label: "가격 낮은순" },
                  ]).map(s => (
                    <button key={s.key} onClick={() => setSort(s.key)}
                      className={`rounded-full px-3 py-1.5 text-xs border transition-all ${sort === s.key ? "border-primary bg-primary/5 text-primary font-medium" : "border-gray-200 text-gray-500"}`}>{s.label}</button>
                  ))}
                </div>
                {/* 지역 검색 */}
                <div className="mb-1.5">
                  <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                    <MapPin size={12} strokeWidth={1.5} className="text-gray-400" />
                    <input type="text" value={selectedRegion === "전체" ? "" : selectedRegion} onChange={e => setSelectedRegion(e.target.value || "전체")}
                      placeholder="지역 검색 (예: 잠실)" className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-gray-400" />
                    {selectedRegion !== "전체" && (
                      <button onClick={() => setSelectedRegion("전체")} className="text-gray-400 text-xs">✕</button>
                    )}
                  </div>
                </div>
                {/* 가격대 필터 (칩 + 오른쪽에 커스텀 입력) */}
                <div className="flex gap-1.5 overflow-x-auto items-center" style={{ scrollbarWidth: 'none' }}>
                  {PRICE_RANGES.map(p => (
                    <button key={p.key} onClick={() => { setSelectedPriceRange(p.key); setCustomPriceMin(""); setCustomPriceMax(""); }}
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] border transition-all shrink-0 ${selectedPriceRange === p.key && !customPriceMin && !customPriceMax ? "border-primary bg-primary/5 text-primary font-medium" : "border-gray-100 text-gray-400 bg-gray-50"}`}>💰 {p.label}</button>
                  ))}
                  {/* 커스텀 범위 입력 */}
                  <div className={`flex items-center gap-0.5 text-[10px] shrink-0 rounded-full border transition-all ${customPriceMin || customPriceMax ? "border-primary bg-primary/5 text-primary" : "border-gray-100 bg-gray-50 text-gray-400"} px-2 py-0.5`}>
                    <input type="number" placeholder="최소" value={customPriceMin} onChange={e => setCustomPriceMin(e.target.value)}
                      className="w-10 bg-transparent outline-none text-right" />
                    <span>원</span>
                    <span className="mx-0.5">~</span>
                    <input type="number" placeholder="최대" value={customPriceMax} onChange={e => setCustomPriceMax(e.target.value)}
                      className="w-10 bg-transparent outline-none text-right" />
                    <span>원</span>
                    {(customPriceMin || customPriceMax) && (
                      <button onClick={() => { setCustomPriceMin(""); setCustomPriceMax(""); }} className="ml-0.5">✕</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Studio List */}
              <div className="px-4">
                {homeSorted.length === 0 ? (
                  <div className="text-center py-12"><p className="text-gray-400 text-sm">조건에 맞는 스튜디오가 없습니다</p></div>
                ) : homeSorted.map(s => (
                  <div key={s.id} onClick={() => openDetail(s)}
                    className="w-full flex gap-3 py-4 border-b border-gray-50 cursor-pointer">
                    <div className="w-[88px] h-[88px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={28} strokeWidth={1.5} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{s.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.area}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-sm font-bold text-gray-900">₩{s.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">/ 시간 · VAT 포함</span>
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
              <div className="policy-area p-2 mb-4">
                <PolicyBadge label="카테고리 목록 미확정" />
                <div className="grid grid-cols-4 gap-2 mt-2">
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
                <PolicyForm question="상세 카테고리 목록을 확정해주세요. (웨딩/프로필/피아노 등 대략적 방향만 논의됨)" screen="소비자" area="카테고리 목록" />
              </div>

              {/* 지역 검색 */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-2 border border-gray-100">
                  <MapPin size={13} strokeWidth={1.5} className="text-gray-400" />
                  <input type="text" value={selectedRegion === "전체" ? "" : selectedRegion} onChange={e => setSelectedRegion(e.target.value || "전체")}
                    placeholder="지역 검색 (예: 잠실, 강남)" className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400" />
                  {selectedRegion !== "전체" && (
                    <button onClick={() => setSelectedRegion("전체")} className="text-gray-400 text-xs">✕</button>
                  )}
                </div>
              </div>

              <p className="text-sm font-bold mb-3">&lsquo;{categoryCat}&rsquo; 스튜디오 {catFiltered.length}곳</p>

              {/* 스튜디오 리스트 상단 광고 배너 (REQ-113) */}
              <div className="mb-3 overflow-hidden rounded-xl">
                <div className="bg-gradient-to-r from-violet-100 to-purple-200 rounded-xl p-4 flex items-center gap-3 relative">
                  <span className="absolute top-2 left-2 bg-primary/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">AD</span>
                  <div className="w-14 h-14 bg-white/60 rounded-lg flex items-center justify-center shrink-0 text-gray-400"><ImageIcon size={22} strokeWidth={1.5} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">카테고리별 추천 배너</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">관리자가 등록한 광고 배너 영역</p>
                  </div>
                </div>
              </div>

              {catFiltered.map(s => (
                <div key={s.id} onClick={() => openDetail(s, categoryCat)}
                  className="flex gap-3 py-3 border-b border-gray-50 cursor-pointer">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={22} strokeWidth={1.5} /></div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.cats.join(", ")} · {s.area}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold">₩{s.price.toLocaleString()}</span>
                      <span className="text-xs text-yellow-500">★ {s.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== DETAIL (IA-012) ===== */}
          {screen === "detail" && (
            <div>
              <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative text-gray-400">
                <ImageIcon size={56} strokeWidth={1} />
                <button onClick={goBack} className="absolute top-3 left-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-sm shadow text-gray-700">‹</button>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-0.5">{selectedStudio.name}</h2>
                <p className="text-xs text-gray-400">{selectedStudio.area}</p>
                <div className="flex items-center gap-2 mt-1 mb-4">
                  <span className="text-xs text-yellow-500">★ {selectedStudio.rating}</span>
                  <span className="text-xs text-gray-400">리뷰 {selectedStudio.reviews}개</span>
                </div>

                {/* 가격표 (VAT 포함) */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">촬영 가격</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₩{selectedStudio.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">/ 시간 · VAT 포함</span>
                  </div>
                </div>

                {/* 헤어/메이크업 옵션 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">헤어 / 메이크업 옵션</p>
                  <div className="space-y-2">
                    {HAIR_MAKEUP_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => toggleOption(opt.id)}
                        className={`w-full flex justify-between items-center p-3 rounded-lg border text-left transition-all ${selectedOptions.includes(opt.id) ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedOptions.includes(opt.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                            {selectedOptions.includes(opt.id) && <Check size={10} strokeWidth={3} className="text-white" />}
                          </span>
                          <span className="text-sm">{opt.name}</span>
                        </div>
                        <span className="text-sm font-medium">+₩{opt.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 카테고리별 포트폴리오 (IA-012 / REQ-106) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500 font-medium">{detailPortfolio.cat} 포트폴리오</p>
                    <span className="text-[10px] text-gray-400">최대 30장</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                    {detailPortfolio.photos.map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={20} strokeWidth={1} /></div>
                    ))}
                  </div>
                </div>

                {/* 위치 (지도) - REQ-106 */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">위치</p>
                  <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <div className="h-32 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      <MapPin size={32} strokeWidth={1.5} className="text-primary z-10" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-gray-700">{selectedStudio.location}</p>
                      <a href={`tel:${selectedStudio.phone}`} className="flex items-center gap-1 text-[10px] text-primary mt-1">
                        <Phone size={12} strokeWidth={1.5} /> {selectedStudio.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Reviews (IA-031) */}
                <div className="policy-area mb-4 p-3">
                  <PolicyBadge label="리뷰 세부 규칙 미확정" />
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">리뷰 {selectedStudio.reviews}개</p>
                    <div className="space-y-2">
                      {[{ name: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다" }, { name: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요" }].map((r, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium">{r.name}</span><span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div>
                          <p className="text-xs text-gray-600">{r.text}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-amber-600 mt-2">작성 기간 · 사진 첨부 · 수정/삭제 · 글자 수 제한 → 미확정</p>
                    <PolicyForm question="리뷰 작성 가능 기간은? (촬영 후 며칠 이내?)" screen="소비자" area="리뷰 작성 기간" />
                    <PolicyForm question="리뷰에 사진 첨부 가능한가요? 개수는?" screen="소비자" area="리뷰 사진 첨부" />
                    <PolicyForm question="리뷰 수정/삭제가 가능한가요?" screen="소비자" area="리뷰 수정/삭제" />
                    <PolicyForm question="리뷰 최소/최대 글자 수는?" screen="소비자" area="리뷰 글자 수" />
                  </div>
                </div>

                {/* 예약 세부 규칙 미확정 (REQ-107 보완) */}
                <div className="policy-area mb-4 p-3">
                  <PolicyBadge label="예약 세부 규칙 미확정" />
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">날짜 선택</p>
                    {/* 월간 캘린더 뷰 */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-center mb-2">2026년 5월</p>
                      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-gray-400 mb-1">
                        {["일","월","화","수","목","금","토"].map(d => <div key={d}>{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-0.5 text-center">
                        {/* 5월 1일 = 금요일 → 앞에 빈칸 5개 */}
                        {Array.from({ length: 5 }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: 31 }).map((_, i) => {
                          const day = i + 1;
                          const isAvailable = [5, 10, 11, 13, 15, 18, 20, 25].includes(day);
                          return (
                            <button key={day} onClick={() => setSelectedDate(day)}
                              className={`py-1 rounded text-[11px] transition-all ${selectedDate === day ? (isAvailable ? "bg-primary text-white font-bold" : "bg-gray-300 text-gray-500 font-bold") : isAvailable ? "bg-primary/10 text-primary font-medium" : "text-gray-400 hover:bg-gray-100"}`}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-3 mt-2 text-[9px] text-gray-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full" /> 선택됨</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary/20 rounded-full" /> 예약 가능</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-2 mt-3">시간 선택</p>
                    {(() => {
                      const isDateAvailable = [5, 10, 11, 13, 15, 18, 20, 25].includes(selectedDate);
                      return (
                        <>
                          {!isDateAvailable && (
                            <p className="text-[10px] text-red-500 mb-1.5">⚠ 선택한 날짜는 예약 불가입니다. 다른 날짜를 선택해주세요.</p>
                          )}
                          <div className="grid grid-cols-4 gap-1.5">
                            {TIMES.map(t => {
                              const booked = BOOKED_TIMES.includes(t);
                              const disabled = !isDateAvailable || booked;
                              return (
                                <button key={t} onClick={() => !disabled && setSelectedTime(t)} disabled={disabled}
                                  className={`rounded-lg py-2 text-center text-xs transition-all ${disabled ? "bg-gray-200 text-gray-300 line-through cursor-not-allowed" : selectedTime === t ? "bg-primary text-white font-bold" : "bg-gray-100 text-gray-600"}`}>{t}</button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                    <p className="text-[10px] text-amber-600 mt-2">최소 예약 단위 · 예약 가능 기간 · 당일 예약 · 버퍼 시간 → 미확정</p>
                    <PolicyForm question="최소 예약 단위는? (1시간 / 30분 / 업체 자유)" screen="소비자" area="최소 예약 단위" />
                    <PolicyForm question="예약 가능 기간은? (며칠 전부터 예약 가능?)" screen="소비자" area="예약 가능 기간" />
                    <PolicyForm question="당일 예약 가능한가요?" screen="소비자" area="당일 예약" />
                    <PolicyForm question="예약 간 버퍼 시간은? (청소/준비 시간)" screen="소비자" area="예약 버퍼 시간" />
                  </div>
                </div>

                {/* CTA: 예약 + 문의(전화) */}
                <div className="flex gap-2">
                  <a href={`tel:${selectedStudio.phone}`} className="flex items-center justify-center w-14 h-12 border border-gray-300 rounded-xl text-gray-500 shrink-0">
                    <Phone size={18} strokeWidth={1.5} />
                  </a>
                  <button onClick={() => navigate("booking")} className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-sm">예약하기</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== BOOKING (IA-020) ===== */}
          {screen === "booking" && (
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">예약 확인</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="font-bold text-sm">{selectedStudio.name}</p>
                <p className="text-xs text-gray-400 mt-1">{selectedStudio.cats.join(", ")} · {selectedStudio.area}</p>
              </div>
              <div className="space-y-3 mb-4 px-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">날짜</span><span className="font-medium">2026.05.{selectedDate} ({["목","금","토","일","월","화","수"][selectedDate - 8]})</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">시간</span><span className="font-medium">{selectedTime} ~ {endTime} (2시간)</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">촬영 비용</span><span className="font-medium">₩{basePrice.toLocaleString()}</span></div>
                {selectedOptions.length > 0 && selectedOptions.map(id => {
                  const opt = HAIR_MAKEUP_OPTIONS.find(o => o.id === id);
                  return opt ? <div key={id} className="flex justify-between text-sm"><span className="text-gray-500">{opt.name}</span><span className="font-medium">+₩{opt.price.toLocaleString()}</span></div> : null;
                })}
                <div className="flex justify-between text-sm border-t border-gray-100 pt-3"><span className="text-gray-500 font-bold">총 금액</span><span className="font-bold text-primary text-base">₩{totalPrice.toLocaleString()}</span></div>
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
                <PolicyForm question="예약 취소/환불 정책을 확정해주세요. (취소 수수료, 환불 기준 등)" screen="소비자" area="취소/환불 정책" />
              </div>
              <button onClick={() => navigate("done")} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">결제하기 · 토스페이먼츠</button>
            </div>
          )}

          {/* ===== DONE (IA-022) ===== */}
          {screen === "done" && (
            <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 500 }}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary"><CheckCircle2 size={48} strokeWidth={1.5} /></div>
              <h2 className="text-lg font-bold mb-1">예약 완료!</h2>
              <p className="text-sm text-gray-500">{selectedStudio.name}</p>
              <p className="text-xs text-gray-400 mb-6">2026.05.{selectedDate} {selectedTime} ~ {endTime}</p>
              <div className="bg-primary/5 rounded-xl p-4 w-full mb-4 border border-primary/10">
                <p className="text-xs text-primary font-medium">토스페이먼츠 결제 완료</p>
                <p className="text-sm font-bold text-gray-900 mt-1">₩{totalPrice.toLocaleString()}</p>
              </div>
              <button onClick={() => { setScreen("myBookings"); setTab("mypage"); }} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm mb-2">예약 내역 확인</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm">홈으로</button>
            </div>
          )}

          {/* ===== MY BOOKINGS (IA-023/051) ===== */}
          {screen === "myBookings" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">내 예약</h2>
              <div className="flex gap-2 mb-4">
                {(["예정", "완료", "취소"] as BookingFilter[]).map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${bookingFilter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{f} {f === "예정" ? UPCOMING_BOOKINGS.length : f === "완료" ? COMPLETED_BOOKINGS.length : CANCELLED_BOOKINGS.length}</button>
                ))}
              </div>
              {filteredBookings.length === 0 ? <div className="text-center py-12"><p className="text-gray-400 text-sm">해당 예약이 없습니다</p></div> : filteredBookings.map((b, i) => (
                <div key={i} className={`bg-gray-50 rounded-xl p-4 mb-3 ${bookingFilter === "취소" ? "opacity-60" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="text-sm font-bold">{b.studio}</p><p className="text-xs text-gray-400 mt-0.5">{b.cat} · {b.date}</p><p className="text-xs text-gray-400">{b.time}</p></div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold">{b.price}</span>
                    {bookingFilter === "예정" && <div className="policy-area px-2 py-1"><span className="text-[10px] text-amber-700">⚠️ 취소 정책 미확정</span></div>}
                    {bookingFilter === "완료" && (b as { canReview?: boolean }).canReview && (
                      <button onClick={() => { setReviewTarget(b.studio); setReviewRating(5); setReviewText(""); navigate("reviewWrite"); }} className="text-xs text-primary font-medium">리뷰 작성 →</button>
                    )}
                    {bookingFilter === "취소" && <span className="text-[10px] text-gray-400">{(b as { reason?: string }).reason}</span>}
                  </div>
                </div>
              ))}
              {/* 취소/환불 정책 미확정 — REQ-108, 미확정 항목 */}
              <div className="policy-area mt-4 p-3">
                <PolicyBadge label="취소/환불 정책 미확정" />
                <PolicyForm question="예약 취소 시 환불 기준은? (7일 전/3일 전/당일/노쇼 각각 환불율)" screen="소비자" area="취소/환불 정책" />
                <PolicyForm question="취소 수수료 부과 기준은? (업체/소비자 귀책 구분)" screen="소비자" area="취소 수수료" />
                <PolicyForm question="환불 처리 소요 기간은? (PG사 환불 프로세스)" screen="소비자" area="환불 처리 기간" />
              </div>
            </div>
          )}

          {/* ===== REVIEW WRITE (IA-030) ===== */}
          {screen === "reviewWrite" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">리뷰 작성</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-sm font-bold">{reviewTarget}</p></div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">별점</p>
                <div className="flex gap-2 justify-center">{[1,2,3,4,5].map(star => <button key={star} onClick={() => setReviewRating(star)} className="text-3xl">{star <= reviewRating ? "★" : "☆"}</button>)}</div>
                <p className="text-center text-xs text-gray-400 mt-2">{reviewRating}점</p>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">리뷰 내용</p>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="촬영 경험을 공유해주세요" className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none resize-none border border-gray-200 focus:border-primary" rows={5} />
                <p className="text-right text-[10px] text-gray-400 mt-1">{reviewText.length}/500</p>
              </div>
              <button onClick={() => { setScreen("myBookings"); setTab("mypage"); }} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">리뷰 등록</button>
            </div>
          )}

          {/* ===== MY REVIEWS (IA-053) ===== */}
          {screen === "myReviews" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">내 리뷰 관리</h2>
              {MY_REVIEWS_DATA.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start mb-2"><div><p className="text-sm font-bold">{r.studio}</p><p className="text-xs text-gray-400 mt-0.5">{r.date}</p></div><span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div>
                  <p className="text-xs text-gray-600">{r.text}</p>
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100"><button className="text-[10px] text-gray-400 px-2 py-1">수정</button><button className="text-[10px] text-red-400 px-2 py-1">삭제</button></div>
                </div>
              ))}
            </div>
          )}

          {/* ===== PAYMENT HISTORY (IA-052) ===== */}
          {screen === "paymentHistory" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">결제 내역</h2>
              {PAYMENT_HISTORY.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-gray-50">
                  <div><p className="text-sm font-medium">{p.studio}</p><p className="text-xs text-gray-400 mt-0.5">{p.date} · {p.method}</p></div>
                  <div className="text-right"><p className={`text-sm font-bold ${p.status === "환불완료" ? "text-red-500" : "text-gray-900"}`}>{p.status === "환불완료" ? "-" : ""}{p.amount}</p><p className={`text-[10px] ${p.status === "환불완료" ? "text-red-400" : "text-green-500"}`}>{p.status}</p></div>
                </div>
              ))}
            </div>
          )}

          {/* ===== MY PAGE (IA-050) ===== */}
          {screen === "mypage" && (
            <div className="p-4">
              {/* 프로필 편집 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary"><User size={26} strokeWidth={1.5} /></div>
                  <button onClick={() => setIsEditingProfile(true)} className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow"><Camera size={11} strokeWidth={2} /></button>
                </div>
                <div className="flex-1">
                  {isEditingProfile ? (
                    <div className="flex items-center gap-2"><input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="text-sm font-bold border-b border-primary outline-none bg-transparent w-24" autoFocus /><button onClick={() => setIsEditingProfile(false)} className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-1 rounded">완료</button></div>
                  ) : (<div className="flex items-center gap-2"><p className="font-bold">{userName}</p><button onClick={() => setIsEditingProfile(true)} className="text-gray-400"><Pencil size={12} strokeWidth={1.5} /></button></div>)}
                </div>
              </div>

              {/* 예약 내역 with pagination */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">예약 내역</h3>
                  {totalBookingPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => setMyBookingPage(p => Math.max(0, p - 1))} disabled={myBookingPage === 0} className={`text-sm ${myBookingPage === 0 ? "text-gray-300" : "text-gray-500"}`}>‹</button>
                      <span className="text-xs text-gray-400">{myBookingPage + 1}/{totalBookingPages}</span>
                      <button onClick={() => setMyBookingPage(p => Math.min(totalBookingPages - 1, p + 1))} disabled={myBookingPage === totalBookingPages - 1} className={`text-sm ${myBookingPage === totalBookingPages - 1 ? "text-gray-300" : "text-gray-500"}`}>›</button>
                    </div>
                  )}
                </div>
                {pagedBookings.map((b, i) => (
                  <div key={i} className={`bg-gray-50 rounded-xl p-4 mb-2 ${b.status === "취소" ? "opacity-50" : ""}`}>
                    <div className="flex justify-between items-start"><div><p className="text-sm font-medium">{b.studio}</p><p className="text-xs text-gray-400 mt-0.5">{b.date}</p><p className="text-xs text-gray-400">{b.cat}</p></div><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(b.status)}`}>{b.status}</span></div>
                  </div>
                ))}
              </div>

              <div className="space-y-0">
                {[
                  { label: "내 예약 내역", action: () => navigate("myBookings") },
                  { label: "내 리뷰 관리", action: () => navigate("myReviews") },
                  { label: "결제 내역", action: () => navigate("paymentHistory") },
                  { label: "고객센터", action: () => {} },
                  { label: "로그아웃", action: () => navigate("login") },
                ].map(m => (
                  <button key={m.label} onClick={m.action} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                    <span className="text-sm">{m.label}</span><span className="text-gray-300 text-xs">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== LOGIN (IA-003) ===== */}
          {screen === "login" && (
            <div className="p-6 pt-16 flex flex-col items-center">
              <p className="text-3xl font-bold text-primary mb-2">퍼니</p>
              <p className="text-xs text-gray-400 mb-10">스튜디오 대관·예약 플랫폼</p>

              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2">💬 카카오로 시작하기</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-bold text-sm mb-6 flex items-center justify-center gap-2">🟢 네이버로 시작하기</button>

              <div className="flex items-center gap-4 w-full mb-6">
                <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">또는</span><div className="flex-1 h-px bg-gray-200" />
              </div>

              <input type="email" placeholder="이메일" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 mb-2" />
              <input type="password" placeholder="비밀번호" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 mb-4" />
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mb-4">로그인</button>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <button onClick={() => navigate("signup")}>회원가입</button>
                <span>|</span>
                <button onClick={() => navigate("forgotPassword")}>비밀번호 찾기</button>
              </div>

              <div className="mt-8 w-full">
                <button onClick={() => navigate("bizSignup")} className="w-full border border-primary text-primary py-3 rounded-xl font-medium text-sm">🏢 업체 회원가입</button>
              </div>
            </div>
          )}

          {/* ===== SIGNUP (IA-001) ===== */}
          {screen === "signup" && (
            <div className="p-6 pt-16">
              <h2 className="text-lg font-bold mb-1">회원가입</h2>
              <p className="text-xs text-gray-400 mb-6">소비자 계정</p>

              <div className="policy-area p-3 mb-4">
                <PolicyBadge label="회원 세부 규칙 미확정" />
                <PolicyForm question="닉네임 중복 허용 여부는?" screen="소비자" area="닉네임 중복" />
                <PolicyForm question="닉네임 변경 가능한가요? (빈도 제한 포함)" screen="소비자" area="닉네임 변경" />
                <PolicyForm question="탈퇴 시 개인정보·예약 이력·리뷰는 어떻게 처리?" screen="소비자" area="탈퇴 데이터 처리" />
              </div>

              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-gray-500 mb-1">이름</p><input type="text" placeholder="홍길동" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">닉네임 (앱 내 표시)</p><input type="text" placeholder="퍼니유저" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">이메일</p><input type="email" placeholder="email@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">비밀번호</p><input type="password" placeholder="8자 이상" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
              </div>

              {/* 약관 동의 (REQ-101) */}
              <div className="space-y-2 mb-4 bg-gray-50 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="w-4 h-4 accent-[#7C3AED]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 서비스 이용약관 동의</span>
                  <span className="text-[10px] text-gray-400 underline">보기</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} className="w-4 h-4 accent-[#7C3AED]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 개인정보 처리방침 동의</span>
                  <span className="text-[10px] text-gray-400 underline">보기</span>
                </label>
              </div>

              <p className="text-xs text-gray-400 mb-3">또는 SNS로 가입</p>
              <button className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm mb-2">💬 카카오로 가입</button>
              <button className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-bold text-sm mb-6">🟢 네이버로 가입</button>

              <button onClick={() => { if (agreeTerms && agreePrivacy) { setScreen("home"); setTab("home"); } }} disabled={!agreeTerms || !agreePrivacy}
                className={`w-full py-3 rounded-xl font-bold text-sm ${agreeTerms && agreePrivacy ? "bg-primary text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>가입 완료</button>
            </div>
          )}

          {/* ===== BIZ SIGNUP (IA-002) ===== */}
          {screen === "bizSignup" && (
            <div className="p-6 pt-16">
              <h2 className="text-lg font-bold mb-1">업체 회원가입</h2>
              <p className="text-xs text-gray-400 mb-6">사업자 계정 · 승인 후 이용 가능</p>

              <div className="policy-area p-3 mb-4">
                <PolicyBadge label="업체 입점 세부 규칙 미확정" />
                <PolicyForm question="승인 거절 시 사유 전달 방식은? (이메일 / 앱 알림)" screen="소비자" area="업체 승인 거절 사유 전달" />
                <PolicyForm question="재신청 규칙은? (횟수 제한, 대기 기간)" screen="소비자" area="업체 재신청 규칙" />
              </div>


              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-gray-500 mb-1">업체명</p><input type="text" placeholder="스튜디오명" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">대표자명</p><input type="text" placeholder="홍길동" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">사업자등록번호</p><input type="text" placeholder="000-00-00000" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">연락처</p><input type="tel" placeholder="02-0000-0000" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">이메일</p><input type="email" placeholder="biz@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">비밀번호</p><input type="password" placeholder="8자 이상" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">스튜디오/작업물 사진 업로드</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300"><span className="text-xl text-gray-400">+</span></div>
                  {[1,2,3].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl" />)}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">심사 시 활용됩니다</p>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-2 mb-4 bg-gray-50 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#7C3AED]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 서비스 이용약관 동의</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#7C3AED]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 개인정보 처리방침 동의</span>
                </label>
              </div>

              <button onClick={() => { setScreen("login"); }} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm mb-3">가입 신청</button>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 mb-1">📋 승인 안내</p>
                <div className="space-y-1 text-[10px] text-amber-600">
                  <p>• 심사는 2~3일 소요될 수 있습니다</p>
                  <p>• 전화 확인이 진행될 수 있으니 전화를 받아주세요</p>
                  <p>• 결과는 등록하신 이메일로 안내됩니다</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== FORGOT PASSWORD (IA-004) ===== */}
          {screen === "forgotPassword" && (
            <div className="p-6 pt-16">
              <h2 className="text-lg font-bold mb-1">비밀번호 찾기</h2>
              <p className="text-xs text-gray-400 mb-8">가입 시 사용한 이메일로 재설정 링크를 발송합니다</p>
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-1">이메일</p>
                <input type="email" placeholder="email@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" />
              </div>
              <button onClick={goBack} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm mb-4">비밀번호 재설정 링크 발송</button>
              <p className="text-center text-[10px] text-gray-400">입력한 이메일로 비밀번호 재설정 링크가 전송됩니다</p>
            </div>
          )}

          {/* ===== NOTIFICATIONS (IA-040) ===== */}
          {screen === "notifications" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">알림</h2>
              {CONSUMER_NOTIFICATIONS.map(n => {
                const IconComp = n.type === "booking" ? Calendar : n.type === "remind" ? Clock : n.type === "review" ? Star : Bell;
                return (
                  <div key={n.id} className={`flex gap-3 py-3.5 border-b border-gray-50 ${n.read ? "opacity-60" : ""}`}>
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                      <IconComp size={16} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Tab — IA: 홈/카테고리/마이페이지 */}
        {showHeader && (
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-100 flex items-center z-10">
            {[
              { key: "home" as Tab, Icon: Home, label: "홈", s: "home" as Screen },
              { key: "category" as Tab, Icon: LayoutGrid, label: "카테고리", s: "category" as Screen },
              { key: "mypage" as Tab, Icon: User, label: "마이페이지", s: "mypage" as Screen },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setScreen(t.s); }}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${tab === t.key ? "text-primary" : "text-gray-400"}`}>
                <t.Icon size={20} strokeWidth={1.5} />
                <span className="text-[10px]">{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
