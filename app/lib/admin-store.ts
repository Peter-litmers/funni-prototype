"use client";

import { useSyncExternalStore } from "react";

const DEFAULT_CATEGORIES = [
  "프로필",
  "바디프로필",
  "웨딩",
  "가족",
  "반려동물",
  "비즈니스",
  "커플",
  "아기",
];

const DEFAULT_REGIONS = [
  "서울 강남",
  "서울 성수",
  "서울 잠실",
  "서울 홍대",
  "서울 합정",
  "경기 판교",
  "경기 분당",
];

const DEFAULT_FEE_RATE = 10;

const DEFAULT_BUSINESS_FEES: Record<string, number> = {
  "블룸 웨딩홀": 8,
  "블룸 웨딩 스튜디오": 8,
};

export type HomeKeyword = {
  label: string;
  aliases: string[]; // 각 별칭은 공백 AND 매칭, 별칭 간 OR. 비어있으면 label로만 매칭
};

const DEFAULT_HOME_KEYWORDS: HomeKeyword[] = [
  { label: "인기 검색어", aliases: [] },
  { label: "증명사진", aliases: ["증명사진", "이력서", "취업 프로필"] },
  { label: "성수 프로필", aliases: ["성수 프로필", "성수 바디프로필"] },
  { label: "주말 웨딩", aliases: ["주말 웨딩", "웨딩 스냅", "본식 웨딩"] },
  { label: "가족 스냅", aliases: ["가족 스냅", "3대 가족", "가족사진"] },
  { label: "커플 스냅", aliases: ["커플 스냅", "커플 촬영", "기념일"] },
  { label: "바디프로필", aliases: [] },
];

const K_CATEGORIES = "photopot.categories";
const K_REGIONS = "photopot.regions";
const K_FEE_RATE = "photopot.feeRate";
const K_BIZ_FEES = "photopot.bizFees";
const K_POLICIES = "photopot.policies.drafts";
const K_HOME_KEYWORDS = "photopot.homeKeywords";
const K_DISMISSED = "photopot.dismissedNotes";
const K_ADS = "photopot.ads";
const K_BANNERS = "photopot.banners";
const K_BLOCKED_MEMBERS = "photopot.blockedMembers";
const K_REVIEW_HIDDEN = "photopot.reviewHidden";
const K_REVIEW_DELETE_REQUESTS = "photopot.reviewDeleteRequests";
const K_BOOKING_ACTIONS = "photopot.bookingActions";
const K_REFUND_MATRIX = "photopot.refundMatrix";
const K_CATEGORY_ICONS = "photopot.categoryIcons";
const K_NOSHOW_REPORTS = "photopot.noShowReports";
const K_SETTLEMENT_REQUESTS = "photopot.settlementRequests";

const CHANGE_EVENT = "photopot-admin-store-change";

// 스냅샷 캐시 — useSyncExternalStore가 같은 reference를 받도록 보장 (무한 루프 방지)
type CacheEntry = { raw: string | null; value: unknown };
const snapshotCache = new Map<string, CacheEntry>();

function sanitizeStringArray(input: unknown, fallback: string[]): string[] {
  if (!Array.isArray(input)) return fallback;
  return input.filter((v): v is string => typeof v === "string");
}

function sanitizeFeeMap(input: unknown): Record<string, number> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v)) {
      result[k] = v;
    }
  }
  return result;
}

function sanitizeNumber(input: unknown, fallback: number): number {
  if (typeof input === "number" && Number.isFinite(input)) return input;
  return fallback;
}

function readStored<T>(
  key: string,
  fallback: T,
  validate: (raw: unknown) => T,
): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const cached = snapshotCache.get(key);
    if (cached && cached.raw === raw) {
      return cached.value as T;
    }
    const parsed = raw ? JSON.parse(raw) : undefined;
    const value = validate(parsed);
    snapshotCache.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(value);
  window.localStorage.setItem(key, raw);
  snapshotCache.set(key, { raw, value });
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

