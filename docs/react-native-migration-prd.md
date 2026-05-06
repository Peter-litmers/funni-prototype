# Funni React Native Migration PRD

작성일: 2026-04-29

## 1. 배경

`PROJECT-STATUS.md`에는 최종 제품의 목표 스택이 이미 `React Native (iOS+Android) + React (Web Admin)`으로 정의돼 있다. 하지만 현재 저장소는 실제 모바일 앱이 아니라, Next.js 기반 단일 웹 프로토타입이다. 따라서 이번 작업의 목적은 "현재 웹 UI를 그대로 포팅"하는 것이 아니라, 모바일 제품으로 재구성하기 위한 기준 문서를 만드는 것이다.

이번 문서에서 고정하는 전제는 아래와 같다.

- 어드민은 모바일로 옮기지 않고 웹으로 유지한다.
- 실서비스 API는 아직 구현돼 있지 않다.
- 현재 저장소의 `apps/web/app/api/*`는 프로토타입 보조 기능이며, 제품 백엔드 API로 간주하지 않는다.

## 2. 현재 코드베이스 진단

### 2.1 구조 요약

- 랜딩, 소비자, 업체, 어드민이 하나의 Next 앱 안에 들어 있다.
- 루트 레이아웃은 웹 전용 피드백 툴을 전역 주입한다. [app/layout.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/layout.tsx:1)
- 소비자/업체/어드민 화면은 각각 대형 단일 파일이다.
  - [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:1) 2326 lines
  - [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:1) 2124 lines
  - [app/admin/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/admin/page.tsx:1) 2796 lines
- 공통 상태는 [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:95) 에 집중돼 있으나, 브라우저 `localStorage`에 강하게 결합돼 있다.

### 2.2 React Native 전환에 불리한 지점

- Next 전용 컴포넌트 사용
  - `next/link`, `next/image`, `next/navigation`
- 브라우저 API 사용
  - `window`, `document`, `navigator.clipboard`, `Blob`, `URL.createObjectURL`, `confirm`, `alert`
- 웹 전용 피드백/주석 기능
  - [app/components/AgentationProvider.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/components/AgentationProvider.tsx:1)
  - [app/components/FeedbackDeepLinkMarker.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/components/FeedbackDeepLinkMarker.tsx:1)
- 데이터 저장 방식
  - `useSyncExternalStore + localStorage` 패턴은 RN에서 그대로 쓸 수 없다. [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:95)
- 화면 구조
  - 실제 라우팅 기반 앱이라기보다, 한 파일 안에서 `screen`, `tab` 상태를 바꾸며 여러 화면을 시뮬레이션한다. [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:56)

### 2.3 재사용 가능한 자산

- 도메인 데이터 모델 초안
  - 카테고리, 수수료, 환불률, 패키지, 정산 요청 등 타입/개념
- 순수 계산 로직
  - 수수료 계산, 예약금 계산, 환불률 선택 로직
- 정책 문서/카탈로그 성격의 정적 데이터
  - [app/lib/policy-catalog.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/policy-catalog.ts)
  - [app/lib/category-icons.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/category-icons.ts)
- 제품 방향성
  - 하나의 앱 안에서 소비자/업체 모드를 공존시키려는 방향
  - 어드민은 웹으로 유지하려는 방향 [PROJECT-STATUS.md](/Users/cigro/Downloads/funni-prototype/PROJECT-STATUS.md:11)

### 2.4 결론

이 저장소는 "RN으로 직접 변환"할 대상이 아니라, "RN 제품 설계를 위한 인터랙션 프로토타입"으로 보는 것이 맞다.

권장 전략:

1. 모바일 앱은 신규 React Native 앱으로 시작한다.
2. 어드민 웹은 Next.js로 유지한다.
3. 현재 프로토타입에서 재사용할 것은 UI가 아니라 도메인 규칙과 화면 흐름이다.
4. 공통 로직은 추출하고, 화면은 RN 패턴에 맞게 다시 조립한다.

## 3. 제품 목표

### 3.1 목표

- 소비자와 업체가 하나의 모바일 앱 안에서 동작한다.
- 어드민은 웹에서 운영한다.
- 현재 프로토타입의 핵심 흐름을 RN 기반 실서비스 구조로 재정의한다.
- 향후 실백엔드 연결이 가능한 상태 관리, API 계층, 네비게이션 구조를 만든다.

