"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareQuote, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCurrentFeedbackViewState } from "../lib/feedback-view-state";

type FeedbackItem = {
  id: string;
  pageUrl: string;
  x: number;
  y: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
  isFixed?: boolean;
  clickOffset?: { x: number; y: number };
  scrollContainerKey?: string;
  scrollTop?: number;
  elementLabel?: string;
  elementPath?: string;
  fullPath?: string;
  cssClasses?: string;
  anchorKey?: string;
  title: string;
  comment: string;
  author: string;
  nearbyText?: string;
  createdAt: string;
  processed?: boolean;
  viewState?: Record<string, unknown>;
};

type ViewportMarker = {
  cardLeft: number;
  cardTop: number;
  left: number;
  top: number;
};

type ScrollContainerMap = Record<string, HTMLElement>;

const VIEW_KEYS = [
  "screen",
  "tab",
  "selectedStudioId",
  "selectedBookingId",
  "detailEntryCat",
  "categoryCat",
  "bookingFilter",
  "bizDetailView",
  "policySection",
] as const;

function getCurrentPageKey(pathname: string | null): string {
  if (!pathname || pathname === "/") return "main";
  return pathname.replace(/^\/+/, "");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function querySelectorSafe(selector?: string | null) {
  if (!selector) return null;

  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

function getBoundingBoxScore(item: FeedbackItem, rect: DOMRect) {
  if (!item.boundingBox || !item.boundingBox.width || !item.boundingBox.height) {
    return 0;
  }

  const widthRatio = rect.width / item.boundingBox.width;
  const heightRatio = rect.height / item.boundingBox.height;
  return Math.abs(Math.log(widthRatio || 1)) + Math.abs(Math.log(heightRatio || 1));
}

function getTextScore(item: FeedbackItem, element: Element) {
  const nearbyText = item.nearbyText?.trim();
  if (!nearbyText) return 0;

  const elementText = element.textContent?.trim() || "";
  if (!elementText) return 1.5;
  if (elementText.includes(nearbyText)) return 0;
  if (nearbyText.includes(elementText) && elementText.length >= 2) return 0.5;
  return 1.5;
}

function pickBestMatch(selector: string, item: FeedbackItem) {
  try {
    const matches = Array.from(document.querySelectorAll(selector)).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );

    if (matches.length === 0) return null;

    let best: { element: HTMLElement; score: number } | null = null;

    for (const match of matches) {
      const rect = match.getBoundingClientRect();
      const score = getBoundingBoxScore(item, rect) + getTextScore(item, match);

      if (!best || score < best.score) {
        best = { element: match, score };
      }
    }

    if (!best) return null;
    return best.score <= 2.5 ? best.element : null;
  } catch {
    return null;
  }
}

function resolveFeedbackTarget(item: FeedbackItem) {
  if (item.anchorKey) {
    const anchor = querySelectorSafe(`[data-feedback-anchor="${CSS.escape(item.anchorKey)}"]`);
    if (anchor) return anchor;
  }

  const selectorMatch = (item.fullPath ? pickBestMatch(item.fullPath, item) : null)
    || (item.elementPath ? pickBestMatch(item.elementPath, item) : null);
  if (selectorMatch) return selectorMatch;

  if (item.cssClasses) {
    const classSelector = item.cssClasses
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => `.${CSS.escape(name)}`)
      .join("");

    const classMatch = classSelector.split(".").length > 2 ? pickBestMatch(classSelector, item) : null;
    if (classMatch) return classMatch;
  }

  return null;
}

function matchesCurrentView(item: FeedbackItem, currentViewState: Record<string, unknown> | null) {
  if (!item.viewState || !currentViewState) return true;

  for (const key of VIEW_KEYS) {
    const itemValue = item.viewState[key];
    const currentValue = currentViewState[key];

    if (itemValue !== undefined && currentValue !== undefined && itemValue !== currentValue) {
      return false;
    }
  }

  return true;
}