function subscribe(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CHANGE_EVENT, handler);
  };
}

function useStored<T>(
  key: string,
  fallback: T,
  validate: (raw: unknown) => T,
): T {
  return useSyncExternalStore(
    subscribe,
    () => readStored(key, fallback, validate),
    () => fallback,
  );
}

export function useCategories(): [string[], (next: string[]) => void] {
  const value = useStored(
    K_CATEGORIES,
    DEFAULT_CATEGORIES,
    (raw) => (raw === undefined ? DEFAULT_CATEGORIES : sanitizeStringArray(raw, DEFAULT_CATEGORIES)),
  );
  return [value, (next) => writeStored(K_CATEGORIES, sanitizeStringArray(next, []))];
}

export function useRegions(): [string[], (next: string[]) => void] {
  const value = useStored(
    K_REGIONS,
    DEFAULT_REGIONS,
    (raw) => (raw === undefined ? DEFAULT_REGIONS : sanitizeStringArray(raw, DEFAULT_REGIONS)),
  );
  return [value, (next) => writeStored(K_REGIONS, sanitizeStringArray(next, []))];
}

function sanitizeHomeKeywords(input: unknown): HomeKeyword[] {
  if (!Array.isArray(input)) return DEFAULT_HOME_KEYWORDS;
  const result: HomeKeyword[] = [];
  for (const item of input) {
    // 하위호환: 이전 버전에서 string[]로 저장됐을 수 있음
    if (typeof item === "string") {
      if (item.trim()) result.push({ label: item.trim(), aliases: [] });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const label = typeof obj.label === "string" ? obj.label.trim() : "";
    if (!label) continue;
    const aliases = Array.isArray(obj.aliases)
      ? obj.aliases
          .filter((a): a is string => typeof a === "string")
          .map(a => a.trim())
          .filter(Boolean)
      : [];
    result.push({ label, aliases });
  }
  return result;
}

export function useHomeKeywords(): [HomeKeyword[], (next: HomeKeyword[]) => void] {
  const value = useStored<HomeKeyword[]>(
    K_HOME_KEYWORDS,
    DEFAULT_HOME_KEYWORDS,
    (raw) => (raw === undefined ? DEFAULT_HOME_KEYWORDS : sanitizeHomeKeywords(raw)),
  );
  return [value, (next) => writeStored(K_HOME_KEYWORDS, sanitizeHomeKeywords(next))];
}

// "대표 확인 대기" 등 클릭으로 닫을 수 있는 뱃지/안내. key 기준으로 dismiss 저장.
export function useDismissed(): [Set<string>, (key: string) => void, (key: string) => void] {
  const value = useStored<string[]>(
    K_DISMISSED,
    [],
    (raw) => (raw === undefined ? [] : sanitizeStringArray(raw, [])),
  );
  const dismiss = (key: string) => {
    if (value.includes(key)) return;
    writeStored(K_DISMISSED, [...value, key]);
  };
  const restore = (key: string) => {
    writeStored(K_DISMISSED, value.filter(k => k !== key));
  };
  return [new Set(value), dismiss, restore];
}

// ===== 광고(상단 프리미엄 노출) =====
export type AdEntry = {
  id: string;
  studio: string;
  cat: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string;
  status: "노출중" | "대기" | "종료";
};

const DEFAULT_ADS: AdEntry[] = [
  { id: "ad-1", studio: "루미에르 스튜디오", cat: "프로필", periodStart: "2026-04-01", periodEnd: "2026-04-30", status: "노출중" },
  { id: "ad-2", studio: "아이덴티티 프로필", cat: "프로필", periodStart: "2026-04-05", periodEnd: "2026-05-05", status: "노출중" },
  { id: "ad-3", studio: "선셋 포토랩", cat: "바디프로필", periodStart: "2026-04-15", periodEnd: "2026-05-15", status: "노출중" },
  { id: "ad-4", studio: "바디에디션 랩", cat: "바디프로필", periodStart: "2026-04-10", periodEnd: "2026-05-10", status: "노출중" },
  { id: "ad-5", studio: "블룸 웨딩 스튜디오", cat: "웨딩", periodStart: "2026-04-10", periodEnd: "2026-05-10", status: "노출중" },
  { id: "ad-6", studio: "프라이빗 웨딩하우스", cat: "웨딩", periodStart: "2026-04-12", periodEnd: "2026-05-12", status: "노출중" },
  { id: "ad-7", studio: "브랜드컷 스튜디오", cat: "비즈니스", periodStart: "2026-04-08", periodEnd: "2026-05-08", status: "노출중" },
  { id: "ad-8", studio: "비즈니스 데이랩", cat: "비즈니스", periodStart: "2026-04-11", periodEnd: "2026-05-11", status: "노출중" },
  { id: "ad-9", studio: "루미에르 스튜디오", cat: "전체", periodStart: "2026-04-01", periodEnd: "2026-04-30", status: "노출중" },
];

function sanitizeAds(input: unknown): AdEntry[] {
  if (!Array.isArray(input)) return DEFAULT_ADS;
  const out: AdEntry[] = [];
  for (const it of input) {
    if (!it || typeof it !== "object") continue;
    const obj = it as Record<string, unknown>;
    const id = typeof obj.id === "string" ? obj.id : null;
    const studio = typeof obj.studio === "string" ? obj.studio : null;
    if (!id || !studio) continue;
    out.push({
      id,
      studio,
      cat: typeof obj.cat === "string" ? obj.cat : "",
      periodStart: typeof obj.periodStart === "string" ? obj.periodStart : "",
      periodEnd: typeof obj.periodEnd === "string" ? obj.periodEnd : "",
      status: obj.status === "노출중" || obj.status === "대기" || obj.status === "종료" ? obj.status : "대기",
    });
  }
  return out;
}

export function useAds(): [AdEntry[], (next: AdEntry[]) => void] {
  const value = useStored<AdEntry[]>(
    K_ADS,
    DEFAULT_ADS,
    (raw) => (raw === undefined ? DEFAULT_ADS : sanitizeAds(raw)),
  );
  return [value, (next) => writeStored(K_ADS, sanitizeAds(next))];
}

// ===== 배너 =====
export type BannerEntry = {
  id: string;
  title: string;
  position: string;
  periodStart: string;
  periodEnd: string;
  status: "노출중" | "대기" | "종료";
};

const DEFAULT_BANNERS: BannerEntry[] = [
  { id: "bn-1", title: "프로필 촬영 특가", position: "메인 상단", periodStart: "2026-04-01", periodEnd: "2026-04-30", status: "노출중" },
  { id: "bn-2", title: "반려동물 촬영전", position: "카테고리", periodStart: "2026-04-15", periodEnd: "2026-05-15", status: "노출중" },
  { id: "bn-3", title: "웨딩 촬영 패키지", position: "메인 중간", periodStart: "2026-05-01", periodEnd: "2026-05-31", status: "대기" },
];

function sanitizeBanners(input: unknown): BannerEntry[] {
  if (!Array.isArray(input)) return DEFAULT_BANNERS;
  const out: BannerEntry[] = [];
  for (const it of input) {
    if (!it || typeof it !== "object") continue;
    const obj = it as Record<string, unknown>;
    const id = typeof obj.id === "string" ? obj.id : null;
    const title = typeof obj.title === "string" ? obj.title : null;
    if (!id || !title) continue;
    out.push({
      id,
      title,
      position: typeof obj.position === "string" ? obj.position : "메인 상단",
      periodStart: typeof obj.periodStart === "string" ? obj.periodStart : "",
      periodEnd: typeof obj.periodEnd === "string" ? obj.periodEnd : "",
      status: obj.status === "노출중" || obj.status === "대기" || obj.status === "종료" ? obj.status : "대기",
    });
  }
  return out;
}

export function useBanners(): [BannerEntry[], (next: BannerEntry[]) => void] {
  const value = useStored<BannerEntry[]>(
    K_BANNERS,
    DEFAULT_BANNERS,
    (raw) => (raw === undefined ? DEFAULT_BANNERS : sanitizeBanners(raw)),
  );
  return [value, (next) => writeStored(K_BANNERS, sanitizeBanners(next))];
}

// ===== 차단 회원 =====
export function useBlockedMembers(): [Set<string>, (name: string) => void, (name: string) => void] {
  const value = useStored<string[]>(
    K_BLOCKED_MEMBERS,
    [],
    (raw) => (raw === undefined ? [] : sanitizeStringArray(raw, [])),
  );
  const block = (name: string) => {
    if (value.includes(name)) return;
    writeStored(K_BLOCKED_MEMBERS, [...value, name]);
  };
  const unblock = (name: string) => writeStored(K_BLOCKED_MEMBERS, value.filter(n => n !== name));
  return [new Set(value), block, unblock];
}

// ===== 리뷰 숨김 =====
export function useHiddenReviews(): [Set<string>, (id: string) => void, (id: string) => void] {
  const value = useStored<string[]>(
    K_REVIEW_HIDDEN,
    [],
    (raw) => (raw === undefined ? [] : sanitizeStringArray(raw, [])),
  );
  const hide = (id: string) => {
    if (value.includes(id)) return;
    writeStored(K_REVIEW_HIDDEN, [...value, id]);
  };
  const unhide = (id: string) => writeStored(K_REVIEW_HIDDEN, value.filter(x => x !== id));
  return [new Set(value), hide, unhide];
}

// ===== 리뷰 삭제 요청 =====
export type ReviewDeleteRequest = {
  id: string;
  reviewId: string;
  studio: string;
  author: string;
  rating: number;
  text: string;
  reason: string;
  requestedAt: number;
  status: "대기" | "승인" | "거절";
};

const DEFAULT_DELETE_REQUESTS: ReviewDeleteRequest[] = [
  { id: "rdr-1", reviewId: "rv-101", studio: "루미에르 스튜디오", author: "김**", rating: 2, text: "사진 보정이 기대와 달랐어요. 다음엔 더 상세하게 논의하고 싶네요.", reason: "오해 소지가 있는 내용으로 재촬영 후 삭제 요청", requestedAt: Date.now() - 1000 * 60 * 60 * 2, status: "대기" },
  { id: "rdr-2", reviewId: "rv-102", studio: "펫모먼츠 스튜디오", author: "박**", rating: 1, text: "시간이 밀려서 대기했어요.", reason: "업체 답글로 사과 전달 완료 - 고객 요청으로 삭제 검토", requestedAt: Date.now() - 1000 * 60 * 60 * 26, status: "대기" },
];

function sanitizeDeleteRequests(input: unknown): ReviewDeleteRequest[] {
  if (!Array.isArray(input)) return DEFAULT_DELETE_REQUESTS;
  const out: ReviewDeleteRequest[] = [];
  for (const it of input) {
    if (!it || typeof it !== "object") continue;
    const obj = it as Record<string, unknown>;
    const id = typeof obj.id === "string" ? obj.id : null;
    if (!id) continue;
    out.push({
      id,
      reviewId: typeof obj.reviewId === "string" ? obj.reviewId : "",
      studio: typeof obj.studio === "string" ? obj.studio : "",
      author: typeof obj.author === "string" ? obj.author : "",
      rating: typeof obj.rating === "number" ? obj.rating : 0,
      text: typeof obj.text === "string" ? obj.text : "",
      reason: typeof obj.reason === "string" ? obj.reason : "",
      requestedAt: typeof obj.requestedAt === "number" ? obj.requestedAt : 0,
      status: obj.status === "승인" || obj.status === "거절" ? obj.status : "대기",
    });
  }
  return out;
}

export function useReviewDeleteRequests(): [
  ReviewDeleteRequest[],
  (id: string, status: "승인" | "거절") => void,
] {
  const value = useStored<ReviewDeleteRequest[]>(
    K_REVIEW_DELETE_REQUESTS,
    DEFAULT_DELETE_REQUESTS,
    (raw) => (raw === undefined ? DEFAULT_DELETE_REQUESTS : sanitizeDeleteRequests(raw)),
  );
  const decide = (id: string, status: "승인" | "거절") => {
    const next = value.map(r => (r.id === id ? { ...r, status } : r));
    writeStored(K_REVIEW_DELETE_REQUESTS, next);
  };
  return [value, decide];
}

// ===== 예약 액션 상태 (환불/노쇼 플래그 등) =====
export type BookingActionEntry = {
  refunded?: boolean;
  noShow?: boolean;
  note?: string;
};

export function useBookingActions(): [
  Record<string, BookingActionEntry>,
  (id: string, next: BookingActionEntry) => void,
] {
  const value = useStored<Record<string, BookingActionEntry>>(
    K_BOOKING_ACTIONS,
    {},
    (raw) => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
      const result: Record<string, BookingActionEntry> = {};
      for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
        if (v && typeof v === "object") {
          const o = v as Record<string, unknown>;
          result[k] = {
            refunded: typeof o.refunded === "boolean" ? o.refunded : undefined,
            noShow: typeof o.noShow === "boolean" ? o.noShow : undefined,
            note: typeof o.note === "string" ? o.note : undefined,
          };
        }
      }
      return result;
    },
  );
  const update = (id: string, next: BookingActionEntry) => {
    const merged = { ...value, [id]: { ...value[id], ...next } };
    writeStored(K_BOOKING_ACTIONS, merged);
  };
  return [value, update];
}

