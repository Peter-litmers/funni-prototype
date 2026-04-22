"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera, Dumbbell, Heart, Cake, PawPrint, Briefcase, Baby, Sparkles,
  Home, LayoutGrid, User, Bell, Phone, MapPin, Star, Pencil, Check,
  CheckCircle2, ImageIcon, Calendar, Clock, Search, SlidersHorizontal, Tag,
  type LucideIcon
} from "lucide-react";
import { useCategories } from "../lib/admin-store";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "프로필": Camera,
  "바디프로필": Dumbbell,
  "웨딩": Sparkles,
  "가족": Cake,
  "반려동물": PawPrint,
  "비즈니스": Briefcase,
  "커플": Heart,
  "아기": Baby,
};
const getCatIcon = (name: string): LucideIcon => CATEGORY_ICONS[name] ?? Tag;

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/photopop-logo.png" alt="포토팟 로고" width={40} height={40} className="h-10 w-10 object-contain" />
      <p className="text-lg font-bold tracking-tight text-gray-900">포토팟</p>
    </div>
  );
}


const HOME_KEYWORDS = ["인기", "웨딩", "프로필", "가족", "반려동물", "비즈니스"];

const HOME_AD_PAGES = [
  [
    { title: "로맨틱 웨딩", subtitle: "대표 추천 노출", tone: "from-rose-100 to-pink-100" },
    { title: "프로필 촬영", subtitle: "인기 작가 큐레이션", tone: "from-pink-50 to-rose-100" },
    { title: "가족 촬영", subtitle: "주말 예약 인기", tone: "from-orange-50 to-rose-100" },
  ],
  [
    { title: "커플 촬영", subtitle: "야외 스냅 추천", tone: "from-fuchsia-50 to-pink-100" },
    { title: "아기 촬영", subtitle: "성장 기록 남기기", tone: "from-rose-50 to-orange-100" },
    { title: "바디프로필", subtitle: "성수 인기 스튜디오", tone: "from-pink-100 to-rose-200" },
  ],
  [
    { title: "비즈니스 촬영", subtitle: "브랜드/팀 프로필 추천", tone: "from-rose-50 to-pink-100" },
    { title: "반려동물 촬영", subtitle: "반려 가족과 함께", tone: "from-neutral-100 to-stone-100" },
    { title: "가족 패키지", subtitle: "3인 이상 촬영 추천", tone: "from-pink-50 to-amber-50" },
  ],
];


// 카테고리별 포트폴리오 (REQ-106: 탐색 경로의 카테고리에 맞는 사진만 표시)
type StudioCategoryPortfolio = Record<string, number[]>;

