"use client";
import { useRef } from "react";
import { Agentation } from "agentation";
import { usePathname } from "next/navigation";


export default function AgentationProvider() {
  const pathname = usePathname();
  // Agentation annotation id → 우리 feedback id 매핑
  const idMapRef = useRef<Map<string, string>>(new Map());

  const handleAnnotationAdd = async (annotation: {
    id?: string;
    x?: number;
    y?: number;
    comment?: string;
    element?: string;
    elementPath?: string;
    nearbyText?: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
    [key: string]: unknown;
  }) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageUrl: pathname?.replace("/", "") || "main",
          x: annotation.x ?? annotation.boundingBox?.x ?? 0,
          y: annotation.y ?? annotation.boundingBox?.y ?? 0,
          title: annotation.comment ? annotation.comment.slice(0, 30) : (annotation.element || "요소"),
          comment: annotation.comment || "",
          author: "고객사 (Agentation)",
          nearbyText: annotation.elementPath || "",
        }),
      });
      const data = await res.json();
      if (data.ok && data.item?.id && annotation.id) {
        idMapRef.current.set(annotation.id, data.item.id);
      }
    } catch (e) {
      console.error("Failed to sync annotation:", e);
    }
  };

  const handleAnnotationDelete = async (annotation: { id?: string; [key: string]: unknown }) => {
    if (!annotation.id) return;
    const feedbackId = idMapRef.current.get(annotation.id);
    if (!feedbackId) return;
    try {
      await fetch(`/api/feedback?id=${encodeURIComponent(feedbackId)}`, { method: "DELETE" });
      idMapRef.current.delete(annotation.id);
    } catch (e) {
      console.error("Failed to delete feedback:", e);
    }
  };

  return (
    <Agentation
      onAnnotationAdd={handleAnnotationAdd}
      onAnnotationDelete={handleAnnotationDelete}
    />
  );
}
