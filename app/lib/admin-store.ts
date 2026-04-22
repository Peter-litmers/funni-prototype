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

const K_CATEGORIES = "photopot.categories";
const K_REGIONS = "photopot.regions";
const K_FEE_RATE = "photopot.feeRate";
const K_BIZ_FEES = "photopot.bizFees";

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
