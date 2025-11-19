"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AuthResponseDto () {
        return AuthResponseDto;
    },
    get KakaoCallbackDto () {
        return KakaoCallbackDto;
    },
    get KakaoUserInfo () {
        return KakaoUserInfo;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
const _types = require("../types");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let KakaoCallbackDto = class KakaoCallbackDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '카카오 OAuth 인가 코드',
        example: 'authorization_code_from_kakao'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], KakaoCallbackDto.prototype, "code", void 0);
let KakaoUserInfo = class KakaoUserInfo {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '사용자 ID (kakao_ 접두사 포함)',
        example: 'kakao_4546512331'
    }),
    _ts_metadata("design:type", String)
], KakaoUserInfo.prototype, "userId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '사용자 닉네임',
        example: '카카오 사용자'
    }),
    _ts_metadata("design:type", String)
], KakaoUserInfo.prototype, "nickname", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '사용자 이메일',
        example: 'user@kakao.com',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], KakaoUserInfo.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '프로필 이미지 URL',
        example: 'https://k.kakaocdn.net/...',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], KakaoUserInfo.prototype, "profileImageUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'OAuth 제공자',
        example: 'KAKAO'
    }),
    _ts_metadata("design:type", typeof _types.Provider === "undefined" ? Object : _types.Provider)
], KakaoUserInfo.prototype, "provider", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '제공자별 사용자 ID',
        example: '4546512331'
    }),
    _ts_metadata("design:type", String)
], KakaoUserInfo.prototype, "providerId", void 0);
let AuthResponseDto = class AuthResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '인증 성공 여부',
        example: true
    }),
    _ts_metadata("design:type", Boolean)
], AuthResponseDto.prototype, "success", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '사용자 정보',
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: 'kakao_123456789'
            },
            nickname: {
                type: 'string',
                example: '카카오 사용자'
            },
            email: {
                type: 'string',
                example: 'user@kakao.com'
            },
            profileImageUrl: {
                type: 'string',
                example: 'https://...'
            },
            provider: {
                type: 'string',
                example: 'kakao'
            },
            providerId: {
                type: 'string',
                example: '123456789'
            }
        }
    }),
    _ts_metadata("design:type", typeof AuthUser === "undefined" ? Object : AuthUser)
], AuthResponseDto.prototype, "user", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'JWT 액세스 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    _ts_metadata("design:type", String)
], AuthResponseDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'JWT 리프레시 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    _ts_metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '응답 메시지',
        example: '로그인 성공'
    }),
    _ts_metadata("design:type", String)
], AuthResponseDto.prototype, "message", void 0);

//# sourceMappingURL=kakao-callback.dto.js.map