### 3.2 비목표

- Next.js 페이지를 JSX 단위로 1:1 포팅하지 않는다.
- 웹 전용 피드백 오버레이를 모바일 1차 범위에 포함하지 않는다.
- 현재 `localStorage` 기반 상태를 장기 구조로 유지하지 않는다.

## 4. 대상 범위

### 4.1 모바일 앱 범위

- 공통
  - 앱 셸, 인증 진입, 역할 전환, 하단 4탭
- 소비자
  - 홈, 탐색, 상세, 예약, 결제, 내 예약, MY
- 업체
  - 대시보드, 스튜디오 관리, 예약 관리, 정산 조회, MY

### 4.2 웹 범위

- 어드민 웹 유지
  - 업체 관리
  - 정산 관리
  - 광고/배너 관리
  - 정책 관리

## 5. 제품 원칙

### 5.1 앱 구조 원칙

- 소비자/업체는 하나의 앱 안에서 역할 기반으로 분기한다.
- 어드민은 별도 웹으로 유지한다.
- 탭 구조는 `홈 / 탐색 / 예약 / MY`를 기본으로 하되, 역할별 콘텐츠만 다르게 노출한다.

### 5.2 기술 원칙

- 모바일 신규 앱은 Expo 기반 React Native로 시작한다.
- 파일 기반 라우팅을 사용해 현재 웹 프로토타입의 경로 사고방식을 유지한다.
- 상태는 화면 상태와 서버 상태를 분리한다.
- 저장소 추상화 계층을 둬서 웹의 `localStorage`와 모바일의 영속 저장소를 분리한다.

## 6. 제안 기술 방향

### 6.1 권장 베이스라인

- Mobile: Expo + Expo Router + TypeScript
- Admin Web: Next.js 유지
- Shared: `packages/domain`, `packages/api`, `packages/ui-tokens` 형태의 공통 모듈 분리

### 6.2 저장소 전략

- 현재 `admin-store`는 그대로 옮기지 않는다.
- `storage adapter` 인터페이스를 만든다.
- 웹은 `localStorage`, 모바일은 AsyncStorage 계열 구현체를 사용한다.
- 대형 화면 상태는 저장소에 직접 얹지 말고, 도메인별 store로 분리한다.

### 6.3 API 전략

- 현재 Next Route Handler는 프로토타입용 보조 API에 가깝다.
  - 피드백
  - 정책 질문/답변
- 실서비스 기준의 예약, 결제, 정산, 인증 API는 아직 구현돼 있지 않다.
- 따라서 RN 전환과 동시에 "UI 포팅"보다 "실제 백엔드 계약 정의"가 먼저다.

정리하면:

- 실서비스 개발 기준으로는 API 명세 확정이 선행 과제다.
- 하지만 RN 화면 데모를 먼저 만드는 것은 가능하다.
- 이 경우에는 실데이터 연동이 아니라 `mock data + local state` 기준으로 화면을 먼저 이관한다.
- 어드민 웹은 그대로 두고, 모바일 화면만 별도 RN 앱에서 재구성한다.

## 7. 단계별 실행 계획

### Phase 0. 분석/설계 고정

- 화면 IA 재정리
- 사용자 역할 정의
- 정책 미확정 항목 정리
- API/DB 초안 작성

산출물:

- 모바일 IA
- 역할 전환 규칙
- 핵심 엔티티 목록
- API 초안

### Phase 0A. 화면 우선 이관 트랙

API 없이도 RN 화면 이관을 먼저 진행할 수 있는 별도 트랙이다.

- 목표: 현재 프로토타입의 핵심 UX를 RN 앱에서 먼저 재현
- 데이터 소스: 하드코딩 fixture + mock store
- 제외 범위: 실인증, 실결제, 실정산, 실예약 동기화

완료 기준:

- 소비자/업체 주요 화면이 RN 네비게이션 위에서 동작
- 현재 Next 프로토타입의 핵심 흐름을 모바일에서 데모 가능
- 이후 API 연결 시 교체할 수 있도록 화면 로직과 mock 데이터를 분리

### Phase 1. 기반 분리

- 모바일 앱 신규 생성
- 공통 타입/계산 로직 추출
- 디자인 토큰 정리
- 저장소 추상화 도입

완료 기준:

- Next 의존 없는 공통 도메인 패키지 생성
- RN 앱에서 공통 로직 import 가능