// ===== 카테고리별 아이콘 오버라이드 =====
function sanitizeCategoryIcons(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof k === "string" && typeof v === "string") result[k] = v;
  }
  return result;
}

export function useCategoryIcons(): [Record<string, string>, (next: Record<string, string>) => void] {
  const value = useStored<Record<string, string>>(
    K_CATEGORY_ICONS,
    {},
    (raw) => (raw === undefined ? {} : sanitizeCategoryIcons(raw)),
  );
  return [value, (next) => writeStored(K_CATEGORY_ICONS, sanitizeCategoryIcons(next))];
}

// ===== 업체→소비자 노쇼 신고 =====
export type NoShowReport = {
  id: string;
  bookingId: string;
  consumerName: string;
  studioName: string;
  reportedAt: number; // epoch ms
  reason?: string;
  resolved?: boolean; // 어드민이 처리(경고/이용정지 등)한 후 체크
};

function sanitizeNoShowReports(input: unknown): NoShowReport[] {
  if (!Array.isArray(input)) return [];
  const out: NoShowReport[] = [];
  for (const it of input) {
    if (!it || typeof it !== "object") continue;
    const o = it as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.consumerName !== "string") continue;
    out.push({
      id: o.id,
      bookingId: typeof o.bookingId === "string" ? o.bookingId : "",
      consumerName: o.consumerName,
      studioName: typeof o.studioName === "string" ? o.studioName : "",
      reportedAt: typeof o.reportedAt === "number" ? o.reportedAt : 0,
      reason: typeof o.reason === "string" ? o.reason : undefined,
      resolved: typeof o.resolved === "boolean" ? o.resolved : false,
    });
  }
  return out;
}

