# Funni Mobile UI Architecture

작성일: 2026-04-29

## 1. 목적

이 문서는 현재 Next.js 웹 프로토타입을 React Native로 "다시 조립"할 때의 구현 기준 문서다.

목표는 아래 3가지다.

- 화면을 먼저 RN으로 옮긴다.
- `탭 이동 + mock 액션`까지 동작하는 모바일 프로토타입을 만든다.
- 이후 API를 붙여도 구조를 크게 뜯지 않게 만든다.

전제:

- 어드민은 웹 유지
- 모바일은 소비자/업체 통합 앱
- 1차는 `mock data + local state`
- 스타일링은 `NativeWind v4.x`

## 2. 추천 스택

### 필수

- `expo`
- `expo-router`
- `nativewind@v4`
- `expo-image`
- `@expo/vector-icons`
- `expo-font`

### 조건부

- `react-hook-form`
  - 업체 등록/수정 폼이 커서 도입 가치가 높다
- `zustand`
  - 1차 필수는 아니고, 역할/세션/공통 필터가 커질 때 도입

## 3. 구현 원칙

### 3.1 재사용 원칙

- 화면 전체를 재사용하지 않는다.
- 작은 UI 조각과 도메인 카드 단위로 재사용한다.
- 소비자/업체가 같은 데이터를 다르게 보여주는 경우, "공통 카드 + 역할별 wrapper"로 푼다.

### 3.2 상태 원칙

- 1차는 `local state + feature hooks` 위주
- 전역 store는 최소화
- mock 데이터는 화면 밖으로 분리
- API 없이도 동작하게 `repository interface`를 먼저 둔다

### 3.3 스타일 원칙

- 웹 Tailwind 클래스를 1:1 복사하지 않는다.
- 토큰 먼저 정의하고 NativeWind 클래스로 다시 쓴다.
- 공통 컴포넌트에는 variant 패턴을 준다.
- screen 파일에 긴 className 문자열이 계속 반복되면 컴포넌트로 승격한다.

### 3.4 완료 기준

화면 이관 완료는 아래 조건을 만족해야 한다.

1. 탭 이동이 된다.
2. 소비자/업체 모드 전환이 된다.
3. 예약/리뷰/정산 버튼이 mock 액션으로 반응한다.
4. 공통 카드와 버튼이 재사용된다.
5. mock layer를 교체하면 API 연동으로 넘어갈 수 있다.

## 4. 추천 폴더 구조

```text
apps/mobile/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      home.tsx
      explore.tsx
      bookings.tsx
      my.tsx
    studio/
      [id].tsx
    booking/
      [studioId].tsx
      complete.tsx
      balance/
        [bookingId].tsx
    notifications.tsx
    auth/
      login.tsx
      signup.tsx
      business-signup.tsx
      business-pending.tsx
    biz/
      dashboard.tsx
      bookings/
        index.tsx
        [id].tsx
      studios/
        index.tsx
        edit.tsx
        [id].tsx
      settlements.tsx
      reviews.tsx
      account.tsx

  src/
    components/
      ui/
        Button.tsx
        Chip.tsx
        Badge.tsx
        Section.tsx
        Screen.tsx
        EmptyState.tsx
        Input.tsx
        TopBar.tsx
      cards/
        StudioCard.tsx
        BookingCard.tsx
        ReviewCard.tsx
        NotificationCard.tsx
        StatCard.tsx
      forms/
        PackageEditor.tsx
        DepositEditor.tsx
        TagInputRow.tsx
      layout/
        TabBar.tsx
        RoleGate.tsx
        HeaderActions.tsx

    features/
      consumer/
        components/
        hooks/
        screens/
        selectors/
      business/
        components/
        hooks/
        screens/
        selectors/
      shared/
        components/
        hooks/
        formatters/
        constants/

    lib/
      navigation/
      utils/
      cn.ts

    mocks/
      fixtures/
        studios.ts
        bookings.ts
        reviews.ts
        notifications.ts
        settlements.ts
      repositories/
        studioRepository.ts
        bookingRepository.ts
        reviewRepository.ts
        notificationRepository.ts
      scenarios/
        consumer.ts
        business.ts

    theme/
      colors.ts
      spacing.ts
      radius.ts
      typography.ts
      shadows.ts
      tokens.ts

packages/
  domain/
    studio.ts
    booking.ts
    payment.ts
    review.ts
    settlement.ts
    notification.ts
    enums.ts
    calculators/
      deposit.ts
      refund.ts
      pricing.ts
```

## 5. 폴더 구조 설명

### `app/`

- Expo Router route 파일만 둔다.
- business logic를 많이 넣지 않는다.
- route 파일은 `screen container` 역할만 한다.

예시:

