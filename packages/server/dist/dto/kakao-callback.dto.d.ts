import { Provider } from '../types';
export interface KakaoProfile {
    nickname: string;
    profile_image_url?: string;
}
export interface KakaoAccount {
    profile: KakaoProfile;
    email?: string;
    has_email?: boolean;
}
export interface KakaoResponse {
    userId: string;
    nickname: string;
    email: string | null;
    profileImageUrl: string | null;
    provider: string;
    providerId: string;
}
export interface AuthUser {
    userId: string;
    provider: Provider;
    nickname?: string;
}
export declare class KakaoCallbackDto {
    code: string;
}
export declare class KakaoUserInfo {
    userId: string;
    nickname: string;
    email: string | null;
    profileImageUrl: string | null;
    provider: Provider;
    providerId: string;
}
export declare class AuthResponseDto {
    success: boolean;
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    message: string;
}
