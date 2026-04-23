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
  { label: "인기", aliases: [] },
  { label: "증명사진", aliases: ["증명사진", "이력서", "취업 프로필"] },
  { label: "성수 프로필", aliases: ["성수 프로필", "성수 바디프로필"] },
  { label: "주말 웨딩", aliases: ["주말 웨딩", "웨딩 스냅", "본식 웨딩"] },
  { label: "가족 스냅", aliases: ["가족 스냅", "3대 가족", "가족사진"] },
  { label: "반려 가족", aliases: ["반려동물", "반려 가족", "펫"] },
  { label: "바디프로필", aliases: [] },
];

const K_CATEGORIES = "photopot.categories";
const K_REGIONS = "photopot.regions";
const K_FEE_RATE = "photopot.feeRate";
const K_BIZ_FEES = "photopot.bizFees";
const K_POLICIES = "photopot.policies.drafts";
const K_HOME_KEYWORDS = "photopot.homeKeywords";

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
