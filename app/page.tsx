import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <p className="text-sm text-primary font-medium mb-2">Interactive Prototype</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">퍼니 (Funni)</h1>
        <p className="text-base text-gray-500">촬영 스튜디오 대관·예약 O2O 플랫폼</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full mb-8">
        <Link href="/consumer" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl mb-4">📱</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">소비자 화면</h2>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">스튜디오 탐색 → 예약 → 결제<br/>바비톡 스타일 UI</p>
          <span className="text-primary font-medium text-sm group-hover:underline">열기 →</span>
        </Link>

        <Link href="/business" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl mb-4">🏢</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">업체 화면</h2>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">스튜디오 등록 → 예약 관리 → 정산<br/>MY에서 업체 모드 전환</p>
          <span className="text-primary font-medium text-sm group-hover:underline">열기 →</span>
        </Link>

        <Link href="/admin" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl mb-4">🖥️</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">어드민 웹</h2>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">입점 관리 → 수동 정산 → 광고<br/>운영자 대시보드</p>
          <span className="text-primary font-medium text-sm group-hover:underline">열기 →</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-5 max-w-4xl w-full border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-gray-900">📱 앱 구조</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          소비자와 업체는 <strong className="text-primary">하나의 앱</strong>에서 동작합니다.
          하단 네비게이션 바(홈/탐색/예약/MY)는 동일하며, MY 탭에서 업체 모드로 전환하면 각 탭의 내용이 업체용으로 바뀝니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 max-w-4xl w-full border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="policy-badge">⚠️ 정책 미확정</span>
          <span className="text-sm font-bold text-gray-900">표시 안내</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          노란 점선 테두리 영역은 <strong className="text-amber-700">고객사와 정책이 확정되어야 개발 가능한 부분</strong>입니다.
          각 화면에서 확인하시고, 해당 항목이 결정되면 기획 확정 → 개발 착수가 가능합니다.
        </p>
      </div>
    </div>
  );
}
