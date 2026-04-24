"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera, Home, LayoutGrid, User, Bell, Phone, Calendar, MapPin, Search, SlidersHorizontal,
  DollarSign, BarChart3, Building2, ImageIcon, X, Star, Check, ChevronDown,
} from "lucide-react";
import { useCategories, useFeeRate, useBusinessFees, getFeeForBusiness, useHomeKeywords, matchesKeyword, useCategoryIcons, useNoShowReports, countNoShowsFor, useAds, type HomeKeyword } from "../lib/admin-store";
import { resolveCatIcon } from "../lib/category-icons";

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/photopop-logo.png" alt="포토팟 로고" width={40} height={40} className="h-10 w-10 object-contain" />
      <p className="text-lg font-bold tracking-tight text-gray-900">포토팟</p>
    </div>
  );
}

type Screen = "home" | "category" | "detail" | "register" | "bookings" | "bookingDetail" | "settlement" | "notifications" | "studioView" | "mypage" | "bizSignup" | "approvalWaiting" | "dashboard" | "bizInfo" | "reviews" | "login";
type Sort = "payments" | "rating" | "distance";
type BookingFilter = "전체" | "확정" | "예약 취소 중" | "완료";
type Tab = "home" | "category" | "my";

// Studio browsing data — 소비자와 동일한 탐색 화면 (CATEGORIES는 컴포넌트 안에서 훅으로 주입)


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


const STUDIOS: { id: number; name: string; cat: string; tags: string[]; desc: string; area: string; price: string; rating: number; reviews: number; phone: string; travelAvailable: boolean; paymentCount: number; distanceKm: number }[] = [
  { id: 1, name: "루미에르 스튜디오", cat: "프로필", tags: ["증명사진", "취업프로필", "이력서"], desc: "프로필촬영, 임직원 프로필, 이력서사진", area: "서울 강남구", price: "50,000", rating: 4.8, reviews: 124, phone: "02-1234-5678", travelAvailable: true, paymentCount: 302, distanceKm: 1.2 },
  { id: 2, name: "선셋 포토랩", cat: "바디프로필", tags: ["일반바디", "피트니스", "커플바디"], desc: "바디프로필, 커플촬영, 운동기록", area: "서울 성수동", price: "80,000", rating: 4.9, reviews: 89, phone: "02-2345-6789", travelAvailable: false, paymentCount: 287, distanceKm: 3.8 },
  { id: 3, name: "블룸 웨딩 스튜디오", cat: "웨딩", tags: ["본식스냅", "야외웨딩", "리마인드"], desc: "웨딩스냅, 본식촬영, 야외웨딩", area: "서울 잠실", price: "200,000", rating: 4.7, reviews: 56, phone: "02-3456-7890", travelAvailable: true, paymentCount: 190, distanceKm: 6.1 },
  { id: 4, name: "패밀리 모먼츠", cat: "가족", tags: ["3대가족", "가족나들이", "돌잔치"], desc: "가족사진, 3대 가족 스냅, 주말 촬영", area: "경기 일산", price: "130,000", rating: 4.5, reviews: 31, phone: "031-9234-5678", travelAvailable: false, paymentCount: 57, distanceKm: 23.1 },
  { id: 5, name: "펫모먼츠 스튜디오", cat: "반려동물", tags: ["강아지", "고양이", "반려가족"], desc: "반려동물 촬영, 반려 가족 스냅, 맞춤 소품 제공", area: "서울 망원동", price: "90,000", rating: 4.7, reviews: 44, phone: "02-4567-8901", travelAvailable: true, paymentCount: 154, distanceKm: 8.4 },
  { id: 6, name: "브랜드컷 스튜디오", cat: "비즈니스", tags: ["단체촬영", "음식", "제품"], desc: "브랜드 프로필, 팀 촬영, 대표 인터뷰컷", area: "서울 합정", price: "60,000", rating: 4.7, reviews: 45, phone: "02-5678-9012", travelAvailable: false, paymentCount: 118, distanceKm: 7.9 },
  { id: 7, name: "베이비데이 스튜디오", cat: "아기", tags: ["신생아", "100일", "돌"], desc: "아기 촬영, 성장 스냅, 컨셉 프로필", area: "서울 신촌", price: "70,000", rating: 4.6, reviews: 28, phone: "02-6789-0123", travelAvailable: false, paymentCount: 84, distanceKm: 5.1 },
  { id: 8, name: "아이덴티티 프로필", cat: "프로필", tags: ["취업프로필", "증명사진", "SNS프로필"], desc: "취업 프로필, 개인 브랜딩 촬영, 이력서 사진", area: "서울 종로구", price: "30,000", rating: 4.4, reviews: 52, phone: "02-7890-1234", travelAvailable: false, paymentCount: 111, distanceKm: 4.4 },
  { id: 9, name: "커플모먼트 스튜디오", cat: "커플", tags: ["기념일", "데이트스냅", "프리웨딩"], desc: "커플촬영, 기념일 스냅, 데이트 사진", area: "서울 연남동", price: "110,000", rating: 4.8, reviews: 39, phone: "02-8901-2345", travelAvailable: true, paymentCount: 92, distanceKm: 9.1 },
  { id: 10, name: "프라이빗 웨딩하우스", cat: "웨딩", tags: ["셀프웨딩", "프리웨딩", "리마인드"], desc: "셀프웨딩, 프라이빗 촬영, 웨딩 스냅", area: "서울 청담동", price: "260,000", rating: 4.9, reviews: 21, phone: "02-9012-3456", travelAvailable: true, paymentCount: 61, distanceKm: 2.8 },
  { id: 11, name: "비즈니스 데이랩", cat: "비즈니스", tags: ["사내프로필", "단체촬영", "제품"], desc: "사내 프로필, 팀 스냅, 워크숍 단체 촬영", area: "서울 서초구", price: "95,000", rating: 4.7, reviews: 18, phone: "02-9123-4567", travelAvailable: true, paymentCount: 49, distanceKm: 7.3 },
  { id: 12, name: "바디에디션 랩", cat: "바디프로필", tags: ["피트니스", "선수", "개인바디"], desc: "바디 프로필, 운동기록 촬영, 피트니스 브랜딩", area: "서울 성신여대", price: "150,000", rating: 4.8, reviews: 26, phone: "02-9345-6789", travelAvailable: false, paymentCount: 73, distanceKm: 11.6 },
];

const ALL_BOOKINGS: { id: number; month: number; date: number; name: string; cat: string; time: string; price: number; status: string; isManual?: boolean; cancelReason?: string }[] = [
  { id: 1, month: 5, date: 10, name: "김철수", cat: "프로필", time: "10:00~12:00", price: 100000, status: "확정" },
  { id: 2, month: 5, date: 10, name: "이영희", cat: "바디프로필", time: "14:00~16:00", price: 160000, status: "확정" },
  { id: 3, month: 5, date: 10, name: "박지민", cat: "프로필", time: "17:00~19:00", price: 100000, status: "확정" },
  { id: 4, month: 5, date: 11, name: "최수현", cat: "프로필", time: "10:00~12:00", price: 100000, status: "예약 취소 중", cancelReason: "일정 변경이 생겨서 취소 부탁드립니다." },
  { id: 5, month: 5, date: 11, name: "정다은", cat: "바디프로필", time: "13:00~15:00", price: 160000, status: "확정" },
  { id: 6, month: 5, date: 12, name: "한소희", cat: "프로필", time: "15:00~17:00", price: 100000, status: "완료" },
  { id: 7, month: 5, date: 13, name: "오진우", cat: "바디프로필", time: "10:00~13:00", price: 240000, status: "확정" },
  { id: 8, month: 5, date: 15, name: "윤서연", cat: "프로필", time: "11:00~13:00", price: 100000, status: "확정" },
  { id: 9, month: 5, date: 20, name: "강민지", cat: "바디프로필", time: "14:00~16:00", price: 160000, status: "예약 취소 중", cancelReason: "일정 변경이 생겨서 취소 부탁드립니다." },
  { id: 10, month: 5, date: 25, name: "임재현", cat: "프로필", time: "16:00~18:00", price: 100000, status: "확정" },
  { id: 11, month: 4, date: 5, name: "송예진", cat: "프로필", time: "10:00~12:00", price: 100000, status: "완료" },
  { id: 12, month: 4, date: 12, name: "류현우", cat: "바디프로필", time: "14:00~16:00", price: 160000, status: "완료" },
  { id: 13, month: 4, date: 18, name: "장미래", cat: "웨딩", time: "10:00~14:00", price: 400000, status: "완료" },
];