### Phase 1A. 화면 우선 이관 순서

화면을 먼저 옮긴다면 아래 순서가 가장 안전하다.

1. 앱 셸 + 하단 탭
2. 소비자 홈
3. 소비자 탐색
4. 소비자 상세
5. 소비자 예약/완료
6. 소비자 MY/예약목록
7. 업체 대시보드
8. 업체 예약목록/상세
9. 업체 스튜디오 등록/수정
10. 업체 정산 조회

이 순서는 현재 프로토타입의 데모 가치가 높은 흐름부터 옮기는 기준이다.

### Phase 2. 소비자 MVP

- 홈
- 카테고리 탐색
- 스튜디오 상세
- 예약 플로우
- 결제 진입
- 예약 목록/MY

완료 기준:

- 소비자 핵심 예약 플로우 데모 가능

### Phase 3. 업체 MVP

- 업체 모드 전환
- 대시보드
- 스튜디오 정보/패키지 관리
- 예약 현황
- 정산 조회

완료 기준:

- 하나의 앱 안에서 소비자/업체 모드 전환 가능

### Phase 4. 운영 웹 정리

- 어드민 기능을 Next 웹에 유지
- 모바일과 공통 API 계약 정렬
- 운영 데이터 구조 정리

완료 기준:

- 모바일 앱과 웹 어드민이 같은 도메인 모델을 기준으로 동작

## 8. 반드시 선행돼야 하는 의사결정

아래 항목은 이미 `PROJECT-STATUS.md`에도 미확정으로 남아 있으며, RN 구현 전에 닫아야 한다.

- 예약 확정 방식
- 예약 시간 단위/최소 시간
- 소비자/업체 계정 통합 여부
- 업체 모드 전환 UX
- 취소/환불/노쇼 정책
- 정산 단위와 정산 조회 범위
- 리뷰/광고 운영 정책

## 9. 리스크

- 현재 화면 파일이 너무 커서 컴포넌트 재사용보다 재설계 비용이 더 크다.
- `localStorage` 기반 상태가 많아 모바일 저장소로의 단순 치환이 어렵다.
- 결제/정산/인증은 실제 서버 계약 없이 모바일 구현을 시작하면 재작업 가능성이 높다.
- 웹 피드백 툴은 모바일에서 동일하게 재현되지 않는다.

## 10. 성공 기준

- 모바일 앱이 웹 프로토타입이 아닌 실제 RN 네비게이션 구조로 동작한다.
- 소비자/업체 공통 앱 구조가 유지된다.
- 어드민 웹은 별도 운영 도구로 유지된다.
- 공통 비즈니스 규칙은 UI 파일이 아니라 공유 모듈에 위치한다.
- 실백엔드 연결을 전제로 한 API 계약 문서가 존재한다.

## 11. 바로 다음 액션

1. 현재 프로토타입 화면을 기능 기준으로 잘게 분해한다.
2. 공통 도메인 모델 목록을 뽑는다.
3. 모바일 IA와 탭 구조를 확정한다.
4. 화면 우선이면 Expo 앱을 먼저 만들고 mock 기반으로 주요 화면을 이관한다.
5. 실서비스 전환 단계에서 예약/결제/정산 API 계약을 붙인다.

## 12. 외부 기준 문서

- Expo는 신규 앱 시작점으로 `create-expo-app`을 제공한다.
- Expo Router는 React Native용 파일 기반 라우팅을 제공한다.
- React Native 자체 저장소 대신 커뮤니티 Async Storage 사용이 권장된다.

참고:

- https://docs.expo.dev/more/create-expo/
- https://docs.expo.dev/router/introduction/
- https://docs.expo.dev/versions/latest/sdk/async-storage/
- https://reactnative.dev/docs/network

## 13. 화면 기능 분해표

### 13.1 앱 공통 셸

| 영역 | 현재 근거 | RN 목표 화면/구조 | 핵심 기능 |
|---|---|---|---|
| 앱 셸 | [app/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/page.tsx:1) | `/(tabs)` 기반 앱 셸 | 소비자/업체 공존 구조, 브랜드 홈 진입 |
| 공통 탭 | [PROJECT-STATUS.md](/Users/cigro/Downloads/funni-prototype/PROJECT-STATUS.md:34) | `home / explore / bookings / my` | 역할별 콘텐츠 분기 |
| 인증 진입 | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:2104), [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:1977) | `/auth/*` | 카카오/네이버 로그인, 일반 로그인, 회원가입 |
| 알림 | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:2235), [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:1056) | `/notifications` | 역할별 알림 목록, 딥링크 이동 |

