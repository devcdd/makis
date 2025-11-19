import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // JWT 토큰 정보 로깅
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded = this.jwtService.verify(token) as any;

        console.log('🔐 JWT 토큰 디코딩 정보:', {
          userId: decoded.userId,
          provider: decoded.provider,
          issuedAt: new Date(decoded.iat * 1000).toISOString(),
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
          remainingTime: Math.floor((decoded.exp * 1000 - Date.now()) / 1000 / 60), // 분 단위
        });

        // 요청 객체에 토큰 정보 추가
        request.tokenInfo = {
          userId: decoded.userId,
          provider: decoded.provider,
          issuedAt: decoded.iat,
          expiresAt: decoded.exp,
        };
      } catch (error) {
        console.log('⚠️ JWT 토큰 디코딩 실패:', error instanceof Error ? error.message : String(error));
      }
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('인증이 필요합니다.');
    }
    return user;
  }
}



