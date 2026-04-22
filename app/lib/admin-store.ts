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

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
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

function useStored<T>(key: string, fallback: T, ssr: T): T {
  return useSyncExternalStore(
    subscribe,
    () => readJSON(key, fallback),
    () => ssr,
  );
}

export function useCategories(): [string[], (next: string[]) => void] {
  const value = useStored<string[]>(K_CATEGORIES, DEFAULT_CATEGORIES, DEFAULT_CATEGORIES);
  return [value, (next) => writeJSON(K_CATEGORIES, next)];
}

export function useRegions(): [string[], (next: string[]) => void] {
  const value = useStored<string[]>(K_REGIONS, DEFAULT_REGIONS, DEFAULT_REGIONS);
  return [value, (next) => writeJSON(K_REGIONS, next)];
}

export function useFeeRate(): [number, (next: number) => void] {
  const value = useStored<number>(K_FEE_RATE, DEFAULT_FEE_RATE, DEFAULT_FEE_RATE);
  return [value, (next) => writeJSON(K_FEE_RATE, next)];
}

export function useBusinessFees(): [
  Record<string, number>,
  (next: Record<string, number>) => void,
] {
  const value = useStored<Record<string, number>>(
    K_BIZ_FEES,
    DEFAULT_BUSINESS_FEES,
    DEFAULT_BUSINESS_FEES,
  );
  return [value, (next) => writeJSON(K_BIZ_FEES, next)];
}

export function getFeeForBusiness(
  name: string,
  global: number,
  overrides: Record<string, number>,
): { rate: number; isOverride: boolean } {
  const override = overrides[name];
  if (typeof override === "number") return { rate: override, isOverride: true };
  return { rate: global, isOverride: false };
}
