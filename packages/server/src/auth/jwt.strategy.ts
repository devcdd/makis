import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../supabase/user';
import { JwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'default-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    try {
      console.log('🔐 JWT Strategy validate 호출:', {
        userId: payload.userId,
        iat: payload.iat,
        exp: payload.exp,
        currentTime: Math.floor(Date.now() / 1000),
        remainingTime: payload.exp
          ? payload.exp - Math.floor(Date.now() / 1000)
          : 'unknown',
      });

      const user = await this.userService.getUserByUserId(payload.userId);

      if (!user) {
        console.log('❌ JWT Strategy: 사용자를 찾을 수 없음 -', payload.userId);
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      console.log('✅ JWT Strategy: 토큰 검증 성공 -', payload.userId);
      return {
        userId: user.userId,
        provider: user.provider,
        nickname: user.nickname,
        isAdmin: await this.userService.isUserAdmin(user.userId),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';
      console.log('❌ JWT Strategy: 토큰 검증 실패 -', errorMessage);
      throw new UnauthorizedException('토큰 검증에 실패했습니다.');
    }
  }
}