// 프로토타입 시연용 — 첫 로드 시 소비자 알림/어드민 신고함에 샘플 1건 노출
const DEFAULT_NOSHOW_REPORTS: NoShowReport[] = [
  {
    id: "ns-sample-1",
    bookingId: "B-2026-0138",
    consumerName: "김포토",
    studioName: "펫모먼츠 스튜디오",
    reportedAt: Date.now() - 1000 * 60 * 60 * 3, // 3시간 전
    reason: "예약 시간 30분 지났으나 미도착·연락 두절",
    resolved: false,
  },
];

export function useNoShowReports(): [
  NoShowReport[],
  (r: Omit<NoShowReport, "id" | "reportedAt" | "resolved">) => void,
  (id: string, resolved: boolean) => void,
  (id: string) => void,
] {
  const value = useStored<NoShowReport[]>(
    K_NOSHOW_REPORTS,
    DEFAULT_NOSHOW_REPORTS,
    (raw) => (raw === undefined ? DEFAULT_NOSHOW_REPORTS : sanitizeNoShowReports(raw)),
  );
  const add = (r: Omit<NoShowReport, "id" | "reportedAt" | "resolved">) => {
    const next: NoShowReport = { ...r, id: `ns-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, reportedAt: Date.now(), resolved: false };
    writeStored(K_NOSHOW_REPORTS, [...value, next]);
  };
  const setResolved = (id: string, resolved: boolean) => {
    writeStored(K_NOSHOW_REPORTS, value.map(r => r.id === id ? { ...r, resolved } : r));
  };
  const remove = (id: string) => writeStored(K_NOSHOW_REPORTS, value.filter(r => r.id !== id));
  return [value, add, setResolved, remove];
}

export function countNoShowsFor(reports: NoShowReport[], consumerName: string): number {
  return reports.filter(r => r.consumerName === consumerName).length;
}

// ===== 정산 요청 =====
export type SettlementRequest = {
  id: string;
  account: string; // 업체 아이디 (예: lumiere_biz)
  studioName: string;
  period: string; // 요청 대상 기간 (예: "2026년 4월")
  amount: number; // 요청 금액 (KRW)
  requestedAt: number;
  status: "대기" | "정산 완료" | "반려";
  processedAt?: number;
  note?: string;
};

function sanitizeSettlementRequests(input: unknown): SettlementRequest[] {
  if (!Array.isArray(input)) return [];
  const out: SettlementRequest[] = [];
  for (const it of input) {
    if (!it || typeof it !== "object") continue;
    const o = it as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.account !== "string") continue;
    const status = o.status === "정산 완료" || o.status === "반려" ? o.status : "대기";
    out.push({
      id: o.id,
      account: o.account,
      studioName: typeof o.studioName === "string" ? o.studioName : "",
      period: typeof o.period === "string" ? o.period : "",
      amount: typeof o.amount === "number" ? o.amount : 0,
      requestedAt: typeof o.requestedAt === "number" ? o.requestedAt : 0,
      status,
      processedAt: typeof o.processedAt === "number" ? o.processedAt : undefined,
      note: typeof o.note === "string" ? o.note : undefined,
    });
  }
  return out;
}

// 프로토타입 시연용 — 첫 로드 시 어드민 정산 탭에 샘플 요청 1건 노출
const DEFAULT_SETTLEMENT_REQUESTS: SettlementRequest[] = [
  {
    id: "sr-sample-1",
    account: "bloom_wedding",
    studioName: "블룸 웨딩홀",
    period: "2026년 4월",
    amount: 1240000,
    requestedAt: Date.now() - 1000 * 60 * 60 * 5, // 5시간 전
    status: "대기",
    note: "4월 누적 정산 요청 — 본식 + 리허설 패키지 13건",
  },
];

export function useSettlementRequests(): [
  SettlementRequest[],
  (r: Omit<SettlementRequest, "id" | "requestedAt" | "status">) => void,
  (id: string, status: SettlementRequest["status"]) => void,
  (id: string) => void,
] {
  const value = useStored<SettlementRequest[]>(
    K_SETTLEMENT_REQUESTS,
    DEFAULT_SETTLEMENT_REQUESTS,
    (raw) => (raw === undefined ? DEFAULT_SETTLEMENT_REQUESTS : sanitizeSettlementRequests(raw)),
  );
  const add = (r: Omit<SettlementRequest, "id" | "requestedAt" | "status">) => {
    const next: SettlementRequest = { ...r, id: `sr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, requestedAt: Date.now(), status: "대기" };
    writeStored(K_SETTLEMENT_REQUESTS, [...value, next]);
  };
  const setStatus = (id: string, status: SettlementRequest["status"]) => {
    writeStored(K_SETTLEMENT_REQUESTS, value.map(r => r.id === id ? { ...r, status, processedAt: Date.now() } : r));
  };
  const remove = (id: string) => writeStored(K_SETTLEMENT_REQUESTS, value.filter(r => r.id !== id));
  return [value, add, setStatus, remove];
}

