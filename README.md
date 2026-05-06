# Funni Workspace

`pnpm workspace` 기반 monorepo입니다.

## 구조

- `apps/web`
  - 기존 Next.js 프로토타입
- `apps/mobile`
  - Expo Router + NativeWind 기반 React Native 프로토타입
- `packages/domain`
  - 공통 타입과 계산 로직

## 스크립트

```bash
pnpm dev:web
pnpm dev:mobile
pnpm build:web
pnpm lint:web
pnpm typecheck:domain
```

## 문서

- [RN 마이그레이션 PRD](./docs/react-native-migration-prd.md)
- [모바일 UI 아키텍처](./docs/mobile-ui-architecture.md)
