import type { Metadata } from "next";
import "./globals.css";
import AgentationProvider from "./components/AgentationProvider";
import AgentationBlocker from "./components/AgentationBlocker";

export const metadata: Metadata = {
  title: "퍼니 - 스튜디오 대관 플랫폼 프로토타입",
  description: "소비자앱 / 업체앱 / 어드민웹 프로토타입",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <AgentationBlocker>{children}</AgentationBlocker>
        <AgentationProvider />
      </body>
    </html>
  );
}