// ===== 카테고리별 환불율 매트릭스 =====
// 기간: d7 = 촬영 7일 이상 전, d3to6 = 3~6일 전, d1to2 = 1~2일 전, sameDay = 당일
export type RefundPeriod = "d7" | "d3to6" | "d1to2" | "sameDay";
export type RefundRow = Record<RefundPeriod, number>; // %, 0~100
export type RefundMatrix = Record<string, RefundRow>; // key: 카테고리명

export const REFUND_PERIOD_LABELS: Record<RefundPeriod, string> = {
  d7: "7일 이상 전",
  d3to6: "3~6일 전",
  d1to2: "1~2일 전",
  sameDay: "당일",
};

const STANDARD_ROW: RefundRow = { d7: 100, d3to6: 80, d1to2: 50, sameDay: 20 };
const STRICT_WEDDING_ROW: RefundRow = { d7: 100, d3to6: 50, d1to2: 0, sameDay: 0 };

const DEFAULT_REFUND_MATRIX: RefundMatrix = {
  "프로필": { ...STANDARD_ROW },
  "바디프로필": { ...STANDARD_ROW },
  "웨딩": { ...STRICT_WEDDING_ROW },
  "가족": { ...STANDARD_ROW },
  "반려동물": { ...STANDARD_ROW },
  "비즈니스": { ...STANDARD_ROW },
  "커플": { ...STANDARD_ROW },
  "아기": { ...STANDARD_ROW },
};

