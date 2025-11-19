import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../supabase/user';

interface JwtPayload {
  sub: string;
  userId: string;
  provider: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AdminGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('인증 토큰이 필요합니다.');
    }

    try {
      const token = authHeader.substring(7);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = this.jwtService.verify(token) as any;
      const userId = decoded.userId;

      if (!userId) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      console.log(`🔒 관리자 권한 확인 시작 - userId: ${userId}`);

      // 사용자 관리자 권한 확인
      const isAdmin = await this.userService.isUserAdmin(userId);

      if (!isAdmin) {
        console.log(`❌ 관리자 권한 없음 - userId: ${userId}`);
        throw new ForbiddenException('관리자 권한이 필요합니다.');
      }

      console.log(`✅ 관리자 권한 확인 완료 - userId: ${userId}`);

      // 요청 객체에 사용자 정보 추가
      request.user = {
        userId: userId,
        isAdmin: true,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }

      console.error('관리자 권한 확인 중 오류 발생:', error);
      throw new UnauthorizedException('인증 처리 중 오류가 발생했습니다.');
    }
  }
}
