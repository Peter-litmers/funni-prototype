// 정책 카탈로그 — 어드민 '정책' 탭에서 문서로 관리하는 정책 목록
// 실서비스 설정값과는 분리된 DRAFT 문서 (운영 배포 시 개발팀이 반영)

export type PolicyItem = {
  id: string;
  title: string;
  defaultValue: string;
  note?: string; // 보조 설명
};

export type PolicySection = {
  id: string;
  icon: string;
  title: string;
  items: PolicyItem[];
};

export const POLICY_CATALOG: PolicySection[] = [
  {
    id: "account",
    icon: "👤",
    title: "회원 · 계정",
    items: [
      {
        id: "auth.social",
        title: "소셜 로그인",
        defaultValue: "카카오 + 네이버 + 구글 (3종 모두 지원)",
      },
      {
        id: "auth.business-docs",
        title: "업체 가입 필수 서류",
        defaultValue: "사업자등록번호 + 카테고리별 포트폴리오 사진 (카테고리당 최소 6장)",
      },
      {
        id: "auth.multi-account",
        title: "동일인 다중 계정",
        defaultValue: "소비자 1개 + 업체 1개까지 동일 SNS로 가입 허용",
      },
    ],
  },
  {
    id: "fee",
    icon: "💰",
    title: "수수료 · 정산",
    items: [
      {
        id: "fee.default-rate",
        title: "기본 수수료율",
        defaultValue: "10%",
        note: "어드민 대시보드에서 업체별 개별 설정 가능",
      },
      {
        id: "fee.calc-base",
        title: "수수료 계산 기준",
        defaultValue: "촬영 비용 + 헤어/메이크업 옵션 등 총액 기준",
      },
      {
        id: "settle.unit",
        title: "정산 단위",
        defaultValue: "업체별 일괄 정산",
      },
      {
        id: "settle.cycle",
        title: "정산 주기",
        defaultValue: "월별 기본, 주별 조회 가능",
      },
      {
        id: "settle.target",
        title: "정산 대상",
        defaultValue: "완료된 예약의 총액 (예약금 포함)",
      },
      {
        id: "settle.refund-handling",
        title: "정산 후 환불 발생 시 처리",
        defaultValue:
          "• 정산 완료 전 발생: 해당 정산액에서 즉시 차감\n• 정산 완료 후 발생: 다음 정산 회차에서 차감\n• 누적 환불액 > 다음 정산액: 업체 별도 계좌 입금 요청",
        note: "대표 확인 대기",
      },
      {
        id: "settle.min-max",
        title: "최소 / 최대 정산 금액",
        defaultValue: "최소 ₩50,000 / 최대 ₩10,000,000 (1회 정산 기준)",
        note: "대표 확인 대기 (최대치 협의 중)",
      },
    ],
  },
  {
    id: "booking",
    icon: "📅",
    title: "예약 · 확정",
    items: [
      {
        id: "booking.min-unit",
        title: "최소 예약 단위",
        defaultValue: "1시간 (30분 단위 불가)",
      },
      {
        id: "booking.window",
        title: "예약 가능 기간",
        defaultValue: "기본 무제한 (업체별 최소/최대 기간 개별 설정 가능)",
      },
      {
        id: "booking.confirm",
        title: "예약 확정 방식",
        defaultValue:
          "소비자 예약금 결제 → 업체 승인 → 확정\n· 미승인 시 자동 취소 + 전액 환불",
      },
      {
        id: "booking.auto-cancel",
        title: "미승인 자동취소 대기시간",
        defaultValue: "영업일 기준 48시간",
        note: "영업일 / 달력일 선택 — 어드민 운영 정책 기준치에서 조정 가능",
      },
      {
        id: "booking.buffer",
        title: "촬영 간 버퍼 시간",
        defaultValue: "업체가 카테고리별로 설정 (0 / 15 / 30 / 60 / 90 / 120분)",
      },
      {
        id: "booking.deposit",
        title: "예약금 제도",
        defaultValue:
          "업체가 카테고리별 예약금 금액 직접 설정 · 정산 시 총액에 포함",
      },
    ],
  },
  {
    id: "cancel",
    icon: "↩️",
    title: "취소 · 환불",
    items: [
      {
        id: "cancel.refund-schedule",
        title: "소비자 취소 환불 기준",
        defaultValue:
          "• 촬영 7일 전까지: 전액 환불\n• 3~6일 전: 80% 환불 (20% 수수료)\n• 1~2일 전: 50% 환불\n• 당일: 20% 환불 (80% 수수료)",
        note: "대표 확인 대기",
      },
      {
        id: "cancel.business-side",
        title: "업체 사유 취소",
        defaultValue: "소비자 100% 전액 환불 + 업체에 페널티 누적 기록",
      },
      {
        id: "cancel.penalty-threshold",
        title: "업체 취소 누적 이용정지 기준",
        defaultValue: "5회 누적 시 이용정지 검토",
        note: "대표 확인 대기",
      },
      {
        id: "cancel.noshow",
        title: "노쇼 처리",
        defaultValue:
          "업체측 '노쇼 처리' 버튼으로 접수 → 어드민 대시보드에 자동 집계\n소비자 누적 3회 시 경고",
        note: "대표 확인 대기",
      },
    ],
  },
  {
    id: "review",
    icon: "⭐",
    title: "리뷰",
    items: [
      {
        id: "review.write-window",
        title: "작성 가능 기간 (소비자)",
        defaultValue: "업체 완료 처리 후 2주 이내",
      },
      {
        id: "review.edit-window",
        title: "수정 가능 기간",
        defaultValue: "작성 후 3일 이내",
      },
      {
        id: "review.delete",
        title: "삭제 정책",
        defaultValue: "직접 삭제 불가 · 사유 입력 후 어드민 승인 시 삭제",
      },
      {
        id: "review.length",
        title: "최소 / 최대 글자수",
        defaultValue: "최소 30자 / 최대 300자",
      },
      {
        id: "review.photos",
        title: "사진 첨부",
        defaultValue: "불가 (계약 범위 외)",
      },
      {
        id: "review.business-reply",
        title: "업체 답글",
        defaultValue: "리뷰 등록 후 1주 이내 작성 가능 · 1회/리뷰",
      },
    ],
  },
  {
    id: "business",
    icon: "🏢",
    title: "업체 입점 · 운영",
    items: [
      {
        id: "biz.onboarding",
        title: "입점 방식",
        defaultValue: "관리자 수동 검토 (가입 시 제출한 포트폴리오 심사)",
      },
      {
        id: "biz.reject-notice",
        title: "승인 거절 사유 전달",
        defaultValue: "이메일 + 앱 알림 동시 발송",
      },
      {
        id: "biz.reapply",
        title: "재신청 규칙",
        defaultValue: "횟수/대기기간 제한 없이 관리자 재차단 가능",
      },
      {
        id: "biz.suspend",
        title: "이용정지 기준",
        defaultValue:
          "노쇼 누적 · 소비자 CS 누적 · 포트폴리오 도용 등\n임시: 노쇼·CS 5건 이상 시 어드민 재량 정지",
        note: "대표 확인 대기",
      },
      {
        id: "biz.terminate",
        title: "강제 탈퇴 / 퇴점 기준",
        defaultValue: "운영 초기 정책 수립 후 반영",
        note: "대표 확인 대기 — 시나리오 기반 확정 필요",
      },
    ],
  },
  {
    id: "ads",
    icon: "📢",
    title: "광고",
    items: [
      {
        id: "ads.banner-slots",
        title: "광고 배너 구좌",
        defaultValue: "정사각형 3개 × 3페이지 = 총 9구좌 (로테이션 노출)",
      },
      {
        id: "ads.period",
        title: "광고 노출 기간 단위",
        defaultValue: "월간 기본, 건별 시작일/종료일 직접 설정 가능",
      },
      {
        id: "ads.banner-order",
        title: "배너 노출 순서",
        defaultValue: "로테이션 (9구좌 순환)",
      },
      {
        id: "ads.min-rate",
        title: "최소 광고 단가 (월간 기준)",
        defaultValue: "₩300,000",
        note: "대표 확인 대기",
      },
      {
        id: "ads.premium",
        title: "프리미엄 영역 (추천 스튜디오)",
        defaultValue:
          "홈 상단 '지금 추천하는 스튜디오' 섹션 · 유료 수동 등록\n어드민에서 업체 직접 선정",
      },
    ],
  },
  {
    id: "discover",
    icon: "🔍",
    title: "탐색 · 필터 · 지도",
    items: [
      {
        id: "discover.map",
        title: "지도 API",
        defaultValue: "카카오 지도 (일 30만 건 무료, 초기~중기 비용 없음)",
        note: "네이버 6월 만료로 전환 확정",
      },
      {
        id: "discover.default-sort",
        title: "기본 정렬",
        defaultValue: "결제순 → 평점순 (어떤 상위 정렬이든 평점 차순으로 고정)",
      },
      {
        id: "discover.sort-options",
        title: "정렬 옵션",
        defaultValue: "결제순 / 평점순 / 거리순",
      },
      {
        id: "discover.categories",
        title: "카테고리 목록 (기본)",
        defaultValue:
          "프로필 · 바디프로필 · 웨딩 · 가족 · 반려동물 · 비즈니스 · 커플 · 아기",
        note: "어드민 '카테고리 관리'에서 실시간 편집 가능",
      },
      {
        id: "discover.home-structure",
        title: "홈 화면 구조",
        defaultValue:
          "① 광고 배너 (9구좌) → ② 추천 스튜디오 (유료 수동) → ③ 많이 찾는 스튜디오 (자동: 결제순+평점) → ④ 필터",
      },
    ],
  },
  {
    id: "notification",
    icon: "🔔",
    title: "알림",
    items: [
      {
        id: "notif.channels",
        title: "알림 채널",
        defaultValue: "FCM 푸시 + 인앱 알림 목록 (중복 발송)",
      },
      {
        id: "notif.triggers",
        title: "알림 발송 시점",
        defaultValue:
          "• 예약 확정 (업체 승인 시)\n• 촬영 리마인드 (전일 오전)\n• 리뷰 작성 요청 (완료 처리 후)\n• 업체 입점 승인/거절",
      },
    ],
  },
];

export function formatTimestamp(ts: number): string {
  if (!ts) return "-";
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