function sanitizeRefundRow(input: unknown): RefundRow {
  const clamp = (v: unknown) => {
    const n = typeof v === "number" && Number.isFinite(v) ? v : 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  };
  const o = (input && typeof input === "object" ? (input as Record<string, unknown>) : {}) as Record<string, unknown>;
  return {
    d7: clamp(o.d7),
    d3to6: clamp(o.d3to6),
    d1to2: clamp(o.d1to2),
    sameDay: clamp(o.sameDay),
  };
}

function sanitizeRefundMatrix(input: unknown): RefundMatrix {
  if (!input || typeof input !== "object" || Array.isArray(input)) return DEFAULT_REFUND_MATRIX;
  const out: RefundMatrix = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof k === "string" && k.trim()) {
      out[k] = sanitizeRefundRow(v);
    }
  }
  return out;
}

export function useRefundMatrix(): [RefundMatrix, (next: RefundMatrix) => void] {
  const value = useStored<RefundMatrix>(
    K_REFUND_MATRIX,
    DEFAULT_REFUND_MATRIX,
    (raw) => (raw === undefined ? DEFAULT_REFUND_MATRIX : sanitizeRefundMatrix(raw)),
  );
  return [value, (next) => writeStored(K_REFUND_MATRIX, sanitizeRefundMatrix(next))];
}

