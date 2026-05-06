"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export type FeedbackViewState = Record<string, unknown>;

export type FeedbackRecord = {
  id: string;
  pageUrl: string;
  x: number;
  y: number;
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
  updatedAt?: string;
  processed: boolean;
  viewState?: FeedbackViewState;
};

let currentFeedbackViewState: FeedbackViewState | null = null;
const FEEDBACK_VIEW_STATE_EVENT = "feedback-view-state-change";

export function publishFeedbackViewState(snapshot: FeedbackViewState) {
  currentFeedbackViewState = snapshot;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FEEDBACK_VIEW_STATE_EVENT, { detail: snapshot }));
  }
}

export function getPublishedFeedbackViewState(): FeedbackViewState | null {
  return currentFeedbackViewState;
}

export function usePublishFeedbackViewState(snapshot: FeedbackViewState) {
  useEffect(() => {
    publishFeedbackViewState(snapshot);
  }, [snapshot]);
}

export function useCurrentFeedbackViewState() {
  const [snapshot, setSnapshot] = useState<FeedbackViewState | null>(currentFeedbackViewState);

  useEffect(() => {
    const handleChange = (event: Event) => {
      const customEvent = event as CustomEvent<FeedbackViewState>;
      setSnapshot(customEvent.detail ?? currentFeedbackViewState);
    };

    window.addEventListener(FEEDBACK_VIEW_STATE_EVENT, handleChange);
    return () => {
      window.removeEventListener(FEEDBACK_VIEW_STATE_EVENT, handleChange);
    };
  }, []);

  return snapshot;
}

export function useFeedbackDeepLink(pageUrl: string, applyFeedback: (item: FeedbackRecord) => void) {
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get("fb");
  const applyFeedbackRef = useRef(applyFeedback);

  useEffect(() => {
    applyFeedbackRef.current = applyFeedback;
  }, [applyFeedback]);

  useEffect(() => {
    let cancelled = false;

    async function loadFeedback() {
      if (!feedbackId) return;

      try {
        const res = await fetch(`/api/feedback?id=${encodeURIComponent(feedbackId)}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (cancelled || !res.ok || !data.item || data.item.pageUrl !== pageUrl) {
          return;
        }

        applyFeedbackRef.current(data.item as FeedbackRecord);
      } catch {
        // Ignore deep link fetch failures; marker UI handles visible errors separately.
      }
    }

    loadFeedback();

    return () => {
      cancelled = true;
    };
  }, [feedbackId, pageUrl]);

  return feedbackId;
}
