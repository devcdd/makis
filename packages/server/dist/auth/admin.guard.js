"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminGuard", {
    enumerable: true,
    get: function() {
        return AdminGuard;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _user = require("../supabase/user");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AdminGuard = class AdminGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new _common.UnauthorizedException('인증 토큰이 필요합니다.');
        }
        try {
            const token = authHeader.substring(7);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded = this.jwtService.verify(token);
            const userId = decoded.userId;
            if (!userId) {
                throw new _common.UnauthorizedException('유효하지 않은 토큰입니다.');
            }
            console.log(`🔒 관리자 권한 확인 시작 - userId: ${userId}`);
            // 사용자 관리자 권한 확인
            const isAdmin = await this.userService.isUserAdmin(userId);
            if (!isAdmin) {
                console.log(`❌ 관리자 권한 없음 - userId: ${userId}`);
                throw new _common.ForbiddenException('관리자 권한이 필요합니다.');
            }
            console.log(`✅ 관리자 권한 확인 완료 - userId: ${userId}`);
            // 요청 객체에 사용자 정보 추가
            request.user = {
                userId: userId,
                isAdmin: true
            };
            return true;
        } catch (error) {
            if (error instanceof _common.UnauthorizedException || error instanceof _common.ForbiddenException) {
                throw error;
            }
            console.error('관리자 권한 확인 중 오류 발생:', error);
            throw new _common.UnauthorizedException('인증 처리 중 오류가 발생했습니다.');
        }
    }
    constructor(jwtService, userService){
        this.jwtService = jwtService;
        this.userService = userService;
    }
};
AdminGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _user.UserService === "undefined" ? Object : _user.UserService
    ])
], AdminGuard);

//# sourceMappingURL=admin.guard.js.map