function computeMarker(
  item: FeedbackItem,
  scrollContainers: ScrollContainerMap,
  frameRect: DOMRect | null,
): ViewportMarker | null {
  const targetEl = resolveFeedbackTarget(item);
  let nextTop = 0;
  let nextLeft = 0;

  if (item.boundingBox) {
    const relX = item.clickOffset?.x ?? 0.5;
    const relY = item.clickOffset?.y ?? 0.35;
    const scrollContainer = item.scrollContainerKey ? scrollContainers[item.scrollContainerKey] : null;
    const scrollDelta = scrollContainer && typeof item.scrollTop === "number"
      ? scrollContainer.scrollTop - item.scrollTop
      : 0;
    nextLeft = item.boundingBox.x + item.boundingBox.width * relX;
    nextTop = item.isFixed
      ? item.boundingBox.y + item.boundingBox.height * relY
      : item.boundingBox.y - window.scrollY - scrollDelta + item.boundingBox.height * relY;
  } else if (targetEl instanceof HTMLElement) {
    const rect = targetEl.getBoundingClientRect();
    const relX = item.clickOffset?.x ?? 0.5;
    const relY = item.clickOffset?.y ?? 0.35;
    nextLeft = rect.left + rect.width * relX;
    nextTop = rect.top + rect.height * relY;
  } else {
    nextLeft = (item.x / 100) * window.innerWidth;
    nextTop = item.isFixed ? item.y : item.y - window.scrollY;
  }

  if (frameRect) {
    const outsideFrame =
      nextLeft < frameRect.left ||
      nextLeft > frameRect.right ||
      nextTop < frameRect.top ||
      nextTop > frameRect.bottom;

    if (outsideFrame) return null;
  }

  const minLeft = frameRect ? frameRect.left + 12 : 24;
  const maxLeft = frameRect ? frameRect.right - 12 : window.innerWidth - 24;
  const minTop = frameRect ? frameRect.top + 12 : 24;
  const maxTop = frameRect ? frameRect.bottom - 12 : window.innerHeight - 24;
  const clampedLeft = clamp(nextLeft, minLeft, maxLeft);
  const clampedTop = clamp(nextTop, minTop, maxTop);
  const cardMinLeft = frameRect ? frameRect.left + 120 : 172;
  const cardMaxLeft = frameRect ? frameRect.right - 120 : window.innerWidth - 172;
  const cardMinTop = frameRect ? frameRect.top + 16 : 20;
  const cardMaxTop = frameRect ? frameRect.bottom - 140 : window.innerHeight - 180;

  return {
    cardLeft: clamp(clampedLeft, cardMinLeft, cardMaxLeft),
    cardTop: clamp(clampedTop + 28, cardMinTop, cardMaxTop),
    left: clampedLeft,
    top: clampedTop,
  };
}