### 13.2 소비자 앱

현재 소비자 화면은 [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:680) 의 `Screen` enum으로 시뮬레이션된다.

| 현재 screen | RN 목표 route 예시 | 핵심 기능 | 비고 |
|---|---|---|---|
| `home` | `/home` | 광고 카드, 추천 검색어, 카테고리 진입, 브랜드 홈 | 검색 진입과 탐색 진입이 섞여 있음 |
| `category` | `/explore` | 카테고리/지역/가격 필터, 정렬, 스튜디오 목록 | RN에서는 탐색 메인 화면으로 승격 |
| `detail` | `/studio/[id]` | 스튜디오 상세, 포트폴리오, 소개, 패키지, 예약금/옵션 확인 | 소개 더보기, 진입 카테고리 상태 포함 |
| `booking` | `/booking/[studioId]` | 날짜/시간 선택, 패키지/옵션 선택, 예약금/잔금 계산 | 예약 도메인의 핵심 |
| `done` | `/booking/complete` | 예약 완료, 후속 액션 | 예약 상세나 예약목록으로 연결 |
| `balancePayment` | `/payments/balance/[bookingId]` | 잔금 결제 | 예약금 모델 채택 시 필요 |
| `myBookings` | `/bookings` | 예정/완료/취소 목록, 취소, 잔금 결제, 리뷰 작성 진입 | 소비자 예약 허브 |
| `reviewWrite` | `/reviews/write/[bookingId]` | 평점/텍스트 입력 | 최소 글자수 정책 포함 |
| `myReviews` | `/reviews/me` | 리뷰 목록, 수정 | 리뷰 정책 연동 |
| `paymentHistory` | `/payments/history` | 결제 이력 조회 | PG 연동 후 거래 기준 필요 |
| `mypage` | `/my` | 프로필, 예약/리뷰/결제 진입, 업체 전환 CTA | 역할 전환 UX 결정 필요 |
| `login` | `/auth/login` | 로그인 | 소셜/이메일 |
| `signup` | `/auth/signup` | 소비자 회원가입 | 약관 동의 포함 |
| `bizSignup` | `/auth/business-signup` | 업체 가입 신청 | 하나의 앱에서 업체 전환 진입점 |
| `forgotPassword` | `/auth/forgot-password` | 비밀번호 찾기 | 소셜 중심이면 축소 가능 |
| `notifications` | `/notifications` | 알림 리스트 | 액션 기반 이동 |

소비자 구현 우선순위:

1. `home`
2. `explore`
3. `studio detail`
4. `booking`
5. `bookings`
6. `my`

### 13.3 업체 앱

현재 업체 화면은 [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:56) 의 `Screen` enum으로 시뮬레이션된다.

| 현재 screen | RN 목표 route 예시 | 핵심 기능 | 비고 |
|---|---|---|---|
| `home` | `/home` 또는 역할별 홈 | 광고/추천/탐색 공통 홈 | 현재는 소비자 홈과 유사 |
| `category` | `/explore` | 공통 탐색 | 소비자와 UI 공유 가능 |
| `detail` | `/studio/[id]` | 공통 스튜디오 상세 | 업체도 탐색 맥락에서 진입 |
| `dashboard` | `/biz/dashboard` | 실적 요약, 예약 현황, 취소 요청, 정산 CTA | 업체 전용 홈 역할 |
| `register` | `/biz/studios/edit` | 스튜디오 등록/수정, 카테고리, 소개, 태그, 패키지 | 대형 폼, 도메인 분리 필요 |
| `studioView` | `/biz/studios/[id]` | 등록된 스튜디오 조회 | 공개 상세와 편집 상세 분리 필요 |
| `bookings` | `/biz/bookings` | 캘린더/필터 기반 예약 목록 | 상태별 관리 허브 |
| `bookingDetail` | `/biz/bookings/[id]` | 예약 상세, 확정/취소/노쇼/완료 처리 | 운영 액션 집중 화면 |
| `settlement` | `/biz/settlements` | 월별 정산 조회, 정산 요청 | 백엔드 계약 필수 |
| `reviews` | `/biz/reviews` | 리뷰 목록, 답글 | 리뷰 운영 정책과 연결 |
| `bizInfo` | `/biz/account` | 업체 정보/계좌/정책 정보 | 정산 계좌와 분리 검토 가능 |
| `mypage` | `/my` 또는 `/biz/my` | 업체 설정 허브 | 소비자 MY와 정보 구조 정리 필요 |
| `notifications` | `/notifications` | 업체 알림 | 예약/정산 이벤트 중심 |
| `bizSignup` | `/auth/business-signup` | 업체 가입 신청 | 소비자 앱과 공유 |
| `approvalWaiting` | `/auth/business-pending` | 심사 대기 상태 | 업체 온보딩 상태 화면 |
| `login` | `/auth/login` | 로그인 | 통합 인증으로 합칠 가능성 높음 |

