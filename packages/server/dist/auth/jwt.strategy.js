"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtStrategy", {
    enumerable: true,
    get: function() {
        return JwtStrategy;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _passportjwt = require("passport-jwt");
const _config = require("@nestjs/config");
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
let JwtStrategy = class JwtStrategy extends (0, _passport.PassportStrategy)(_passportjwt.Strategy) {
    async validate(payload) {
        try {
            console.log('🔐 JWT Strategy validate 호출:', {
                userId: payload.userId,
                iat: payload.iat,
                exp: payload.exp,
                currentTime: Math.floor(Date.now() / 1000),
                remainingTime: payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 'unknown'
            });
            const user = await this.userService.getUserByUserId(payload.userId);
            if (!user) {
                console.log('❌ JWT Strategy: 사용자를 찾을 수 없음 -', payload.userId);
                throw new _common.UnauthorizedException('사용자를 찾을 수 없습니다.');
            }
            console.log('✅ JWT Strategy: 토큰 검증 성공 -', payload.userId);
            return {
                userId: user.userId,
                provider: user.provider,
                nickname: user.nickname,
                isAdmin: await this.userService.isUserAdmin(user.userId)
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            console.log('❌ JWT Strategy: 토큰 검증 실패 -', errorMessage);
            throw new _common.UnauthorizedException('토큰 검증에 실패했습니다.');
        }
    }
    constructor(userService, configService){
        super({
            jwtFromRequest: _passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'default-secret-key'
        }), this.userService = userService, this.configService = configService;
    }
};
JwtStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _user.UserService === "undefined" ? Object : _user.UserService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], JwtStrategy);

//# sourceMappingURL=jwt.strategy.js.map