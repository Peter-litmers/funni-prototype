"use client";
import Link from "next/link";
import Image from "next/image";
import { Smartphone, Building2, MonitorCog, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white flex flex-col items-center justify-center p-6">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-sm ring-1 ring-pink-100">
          <Image src="/photopop-logo.png" alt="포토팟 로고" width={72} height={72} className="h-[72px] w-[72px] object-contain" />
        </div>
        <p className="text-sm text-primary font-medium mb-2">Photopot Prototype</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">포토팟</h1>
        <p className="text-base text-gray-500">촬영 스튜디오 예약과 운영 관리를 연결하는 플랫폼</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full mb-8">
        <Link href="/consumer" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4"><Smartphone size={24} strokeWidth={1.5} /></div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">소비자 화면</h2>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">스튜디오 탐색 → 예약 → 결제</p>
          <span className="text-primary font-medium text-sm group-hover:underline">열기 →</span>
        </Link>

        <Link href="/business" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4"><Building2 size={24} strokeWidth={1.5} /></div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">업체 화면</h2>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">스튜디오 관리 → 예약 달력 → 정산</p>
          <span className="text-primary font-medium text-sm group-hover:underline">열기 →</span>
        </Link>

        <Link href="/admin" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4"><MonitorCog size={24} strokeWidth={1.5} /></div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">어드민 웹</h2>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">입점 관리 → 수동 정산 → 광고</p>
          <span className="text-primary font-medium text-sm group-hover:underline">열기 →</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-5 max-w-4xl w-full border border-pink-100 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone size={14} strokeWidth={1.5} className="text-gray-700" /><span className="text-sm font-bold text-gray-900">앱 구조</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          소비자와 업체는 <strong className="text-primary">하나의 앱</strong>에서 동작합니다.
          하단 탭은 공통 구조를 유지하고, 마지막 탭만 계정 유형에 맞는 개인/업체 메뉴로 전환됩니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 max-w-4xl w-full border border-pink-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} strokeWidth={1.5} className="text-primary" />
          <span className="text-sm font-bold text-gray-900">현재 반영 범위</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          홈 구조 리디자인, 로고 교체, 브랜드 톤 정리, 소비자/업체 주요 진입 화면 리브랜딩을 우선 반영했습니다.
          이후 검색, 예약, 상세 운영 흐름도 같은 톤으로 확장할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
