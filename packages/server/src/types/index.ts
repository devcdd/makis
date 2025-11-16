// OAuth Provider enum
export enum Provider {
  KAKAO = 'KAKAO',
  // 추후 다른 provider 추가 가능
  // GOOGLE = 'google',
  // NAVER = 'naver',
}

// 기존 characters 테이블용 (하위 호환성 유지)
export interface Character {
  id: number;
  characterId: string; // 기존 userId → characterId로 변경
  ownerId: string | null; // 새로 추가된 필드
  createdAt: string;
}

// 새로운 users 테이블용 (회원 정보)
export interface User {
  userId: string; // 카카오 로그인 response의 user.id
  provider: Provider;
  nickname?: string; // 선택적 필드로 추가 (로그인 시점에 없을 수 있음)
}

export interface Coupon {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateUserRequest {
  userId: string;
}

export interface CreateCharacterRequest {
  characterId: string;
  ownerId: string | null;
}

export interface CreateCouponRequest {
  name: string;
}

export interface JwtPayload {
  sub: string;
  userId: string;
  provider: Provider;
  iat?: number;
  exp?: number;
}