업체 구현 우선순위:

1. `dashboard`
2. `biz bookings`
3. `booking detail`
4. `studio edit/view`
5. `settlements`
6. `reviews`

### 13.4 어드민 웹

현재 어드민은 [app/admin/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/admin/page.tsx:72) 의 탭 구조다.

| 현재 tab | 웹 유지 여부 | 핵심 기능 |
|---|---|---|
| `dashboard` | 유지 | KPI, 월별 집계 |
| `businesses` | 유지 | 업체 목록, 상세, 수수료 설정 |
| `settlement` | 유지 | 정산 목록, 정산 처리, KB 파일 다운로드 |
| `ads` | 유지 | 카테고리별 광고 구좌 관리 |
| `members` | 유지 | 회원 관리, 차단 |
| `categories` | 유지 | 카테고리/지역/추천 검색어/아이콘 설정 |
| `banners` | 유지 | 배너 운영 |
| `bookings` | 유지 | 예약 관리 |
| `payments` | 유지 | 결제/환불 관리 |
| `reviews` | 유지 | 리뷰 삭제 요청/숨김 처리 |
| `policies` | 유지 | 운영 정책 문서 관리 |

## 14. 공통 도메인 모델 목록

### 14.1 핵심 공유 엔티티

| 도메인 | 현재 근거 | 설명 | 공유 대상 |
|---|---|---|---|
| `User` | 소비자/업체 로그인 흐름 전반 | 소비자/업체 역할을 가진 사용자 계정 | mobile, backend, admin |
| `UserRole` | [PROJECT-STATUS.md](/Users/cigro/Downloads/funni-prototype/PROJECT-STATUS.md:33) | `consumer`, `business`, `admin` | mobile, backend |
| `Studio` | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:45), [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:83) | 스튜디오 기본 정보, 카테고리, 지역, 소개, 평점 | mobile, backend, admin |
| `StudioCategory` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:146) | 카테고리 마스터 | mobile, admin, backend |
| `Region` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:155) | 지역 마스터 | mobile, admin, backend |
| `StudioPackage` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:267) | 패키지명, 가격, 설명 | mobile, admin, backend |
| `StudioDeposit` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:389) | 예약금 사용 여부, 정률/정액, 값 | mobile, admin, backend |
| `FeaturedPackage` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:451) | 대표 노출 패키지 인덱스 | mobile, admin |
| `StudioPortfolio` | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:43) | 카테고리별 포트폴리오 묶음 | mobile, admin, backend |
| `CategoryIcon` | [app/lib/category-icons.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/category-icons.ts:7) | 카테고리 아이콘 매핑 | mobile, admin |

### 14.2 예약/결제 도메인

| 도메인 | 현재 근거 | 설명 | 공유 대상 |
|---|---|---|---|
| `Booking` | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:630), [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:98) | 예약 기본 엔티티. 소비자, 스튜디오, 날짜, 시간, 상태 | mobile, backend, admin |
| `BookingStatus` | 소비자/업체 booking filter | 예정/완료/취소/확정/취소 요청 등 상태 집합 | mobile, backend, admin |
| `BookingAction` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:617) | 환불 여부, 노쇼 여부, 메모 | admin, backend |
| `TimeSlot` | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:685) | 예약 가능한 시간 슬롯 | mobile, backend |
| `Payment` | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:663) | 결제 기록, 예약금/잔금 분리 포함 | mobile, backend, admin |
| `RefundPolicy` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:816) | 카테고리별 기간 구간 환불률 | mobile, admin, backend |
| `SettlementRequest` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:743) | 업체 정산 요청 | business, admin, backend |
| `SettlementRow` | [app/admin/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/admin/page.tsx:75) | 운영 정산 처리 단위 | admin, backend |