- 데이터 로드 훅 호출
- 파라미터 읽기
- 상위 레이아웃 연결
- 프레젠테이셔널 컴포넌트 조합

### `src/components/ui/`

- 앱 전반에서 반복되는 최소 단위 컴포넌트
- 디자인 시스템의 실제 출력층

예시:

- `Button`
- `Chip`
- `Badge`
- `Input`
- `Section`
- `TopBar`

### `src/components/cards/`

- 도메인 정보를 카드로 보여주는 재사용 컴포넌트
- 화면보다 큰 단위지만, feature에 종속되지 않게 유지

예시:

- `StudioCard`
- `BookingCard`
- `ReviewCard`

### `src/features/*`

- 소비자/업체별 화면 조립 로직
- hook, selector, 화면용 helper는 여기 둔다

### `src/mocks/`

- 화면 이관 1차에서 가장 중요
- fixture와 repository를 분리해서 mock도 "진짜 데이터 계층처럼" 만든다

예시:

- `studioRepository.list()`
- `bookingRepository.getById()`
- `bookingRepository.cancel()`
- `reviewRepository.create()`

### `packages/domain/`

- UI 의존 없는 타입과 계산 로직
- 나중에 웹/모바일/백엔드가 공유할 수 있는 가장 안전한 층

## 6. 화면 분해 기준

### 6.1 공통 UI primitives

먼저 만들어야 하는 것:

- `Button`
- `IconButton`
- `Chip`
- `StatusBadge`
- `Section`
- `TextField`
- `CardShell`
- `TopBar`
- `BottomActionBar`

이 레벨은 스타일 일관성을 담당한다.

### 6.2 공통 도메인 카드

두 번째로 만들어야 하는 것:

- `StudioCard`
- `StudioHero`
- `PackageCard`
- `BookingCard`
- `ReviewCard`
- `NotificationCard`
- `SettlementSummaryCard`
- `StatCard`

이 레벨은 consumer/business 공통 재사용의 핵심이다.

### 6.3 feature 조립 컴포넌트

세 번째 레벨:

- `HomeAdCarousel`
- `CategoryFilterBar`
- `PriceFilterSheet`
- `BookingCalendar`
- `BookingTimeSlots`
- `BusinessBookingActions`
- `StudioEditorForm`
- `DepositSettingsPanel`

이 레벨부터는 feature 종속이 생겨도 괜찮다.

### 6.4 화면

마지막 레벨:

- `ConsumerHomeScreen`
- `ConsumerExploreScreen`
- `ConsumerStudioDetailScreen`
- `ConsumerBookingScreen`
- `BusinessDashboardScreen`
- `BusinessBookingsScreen`
- `BusinessBookingDetailScreen`

화면 파일은 가능한 한 "조립"만 해야 한다.

## 7. 무엇을 공통화하고 무엇을 분리할지

### 공통화 대상

- 버튼
- 칩/배지
- 섹션 컨테이너
- 스튜디오 카드
- 예약 카드
- 리뷰 카드
- 알림 카드
- 가격/예약금 계산 로직
- 상태 라벨 매핑

### 분리 대상

- 소비자 MY와 업체 MY
- 소비자 예약 상세와 업체 예약 상세 액션 패널
- 업체 스튜디오 편집 폼
- 업체 대시보드 KPI
- 정산 요청 흐름

### 기준

- 데이터 구조는 같고 표시만 다르면 공통화
- 액션이 다르면 분리
- 분기 prop가 5개 이상 늘어나면 분리

## 8. NativeWind 토큰 구조

현재 웹 색상 기준은 [globals.css](/Users/cigro/Downloads/funni-prototype/apps/web/app/globals.css:1)에 있다.

핵심 값:

- `primary`: `#e85d93`
- `primary-light`: `#fce3ec`
- `primary-dark`: `#c43c74`
- `primary-bg`: `#fff4f8`
- `warning`: `#F59E0B`
- `danger`: `#EF4444`
- `success`: `#10B981`

### 추천 토큰 파일

```ts
// apps/mobile/src/theme/colors.ts
export const colors = {
  brand: {
    50: "#fff4f8",
    100: "#fce3ec",
    500: "#e85d93",
    700: "#c43c74",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    400: "#9ca3af",
    500: "#6b7280",
    700: "#374151",
    900: "#111827",
  },
  success: {
    50: "#ecfdf5",
    500: "#10b981",
  },
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
  },
  danger: {
    50: "#fef2f2",
    500: "#ef4444",
  },
  white: "#ffffff",
  black: "#000000",
} as const;
```

```ts
// apps/mobile/src/theme/radius.ts
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;
```

```ts
// apps/mobile/src/theme/spacing.ts
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;
```

### NativeWind theme 방향