const NOTIFICATIONS: { id: number; type: string; text: string; time: string; action?: { screen: Screen; filter?: BookingFilter } }[] = [
  { id: 1, type: "booking", text: "김철수님이 5/10 프로필 촬영을 예약했습니다", time: "10분 전", action: { screen: "bookings", filter: "확정" } },
  { id: 2, type: "cancel", text: "최수현님이 5/11 예약 취소를 요청했습니다", time: "30분 전", action: { screen: "bookings", filter: "예약 취소 중" } },
  { id: 3, type: "review", text: "한소희님이 리뷰를 작성했습니다 ★★★★★", time: "2시간 전", action: { screen: "reviews" } },
  { id: 4, type: "settlement", text: "4월 2주차 정산이 완료되었습니다 (₩450,000)", time: "1일 전", action: { screen: "settlement" } },
  { id: 5, type: "booking", text: "오진우님이 5/13 바디프로필 촬영을 예약했습니다", time: "2일 전", action: { screen: "bookings", filter: "확정" } },
];

const SETTLEMENTS = [
  { id: 1, date: "2026.04.10", period: "4월 2주차", count: 8, total: 680000, fee: "10%", net: "₩612,000", status: "완료" },
  { id: 2, date: "2026.04.03", period: "4월 1주차", count: 5, total: 450000, fee: "10%", net: "₩405,000", status: "완료" },
  { id: 3, date: "2026.03.27", period: "3월 4주차", count: 6, total: 520000, fee: "10%", net: "₩468,000", status: "완료" },
  { id: 4, date: "2026.03.20", period: "3월 3주차", count: 4, total: 320000, fee: "10%", net: "₩288,000", status: "완료" },
];