### 14.3 리뷰/운영 도메인

| 도메인 | 현재 근거 | 설명 | 공유 대상 |
|---|---|---|---|
| `Review` | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:658), [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:1891) | 소비자 리뷰 본문, 평점, 작성 상태 | mobile, backend, admin |
| `ReviewDeleteRequest` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:560) | 리뷰 삭제 요청 및 심사 상태 | mobile, admin, backend |
| `Notification` | [app/consumer/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/consumer/page.tsx:622), [app/business/page.tsx](/Users/cigro/Downloads/funni-prototype/apps/web/app/business/page.tsx:114) | 역할별 알림 | mobile, backend |
| `NoShowReport` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:673) | 노쇼 신고 | business, admin, backend |
| `PolicyEntry` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:937) | 운영 정책 문서 값과 변경 이력 | admin, backend |
| `PolicySection` | [app/lib/policy-catalog.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/policy-catalog.ts:11) | 정책 카탈로그 구조 | admin |

### 14.4 마케팅/탐색 도메인

| 도메인 | 현재 근거 | 설명 | 공유 대상 |
|---|---|---|---|
| `HomeKeyword` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:33) | 추천 검색어와 alias 규칙 | mobile, admin |
| `AdEntry` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:215) | 카테고리별 광고 슬롯 데이터 | mobile, admin, backend |
| `BannerEntry` | [app/lib/admin-store.ts](/Users/cigro/Downloads/funni-prototype/apps/web/app/lib/admin-store.ts:484) | 메인/카테고리 배너 | mobile, admin, backend |

### 14.5 1차 타입 설계 제안

1. `Studio`, `Booking`, `Payment`, `Review`, `SettlementRequest`를 최우선 서버 엔티티로 확정한다.
2. `HomeKeyword`, `CategoryIcon`, `BannerEntry`, `AdEntry`는 운영 설정 엔티티로 분리한다.
3. `PolicyEntry`는 실설정값과 문서성 운영가이드를 분리한다.
4. `BookingStatus`, `SettlementStatus`, `ReviewDeleteRequestStatus`는 enum으로 먼저 고정한다.
5. `consumer/biz/admin`가 모두 쓰는 타입은 `packages/domain`에 두고, 화면 전용 상태는 각 앱 내부로 남긴다.

## 15. 다음 문서화 대상

이 문서 다음 단계로 바로 이어져야 할 산출물:

1. 모바일 IA 상세 트리
2. API 계약 초안
3. 예약 상태 머신
4. 역할 전환 UX 명세
5. 어드민-모바일 권한 매트릭스

## 16. 판단 정리: 화면 먼저 옮길 수 있는가

대답은 `가능하다`이다. 다만 조건이 있다.

### 16.1 가능한 이유

- 현재 프로토타입은 이미 서버 의존보다 화면/상태 시뮬레이션 비중이 높다.
- 소비자/업체 흐름 대부분이 로컬 상태와 하드코딩 데이터로 동작한다.
- 따라서 RN에서도 같은 fixture 기반으로 화면을 먼저 재현할 수 있다.

### 16.2 주의할 점

- 이것은 `실서비스 이전`이 아니라 `RN 프로토타입 재구성`이다.
- 현재 Next 화면을 1:1 복붙하는 방식은 비효율적이다.
- 화면은 먼저 옮기되, 데이터는 `mock layer`로 분리해서 만들어야 한다.

### 16.3 추천 실행 방식

- `apps/mobile`에 Expo 앱을 새로 만든다.
- `fixtures/` 또는 `packages/domain-mocks/`에 목데이터를 둔다.
- 화면별로 `view model` 또는 `screen state`를 분리한다.
- 결제/정산/인증 버튼은 1차에서 mock action으로 처리한다.

### 16.4 지금 기준 우선순위

1. 소비자 홈/탐색/상세/예약
2. 소비자 예약목록/MY
3. 업체 대시보드/예약관리
4. 업체 스튜디오 관리
5. 업체 정산 조회

즉, 지금 단계에서는 `API보다 화면을 먼저 옮기는 전략`이 맞다. 단, 그것을 실서비스 준비 완료와 혼동하면 안 된다.
