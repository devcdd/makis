import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../supabase/user';
import { JwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-jwt-secret',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.userService.getUserByUserId(payload.userId);

      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      return {
        userId: user.userId,
        provider: user.provider,
        nickname: user.nickname,
      };
    } catch (error) {
      throw new UnauthorizedException('토큰 검증에 실패했습니다.');
    }
  }
}