// 카테고리 + 촬영일·오늘 → 환불율(%) 계산. 카테고리 누락 시 첫 행 fallback.
export function pickRefundRate(matrix: RefundMatrix, category: string, daysUntilShoot: number): {
  period: RefundPeriod;
  rate: number;
  fromDefault: boolean;
} {
  const row = matrix[category] ?? Object.values(matrix)[0] ?? STANDARD_ROW;
  const fromDefault = !matrix[category];
  let period: RefundPeriod = "sameDay";
  if (daysUntilShoot >= 7) period = "d7";
  else if (daysUntilShoot >= 3) period = "d3to6";
  else if (daysUntilShoot >= 1) period = "d1to2";
  return { period, rate: row[period], fromDefault };
}

// 칩/자유검색 매칭: 각 별칭은 공백 분리 AND, 별칭들 사이는 OR.
// aliases가 비어있으면 label 자체를 쿼리로 사용.
export function matchesKeyword(haystack: string, entry: HomeKeyword): boolean {
  const queries = entry.aliases.length > 0 ? entry.aliases : [entry.label];
  const h = haystack.toLowerCase();
  return queries.some(q => {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return false;
    return tokens.every(t => h.includes(t));
  });
}

export function useFeeRate(): [number, (next: number) => void] {
  const value = useStored(
    K_FEE_RATE,
    DEFAULT_FEE_RATE,
    (raw) => (raw === undefined ? DEFAULT_FEE_RATE : sanitizeNumber(raw, DEFAULT_FEE_RATE)),
  );
  return [value, (next) => writeStored(K_FEE_RATE, sanitizeNumber(next, DEFAULT_FEE_RATE))];
}