- 브랜드 색상을 `primary` 대신 `brand` 네임스페이스로 두는 것을 권장
- 이유:
  - semantic token으로 확장하기 쉽다
  - 이후 `accent`, `info`, `surface` 추가가 자연스럽다

추천 semantic alias:

- `bg-brand-500`
- `text-brand-500`
- `border-brand-200`
- `bg-success-50`
- `bg-warning-50`
- `bg-danger-50`

## 9. 웹 클래스에서 RN로 옮길 때 매핑 원칙

현재 웹에서 반복적으로 쓰이는 패턴:

- `bg-primary`
- `bg-primary/5`
- `text-gray-500`
- `rounded-xl`, `rounded-2xl`, `rounded-full`
- `border border-gray-100`
- `shadow-sm`
- `px-4 py-3`
- `gap-2`, `gap-3`

### 그대로 옮겨도 되는 것

- 색상
- radius
- padding / margin
- flex / gap
- border
- font size / weight

### 다시 설계해야 하는 것

- `hover:*`
- `cursor-*`
- 웹 스크롤바 숨김
- `min-h-screen`
- `grid-cols-*`
- `sticky`
- `vh` 감각의 높이 고정

### RN 매핑 예시

웹:

```tsx
<button className="bg-primary text-white py-3.5 rounded-xl font-bold text-sm" />
```

RN:

```tsx
<Pressable className="items-center justify-center rounded-xl bg-brand-500 px-4 py-3">
  <Text className="text-sm font-bold text-white">저장</Text>
</Pressable>
```

웹:

```tsx
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm" />
```

RN:

```tsx
<View className="rounded-2xl border border-gray-100 bg-white">
```

그림자:

- RN 그림자는 플랫폼 차이가 크므로 utility 남발보다 `CardShell` 안에 묶는 편이 안전하다.

## 10. NativeWind 사용 규칙

### 권장

- layout와 spacing은 NativeWind class로 처리
- 반복 card/button은 컴포넌트로 감싼다
- 색/반경/간격은 theme token에서만 꺼낸다
- 화면마다 반복되는 wrapper class는 `Screen` 컴포넌트로 흡수

### 비권장

- 한 요소에 className 20개 이상 누적
- 모든 variation을 props로 우겨넣는 mega component
- inline style에 하드코딩 색상 반복
- feature 전용 컴포넌트를 공통 컴포넌트처럼 포장

## 11. 상태 확장 전략

질문처럼 결국 확장은 해야 한다. 다만 순서를 잘라야 한다.

### 1차

- `useState`
- `useMemo`
- feature hooks
- mock repository

### 2차

- role/session/filter 정도만 전역화
- 필요 시 `zustand` 도입

### 3차

- API 도입 후 server state 분리
- optimistic update, loading state, error state 확장

즉, 처음부터 거대한 store를 만들지 말고 "확장 가능한 얇은 구조"로 시작하는 게 맞다.

## 12. 화면 이관 추천 순서

### Step 1

- 앱 셸
- 탭 구조
- 역할 전환 gate

### Step 2

- `Button`, `Chip`, `Badge`, `Screen`, `TopBar`

### Step 3

- `StudioCard`, `BookingCard`, `NotificationCard`, `StatCard`

### Step 4

- 소비자 홈
- 소비자 탐색
- 소비자 상세

### Step 5

- 소비자 예약
- 예약 완료
- 예약 목록

### Step 6

- 업체 대시보드
- 업체 예약 목록
- 업체 예약 상세

### Step 7

- 업체 스튜디오 관리
- 업체 정산 조회

## 13. 첫 구현 스프린트 범위

첫 스프린트에서 끝내야 하는 범위:

1. Expo 앱 생성
2. Expo Router 설정
3. NativeWind v4 설정
4. 토큰 세팅
5. 공통 UI primitives 작성
6. mock fixture 작성
7. 소비자 홈/탐색/상세/예약 작성
8. 탭 이동 + mock 액션 검증

## 14. 바로 구현하면 안 되는 것

- 웹 page 파일을 그대로 복붙
- `screen` enum 하나로 앱 전체를 제어
- `localStorage` 기반 구조를 그대로 RN로 이식
- 공통화 욕심으로 모든 화면을 하나의 컴포넌트로 우겨넣기
- 정산/예약/리뷰 모든 상태를 처음부터 하나의 store로 통합

## 15. 다음 실행 체크리스트

1. `apps/mobile` 생성
2. `expo-router` 초기 구조 생성
3. `nativewind@v4` 설정
4. `theme/` 토큰 생성
5. `packages/domain` 초안 생성
6. `mocks/fixtures` 생성
7. `components/ui` 1차 작성
8. 소비자 홈부터 조립 시작
