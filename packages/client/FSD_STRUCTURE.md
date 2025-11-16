# FSD (Feature-Sliced Design) 구조

이 프로젝트는 Feature-Sliced Design 아키텍처를 따릅니다.

## 📁 디렉토리 구조

```
src/
├── app/                      # 애플리케이션 레이어
│   ├── providers/           # 프로바이더 (Router, Theme 등)
│   │   └── router/          # 라우팅 설정
│   └── index.tsx            # 앱 진입점
│
├── pages/                    # 페이지 레이어
│   └── submit/              # 제출 페이지
│       ├── ui/              # UI 컴포넌트
│       └── index.ts         # Public API
│
├── widgets/                  # 위젯 레이어
│   └── Header/              # 헤더 위젯
│       ├── ui/              # UI 컴포넌트
│       └── index.ts         # Public API
│
├── features/                 # 기능 레이어
│   └── register-user/       # 사용자 등록 기능
│       ├── api/             # API 호출
│       └── index.ts         # Public API
│
└── shared/                   # 공유 레이어
    └── ui/                  # 공통 UI 컴포넌트
        ├── InputBox/        # 입력 박스
        ├── SubmitButton/    # 제출 버튼
        └── index.ts         # Public API
```

## 🎯 레이어 설명

### 1. **app** - 애플리케이션 레이어

- 앱 초기화 및 전역 설정
- 라우팅 구성
- 전역 프로바이더

### 2. **pages** - 페이지 레이어

- 라우팅 가능한 페이지
- URL과 1:1 매핑
- widgets, features, entities, shared 사용 가능

### 3. **widgets** - 위젯 레이어

- 복잡한 독립적인 UI 블록
- Header, Sidebar, Footer 같은 큰 컴포넌트
- features, entities, shared 사용 가능

### 4. **features** - 기능 레이어

- 사용자 시나리오와 비즈니스 로직
- 사용자 등록, 쿠폰 제출 등
- entities, shared 사용 가능

### 5. **shared** - 공유 레이어

- 재사용 가능한 컴포넌트와 유틸리티
- UI 컴포넌트, 상수, 헬퍼 함수
- 다른 레이어에 의존하지 않음

## 📐 규칙

### 1. Public API 패턴

각 모듈은 `index.ts`를 통해 export:

```typescript
// shared/ui/InputBox/index.ts
export { InputBox } from './InputBox';
```

### 2. Import 규칙

- 상위 레이어는 하위 레이어만 import 가능
- 같은 레이어끼리는 import 불가
- `@/` alias 사용

```typescript
// ✅ 올바른 import
import { InputBox } from '@/shared/ui/InputBox';
import { registerUser } from '@/features/register-user';

// ❌ 잘못된 import
import { InputBox } from '@/shared/ui/InputBox/InputBox'; // index.ts를 거쳐야 함
```

### 3. 디렉토리 구조

```
feature-name/
├── api/          # API 호출
├── model/        # 비즈니스 로직, 상태
├── ui/           # UI 컴포넌트
└── index.ts      # Public API
```

## 🔧 Path Alias 설정

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### vite.config.ts

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

## 📝 예시

### 새로운 기능 추가하기

1. **features에 기능 추가**:

```typescript
// features/submit-coupon/api/submitCoupon.ts
export async function submitCoupon(code: string) { ... }

// features/submit-coupon/index.ts
export { submitCoupon } from './api/submitCoupon';
```

2. **shared에 UI 컴포넌트 추가**:

```typescript
// shared/ui/CouponInput/CouponInput.tsx
export function CouponInput() { ... }

// shared/ui/CouponInput/index.ts
export { CouponInput } from './CouponInput';
```

3. **pages에서 조합**:

```typescript
// pages/coupon/ui/CouponPage.tsx
import { CouponInput } from '@/shared/ui/CouponInput';
import { submitCoupon } from '@/features/submit-coupon';
```

## 📚 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