export function useBusinessFees(): [
  Record<string, number>,
  (next: Record<string, number>) => void,
] {
  const value = useStored(
    K_BIZ_FEES,
    DEFAULT_BUSINESS_FEES,
    (raw) => (raw === undefined ? DEFAULT_BUSINESS_FEES : sanitizeFeeMap(raw)),
  );
  return [value, (next) => writeStored(K_BIZ_FEES, sanitizeFeeMap(next))];
}

export function getFeeForBusiness(
  name: string,
  global: number,
  overrides: Record<string, number>,
): { rate: number; isOverride: boolean } {
  const override = overrides[name];
  if (typeof override === "number" && Number.isFinite(override)) {
    return { rate: override, isOverride: true };
  }
  return { rate: global, isOverride: false };
}

// ===== 정책 DRAFT 스토어 (실서비스에 즉시 반영되지 않음, 문서 관리용) =====

export type PolicyEntry = {
  value: string;
  updatedAt: number; // epoch ms
  history: Array<{
    value: string;
    updatedAt: number;
    editor: string;
  }>;
};

export type PolicyMap = Record<string, PolicyEntry>;

function sanitizePolicyMap(input: unknown): PolicyMap {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const result: PolicyMap = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!v || typeof v !== "object") continue;
    const entry = v as Record<string, unknown>;
    if (typeof entry.value !== "string") continue;
    const updatedAt = typeof entry.updatedAt === "number" ? entry.updatedAt : 0;
    const history = Array.isArray(entry.history)
      ? entry.history.filter(
          (h): h is { value: string; updatedAt: number; editor: string } =>
            !!h &&
            typeof h === "object" &&
            typeof (h as { value?: unknown }).value === "string" &&
            typeof (h as { updatedAt?: unknown }).updatedAt === "number" &&
            typeof (h as { editor?: unknown }).editor === "string",
        )
      : [];
    result[k] = { value: entry.value, updatedAt, history };
  }
  return result;
}

export function usePolicies(): [
  PolicyMap,
  (id: string, newValue: string, editor?: string) => void,
  (id: string) => void,
] {
  const value = useStored<PolicyMap>(
    K_POLICIES,
    {},
    (raw) => (raw === undefined ? {} : sanitizePolicyMap(raw)),
  );

  const update = (id: string, newValue: string, editor = "어드민") => {
    const now = Date.now();
    const current = value[id];
    const next: PolicyMap = { ...value };
    const newHistory = current
      ? [
          {
            value: current.value,
            updatedAt: current.updatedAt || now,
            editor,
          },
          ...current.history,
        ].slice(0, 20) // 최근 20개까지만 보관
      : [];
    next[id] = { value: newValue, updatedAt: now, history: newHistory };
    writeStored(K_POLICIES, next);
  };

  const reset = (id: string) => {
    const next: PolicyMap = { ...value };
    delete next[id];
    writeStored(K_POLICIES, next);
  };

  return [value, update, reset];
}
