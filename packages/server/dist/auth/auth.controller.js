"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const kakao_callback_dto_1 = require("../dto/kakao-callback.dto");
const create_user_dto_1 = require("../dto/create-user.dto");
const user_1 = require("../supabase/user");
let AuthController = class AuthController {
    authService;
    userService;
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async kakaoCallback(callbackDto, request, response) {
        const authResponse = await this.authService.handleKakaoCallback(callbackDto, request);
        response.setHeader('x-refresh-token', authResponse.refreshToken);
        return authResponse;
    }
    async updateNickname(userId, updateNicknameDto) {
        return this.userService.updateUserNickname(userId, updateNicknameDto.nickname);
    }
    async refreshTokens(request, response) {
        try {
            console.log('🔄 Refresh API 호출됨');
            console.log('🍪 요청 쿠키:', request.cookies);
            console.log('🍪 Refresh Token 쿠키:', request.cookies?.refreshToken);
            const refreshToken = request.cookies?.refreshToken;
            if (!refreshToken) {
                return response.status(401).json({
                    success: false,
                    message: 'Refresh Token이 없습니다.',
                });
            }
            const tokens = await this.authService.refreshTokens(refreshToken);
            response.setHeader('x-access-token', tokens.accessToken);
            response.setHeader('x-refresh-token', tokens.refreshToken);
            return response.json({
                success: true,
                message: '토큰이 갱신되었습니다.',
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        }
        catch (error) {
            console.error('토큰 갱신 실패:', error);
            return response.status(401).json({
                success: false,
                message: '토큰 갱신에 실패했습니다.',
            });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('kakao/callback'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '카카오 OAuth 콜백',
        description: '카카오 OAuth 인가 코드를 받아 사용자 정보를 조회하고 로그인 처리합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '로그인 성공',
        type: kakao_callback_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '잘못된 요청',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: '서버 오류',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kakao_callback_dto_1.KakaoCallbackDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoCallback", null);
__decorate([
    (0, common_1.Patch)('user/:userId/nickname'),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 닉네임 업데이트',
        description: '특정 사용자의 닉네임을 업데이트합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '닉네임 업데이트 성공',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '잘못된 요청',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: '서버 오류',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.UpdateNicknameDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateNickname", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '토큰 갱신',
        description: 'Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '토큰 갱신 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '토큰이 갱신되었습니다.' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '유효하지 않은 Refresh Token',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('인증'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map