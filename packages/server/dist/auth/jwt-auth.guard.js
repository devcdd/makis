"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthGuard", {
    enumerable: true,
    get: function() {
        return JwtAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _jwt = require("@nestjs/jwt");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JwtAuthGuard = class JwtAuthGuard extends (0, _passport.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        // JWT 토큰 정보 로깅
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const decoded = this.jwtService.verify(token);
                console.log('🔐 JWT 토큰 디코딩 정보:', {
                    userId: decoded.userId,
                    provider: decoded.provider,
                    issuedAt: new Date(decoded.iat * 1000).toISOString(),
                    expiresAt: new Date(decoded.exp * 1000).toISOString(),
                    remainingTime: Math.floor((decoded.exp * 1000 - Date.now()) / 1000 / 60)
                });
                // 요청 객체에 토큰 정보 추가
                request.tokenInfo = {
                    userId: decoded.userId,
                    provider: decoded.provider,
                    issuedAt: decoded.iat,
                    expiresAt: decoded.exp
                };
            } catch (error) {
                console.log('⚠️ JWT 토큰 디코딩 실패:', error instanceof Error ? error.message : String(error));
            }
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new _common.UnauthorizedException('인증이 필요합니다.');
        }
        return user;
    }
    constructor(jwtService){
        super(), this.jwtService = jwtService;
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], JwtAuthGuard);

//# sourceMappingURL=jwt-auth.guard.js.map