export default function BusinessApp() {
  const [adminCategories] = useCategories();
  const [feeRate] = useFeeRate();
  const [bizFees] = useBusinessFees();
  const [categoryIcons] = useCategoryIcons();
  const [noShowReports, addNoShowReport] = useNoShowReports();
  const [ads] = useAds();
  const getCatIcon = (name: string) => resolveCatIcon(name, categoryIcons);
  const CATEGORIES = [{ name: "전체", Icon: LayoutGrid }, ...adminCategories.map(n => ({ name: n, Icon: getCatIcon(n) }))];
  const HOME_CATEGORY_GRID = adminCategories.map(n => ({ name: n, Icon: getCatIcon(n) }));
  const [homeKeywords] = useHomeKeywords();
  const myFee = getFeeForBusiness("루미에르 스튜디오", feeRate, bizFees);
  const [screen, setScreen] = useState<Screen>("home");
  const [tab, setTab] = useState<Tab>("home");
  const [sort, setSort] = useState<Sort>("payments");
  const [sortOpen, setSortOpen] = useState(false);
  const [adIdx, setAdIdx] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [activeKeyword, setActiveKeyword] = useState("인기 검색어");
  const [freeKeyword, setFreeKeyword] = useState<HomeKeyword | null>(null);
  const [homeSearchInput, setHomeSearchInput] = useState("");
  // 한 업체 계정에 스튜디오 여러 개 가능, 각 스튜디오 = 단일 카테고리
  type MyStudio = { id: string; name: string; category: string; address: string; intro: string; photoCount: number; tags: string[] };
  const [myStudios, setMyStudios] = useState<MyStudio[]>([
    { id: "s-1", name: "루미에르 스튜디오", category: "프로필", address: "서울시 강남구 역삼동 123-4", intro: `✨ 루미에르 스튜디오 — 자연광이 가장 따뜻한 시간
'루미에르(Lumière)'는 프랑스어로 '빛'을 뜻합니다. 과장된 보정이 아닌, 자연광 속에서 가장 편안한 당신의 얼굴을 기록하는 강남 역삼 프로필 전문 스튜디오입니다.

👤 작가 소개
12년 경력의 이현우 실장과 7년 경력의 김지혜 팀장이 함께합니다. 2014년 오픈 이후 누적 10,000명 이상의 프로필을 촬영했으며, 삼성·LG·현대·카카오 등 대기업 임직원 프로필부터 취업·이직 준비생, SNS·배우 프로필까지 다양한 현장을 담아왔습니다.

🎯 저희가 추구하는 톤
과한 보정을 지양합니다. 얼굴형을 억지로 좁히거나 피부를 인형처럼 매끈하게 만들지 않아요. 원본이 가진 자연스러운 결을 살리고, 5년 뒤에 봐도 어색하지 않은 프로필을 만드는 것이 목표입니다.

📋 촬영 프로세스
1) 예약 — 포토팟 앱에서 원하시는 날짜·시간 선택
2) 사전 상담 — 촬영 1~2일 전 카톡으로 복장·컨셉 무료 상담
3) 도착 & 준비 — 전용 탈의실·파우더룸 이용
4) 촬영 — 1컨셉 기준 30분, 200~300컷 테스트 후 선별
5) 현장 셀렉 — 마음에 드는 컷 즉시 선택
6) 보정 — 1주일 이내 이메일로 보정본 전달
7) 재수정 — 최종 보정본 확인 후 1회 무료 재수정

🏢 시설·장비
• 면적: 25평 (메인 촬영 세트 3구역 + 탈의실 + 파우더룸)
• 카메라: Canon EOS R5 (풀프레임 4,500만 화소)
• 렌즈: 35mm·50mm·85mm 단렌즈 3종
• 조명: Profoto B10 × 4기 (자연광 미러링 세팅)
• 배경지: 화이트·그레이·베이지·블랙 4색

💼 패키지 상세
🎯 1컨셉 (기본) · ₩270,000 — 촬영 30분 / 보정본 4컷 / 단일 배경
🎯 2컨셉 (가장 인기) · ₩420,000 — 촬영 60분 / 보정본 7컷 / 배경 2색
🎯 3컨셉 (프리미엄) · ₩580,000 — 촬영 90분 / 보정본 12컷 / 배경 3색 + 헤어 타임

📌 이용 안내
🚇 강남역 2번 출구 도보 5분, 역삼역 3번 출구 도보 7분
🚗 건물 지하주차장 1시간 무료
👕 복장: 면·린넨 소재 권장, 여벌 2벌 지참

🎁 이번 달 이벤트
• 리뷰 작성 시 다음 촬영 ₩20,000 할인 쿠폰
• 친구 추천 시 양측 각 ₩10,000 적립`, photoCount: 6, tags: ["증명사진", "취업프로필", "이력서"] },
    { id: "s-2", name: "루미에르 비즈컷", category: "비즈니스", address: "서울시 강남구 역삼동 123-4 별관", intro: "임직원·대표 프로필 전용 스튜디오. 팀 촬영 공간 별도.", photoCount: 4, tags: ["사내프로필", "대표프로필", "단체촬영"] },
  ]);
  const [editingStudioId, setEditingStudioId] = useState<string | null>(null); // null = 새 등록
  const [selectedCat, setSelectedCat] = useState<string>("프로필");
  const [studioTagInputs, setStudioTagInputs] = useState<[string, string, string]>(["", "", ""]);
  const [introText, setIntroText] = useState<string>("");
  const [replyModal, setReplyModal] = useState<{ idx: number; author: string; text: string } | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [savedReplies, setSavedReplies] = useState<Record<number, string>>({});
  const [calDate, setCalDate] = useState(10);
  const [calMonth, setCalMonth] = useState(5); // 1~12
  const [calYear, setCalYear] = useState(2026);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("전체");
  const [selectedBooking, setSelectedBooking] = useState(ALL_BOOKINGS[0]);
  const [bookings, setBookings] = useState(ALL_BOOKINGS);
  const [registered, setRegistered] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const [settlementMonth, setSettlementMonth] = useState("4월");
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0]);
  const [categoryCat, setCategoryCat] = useState("프로필");
  const historyStack = useRef<{ s: Screen; t: Tab }[]>([]);
  const touchStartX = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setAdIdx(prev => Math.min(prev + 1, HOME_AD_PAGES.length - 1));
    if (diff < -50) setAdIdx(prev => Math.max(prev - 1, 0));
  };
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [manualMemo, setManualMemo] = useState("");

  useEffect(() => {
    if (screen !== "home") return;
    const timer = window.setInterval(() => {
      setAdIdx(prev => (prev + 1) % HOME_AD_PAGES.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [screen]);

  // 어드민에서 키워드가 변경/삭제된 경우 현재 선택값을 안전하게 리셋
  useEffect(() => {
    if (homeKeywords.length === 0) return;
    if (!homeKeywords.some(k => k.label === activeKeyword)) {
      setActiveKeyword(homeKeywords[0].label);
    }
  }, [homeKeywords, activeKeyword]);

  // 화면 전환 시 내부 스크롤 최상단으로
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [screen, selectedStudio]);

  // 홈 검색창 입력 → 카테고리 탭으로 전환하며 자유 키워드 매칭
  const runHomeSearch = () => {
    const q = homeSearchInput.trim();
    if (!q) return;
    const entry: HomeKeyword = { label: q, aliases: [q] };
    setFreeKeyword(entry);
    setActiveKeyword(q);
    setCategoryCat("전체");
    historyStack.current.push({ s: screen, t: tab });
    setScreen("category");
    setTab("category");
    setHomeSearchInput("");
  };

  // 홈 추천 검색어 칩 클릭 → 카테고리 탭으로 전환하며 필터 적용
  const applyHomeKeyword = (label: string) => {
    setActiveKeyword(label);
    const entry = homeKeywords.find(k => k.label === label);
    if (!label || label === "인기" || label === "인기 검색어" || !entry) {
      setFreeKeyword(null);
      setCategoryCat("전체");
    } else if (entry.aliases.length === 0 && adminCategories.includes(label)) {
      setFreeKeyword(null);
      setCategoryCat(label);
    } else {
      setFreeKeyword(entry);
      setCategoryCat("전체");
    }
    historyStack.current.push({ s: screen, t: tab });
    setScreen("category");
    setTab("category");
  };

  const parseStudioPrice = (price: string) => Number(price.replace(/,/g, ""));

  // 추천 스튜디오 = 어드민에서 '노출중'으로 편성한 광고 기준 (순서 유지).
  // 매칭 스튜디오 없거나 광고 0건이면 paymentCount 상위 4곳으로 fallback.
  const promotedStudios = (() => {
    const adStudios = ads
      .filter(a => a.status === "노출중")
      .map(a => STUDIOS.find(s => s.name === a.studio))
      .filter((s): s is typeof STUDIOS[number] => !!s);
    if (adStudios.length > 0) return adStudios.slice(0, 4);
    return [...STUDIOS].sort((a, b) => b.paymentCount - a.paymentCount).slice(0, 4);
  })();
  const hotStudios = [...STUDIOS].sort((a, b) => {
    if (b.paymentCount !== a.paymentCount) return b.paymentCount - a.paymentCount;
    return b.rating - a.rating;
  }).slice(0, 5);

  // 카테고리 탭: freeKeyword 우선 → 없으면 categoryCat + 지역 + 정렬
  const catFiltered = STUDIOS
    .filter(s => {
      if (freeKeyword) {
        const haystack = `${s.name} ${s.desc} ${s.area} ${s.cat} ${s.tags.join(" ")}`;
        return matchesKeyword(haystack, freeKeyword);
      }
      return categoryCat === "전체" || s.cat === categoryCat;
    })
    .filter(s => {
      if (selectedRegion === "전체" || !selectedRegion.trim()) return true;
      return s.area.toLowerCase().includes(selectedRegion.trim().toLowerCase());
    });
  const catSorted = [...catFiltered].sort((a, b) => {
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

  // 편집 중인 스튜디오 조회 (없으면 빈 값 = 신규)
  const editingStudio = editingStudioId ? myStudios.find(s => s.id === editingStudioId) ?? null : null;

  const handleSaveStudio = () => {
    const cleanedTags = studioTagInputs.map(t => t.trim()).filter(Boolean).slice(0, 3);
    const finalIntro = introText.trim() || "스튜디오 소개를 작성하세요";
    if (editingStudioId && editingStudio) {
      setMyStudios(prev => prev.map(s => s.id === editingStudioId ? { ...s, category: selectedCat, tags: cleanedTags, intro: finalIntro } : s));
    } else {
      const newId = `s-${Date.now()}`;
      setMyStudios(prev => [...prev, {
        id: newId,
        name: "새 스튜디오",
        category: selectedCat,
        address: "주소 입력",
        intro: finalIntro,
        photoCount: 0,
        tags: cleanedTags,
      }]);
    }
    setRegistered(true);
    setEditingStudioId(null);
    setStudioTagInputs(["", "", ""]);
    setIntroText("");
  };

  const handleEditStudio = (id: string) => {
    const s = myStudios.find(x => x.id === id);
    if (!s) return;
    setEditingStudioId(id);
    setSelectedCat(s.category);
    setStudioTagInputs([s.tags[0] ?? "", s.tags[1] ?? "", s.tags[2] ?? ""]);
    setIntroText(s.intro ?? "");
    setRegistered(false);
  };

  const handleDeleteStudio = (id: string) => {
    if (!confirm("이 스튜디오를 삭제할까요?")) return;
    setMyStudios(prev => prev.filter(s => s.id !== id));
  };

  const handleAddNewStudio = () => {
    setEditingStudioId(null);
    setSelectedCat(adminCategories[0] ?? "프로필");
    setStudioTagInputs(["", "", ""]);
    setIntroText("");
    setRegistered(false);
  };

  const todayBookings = bookings.filter(b => b.month === 5 && b.date === 10 && b.status !== "완료");
  const monthBookings = bookings.filter(b => b.month === calMonth);
  const dateBookings = monthBookings.filter(b => b.date === calDate);
  const filteredBookings = bookingFilter === "전체" ? dateBookings : dateBookings.filter(b => b.status === bookingFilter);
  const datesWithBookings = [...new Set(monthBookings.map(b => b.date))];

  const totalRevenue = bookings.filter(b => b.status === "완료" || b.status === "확정").reduce((s, b) => s + b.price, 0);
  const pendingAmount = bookings.filter(b => b.status === "확정").reduce((s, b) => s + b.price, 0);

  const handleBookingAction = (id: number, action: "accept" | "reject") => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action === "accept" ? "확정" : "취소완료" } : b));
    setScreen("bookings");
  };
  const openDetail = (studio: (typeof STUDIOS)[number]) => {
    setSelectedStudio(studio);
    navigate("detail");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <Link href="/" className="text-sm text-primary mb-4 hover:underline">← 메인으로</Link>
      <h2 className="text-xl font-bold mb-6 text-gray-900">업체 화면</h2>

      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[28px] bg-white shadow-xl" style={{ height: 780 }}>

        {/* Header */}
        {screen !== "login" && (
          <div className="relative z-10 bg-white pt-5 pl-2 pr-4 pb-2 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {screen !== "home" && <button onClick={goBack} className="text-gray-500 text-lg flex items-center justify-center -mr-1">‹</button>}
                <button onClick={() => { setScreen("home"); setTab("home"); }} className="flex items-center">
                  <BrandMark />
                </button>
              </div>
              <button onClick={() => { navigate("notifications"); setHasNotif(false); }} className="relative text-gray-500 p-1">
                <Bell size={20} strokeWidth={1.5} />
                {hasNotif && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
            </div>
          </div>
        )}

        <div ref={scrollRef} className="overflow-y-auto bg-white" style={{ height: screen === "login" ? "780px" : "calc(780px - 61px - 56px)" }}>

          {/* ===== HOME (IA-010: 소비자와 동일한 스튜디오 탐색) ===== */}
          {screen === "home" && (
            <div className="pb-6">
              <div className="px-4 pt-2">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-primary transition-colors">
                  <Search size={16} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={homeSearchInput}
                    onChange={e => setHomeSearchInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") runHomeSearch(); }}
                    placeholder=""
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                  {homeSearchInput && (
                    <button
                      onClick={() => setHomeSearchInput("")}
                      aria-label="검색어 지우기"
                      className="shrink-0 text-gray-400 hover:text-gray-600"
                    >✕</button>
                  )}
                  {homeSearchInput.trim() && (
                    <button
                      onClick={runHomeSearch}
                      className="shrink-0 rounded-full bg-primary text-white text-xs font-medium px-3 py-1"
                    >검색</button>
                  )}
                </div>

                {homeKeywords.length > 0 && (
                  <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    {homeKeywords.map(k => {
                      if (k.label === "인기" || k.label === "인기 검색어") {
                        return (
                          <span
                            key={k.label}
                            className="shrink-0 whitespace-nowrap text-[13px] font-medium text-primary pr-1"
                            style={{ letterSpacing: "-0.01em" }}
                          >
                            {k.label}
                          </span>
                        );
                      }
                      return (
                        <button
                          key={k.label}
                          onClick={() => applyHomeKeyword(k.label)}
                          className="shrink-0 whitespace-nowrap text-xs text-gray-600 hover:text-primary underline underline-offset-4 decoration-gray-300 hover:decoration-primary decoration-1 transition-colors"
                          style={{ letterSpacing: "-0.01em" }}
                        >
                          {k.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mx-4 mt-5 rounded-3xl bg-gray-50 p-3">
                <p className="text-[11px] font-semibold text-gray-700">이번 주 추천 배너</p>
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
                    <p className="text-[11px] text-gray-400">예약·평점 TOP</p>
                    <h3 className="text-[15px] font-bold text-gray-900">지금 많이 찾는 스튜디오</h3>
                  </div>
                  <button
                    onClick={() => { setCategoryCat("전체"); setScreen("category"); setTab("category"); }}
                    className="text-xs font-medium text-gray-400 hover:text-primary">전체보기 →</button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
                  {hotStudios.map((studio, index) => (
                    <button
                      key={studio.id}
                      onClick={() => openDetail(studio)}
                      className="flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        {index < 3 && (
                          <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-semibold text-white">
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{studio.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 min-w-0">
                          <p className="truncate text-[11px] text-gray-400 min-w-0">{studio.area}</p>
                          {studio.travelAvailable && (
                            <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                              출장 가능
                            </span>
                          )}
                        </div>
                        {studio.tags.length > 0 && (
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {studio.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-gray-500">
                          <span>예약 {studio.paymentCount}건</span>
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
                    <p className="text-[11px] text-gray-400">에디터 셀렉션</p>
                    <h3 className="text-[15px] font-bold text-gray-900">지금 추천하는 스튜디오</h3>
                  </div>
                  <button
                    onClick={() => { setCategoryCat("전체"); setScreen("category"); setTab("category"); }}
                    className="text-xs font-medium text-gray-400 hover:text-primary">전체보기 →</button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
                  {promotedStudios.map((studio, index) => (
                    <button
                      key={studio.id}
                      onClick={() => openDetail(studio)}
                      className="flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[9px] font-semibold text-gray-500">
                          AD #{index + 1}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{studio.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 min-w-0">
                          <p className="truncate text-[11px] text-gray-400 min-w-0">{studio.area}</p>
                          {studio.travelAvailable && (
                            <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                              출장 가능
                            </span>
                          )}
                        </div>
                        {studio.tags.length > 0 && (
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {studio.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2 text-[11px]">
                          <span className="font-bold text-gray-900">₩{parseStudioPrice(studio.price).toLocaleString()}</span>
                          <span className="text-yellow-500">★ {studio.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ===== CATEGORY (IA-011) ===== */}
          {screen === "category" && (
            <div>
              {/* 검색창 */}
              <div className="px-4 pt-3">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 focus-within:border-primary transition-colors">
                  <Search size={16} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={homeSearchInput}
                    onChange={e => setHomeSearchInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") runHomeSearch(); }}
                    placeholder="스튜디오·지역·키워드 검색"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                  {homeSearchInput && (
                    <button onClick={() => setHomeSearchInput("")} aria-label="검색어 지우기" className="shrink-0 text-gray-400 hover:text-gray-600">✕</button>
                  )}
                  {homeSearchInput.trim() && (
                    <button onClick={runHomeSearch} className="shrink-0 rounded-full bg-primary text-white text-xs font-medium px-3 py-1">검색</button>
                  )}
                </div>
              </div>

              {/* 카테고리 칩 — 가로 스크롤 */}
              <div className="mt-3 no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1">
                {CATEGORIES.map(c => {
                  const active = !freeKeyword && categoryCat === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => { setFreeKeyword(null); setCategoryCat(c.name); }}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-all shrink-0 ${active ? "border-primary bg-primary/5 text-primary font-semibold" : "border-gray-200 bg-white text-gray-600"}`}
                    >
                      <c.Icon size={14} strokeWidth={1.7} />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* 필터 바: 지역 + 정렬 */}
              <div className="mt-3 px-4 flex items-center gap-2">
                <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-2 border border-gray-100">
                  <MapPin size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                  <input type="text" value={selectedRegion === "전체" ? "" : selectedRegion} onChange={e => setSelectedRegion(e.target.value || "전체")}
                    placeholder="지역 검색" className="flex-1 min-w-0 bg-transparent text-xs outline-none placeholder:text-gray-400" />
                  {selectedRegion !== "전체" && (
                    <button onClick={() => setSelectedRegion("전체")} className="text-gray-400 text-xs shrink-0">✕</button>
                  )}
                </div>

                {(() => {
                  const sortItems = [
                    { key: "payments" as Sort, label: "예약순" },
                    { key: "rating" as Sort, label: "평점순" },
                    { key: "distance" as Sort, label: "거리순" },
                  ];
                  const currentLabel = sortItems.find(i => i.key === sort)?.label ?? "예약순";
                  return (
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setSortOpen(v => !v)}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                        <SlidersHorizontal size={13} strokeWidth={1.8} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{currentLabel}</span>
                        <ChevronDown size={13} strokeWidth={2} className={`text-gray-500 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                      </button>
                      {sortOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                          <div className="absolute right-0 top-full z-30 mt-1.5 min-w-[120px] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                            {sortItems.map(item => (
                              <button
                                key={item.key}
                                onClick={() => { setSort(item.key); setSortOpen(false); }}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                                  sort === item.key ? "bg-primary/5 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"
                                }`}>
                                {item.label}
                                {sort === item.key && <Check size={14} strokeWidth={2.5} className="text-primary" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* 결과 요약 + 자유검색 칩 */}
              <div className="mt-3 px-4">
                {freeKeyword ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 shrink-0">
                      🔎 {freeKeyword.label}
                      <button onClick={() => setFreeKeyword(null)} className="text-primary/60 hover:text-primary ml-0.5" aria-label="검색어 삭제">✕</button>
                    </span>
                    <p className="text-xs text-gray-500">검색 결과 {catSorted.length}곳</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">&lsquo;{categoryCat}&rsquo; 스튜디오 {catSorted.length}곳</p>
                )}
              </div>

              {/* AD 배너 */}
              <div className="mx-4 mt-3 overflow-hidden rounded-xl">
                <div className="bg-gradient-to-r from-rose-100 to-pink-200 rounded-xl p-4 flex items-center gap-3 relative">
                  <span className="absolute top-2 left-2 bg-primary/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">AD</span>
                  <div className="w-14 h-14 bg-white/60 rounded-lg flex items-center justify-center shrink-0 text-gray-400"><ImageIcon size={22} strokeWidth={1.5} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">카테고리별 추천 배너</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">관리자가 등록한 광고 배너 영역</p>
                  </div>
                </div>
              </div>

              {/* 리스트 */}
              <div className="px-4 pb-4">
                {catSorted.map(s => (
                  <div key={s.id} onClick={() => openDetail(s)}
                    className="flex gap-3 py-3 border-b border-gray-50 cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={22} strokeWidth={1.5} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{s.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                        <p className="text-xs text-gray-400 shrink-0">{s.cat} · {s.area}</p>
                        {s.travelAvailable && (
                          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                            출장 가능
                          </span>
                        )}
                      </div>
                      {s.tags.length > 0 && (
                        <div className="mt-1 flex gap-1 flex-wrap">
                          {s.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold">₩{parseStudioPrice(s.price).toLocaleString()}</span>
                        <span className="text-xs text-yellow-500">★ {s.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                <div className="flex items-center gap-2 mt-1 mb-4 flex-wrap">
                  <span className="text-xs text-yellow-500">★ {selectedStudio.rating}</span>
                  <span className="text-xs text-gray-400">리뷰 {selectedStudio.reviews}개</span>
                  {selectedStudio.travelAvailable && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">출장 가능</span>}
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
                    {[
                      { name: "김**", rating: 5, text: "분위기 너무 좋아요!", reply: "감사합니다! 다음에도 좋은 촬영 하겠습니다." },
                      { name: "이**", rating: 4, text: "시설이 깔끔해요", reply: null },
                    ].map((r, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium">{r.name}</span><span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div>
                        <p className="text-xs text-gray-600">{r.text}</p>
                        {r.reply && (
                          <div className="bg-white rounded-lg p-2.5 mt-2 border border-gray-100">
                            <p className="text-[10px] text-primary font-medium mb-0.5">업체 답변</p>
                            <p className="text-xs text-gray-600">{r.reply}</p>
                          </div>
                        )}
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
              <button onClick={goBack} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
              <h2 className="text-base font-bold mb-4">실적 대시보드</h2>

              {/* 조회 기간 셀렉터 */}
              <div className="flex gap-1.5 mb-4">
                {[
                  { k: "1m", label: "1개월" },
                  { k: "3m", label: "3개월" },
                  { k: "6m", label: "6개월" },
                  { k: "1y", label: "1년" },
                ].map((p, i) => (
                  <button key={p.k}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                      i === 1 ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200"
                    }`}>{p.label}</button>
                ))}
              </div>

              {/* 적용 수수료율 안내 */}
              <div className="mb-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
                <div>
                  <p className="text-[10px] text-gray-500">내 스튜디오 적용 수수료율</p>
                  <p className="text-sm font-bold text-primary">
                    {myFee.rate}%
                    {myFee.isOverride && <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">개별</span>}
                    {!myFee.isOverride && <span className="ml-1.5 text-[10px] text-gray-400">(기본값)</span>}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 text-right">수수료율 변경은<br/>어드민 문의</p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10 text-center">
                  <p className="text-[10px] text-gray-500 mb-1">오늘 예약</p>
                  <p className="text-xl font-bold text-primary">{todayBookings.length}<span className="text-[10px] font-normal ml-0.5">건</span></p>
                </div>
                <div className="bg-green-50 rounded-2xl p-3 border border-green-100 text-center overflow-hidden">
                  <p className="text-[10px] text-gray-500 mb-1">이번 달</p>
                  <p className="text-sm font-bold text-green-600 truncate">₩{(totalRevenue / 10000).toFixed(0)}<span className="text-[10px] font-normal">만원</span></p>
                </div>
                <button onClick={() => { navigate("bookings"); setBookingFilter("예약 취소 중"); }}
                  className="bg-red-50 rounded-2xl p-3 border border-red-100 text-center">
                  <p className="text-[10px] text-gray-500 mb-1">취소 요청</p>
                  <p className="text-xl font-bold text-red-500">{bookings.filter(b => b.status === "예약 취소 중").length}<span className="text-[10px] font-normal ml-0.5">건</span></p>
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
                <button key={b.id} onClick={() => { setSelectedBooking(b); navigate("bookingDetail"); }}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2 text-left">
                  <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Camera size={18} strokeWidth={1.5} /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.cat} · {b.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${b.status === "예약 취소 중" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{b.status}</span>
                    <p className="text-xs font-bold mt-1">₩{b.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ===== BIZ INFO (IA-065 업체 기본정보 수정) ===== */}
          {screen === "bizInfo" && (
            <div className="p-4">
              <button onClick={goBack} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
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
              <h2 className="text-base font-bold mb-4">알림</h2>
              {NOTIFICATIONS.map(n => (
                <button key={n.id} onClick={() => {
                  if (!n.action) return;
                  if (n.action.filter) setBookingFilter(n.action.filter);
                  navigate(n.action.screen);
                  setTab("my");
                }}
                  className="flex gap-3 py-3 border-b border-gray-50 w-full text-left hover:bg-gray-50 cursor-pointer">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === "booking" ? "bg-primary/10 text-primary" : n.type === "cancel" ? "bg-red-50 text-red-500" : n.type === "review" ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                  }`}>
                    {n.type === "booking" ? <Calendar size={16} strokeWidth={1.5} /> : n.type === "cancel" ? <X size={16} strokeWidth={1.5} /> : n.type === "review" ? <Star size={16} strokeWidth={1.5} /> : <DollarSign size={16} strokeWidth={1.5} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  <span className="text-gray-300 text-xs mt-2 shrink-0">›</span>
                </button>
              ))}
            </div>
          )}

          {/* ===== STUDIO REGISTER ===== */}
          {screen === "register" && !registered && (() => {
            const isEdit = !!editingStudio;
            return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold">{isEdit ? `${editingStudio!.name} 수정` : "새 스튜디오 등록"}</h2>
                {myStudios.length > 0 && (
                  <button onClick={() => { setRegistered(true); setEditingStudioId(null); }}
                    className="text-xs text-gray-400">취소</button>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-[11px] text-amber-800">
                💡 한 스튜디오는 한 카테고리에 등록됩니다. 여러 카테고리 운영 시 각각 별도 스튜디오로 등록해주세요. (예: &ldquo;루미에르 스튜디오&rdquo; - 프로필 / &ldquo;루미에르 비즈컷&rdquo; - 비즈니스)
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">스튜디오 이름</label>
                  <input type="text" defaultValue={isEdit ? editingStudio!.name : ""} placeholder="예: 루미에르 스튜디오"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">주소</label>
                  <input type="text" defaultValue={isEdit ? editingStudio!.address : ""} placeholder="서울시 강남구 ..."
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">연락처</label>
                  <input type="text" defaultValue="02-1234-5678" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 outline-none focus:border-primary" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-gray-500 font-medium">스튜디오 소개</label>
                    <span className="text-[10px] text-gray-400">소비자 상세 화면에 노출 · 최대 4,000자</span>
                  </div>
                  <textarea
                    value={introText}
                    onChange={e => setIntroText(e.target.value)}
                    rows={8}
                    maxLength={4000}
                    placeholder="브랜드 스토리·작가 소개·촬영 프로세스·시설·패키지·FAQ·오시는 길 등을 자유롭게 작성해주세요. 섹션 이모지(✨👤📋🏢💼📌❓🎁📍)로 구분하면 소비자에게 더 잘 읽힙니다. (최대 4,000자)"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 outline-none focus:border-primary resize-y"
                  />
                  <div className="flex items-center justify-end mt-1">
                    <span className={`text-[10px] ${introText.length > 3800 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                      {introText.length.toLocaleString()} / 4,000자
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-gray-500 font-medium">상세 카테고리 해시태그 (3개)</label>
                    <span className="text-[10px] text-gray-400">소비자 카드·상세에 #형식으로 노출</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(() => {
                      // 대분류에 맞춘 상세 카테고리 예시 (placeholder 자동 전환)
                      const SUBCAT_HINTS: Record<string, [string, string, string]> = {
                        "프로필": ["증명사진", "취업프로필", "이력서"],
                        "바디프로필": ["일반바디", "피트니스", "커플바디"],
                        "웨딩": ["본식스냅", "야외웨딩", "리마인드"],
                        "가족": ["3대가족", "돌잔치", "가족나들이"],
                        "반려동물": ["강아지", "고양이", "반려가족"],
                        "비즈니스": ["사내프로필", "단체촬영", "음식"],
                        "커플": ["기념일", "데이트스냅", "프리웨딩"],
                        "아기": ["신생아", "100일", "돌"],
                      };
                      const hints = SUBCAT_HINTS[selectedCat] ?? ["태그1", "태그2", "태그3"];
                      return [0, 1, 2].map(i => (
                        <div key={i} className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-primary">
                          <span className="text-sm text-gray-400 mr-1">#</span>
                          <input
                            type="text"
                            value={studioTagInputs[i]}
                            onChange={e => {
                              const next: [string, string, string] = [...studioTagInputs] as [string, string, string];
                              next[i] = e.target.value.replace(/[\s#]/g, "");
                              setStudioTagInputs(next);
                            }}
                            maxLength={10}
                            placeholder={hints[i]}
                            className="flex-1 min-w-0 bg-transparent text-sm outline-none"
                          />
                        </div>
                      ));
                    })()}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">※ 대분류({selectedCat}) 안의 상세 카테고리로 입력하세요. 예: {({ "프로필": "증명사진·취업프로필·이력서", "바디프로필": "일반바디·피트니스·커플바디", "웨딩": "본식스냅·야외웨딩·리마인드", "가족": "3대가족·돌잔치·가족나들이", "반려동물": "강아지·고양이·반려가족", "비즈니스": "사내프로필·단체촬영·음식", "커플": "기념일·데이트스냅·프리웨딩", "아기": "신생아·100일·돌" } as Record<string, string>)[selectedCat] ?? "자유 입력"}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">카테고리 (한 스튜디오 = 한 카테고리)</label>
                  <div className="flex flex-wrap gap-2">
                    {adminCategories.map(c => (
                      <button key={c} onClick={() => setSelectedCat(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedCat === c ? "bg-primary text-white border-primary" : "bg-white text-gray-400 border-gray-200"
                        }`}>
                        {selectedCat === c ? "✓ " : ""}{c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 가격 패키지 + 예약금 + 버퍼 시간 (단일 카테고리) */}
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">가격 패키지 · 예약금 · 버퍼 시간</label>
                  <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                    <p className="text-sm font-bold text-gray-900 mb-2">{selectedCat} 촬영</p>

                    <p className="text-[10px] text-gray-500 mb-1">가격 패키지 (여러 개 가능)</p>
                    <div className="space-y-1.5 mb-2">
                      {[
                        { title: "1컨셉", price: 270000, desc: "보정본 4컷 · 30분 소요" },
                        { title: "2컨셉", price: 420000, desc: "보정본 7컷 · 60분 소요" },
                        { title: "3컨셉", price: 580000, desc: "보정본 12컷 · 90분 소요" },
                      ].map((pkg, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-2 border border-gray-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <input type="text" defaultValue={pkg.title} placeholder="예: 1컨셉 / 4컷 / 기본"
                              className="flex-1 bg-gray-50 rounded px-2 py-1 text-xs border border-transparent outline-none focus:border-primary" />
                            <div className="flex items-center gap-1">
                              <span className="text-xs">₩</span>
                              <input type="text" defaultValue={pkg.price.toLocaleString()}
                                className="w-24 bg-gray-50 rounded px-2 py-1 text-xs text-right border border-transparent outline-none focus:border-primary" />
                            </div>
                          </div>
                          <input type="text" defaultValue={pkg.desc} placeholder="보정본 컷수·소요시간·포함내역"
                            className="w-full bg-gray-50 rounded px-2 py-1 text-[11px] text-gray-500 border border-transparent outline-none focus:border-primary" />
                        </div>
                      ))}
                      <button className="w-full text-xs text-primary bg-white border border-dashed border-primary/30 rounded-lg py-1.5 font-medium">
                        + 패키지 추가
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-500 mb-1 mt-2">추가 옵션 (선택)</p>
                    <div className="space-y-1 mb-2">
                      {[{ name: "원본 추가", price: 40000 }, { name: "보정 컷 추가", price: 40000 }].map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-white rounded-lg p-1.5 border border-gray-100">
                          <input type="text" defaultValue={opt.name} className="flex-1 bg-gray-50 rounded px-2 py-1 text-xs border border-transparent outline-none focus:border-primary" />
                          <span className="text-xs">+₩</span>
                          <input type="text" defaultValue={opt.price.toLocaleString()} className="w-20 bg-gray-50 rounded px-2 py-1 text-xs text-right border border-transparent outline-none focus:border-primary" />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      <div>
                        <p className="text-[10px] text-gray-500 mb-0.5">예약금</p>
                        <input type="text" defaultValue="₩50,000"
                          className="w-full bg-white rounded-lg px-2 py-1.5 text-xs border border-gray-100 outline-none focus:border-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-0.5">버퍼 시간 (청소·준비)</p>
                        <select defaultValue="30" className="w-full bg-white rounded-lg px-2 py-1.5 text-xs border border-gray-100 outline-none focus:border-primary">
                          <option value="0">없음</option>
                          <option value="15">15분</option>
                          <option value="30">30분</option>
                          <option value="60">1시간</option>
                          <option value="90">1시간 30분</option>
                          <option value="120">2시간</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 포트폴리오 업로드 (단일 카테고리) */}
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">포트폴리오 (최대 30장, 동영상 불가)</label>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold">{selectedCat} 포트폴리오</p>
                      <span className="text-[10px] text-gray-400">{isEdit ? editingStudio!.photoCount : 0} / 30장</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(() => {
                        const count = isEdit ? editingStudio!.photoCount : 0;
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
                      <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 accent-[#E85D93]" />
                      <span className="text-xs flex-1">{opt.name}</span>
                      <input type="text" defaultValue={`₩${opt.defaultPrice}`} className="w-24 bg-white rounded-lg px-2 py-1.5 text-xs border border-gray-200 text-right outline-none" />
                    </div>
                  ))}
                </div>

                {/* 출장 가능 + 부가세 (REQ-103) */}
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 flex-1 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#E85D93]" />
                    <span className="text-xs">🚗 출장 가능</span>
                  </label>
                  <label className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 flex-1 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#E85D93]" />
                    <span className="text-xs">💰 VAT 포함</span>
                  </label>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">운영 시간 설정</p>
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
                </div>

                {/* 예약 가능 기간 (업체별 설정) */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">고객 예약 가능 기간</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">최소 예약</p>
                      <select defaultValue="1" className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-100 outline-none focus:border-primary">
                        <option value="0">당일</option>
                        <option value="1">1일 전</option>
                        <option value="3">3일 전</option>
                        <option value="7">7일 전</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">최대 예약</p>
                      <select defaultValue="90" className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-100 outline-none focus:border-primary">
                        <option value="30">30일 이내</option>
                        <option value="60">60일 이내</option>
                        <option value="90">90일 이내</option>
                        <option value="180">6개월 이내</option>
                        <option value="365">1년 이내</option>
                        <option value="unlimited">무제한</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button onClick={handleSaveStudio}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">
                  {isEdit ? "수정 저장" : "등록하기"}
                </button>
              </div>
            </div>
            );
          })()}

          {/* Studio Registered — My Studios List */}
          {screen === "register" && registered && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold">내 스튜디오 <span className="text-xs text-gray-400 font-normal">({myStudios.length}개)</span></h2>
                <button onClick={handleAddNewStudio}
                  className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium">+ 새 스튜디오 추가</button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-4 text-[11px] text-amber-800">
                💡 한 계정에 여러 스튜디오를 개별 등록·운영할 수 있습니다. 각 스튜디오는 단일 카테고리로 운영됩니다.
              </div>

              {myStudios.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <p className="text-sm text-gray-400 mb-3">등록된 스튜디오가 없습니다</p>
                  <button onClick={handleAddNewStudio}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium">첫 스튜디오 등록하기</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myStudios.map(s => (
                    <div key={s.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-28 flex items-center justify-center text-gray-400">
                        <ImageIcon size={36} strokeWidth={1} />
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold truncate">{s.name}</h3>
                            <p className="text-[10px] text-gray-400 truncate">{s.address}</p>
                          </div>
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">{s.category}</span>
                        </div>
                        {s.tags.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap mb-1">
                            {s.tags.map(t => (
                              <span key={t} className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">{s.intro}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                          <span>📸 {s.photoCount}/30장</span>
                          <span>·</span>
                          <span>⭐ 4.8</span>
                        </div>
                        <div className="flex gap-1.5 mt-3">
                          <button onClick={() => handleEditStudio(s.id)}
                            className="flex-1 bg-primary/5 text-primary text-xs font-medium py-2 rounded-lg">수정</button>
                          <button onClick={() => handleDeleteStudio(s.id)}
                            className="bg-red-50 text-red-500 text-xs font-medium py-2 px-3 rounded-lg">삭제</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {myStudios.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-primary/5 rounded-xl p-3 text-center border border-primary/10">
                    <p className="text-[10px] text-gray-500">총 예약</p>
                    <p className="text-lg font-bold text-primary">{bookings.length}건</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
                    <p className="text-[10px] text-gray-500">평균 평점</p>
                    <p className="text-lg font-bold text-yellow-600">4.8 ★</p>
                  </div>
                </div>
              )}
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
                {(["전체", "확정", "예약 취소 중", "완료"] as BookingFilter[]).map(f => (
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
                  <button onClick={() => { if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); setCalDate(1); }}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 text-sm">‹</button>
                  <span className="text-sm font-medium">{calYear}년 {calMonth}월</span>
                  <button onClick={() => { if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); setCalDate(1); }}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 text-sm">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {["일", "월", "화", "수", "목", "금", "토"].map(d => <span key={d} className="text-gray-400 py-1">{d}</span>)}
                  {/* 첫째 날 요일 오프셋 */}
                  {Array.from({ length: new Date(calYear, calMonth - 1, 1).getDay() }).map((_, i) => <span key={`empty-${i}`} />)}
                  {Array.from({ length: new Date(calYear, calMonth, 0).getDate() }).map((_, i) => {
                    const d = i + 1;
                    const hasBooking = calMonth === 5 && calYear === 2026 && datesWithBookings.includes(d);
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
              <p className="text-xs text-gray-500 mb-2 font-medium">{calMonth}월 {calDate}일 예약 ({filteredBookings.length}건)</p>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-400">해당 날짜에 예약이 없습니다</p>
                </div>
              ) : (
                <div>
                  <div className="space-y-2">
                    {filteredBookings.map(b => (
                      <button key={b.id} onClick={() => { setSelectedBooking(b); navigate("bookingDetail"); }}
                        className="w-full bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center text-left">
                        <div>
                          <p className="text-sm font-medium">{b.name}</p>
                          <p className="text-xs text-gray-400">{b.cat} · {b.time}</p>
                          <p className="text-xs font-bold mt-0.5">₩{b.price.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                            b.status === "예약 취소 중" ? "bg-amber-100 text-amber-700" :
                            b.status === "완료" ? "bg-gray-200 text-gray-500" :
                            b.status === "취소완료" ? "bg-gray-200 text-gray-400" :
                            b.status === "수기" ? "bg-orange-100 text-orange-700" :
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
              <button onClick={goBack} className="text-sm text-gray-400 mb-3">← 예약 관리</button>
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
                      selectedBooking.status === "예약 취소 중" ? "bg-amber-100 text-amber-700" :
                      selectedBooking.status === "완료" ? "bg-gray-200 text-gray-500" :
                      "bg-green-100 text-green-700"
                    }`}>{selectedBooking.status}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.status === "예약 취소 중" && (
                <div className="mb-4 rounded-2xl bg-amber-50 p-3 border border-amber-100">
                  <p className="text-sm font-medium mb-2 text-amber-700">고객이 예약 취소를 요청 중입니다</p>
                  {selectedBooking.cancelReason && (
                    <div className="bg-white rounded-lg p-2.5 mb-2 border border-amber-100">
                      <p className="text-[10px] text-gray-500 font-medium mb-0.5">취소 사유</p>
                      <p className="text-xs text-gray-700">{selectedBooking.cancelReason}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleBookingAction(selectedBooking.id, "reject")}
                      className="flex-1 bg-white text-gray-600 py-2.5 rounded-xl text-sm font-medium border border-amber-100">거절</button>
                    <button onClick={() => handleBookingAction(selectedBooking.id, "accept")}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium">취소 수락</button>
                  </div>
                </div>
              )}

              {(selectedBooking.status === "확정" || selectedBooking.status === "완료") && (() => {
                const alreadyReported = noShowReports.some(r => r.bookingId === String(selectedBooking.id));
                const currentCount = countNoShowsFor(noShowReports, selectedBooking.name);
                return (
                <>
                  <div className="mb-4 rounded-2xl bg-gray-50 p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">고객이 방문하지 않은 경우 (노쇼)</p>
                    {alreadyReported ? (
                      <div className="w-full bg-amber-50 text-amber-700 py-2.5 rounded-xl text-sm font-medium border border-amber-200 text-center">
                        ⚠️ 노쇼 신고 완료 · 어드민 확인 대기
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const reason = prompt("노쇼 사유를 간단히 적어주세요 (선택)") || "";
                          addNoShowReport({
                            bookingId: String(selectedBooking.id),
                            consumerName: selectedBooking.name,
                            studioName: "루미에르 스튜디오",
                            reason: reason.trim() || undefined,
                          });
                          alert(`노쇼 신고가 접수되었습니다.\n• 소비자(${selectedBooking.name})에게 알림 발송\n• 어드민 회원관리에 누적 카운트 자동 반영\n• 현재 ${selectedBooking.name}님 누적 노쇼: ${currentCount + 1}회`);
                        }}
                        className="w-full bg-white text-gray-700 py-2.5 rounded-xl text-sm font-medium border border-gray-300 hover:border-red-300 hover:text-red-600">
                        ⚠️ 노쇼 처리
                      </button>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      노쇼 누적은 소비자 이용제한 정책에 반영될 수 있습니다
                      {currentCount > 0 && <span className="text-amber-700 font-medium"> · 현재 {selectedBooking.name}님 누적 {currentCount}회</span>}
                    </p>
                  </div>

                  {selectedBooking.status === "확정" && (
                    <div className="mb-4 rounded-2xl bg-red-50 p-3 border border-red-100">
                      <p className="text-xs text-red-700 font-medium mb-1">부득이한 업체 사유로 취소</p>
                      <p className="text-[10px] text-gray-500 mb-2">고객 100% 환불 처리됩니다. 누적 5회 이상 시 이용정지 검토 대상이 됩니다.</p>
                      <button
                        onClick={() => { if (confirm("정말 업체 사유로 취소하시겠습니까?\n• 고객에게 100% 환불\n• 페널티 1회 누적 (현재 2회)\n• 누적 5회부터 이용정지 검토")) { alert("업체 취소 처리되었습니다. 어드민에 자동 보고됩니다."); } }}
                        className="w-full bg-white text-red-600 py-2 rounded-xl text-xs font-medium border border-red-200">
                        업체 사유로 예약 취소
                      </button>
                    </div>
                  )}
                </>
                );
              })()}

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

              {/* Quick Menu — 업체 마이페이지 전용 메뉴 (IA Group 07) */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button onClick={() => { navigate("register"); }}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <Home size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">내 스튜디오 관리</p>
                  <p className="text-[10px] text-gray-400">등록 · 수정 · 삭제</p>
                </button>
                <button onClick={() => { navigate("bookings"); }}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <Calendar size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">내 예약 달력</p>
                  <p className="text-[10px] text-gray-400">예약 · 수기 일정</p>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button onClick={() => navigate("bizInfo")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <Building2 size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">업체 기본정보</p>
                  <p className="text-[10px] text-gray-400">기본정보 수정</p>
                </button>
                <button onClick={() => navigate("settlement")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <DollarSign size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">정산 내역</p>
                  <p className="text-[10px] text-gray-400">월별 정산</p>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 mb-4">
                <button onClick={() => navigate("dashboard")}
                  className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                  <BarChart3 size={20} strokeWidth={1.5} className="text-gray-700" />
                  <p className="text-sm font-medium mt-1">실적 대시보드</p>
                  <p className="text-[10px] text-gray-400">월별 예약 · 매출</p>
                </button>
              </div>

              <div className="space-y-0">
                <button onClick={() => navigate("reviews")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">리뷰 관리</span>
                  <span className="text-gray-300 text-xs">›</span>
                </button>
                <button className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">고객센터</span>
                  <span className="text-gray-300 text-xs">›</span>
                </button>
                <button onClick={() => setScreen("login")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">로그아웃</span>
                  <span className="text-gray-300 text-xs">›</span>
                </button>
              </div>
            </div>
          )}

          {/* ===== SETTLEMENT ===== */}
          {screen === "settlement" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">정산 내역</h2>

              {/* Period Filter */}
              <div className="flex gap-2 mb-4">
                {["전체", "4월", "3월"].map(m => (
                  <button key={m} onClick={() => setSettlementMonth(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      settlementMonth === m ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    }`}>{m}</button>
                ))}
              </div>

              <div className="mb-4 bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">{settlementMonth === "전체" ? "전체 정산금" : "이번달 금액"}</p>
                <p className="text-2xl font-bold text-primary mt-0.5">₩{pendingAmount.toLocaleString()}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white rounded-lg p-2"><span className="text-gray-400">수수료율</span><br/><span className="text-gray-700 font-medium">플랫폼 10%</span></div>
                  <div className="bg-white rounded-lg p-2"><span className="text-gray-400">정산 방식</span><br/><span className="text-gray-700 font-medium">월 기준, 주별 조회 가능</span></div>
                  <div className="bg-white rounded-lg p-2"><span className="text-gray-400">정산 단위</span><br/><span className="text-gray-700 font-medium">업체별 일괄 정산</span></div>
                  <div className="bg-white rounded-lg p-2"><span className="text-gray-400">환불 반영</span><br/><span className="text-gray-700 font-medium">결제 방식별 정책 확인 예정</span></div>
                </div>
                <p className="mt-3 text-[11px] text-gray-400">예약 시 받은 예약금도 정산 대상에 포함됩니다.</p>
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
              <button onClick={goBack} className="text-sm text-gray-400 mb-3">← 돌아가기</button>
              <h2 className="text-base font-bold mb-4">리뷰 관리</h2>
              <p className="text-[11px] text-gray-400 mb-3">소비자 리뷰 등록 후 1주 이내 답글 작성이 가능합니다.</p>

              {[
                { author: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다", date: "2026.04.10", replied: true, reply: "감사합니다! 다음에도 좋은 촬영 하겠습니다." },
                { author: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요", date: "2026.04.08", replied: false },
                { author: "한**", rating: 5, text: "결과물 퀄리티가 정말 좋습니다. 재방문 예정!", date: "2026.03.28", replied: true, reply: "좋은 리뷰 감사합니다! 또 뵙겠습니다." },
                { author: "박**", rating: 3, text: "가격 대비 보통이었어요", date: "2026.03.20", replied: false },
              ].map((r, i) => {
                const savedReply = savedReplies[i];
                const hasReply = (r.replied && r.reply) || !!savedReply;
                const replyText = savedReply ?? r.reply;
                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-medium">{r.author}</span>
                        <span className="text-xs text-yellow-500 ml-2">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{r.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{r.text}</p>
                    {hasReply ? (
                      <div className="bg-white rounded-lg p-2.5 border border-gray-100">
                        <p className="text-[10px] text-primary font-medium mb-1">업체 답변</p>
                        <p className="text-xs text-gray-600">{replyText}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setReplyModal({ idx: i, author: r.author, text: r.text }); setReplyDraft(""); }}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 text-xs text-gray-500 hover:border-primary hover:text-primary transition-all">
                        답글 작성 (1주 이내)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== REPLY MODAL ===== */}
          {replyModal && (
            <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setReplyModal(null)}>
              <div onClick={(e) => e.stopPropagation()}
                className="w-full bg-white rounded-t-2xl p-4 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">답글 작성</h3>
                  <button onClick={() => setReplyModal(null)} className="text-gray-400"><X size={18} /></button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-[10px] text-gray-400 mb-1">{replyModal.author}의 리뷰</p>
                  <p className="text-xs text-gray-600">{replyModal.text}</p>
                </div>
                <textarea
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  placeholder="리뷰에 대한 답글을 작성해주세요 (10자 이상)"
                  maxLength={300}
                  rows={4}
                  className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none resize-none border border-gray-200 focus:border-primary mb-2"
                />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-gray-400">작성 후 30일 이내 수정 가능</p>
                  <p className="text-[10px] text-gray-400">{replyDraft.length}/300</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setReplyModal(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl text-sm font-medium">취소</button>
                  <button
                    onClick={() => {
                      setSavedReplies({ ...savedReplies, [replyModal.idx]: replyDraft });
                      setReplyModal(null);
                      setReplyDraft("");
                    }}
                    disabled={replyDraft.trim().length < 10}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold ${replyDraft.trim().length >= 10 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                    등록
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== LOGIN (IA-003: 소비자/업체 공용) ===== */}
          {screen === "login" && (
            <div className="p-6 pt-16 flex flex-col items-center">
              <Image src="/photopop-logo.png" alt="포토팟 로고" width={88} height={88} className="mb-3 h-[88px] w-[88px] object-contain" />
              <p className="text-3xl font-bold text-primary mb-1">포토팟</p>
              <p className="text-xs text-gray-400 mb-10">스튜디오 대관·예약 플랫폼</p>

              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2">💬 카카오로 로그인</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2">🟢 네이버로 로그인</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm mb-6 flex items-center justify-center gap-2">G 구글로 로그인</button>

              <div className="flex items-center gap-4 w-full mb-6">
                <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">또는</span><div className="flex-1 h-px bg-gray-200" />
              </div>

              <input type="email" placeholder="이메일" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 mb-2" />
              <input type="password" placeholder="비밀번호" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 mb-4" />
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mb-4">로그인</button>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                <button onClick={() => navigate("bizSignup")}>업체 회원가입</button>
                <span>|</span>
                <button>비밀번호 찾기</button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">소비자 계정은 유저 앱에서 별도로 가입하세요.<br />동일 사용자도 소비자 + 업체 계정을 각각 보유해야 합니다.</p>
            </div>
          )}

          {/* ===== BIZ SIGNUP (IA-002) ===== */}
          {screen === "bizSignup" && (
            <div className="p-4">
              <button onClick={goBack} className="text-sm text-gray-400 mb-4">← 돌아가기</button>
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

              <button onClick={() => navigate("approvalWaiting")} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mb-3">가입 신청</button>
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
              <button onClick={() => {
                if (!manualDate || !manualTime) { alert("날짜와 시간을 입력하세요"); return; }
                const d = new Date(manualDate);
                const newBooking = {
                  id: Date.now(),
                  month: d.getMonth() + 1,
                  date: d.getDate(),
                  name: manualMemo.split(/[,\s]/)[0] || "수기 일정",
                  cat: "수기",
                  time: manualTime + "~",
                  price: 0,
                  status: "수기",
                  isManual: true,
                };
                setBookings(prev => [...prev, newBooking]);
                setCalMonth(d.getMonth() + 1);
                setCalYear(d.getFullYear());
                setCalDate(d.getDate());
                setShowManualModal(false); setManualDate(""); setManualTime(""); setManualMemo("");
              }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mt-4">일정 추가</button>
            </div>
          </div>
        )}

        {/* Bottom Tab - 소비자 앱과 동일 3탭: 홈/카테고리/마이페이지 (마이페이지만 업체 전용) */}
        {screen !== "login" && <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-100 flex items-center z-10">
          {[
            { key: "home" as Tab, Icon: Home, label: "홈", s: "home" as Screen },
            { key: "category" as Tab, Icon: LayoutGrid, label: "카테고리", s: "category" as Screen },
            { key: "my" as Tab, Icon: User, label: "MY", s: "mypage" as Screen },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setScreen(t.s); }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${
                tab === t.key ? "text-primary" : "text-gray-400"
              }`}>
              <t.Icon size={20} strokeWidth={1.5} />
              <span className="text-[10px]">{t.label}</span>
            </button>
          ))}
        </div>}
      </div>
    </div>
  );
}