const STUDIOS: {
  id: number; name: string; cats: string[]; desc: string; area: string;
  price: number; rating: number; reviews: number; phone: string;
  createdAt: string; location: string;
  portfolios: StudioCategoryPortfolio;
  vatIncluded: boolean;
  travelAvailable: boolean;
  paymentCount: number;
  distanceKm: number;
}[] = [
  { id: 1, name: "루미에르 스튜디오", cats: ["프로필", "비즈니스"], desc: "프로필촬영, 임직원 프로필, 이력서사진", area: "서울 강남구", price: 50000, rating: 4.8, reviews: 124, phone: "02-1234-5678", createdAt: "2026-04-10", location: "서울특별시 강남구 역삼동 123-4",
    portfolios: { "프로필": [1,2,3,4,5,6], "비즈니스": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 302, distanceKm: 1.2 },
  { id: 2, name: "선셋 포토랩", cats: ["바디프로필", "커플"], desc: "바디프로필, 커플촬영, 운동기록", area: "서울 성수동", price: 80000, rating: 4.9, reviews: 89, phone: "02-2345-6789", createdAt: "2026-03-28", location: "서울특별시 성동구 성수동 45-6",
    portfolios: { "바디프로필": [1,2,3,4,5,6], "커플": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: false, paymentCount: 287, distanceKm: 3.8 },
  { id: 3, name: "블룸 웨딩 스튜디오", cats: ["웨딩"], desc: "웨딩스냅, 본식촬영, 야외웨딩", area: "서울 잠실", price: 200000, rating: 4.7, reviews: 56, phone: "02-3456-7890", createdAt: "2026-04-05", location: "서울특별시 송파구 잠실동 78-9",
    portfolios: { "웨딩": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 190, distanceKm: 6.1 },
  { id: 4, name: "패밀리 모먼츠", cats: ["가족"], desc: "가족사진, 3대 가족 스냅, 주말 촬영", area: "경기 일산", price: 130000, rating: 4.5, reviews: 31, phone: "031-9234-5678", createdAt: "2026-04-06", location: "경기도 고양시 일산동구 장항동 101-9",
    portfolios: { "가족": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 57, distanceKm: 23.1 },
  { id: 5, name: "펫모먼츠 스튜디오", cats: ["반려동물", "가족"], desc: "반려동물 촬영, 반려 가족 스냅, 맞춤 소품 제공", area: "서울 망원동", price: 90000, rating: 4.7, reviews: 44, phone: "02-4567-8901", createdAt: "2026-04-12", location: "서울특별시 마포구 망원동 45-6",
    portfolios: { "반려동물": [1,2,3,4,5,6], "가족": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: true, paymentCount: 154, distanceKm: 8.4 },
  { id: 6, name: "브랜드컷 스튜디오", cats: ["비즈니스", "프로필"], desc: "브랜드 프로필, 팀 촬영, 대표 인터뷰컷", area: "서울 합정", price: 60000, rating: 4.7, reviews: 45, phone: "02-5678-9012", createdAt: "2026-04-08", location: "서울특별시 마포구 합정동 78-9",
    portfolios: { "비즈니스": [1,2,3,4,5,6], "프로필": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 118, distanceKm: 7.9 },
  { id: 7, name: "베이비데이 스튜디오", cats: ["아기", "프로필"], desc: "아기 촬영, 성장 스냅, 컨셉 프로필", area: "서울 신촌", price: 70000, rating: 4.6, reviews: 28, phone: "02-6789-0123", createdAt: "2026-04-14", location: "서울특별시 서대문구 신촌동 21-3",
    portfolios: { "아기": [1,2,3,4,5,6], "프로필": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 84, distanceKm: 5.1 },
  { id: 8, name: "아이덴티티 프로필", cats: ["프로필"], desc: "취업 프로필, 증명용 프로필, 개인 브랜딩 촬영", area: "서울 종로구", price: 30000, rating: 4.4, reviews: 52, phone: "02-7890-1234", createdAt: "2026-04-09", location: "서울특별시 종로구 관철동 14-7",
    portfolios: { "프로필": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 111, distanceKm: 4.4 },
  { id: 9, name: "커플모먼트 스튜디오", cats: ["커플"], desc: "커플촬영, 기념일 스냅, 데이트 사진", area: "서울 연남동", price: 110000, rating: 4.8, reviews: 39, phone: "02-8901-2345", createdAt: "2026-04-03", location: "서울특별시 마포구 연남동 33-12",
    portfolios: { "커플": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 92, distanceKm: 9.1 },
  { id: 10, name: "프라이빗 웨딩하우스", cats: ["웨딩"], desc: "프라이빗 웨딩, 실내 촬영, 웨딩 스냅", area: "서울 청담동", price: 260000, rating: 4.9, reviews: 21, phone: "02-9012-3456", createdAt: "2026-04-16", location: "서울특별시 강남구 청담동 55-1",
    portfolios: { "웨딩": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: true, paymentCount: 61, distanceKm: 2.8 },
  { id: 11, name: "바디에디션 랩", cats: ["바디프로필"], desc: "바디 프로필, 운동기록 촬영, 피트니스 브랜딩", area: "서울 성신여대", price: 150000, rating: 4.8, reviews: 26, phone: "02-9345-6789", createdAt: "2026-04-13", location: "서울특별시 성북구 동선동 45-2",
    portfolios: { "바디프로필": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: false, paymentCount: 73, distanceKm: 11.6 },
  { id: 12, name: "비즈니스 데이랩", cats: ["비즈니스", "아기"], desc: "사내 프로필, 가족 동반 촬영, 아기 기념 스냅", area: "서울 서초구", price: 95000, rating: 4.7, reviews: 18, phone: "02-9123-4567", createdAt: "2026-04-11", location: "서울특별시 서초구 서초동 88-4",
    portfolios: { "비즈니스": [1,2,3,4,5,6], "아기": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 49, distanceKm: 7.3 },
];

const HAIR_MAKEUP_OPTIONS = [
  { id: 1, name: "헤어 메이크업", price: 30000 },
  { id: 2, name: "얼굴 메이크업", price: 50000 },
  { id: 3, name: "세트 (헤어+얼굴)", price: 70000 },
];

const PRICE_RANGES = [
  { key: "all", label: "전체", min: 0, max: Infinity },
  { key: "low", label: "5만원 이하", min: 0, max: 50000 },
  { key: "mid", label: "5~10만원", min: 50001, max: 100000 },
  { key: "high", label: "10~20만원", min: 100001, max: 200000 },
  { key: "premium", label: "20만원 이상", min: 200001, max: Infinity },
];

const BOOKED_TIMES = ["10:00", "11:00", "15:00"];

const CONSUMER_NOTIFICATIONS: { id: number; type: string; text: string; time: string; read: boolean; action?: { screen: Screen; tab?: Tab; reviewTarget?: string } }[] = [
  { id: 1, type: "booking", text: "루미에르 스튜디오 예약이 확정되었습니다", time: "10분 전", read: false, action: { screen: "myBookings", tab: "mypage" } },
  { id: 2, type: "remind", text: "내일 선셋 포토랩 촬영이 있습니다", time: "1시간 전", read: false, action: { screen: "myBookings", tab: "mypage" } },
  { id: 3, type: "review", text: "브랜드컷 스튜디오 촬영은 어떠셨나요? 리뷰를 남겨주세요", time: "3시간 전", read: true, action: { screen: "reviewWrite", tab: "mypage", reviewTarget: "브랜드컷 스튜디오" } },
  { id: 4, type: "booking", text: "블룸 웨딩 스튜디오 예약이 확정되었습니다", time: "1일 전", read: true, action: { screen: "myBookings", tab: "mypage" } },
  { id: 5, type: "system", text: "포토팟 앱이 업데이트되었습니다", time: "3일 전", read: true },
];

const UPCOMING_BOOKINGS = [
  { studio: "루미에르 스튜디오", date: "2026.05.10 (토)", time: "14:00~16:00", cat: "프로필", price: "₩100,000", status: "확정" },
  { studio: "선셋 포토랩", date: "2026.05.18 (일)", time: "10:00~12:00", cat: "바디프로필", price: "₩160,000", status: "확정" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.05.25 (일)", time: "10:00~14:00", cat: "웨딩", price: "₩800,000", status: "대기" },
];
const COMPLETED_BOOKINGS = [
  { studio: "브랜드컷 스튜디오", date: "2026.04.20 (일)", time: "13:00~15:00", cat: "비즈니스", price: "₩80,000", status: "완료", canReview: true },
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.05 (토)", time: "10:00~14:00", cat: "웨딩", price: "₩800,000", status: "완료", canReview: false },
  { studio: "패밀리 모먼츠", date: "2026.03.22 (토)", time: "10:00~12:00", cat: "가족", price: "₩240,000", status: "완료", canReview: false },
];
const CANCELLED_BOOKINGS = [
  { studio: "펫모먼츠 스튜디오", date: "2026.04.15 (화)", time: "15:00~17:00", cat: "반려동물", price: "₩120,000", status: "취소됨", reason: "소비자 취소 · 촬영 1일 전 취소로 50% 환불" },
  { studio: "루미에르 스튜디오", date: "2026.03.28 (금)", time: "10:00~12:00", cat: "프로필", price: "₩100,000", status: "취소됨", reason: "업체 취소 · 100% 환불 처리" },
];
const MY_REVIEWS_DATA = [
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.06", rating: 5, text: "정말 만족스러운 촬영이었습니다. 결과물도 훌륭해요!" },
  { studio: "패밀리 모먼츠", date: "2026.03.23", rating: 4, text: "가족 모두 편안하게 촬영할 수 있었어요. 스태프가 친절합니다." },
  { studio: "브랜드컷 스튜디오", date: "2026.03.10", rating: 5, text: "팀 프로필 결과물이 기대 이상이에요. 재방문 예정입니다!" },
];
const PAYMENT_HISTORY = [
  { studio: "루미에르 스튜디오", date: "2026.05.08", amount: "₩100,000", method: "카드", status: "결제완료" },
  { studio: "선셋 포토랩", date: "2026.05.05", amount: "₩160,000", method: "카드", status: "결제완료" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.03", amount: "₩800,000", method: "카카오페이", status: "결제완료" },
  { studio: "브랜드컷 스튜디오", date: "2026.04.18", amount: "₩80,000", method: "카드", status: "결제완료" },
  { studio: "펫모먼츠 스튜디오", date: "2026.04.13", amount: "₩120,000", method: "카드", status: "환불완료" },
];
const ALL_MY_BOOKINGS_FOR_MYPAGE = [
  { studio: "루미에르 스튜디오", date: "2026.05.10 (토) 14:00~16:00", cat: "프로필 촬영", status: "확정" },
  { studio: "선셋 포토랩", date: "2026.05.18 (일) 10:00~12:00", cat: "바디프로필", status: "확정" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.05.25 (일) 10:00~14:00", cat: "웨딩", status: "대기" },
  { studio: "브랜드컷 스튜디오", date: "2026.04.20 (일) 13:00~15:00", cat: "비즈니스", status: "완료" },
  { studio: "패밀리 모먼츠", date: "2026.04.12 (토) 10:00~12:00", cat: "가족", status: "완료" },
  { studio: "펫모먼츠 스튜디오", date: "2026.04.05 (토) 15:00~17:00", cat: "반려동물", status: "취소" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.03.22 (토) 10:00~14:00", cat: "웨딩", status: "완료" },
];

type Screen = "home" | "category" | "myBookings" | "detail" | "booking" | "done" | "mypage" | "reviewWrite" | "myReviews" | "paymentHistory" | "login" | "signup" | "bizSignup" | "forgotPassword" | "notifications";
type Sort = "payments" | "rating" | "distance";
type BookingFilter = "예정" | "완료" | "취소";
type Tab = "home" | "category" | "mypage";

const TIMES = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export default function ConsumerApp() {
  const [adminCategories] = useCategories();
  const CATEGORIES = [{ name: "전체", Icon: LayoutGrid }, ...adminCategories.map(n => ({ name: n, Icon: getCatIcon(n) }))];
  const HOME_CATEGORY_GRID = adminCategories.map(n => ({ name: n, Icon: getCatIcon(n) }));
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0]);
  const [tab, setTab] = useState<Tab>("home");
  const [sort, setSort] = useState<Sort>("payments");
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [selectedDate, setSelectedDate] = useState(10);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("예정");
  const [adIdx, setAdIdx] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewTarget, setReviewTarget] = useState("");
  const [myBookingPage, setMyBookingPage] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState("김포토");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [categoryCat, setCategoryCat] = useState("프로필");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [customPriceMin, setCustomPriceMin] = useState<string>("");
  const [customPriceMax, setCustomPriceMax] = useState<string>("");
  const [activeKeyword, setActiveKeyword] = useState("인기");
  const [detailEntryCat, setDetailEntryCat] = useState<string>(""); // 탐색 진입 카테고리
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [editingReviewIdx, setEditingReviewIdx] = useState<number | null>(null);
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [editReviewText, setEditReviewText] = useState("");
  const [deleteRequestIdx, setDeleteRequestIdx] = useState<number | null>(null);
  const [deleteRequestReason, setDeleteRequestReason] = useState("");

  const touchStartX = useRef(0);
  const historyStack = useRef<{ s: Screen; t: Tab }[]>([]);

  useEffect(() => {
    if (screen !== "home") return;
    const timer = window.setInterval(() => {
      setAdIdx(prev => (prev + 1) % HOME_AD_PAGES.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [screen]);

  const navigate = (to: Screen) => {
    historyStack.current.push({ s: screen, t: tab });
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
      if (activeKeyword === "인기") return true;
      if (activeKeyword === "웨딩") return s.cats.includes("웨딩");
      if (activeKeyword === "프로필") return s.cats.includes("프로필");
      if (activeKeyword === "가족") return s.cats.includes("가족");
      if (activeKeyword === "반려동물") return s.cats.includes("반려동물");
      if (activeKeyword === "비즈니스") return s.cats.includes("비즈니스");
      return true;
    })
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
    if (sort === "rating") {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.paymentCount - a.paymentCount;
    }
    if (sort === "distance") {
      if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
      return b.rating - a.rating;
    }
    if (b.paymentCount !== a.paymentCount) return b.paymentCount - a.paymentCount;
    return b.rating - a.rating;
  });
  const finalHomeStudios = homeSorted;
  const promotedStudios = [...STUDIOS].sort((a, b) => b.paymentCount - a.paymentCount).slice(0, 4);
  const hotStudios = [...STUDIOS].sort((a, b) => {
    if (b.paymentCount !== a.paymentCount) return b.paymentCount - a.paymentCount;
    return b.rating - a.rating;
  }).slice(0, 5);

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
  const endTime = TIMES[Math.min(timeIdx + 1, TIMES.length - 1)] || "22:00";
  const basePrice = selectedStudio.price;
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

      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[28px] bg-white shadow-xl" style={{ height: 780 }}>

        {/* Header */}
        {showHeader && (
          <div className="relative z-10 bg-white pt-5 pl-4 pr-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {screen !== "home" && <button onClick={goBack} className="text-gray-500 text-lg flex items-center justify-center -mr-1">‹</button>}
                <button onClick={() => { setScreen("home"); setTab("home"); }} className="flex items-center">
                  <BrandMark />
                </button>
              </div>
              <button onClick={() => navigate("notifications")} className="text-gray-500 relative p-1">
                <Bell size={20} strokeWidth={1.5} />
                {CONSUMER_NOTIFICATIONS.some(n => !n.read) && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto bg-white" style={{ height: showHeader ? "calc(780px - 64px - 56px)" : "calc(780px - 56px)" }}>

          {/* ===== HOME (IA-010) ===== */}
          {screen === "home" && (
            <div className="pb-6">
              <div className="px-4 pt-2">
                <div>
                  <p className="text-[11px] text-gray-400">포토팟 큐레이션</p>
                  <h2 className="mt-1 text-xl font-bold leading-tight text-gray-900">오늘의 촬영에 맞는 스튜디오를 찾아보세요</h2>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-3">
                  <Search size={16} strokeWidth={1.8} className="text-gray-400" />
                  <input
                    type="text"
                    value={selectedRegion === "전체" ? "" : selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value || "전체")}
                    placeholder="어떤 스튜디오를 찾고 계신가요?"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>

                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  {HOME_KEYWORDS.map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => setActiveKeyword(keyword)}
                      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        activeKeyword === keyword
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mx-4 mt-5 rounded-3xl bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-gray-700">이번 주 추천 배너</p>
                  <span className="text-[10px] text-gray-400">3개 x 3페이지</span>
                </div>
                <div className="mt-3 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${adIdx * 100}%)` }}>
                    {HOME_AD_PAGES.map((page, pageIndex) => (
                      <div key={pageIndex} className="grid min-w-full grid-cols-3 gap-2">
                        {page.map(card => (
                          <button
                            key={card.title}
                            className={`h-32 rounded-2xl border border-gray-200 bg-gradient-to-br ${card.tone} p-3 text-left`}
                          >
                            <span className="inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-semibold text-gray-500">
                              AD
                            </span>
                            <div className="mt-4 flex h-[76px] flex-col">
                              <p className="min-h-[32px] text-xs font-bold leading-tight text-gray-900">{card.title}</p>
                              <p className="mt-1 min-h-[28px] text-[10px] leading-snug text-gray-500">{card.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-center gap-1.5">
                    {HOME_AD_PAGES.map((_, i) => (
                      <button key={i} onClick={() => setAdIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === adIdx ? "bg-primary w-4" : "bg-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 px-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-gray-900">카테고리</h3>
                  <button
                    onClick={() => {
                      setScreen("category");
                      setTab("category");
                    }}
                    className="text-xs font-medium text-gray-400"
                  >
                    전체보기
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {HOME_CATEGORY_GRID.map(category => (
                    <button
                      key={category.name}
                      onClick={() => {
                        setCategoryCat(category.name);
                        setScreen("category");
                        setTab("category");
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                        <category.Icon size={20} strokeWidth={1.7} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between px-4">
                  <div>
                    <p className="text-[11px] text-gray-400">에디터 셀렉션</p>
                    <h3 className="text-[15px] font-bold text-gray-900">지금 추천하는 스튜디오</h3>
                  </div>
                  <button className="text-xs font-medium text-gray-400">전체보기</button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
                  {promotedStudios.map((studio, index) => (
                    <button
                      key={studio.id}
                      onClick={() => openDetail(studio)}
                      className="w-40 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[9px] font-semibold text-gray-500">
                          AD #{index + 1}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{studio.name}</p>
                        <p className="mt-1 text-[11px] text-gray-400">{studio.area}</p>
                        {studio.travelAvailable && <p className="mt-1 text-[10px] font-medium text-primary">출장 가능</p>}
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-gray-900">₩{studio.price.toLocaleString()}</span>
                          <span className="text-yellow-500">★ {studio.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between px-4">
                  <div>
                    <p className="text-[11px] text-gray-400">결제랑 평점에 기반으로 보여줘요</p>
                    <h3 className="text-[15px] font-bold text-gray-900">지금 많이 찾는 스튜디오</h3>
                  </div>
                  <button className="text-xs font-medium text-gray-400">전체보기</button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
                  {hotStudios.map((studio, index) => (
                    <button
                      key={studio.id}
                      onClick={() => openDetail(studio)}
                      className="w-44 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        {index < 3 && (
                          <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-semibold text-white">
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{studio.name}</p>
                        <p className="mt-1 text-[11px] text-gray-400">{studio.area}</p>
                        {studio.travelAvailable && <p className="mt-1 text-[10px] font-medium text-primary">출장 가능</p>}
                        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                          <span>결제 {studio.paymentCount}건</span>
                          <span className="text-yellow-500">★ {studio.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 px-4">
                <div className="mb-3 flex items-center gap-2">
                  <SlidersHorizontal size={16} strokeWidth={1.8} className="text-gray-500" />
                  <h3 className="text-[15px] font-bold text-gray-900">필터</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-[11px] text-gray-400">기본 정렬: 결제순 → 평점순</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {([
                      { key: "payments" as Sort, label: "결제순" },
                      { key: "rating" as Sort, label: "평점순" },
                      { key: "distance" as Sort, label: "거리순" },
                    ]).map(item => (
                      <button
                        key={item.key}
                        onClick={() => setSort(item.key)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          sort === item.key ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 px-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-gray-900">맞춤 결과</h3>
                  <span className="text-xs text-gray-400">{finalHomeStudios.length}곳</span>
                </div>
                <div className="mt-3 flex gap-1.5 overflow-x-auto items-center" style={{ scrollbarWidth: 'none' }}>
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

              <div className="px-4">
                {finalHomeStudios.length === 0 ? (
                  <div className="text-center py-12"><p className="text-gray-400 text-sm">조건에 맞는 스튜디오가 없습니다</p></div>
                ) : finalHomeStudios.map(s => (
                  <div key={s.id} onClick={() => openDetail(s)}
                    className="w-full flex gap-3 py-4 border-b border-gray-50 cursor-pointer">
                    <div className="w-[88px] h-[88px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={28} strokeWidth={1.5} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{s.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.area}</p>
                      {s.travelAvailable && <p className="text-[10px] font-medium text-primary mt-1">출장 가능</p>}
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-sm font-bold text-gray-900">₩{s.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">/ 시간 · {s.vatIncluded ? "VAT 포함" : "VAT 별도"}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-yellow-500">★ {s.rating}</span>
                        <span className="text-xs text-gray-400">({s.reviews})</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-400">결제 {s.paymentCount}건</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-400">{s.distanceKm.toFixed(1)}km</span>
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
              <div className="grid grid-cols-4 gap-2 mb-4">
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
                <div className="bg-gradient-to-r from-rose-100 to-pink-200 rounded-xl p-4 flex items-center gap-3 relative">
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
                    {s.travelAvailable && <p className="text-[10px] font-medium text-primary mt-1">출장 가능</p>}
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
                <div className="flex items-center gap-2 mt-1 mb-4 flex-wrap">
                  <span className="text-xs text-yellow-500">★ {selectedStudio.rating}</span>
                  <span className="text-xs text-gray-400">리뷰 {selectedStudio.reviews}개</span>
                  {selectedStudio.travelAvailable && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">출장 가능</span>}
                </div>

                {/* 스튜디오 소개 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">스튜디오 소개</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedStudio.desc}. {selectedStudio.area}에 위치한 {selectedStudio.cats.join("·")} 전문 스튜디오입니다. 편안한 분위기에서 최고의 결과물을 제공해드려요.</p>
                </div>

                {/* 가격표 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">촬영 가격</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₩{selectedStudio.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">/ 시간 · {selectedStudio.vatIncluded ? "VAT 포함" : "VAT 별도"}</span>
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
                      <span className="absolute bottom-2 right-2 text-[9px] bg-white/90 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200 z-10">카카오맵 연동 예정</span>
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
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">리뷰 {selectedStudio.reviews}개</p>
                  <div className="space-y-2">
                    {[
                      { name: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다", date: "2026.04.10", reply: "감사합니다! 다음에도 좋은 촬영 하겠습니다." },
                      { name: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요", date: "2026.04.08", reply: null },
                    ].map((r, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-medium">{r.name}</span>
                          <span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                          <span className="ml-auto text-[10px] text-gray-400">{r.date}</span>
                        </div>
                        <p className="text-xs text-gray-600">{r.text}</p>
                        {r.reply && (
                          <div className="bg-gray-50 rounded-lg p-2.5 mt-2 border border-gray-100">
                            <p className="text-[10px] text-primary font-medium mb-0.5">업체 답변</p>
                            <p className="text-xs text-gray-600">{r.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
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
                          <p className="text-[10px] text-red-500 mb-1.5">선택한 날짜는 예약 불가입니다. 다른 날짜를 선택해주세요.</p>
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
                <div className="flex justify-between text-sm"><span className="text-gray-500">시간</span><span className="font-medium">{selectedTime} ~ {endTime} (1시간)</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">촬영 비용</span><span className="font-medium">₩{basePrice.toLocaleString()}</span></div>
                {selectedOptions.length > 0 && selectedOptions.map(id => {
                  const opt = HAIR_MAKEUP_OPTIONS.find(o => o.id === id);
                  return opt ? <div key={id} className="flex justify-between text-sm"><span className="text-gray-500">{opt.name}</span><span className="font-medium">+₩{opt.price.toLocaleString()}</span></div> : null;
                })}
                <div className="flex justify-between text-sm border-t border-gray-100 pt-3"><span className="text-gray-500 font-bold">총 금액</span><span className="font-bold text-primary text-base">₩{totalPrice.toLocaleString()}</span></div>
                <p className="text-[11px] text-gray-400 pt-1">예약금 결제 후 업체 승인 시 확정되며, 영업일 기준 48시간 내 미승인 시 자동 취소 및 전액 환불됩니다.</p>
              </div>

              <button onClick={() => navigate("done")} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">결제하기 · 토스페이먼츠</button>
            </div>
          )}

          {/* ===== DONE (IA-022) ===== */}
          {screen === "done" && (
            <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 500 }}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary"><CheckCircle2 size={48} strokeWidth={1.5} /></div>
              <h2 className="text-lg font-bold mb-1">예약 요청 완료!</h2>
              <p className="text-sm text-gray-500">{selectedStudio.name}</p>
              <p className="text-xs text-gray-400 mb-6">2026.05.{selectedDate} {selectedTime} ~ {endTime}</p>
              <div className="bg-primary/5 rounded-xl p-4 w-full mb-4 border border-primary/10">
                <p className="text-xs text-primary font-medium">토스페이먼츠 예약금 결제 완료</p>
                <p className="text-sm font-bold text-gray-900 mt-1">₩{totalPrice.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500 mt-2">업체 승인 후 예약이 확정되며, 영업일 기준 48시간 내 미승인 시 자동 취소 및 전액 환불됩니다.</p>
              </div>
              <button onClick={() => { setScreen("myBookings"); setTab("mypage"); }} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm mb-2">예약 요청 내역 확인</button>
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
              {bookingFilter === "완료" && <p className="text-[11px] text-gray-400 mb-3">리뷰는 업체가 촬영 건을 완료 처리한 시점부터 2주 이내 작성, 작성 후 3일 이내 수정 가능합니다.</p>}
              {bookingFilter === "취소" && (
                <div className="mb-3 rounded-xl bg-rose-50 p-3 text-[11px] text-rose-500">
                  <p>소비자 취소 환불 기준: 7일 전 전액 환불 · 3~6일 전 20% · 1~2일 전 50% · 당일 80%</p>
                  <p className="mt-1">업체 취소: 100% 환불 + 업체에 페널티 누적 기록 (누적 5회 이상 시 이용정지 검토)</p>
                </div>
              )}
              {filteredBookings.length === 0 ? <div className="text-center py-12"><p className="text-gray-400 text-sm">해당 예약이 없습니다</p></div> : filteredBookings.map((b, i) => (
                <div key={i} className={`bg-gray-50 rounded-xl p-4 mb-3 ${bookingFilter === "취소" ? "opacity-60" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="text-sm font-bold">{b.studio}</p><p className="text-xs text-gray-400 mt-0.5">{b.cat} · {b.date}</p><p className="text-xs text-gray-400">{b.time}</p></div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold">{b.price}</span>
                    <div className="flex items-center gap-2">
                      {bookingFilter === "예정" && (
                        <button
                          onClick={() => { if (confirm(`${b.studio} 예약을 취소 요청하시겠습니까?\n\n※ 취소 환불 기준이 적용됩니다\n• 7일 전: 전액 환불\n• 3~6일 전: 20% 환불\n• 1~2일 전: 50% 환불\n• 당일: 80% 환불`)) alert("취소 요청이 접수되었습니다. 업체 승인 후 환불됩니다."); }}
                          className="text-xs text-red-500 bg-red-50 px-2.5 py-1 rounded-full font-medium">
                          예약 취소
                        </button>
                      )}
                      {bookingFilter === "완료" && (b as { canReview?: boolean }).canReview && (
                        <button onClick={() => { setReviewTarget(b.studio); setReviewRating(5); setReviewText(""); navigate("reviewWrite"); }} className="text-xs text-primary font-medium">리뷰 작성 →</button>
                      )}
                      {bookingFilter === "취소" && <span className="text-[10px] text-gray-400">{(b as { reason?: string }).reason}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== REVIEW WRITE (IA-030) ===== */}
          {screen === "reviewWrite" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">리뷰 작성</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-sm font-bold">{reviewTarget}</p></div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">별점</p>
                <div className="flex gap-2 justify-center">{[1,2,3,4,5].map(star => <button key={star} onClick={() => setReviewRating(star)} className={`text-3xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}>{star <= reviewRating ? "★" : "☆"}</button>)}</div>
                <p className="text-center text-xs text-gray-400 mt-2">{reviewRating}점</p>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">리뷰 내용</p>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} maxLength={300} placeholder="촬영 경험을 30자 이상 작성해주세요" className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none resize-none border border-gray-200 focus:border-primary" rows={5} />
                <div className="mt-1 flex items-center justify-end">
                  <p className="text-[10px] text-gray-400">{reviewText.length}/300</p>
                </div>
              </div>
              <button onClick={() => { setScreen("myBookings"); setTab("mypage"); }} disabled={reviewText.trim().length < 30} className={`w-full py-3.5 rounded-xl font-bold text-sm ${reviewText.trim().length >= 30 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>리뷰 등록</button>
            </div>
          )}

          {/* ===== MY REVIEWS (IA-053) ===== */}
          {screen === "myReviews" && editingReviewIdx === null && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">내 리뷰 관리</h2>
              {MY_REVIEWS_DATA.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start mb-2"><div><p className="text-sm font-bold">{r.studio}</p><p className="text-xs text-gray-400 mt-0.5">{r.date}</p></div><span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div>
                  <p className="text-xs text-gray-600">{r.text}</p>
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button onClick={() => { setEditingReviewIdx(i); setEditReviewRating(r.rating); setEditReviewText(r.text); }} className="text-[10px] text-primary px-2 py-1 font-medium">수정</button>
                    <button onClick={() => { setDeleteRequestIdx(i); setDeleteRequestReason(""); }} className="text-[10px] text-red-400 px-2 py-1">삭제 요청</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== MY REVIEW EDIT ===== */}
          {screen === "myReviews" && editingReviewIdx !== null && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">리뷰 수정</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-sm font-bold">{MY_REVIEWS_DATA[editingReviewIdx].studio}</p><p className="text-xs text-gray-400 mt-0.5">{MY_REVIEWS_DATA[editingReviewIdx].date}</p></div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">별점</p>
                <div className="flex gap-2 justify-center">{[1,2,3,4,5].map(star => <button key={star} onClick={() => setEditReviewRating(star)} className={`text-3xl ${star <= editReviewRating ? "text-yellow-400" : "text-gray-300"}`}>{star <= editReviewRating ? "★" : "☆"}</button>)}</div>
                <p className="text-center text-xs text-gray-400 mt-2">{editReviewRating}점</p>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">리뷰 내용</p>
                <textarea value={editReviewText} onChange={e => setEditReviewText(e.target.value)} maxLength={300} className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none resize-none border border-gray-200 focus:border-primary" rows={5} />
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-[10px] text-gray-400">30자 이상 입력해야 수정 가능 · 삭제는 요청 후 승인됩니다.</p>
                  <p className="text-[10px] text-gray-400 shrink-0">{editReviewText.length}/300</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingReviewIdx(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium text-sm">취소</button>
                <button onClick={() => setEditingReviewIdx(null)} disabled={editReviewText.trim().length < 30} className={`flex-1 py-3 rounded-xl font-bold text-sm ${editReviewText.trim().length >= 30 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>수정 완료</button>
              </div>
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
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden">
                    {profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <User size={26} strokeWidth={1.5} />
                    )}
                  </div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => setProfileImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                  <button onClick={() => profileInputRef.current?.click()}
                    className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow">
                    <Camera size={11} strokeWidth={2} />
                  </button>
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
                <button onClick={() => navigate("myBookings")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">내 예약 내역</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button onClick={() => navigate("myReviews")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">내 리뷰 관리</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button onClick={() => navigate("paymentHistory")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">결제 내역</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">고객센터</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button onClick={() => navigate("login")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">로그아웃</span><span className="text-gray-300 text-xs">›</span>
                </button>
              </div>
            </div>
          )}

          {/* ===== LOGIN (IA-003) ===== */}
          {screen === "login" && (
            <div className="p-6 pt-16 flex flex-col items-center">
              <Image src="/photopop-logo.png" alt="포토팟 로고" width={88} height={88} className="mb-3 h-[88px] w-[88px] object-contain" />
              <p className="text-3xl font-bold text-primary mb-2">포토팟</p>
              <p className="text-xs text-gray-400 mb-10">스튜디오 대관·예약 플랫폼</p>

              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2">💬 카카오로 시작하기</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2">🟢 네이버로 시작하기</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm mb-6 flex items-center justify-center gap-2">G 구글로 시작하기</button>

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


              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-gray-500 mb-1">이름</p><input type="text" placeholder="홍길동" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">닉네임 (앱 내 표시)</p><input type="text" placeholder="포토팟유저" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">이메일</p><input type="email" placeholder="email@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">비밀번호</p><input type="password" placeholder="8자 이상" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
              </div>

              {/* 약관 동의 (REQ-101) */}
              <div className="space-y-2 mb-4 bg-gray-50 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="w-4 h-4 accent-[#E85D93]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 서비스 이용약관 동의</span>
                  <span className="text-[10px] text-gray-400 underline">보기</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} className="w-4 h-4 accent-[#E85D93]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 개인정보 처리방침 동의</span>
                  <span className="text-[10px] text-gray-400 underline">보기</span>
                </label>
              </div>

              <p className="text-xs text-gray-400 mb-3">또는 SNS로 가입</p>
              <button className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm mb-2">💬 카카오로 가입</button>
              <button className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-bold text-sm mb-2">🟢 네이버로 가입</button>
              <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm mb-6">G 구글로 가입</button>

              <button onClick={() => { if (agreeTerms && agreePrivacy) { setScreen("home"); setTab("home"); } }} disabled={!agreeTerms || !agreePrivacy}
                className={`w-full py-3 rounded-xl font-bold text-sm ${agreeTerms && agreePrivacy ? "bg-primary text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>가입 완료</button>
            </div>
          )}

          {/* ===== BIZ SIGNUP (IA-002) ===== */}
          {screen === "bizSignup" && (
            <div className="p-6 pt-16">
              <h2 className="text-lg font-bold mb-1">업체 회원가입</h2>
              <p className="text-xs text-gray-400 mb-6">사업자 계정 · 승인 후 이용 가능</p>

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
                  <input type="checkbox" className="w-4 h-4 accent-[#E85D93]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 서비스 이용약관 동의</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#E85D93]" />
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
                const handleClick = () => {
                  if (!n.action) return;
                  if (n.action.reviewTarget) { setReviewTarget(n.action.reviewTarget); setReviewRating(5); setReviewText(""); }
                  if (n.action.tab) setTab(n.action.tab);
                  navigate(n.action.screen);
                };
                return (
                  <button key={n.id} onClick={handleClick}
                    className={`flex gap-3 py-3.5 border-b border-gray-50 w-full text-left ${n.read ? "opacity-60" : ""} ${n.action ? "hover:bg-gray-50 cursor-pointer" : ""}`}>
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                      <IconComp size={16} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
                    {n.action && <span className="text-gray-300 text-xs mt-2 shrink-0">›</span>}
                  </button>
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
              { key: "mypage" as Tab, Icon: User, label: "MY", s: "mypage" as Screen },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setScreen(t.s); }}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${tab === t.key ? "text-primary" : "text-gray-400"}`}>
                <t.Icon size={20} strokeWidth={1.5} />
                <span className="text-[10px]">{t.label}</span>
              </button>
            ))}
          </div>
        )}

        {deleteRequestIdx !== null && (
          <div className="absolute inset-0 z-30 flex items-end bg-black/45">
            <div className="w-full rounded-t-3xl bg-white p-5 pb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold">리뷰 삭제 요청</h3>
                <button onClick={() => { setDeleteRequestIdx(null); setDeleteRequestReason(""); }} className="text-sm text-gray-400">닫기</button>
              </div>
              <div className="mb-4 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-bold">{MY_REVIEWS_DATA[deleteRequestIdx].studio}</p>
                <p className="mt-1 text-[11px] text-gray-400">삭제는 바로 처리되지 않고, 사유 확인 후 어드민 승인으로 진행됩니다.</p>
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">삭제 요청 사유</label>
                <textarea value={deleteRequestReason} onChange={e => setDeleteRequestReason(e.target.value)} placeholder="삭제를 요청하는 이유를 입력해주세요" className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-primary" rows={4} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setDeleteRequestIdx(null); setDeleteRequestReason(""); }} className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-600">취소</button>
                <button onClick={() => { setDeleteRequestIdx(null); setDeleteRequestReason(""); }} disabled={!deleteRequestReason.trim()} className={`flex-1 rounded-xl py-3 text-sm font-bold ${deleteRequestReason.trim() ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>삭제 요청 제출</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