export default function FeedbackDeepLinkMarker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get("fb");
  const currentPageKey = useMemo(() => getCurrentPageKey(pathname), [pathname]);
  const currentViewState = useCurrentFeedbackViewState();

  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [markers, setMarkers] = useState<Record<string, ViewportMarker>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dismissed = feedbackId !== null && dismissedId === feedbackId;
  const isSingleMode = !!feedbackId;

  useEffect(() => {
    let cancelled = false;

    async function loadFeedback() {
      try {
        const res = await fetch(
          feedbackId
            ? `/api/feedback?id=${encodeURIComponent(feedbackId)}`
            : `/api/feedback?processed=false&pageUrl=${encodeURIComponent(currentPageKey)}`,
          { cache: "no-store" },
        );
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setItems([]);
          setError(data.error || "피드백을 불러오지 못했습니다.");
          return;
        }

        const nextItems = feedbackId ? (data.item ? [data.item] : []) : (data.items ?? []);
        setItems(nextItems);
        setActiveId(feedbackId ? (nextItems[0]?.id ?? null) : null);
        setError(null);
      } catch {
        if (!cancelled) {
          setItems([]);
          setError("피드백을 불러오지 못했습니다.");
        }
      }
    }

    loadFeedback();

    return () => {
      cancelled = true;
    };
  }, [currentPageKey, feedbackId]);

  useEffect(() => {
    const visibleItems = items.filter((entry) => (
      entry.pageUrl === currentPageKey &&
      (!entry.processed) &&
      matchesCurrentView(entry, currentViewState)
    ));
    if (visibleItems.length === 0 || dismissed) {
      return;
    }

    const primary = visibleItems[0];
    const scrollContainer = primary.scrollContainerKey
      ? querySelectorSafe(`[data-feedback-scroll="${CSS.escape(primary.scrollContainerKey)}"]`)
      : null;
    const frameElement = querySelectorSafe(`[data-feedback-frame="${CSS.escape(currentPageKey)}"]`);
    const frameRect = frameElement instanceof HTMLElement ? frameElement.getBoundingClientRect() : null;
    const scrollContainers: ScrollContainerMap = {};
    for (const entry of visibleItems) {
      if (!entry.scrollContainerKey) continue;
      const candidate = querySelectorSafe(`[data-feedback-scroll="${CSS.escape(entry.scrollContainerKey)}"]`);
      if (candidate instanceof HTMLElement) {
        scrollContainers[entry.scrollContainerKey] = candidate;
      }
    }

    if (isSingleMode) {
      if (scrollContainer instanceof HTMLElement && typeof primary.scrollTop === "number") {
        scrollContainer.scrollTop = primary.scrollTop;
      } else {
        const targetTop = primary.boundingBox
          ? (primary.isFixed ? window.scrollY + primary.boundingBox.y : primary.boundingBox.y)
          : (primary.isFixed ? window.scrollY + primary.y : primary.y);

        window.scrollTo({
          left: 0,
          top: Math.max(targetTop - window.innerHeight * 0.35, 0),
          behavior: "smooth",
        });
      }
    }

    const updateMarkers = () => {
      const nextMarkers: Record<string, ViewportMarker> = {};
      for (const item of visibleItems) {
        const marker = computeMarker(item, scrollContainers, frameRect);
        if (marker) nextMarkers[item.id] = marker;
      }
      setMarkers(nextMarkers);
    };

    const frame1 = window.requestAnimationFrame(updateMarkers);
    window.addEventListener("scroll", updateMarkers, { passive: true });
    window.addEventListener("resize", updateMarkers);
    scrollContainer?.addEventListener("scroll", updateMarkers, { passive: true });
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(updateMarkers);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.cancelAnimationFrame(frame1);
      window.removeEventListener("scroll", updateMarkers);
      window.removeEventListener("resize", updateMarkers);
      scrollContainer?.removeEventListener("scroll", updateMarkers);
      observer.disconnect();
    };
  }, [currentPageKey, currentViewState, dismissed, isSingleMode, items]);

  if (dismissed) return null;

  if (error && feedbackId) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex justify-center px-4">
        <div className="pointer-events-auto rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  const visibleItems = items.filter((item) => item.pageUrl === currentPageKey && markers[item.id] && matchesCurrentView(item, currentViewState));
  if (visibleItems.length === 0) return null;

  const activeItem = visibleItems.find((item) => item.id === activeId) ?? (isSingleMode ? visibleItems[0] : null);
  const activeMarker = activeItem ? markers[activeItem.id] : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {visibleItems.map((item) => {
        const marker = markers[item.id];
        const isActive = activeItem?.id === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId((current) => (current === item.id ? null : item.id))}
            className={`pointer-events-auto absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white ${
              isActive
                ? "border-rose-500 shadow-[0_0_0_10px_rgba(244,63,94,0.18)]"
                : "border-amber-500 shadow-[0_0_0_6px_rgba(245,158,11,0.18)]"
            }`}
            style={{ left: marker.left, top: marker.top }}
            aria-label={item.title || item.comment}
          />
        );
      })}
      {activeItem && activeMarker ? (
        <div
          className="pointer-events-auto absolute flex w-[min(320px,calc(100vw-24px))] -translate-x-1/2 flex-col gap-2 rounded-2xl border border-rose-100 bg-white p-4 shadow-2xl"
          style={{
            left: activeMarker.cardLeft,
            top: activeMarker.cardTop,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-rose-600">
                <MessageSquareQuote size={14} />
                <span>{isSingleMode ? "선택한 피드백 위치" : "페이지 피드백"}</span>
              </div>
              <p className="truncate text-sm font-semibold text-gray-900">
                {activeItem.title || "제목 없는 피드백"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isSingleMode) setDismissedId(feedbackId);
                else setActiveId(null);
              }}
              className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="피드백 위치 표시 닫기"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-sm leading-6 text-gray-600">{activeItem.comment}</p>
          {activeItem.nearbyText ? (
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
              근처 텍스트: {activeItem.nearbyText}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
