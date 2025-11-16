export declare enum Provider {
    KAKAO = "KAKAO"
}
export interface Character {
    id: number;
    characterId: string;
    ownerId: string | null;
    createdAt: string;
}
export interface User {
    userId: string;
    provider: Provider;
    nickname?: string;
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
