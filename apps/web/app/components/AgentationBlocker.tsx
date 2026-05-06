"use client";
import { useEffect, useState, type ReactNode } from "react";

export default function AgentationBlocker({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const check = () => setIsActive(!!document.getElementById("feedback-cursor-styles"));
    const observer = new MutationObserver(check);
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      onClickCapture={(e) => {
        if (isActive) {
          e.stopPropagation();
        }
      }}
    >
      {children}
    </div>
  );
}
