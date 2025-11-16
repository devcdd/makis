import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '../types';

// 카카오 프로필 정보 타입
export interface KakaoProfile {
  nickname: string;
  profile_image_url?: string;
}

// 카카오 계정 정보 타입
export interface KakaoAccount {
  profile: KakaoProfile;
  email?: string;
  has_email?: boolean;
}

// 카카오 API 응답 타입
export interface KakaoResponse {
  userId: string;
  nickname: string;
  email: string | null;
  profileImageUrl: string | null;
  provider: string;
  providerId: string;
}

// 인증 응답 사용자 정보 타입
export interface AuthUser {
  userId: string;
  provider: Provider;
  nickname?: string;
}

export class KakaoCallbackDto {
  @ApiProperty({
    description: '카카오 OAuth 인가 코드',
    example: 'authorization_code_from_kakao',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class KakaoUserInfo {
  @ApiProperty({
    description: '사용자 ID (kakao_ 접두사 포함)',
    example: 'kakao_4546512331',
  })
  userId: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: '카카오 사용자',
  })
  nickname: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@kakao.com',
    nullable: true,
  })
  email: string | null;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://k.kakaocdn.net/...',
    nullable: true,
  })
  profileImageUrl: string | null;

  @ApiProperty({
    description: 'OAuth 제공자',
    example: 'KAKAO',
  })
  provider: Provider;

  @ApiProperty({
    description: '제공자별 사용자 ID',
    example: '4546512331',
  })
  providerId: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: '인증 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '사용자 정보',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'kakao_123456789' },
      nickname: { type: 'string', example: '카카오 사용자' },
      email: { type: 'string', example: 'user@kakao.com' },
      profileImageUrl: { type: 'string', example: 'https://...' },
      provider: { type: 'string', example: 'kakao' },
      providerId: { type: 'string', example: '123456789' },
    },
  })
  user: AuthUser;

  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT 리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: '응답 메시지',
    example: '로그인 성공',
  })
  message: string;
}
