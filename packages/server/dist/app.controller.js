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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("axios");
const app_service_1 = require("./app.service");
const supabase_service_1 = require("./supabase/supabase.service");
const user_1 = require("./supabase/user");
const coupon_1 = require("./supabase/coupon");
const create_coupon_dto_1 = require("./dto/create-coupon.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
const coupon_response_dto_1 = require("./dto/coupon-response.dto");
const messages_1 = require("./constants/messages");
let AppController = class AppController {
    appService;
    supabaseService;
    userService;
    couponService;
    jwtService;
    constructor(appService, supabaseService, userService, couponService, jwtService) {
        this.appService = appService;
        this.supabaseService = supabaseService;
        this.userService = userService;
        this.couponService = couponService;
        this.jwtService = jwtService;
    }
    async validateMapleCharacter(characterId, userId) {
        try {
            console.log('메이플스토리 API 호출 시작:', { characterId, userId });
            if (characterId?.length !== 13) {
                return false;
            }
            const response = await axios_1.default.post('https://mcoupon.nexon.com/maplestoryidle/coupon/api/v1/redeem-coupon-by-npacode', {
                coupon: 'NO1MAPLEIDLE',
                id: 'null',
                npaCode: characterId,
            });
            console.log('메이플스토리 API 응답:', JSON.stringify(response.data, null, 2));
            if (response.data.existCharacter === false) {
                console.log('캐릭터 검증 실패: existCharacter가 false');
                return false;
            }
            console.log('캐릭터 검증 성공');
            return true;
        }
        catch (error) {
            console.error('메이플스토리 API 호출 실패:', error);
            return false;
        }
    }
    getHello() {
        return this.appService.getHello();
    }
    async createCharacter(request, body) {
        let ownerId = null;
        try {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const verifyResult = this.jwtService.verify(token);
                ownerId = verifyResult.userId;
            }
        }
        catch (error) {
            console.log('토큰 파싱 실패 또는 토큰 없음:', error instanceof Error ? error.message : String(error));
        }
        if (ownerId) {
            const isValidCharacter = await this.validateMapleCharacter(body.characterId, ownerId);
            if (!isValidCharacter) {
                throw new common_1.HttpException('유효하지 않은 캐릭터입니다. 메이플스토리 캐릭터 정보를 확인해주세요.', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        return await this.userService.saveCharacter({
            characterId: body.characterId,
            ownerId: ownerId,
        });
    }
    async createCoupon(createCouponDto) {
        return await this.couponService.saveCoupon(createCouponDto.name);
    }
    async getAutoCoupon(couponName) {
        const characters = await this.userService.getAllCharacters();
        console.log('쿠폰 이름:', couponName);
        console.log('전체 캐릭터 리스트:', characters);
        return {
            message: messages_1.MESSAGES.COUPON_AUTO_PROCESS_RECEIVED,
            couponName,
            characterCount: characters.length,
        };
    }
    async getAdminCharacters() {
        return await this.userService.getAllCharacters();
    }
    async getAdminCoupons() {
        return await this.couponService.getAllCoupons();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '기본 인사말' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: messages_1.MESSAGES.SUCCESS, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('characters'),
    (0, swagger_1.ApiOperation)({ summary: '새로운 캐릭터 생성', tags: [messages_1.API_TAGS.USERS] }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: messages_1.MESSAGES.CREATE_USER_SUCCESS,
        type: [user_response_dto_1.UserResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: messages_1.MESSAGES.BAD_REQUEST }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createCharacter", null);
__decorate([
    (0, common_1.Post)('coupons'),
    (0, swagger_1.ApiOperation)({ summary: '새로운 쿠폰 생성', tags: [messages_1.API_TAGS.COUPONS] }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: messages_1.MESSAGES.CREATE_COUPON_SUCCESS,
        type: [coupon_response_dto_1.CouponResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: messages_1.MESSAGES.BAD_REQUEST }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createCoupon", null);
__decorate([
    (0, common_1.Get)('auto/coupon/:couponName'),
    (0, swagger_1.ApiOperation)({
        summary: '쿠폰 자동 배포 요청',
        description: messages_1.MESSAGES.COUPON_AUTO_PROCESS_DESC,
        tags: [messages_1.API_TAGS.AUTO],
    }),
    (0, swagger_1.ApiParam)({
        name: 'couponName',
        description: '배포할 쿠폰 이름',
        example: 'discount_coupon',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: messages_1.MESSAGES.COUPON_AUTO_PROCESS_RECEIVED,
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                couponName: { type: 'string' },
                userCount: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('couponName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAutoCoupon", null);
__decorate([
    (0, common_1.Get)('admin/characters'),
    (0, swagger_1.ApiOperation)({
        summary: '전체 캐릭터 리스트 조회',
        description: messages_1.MESSAGES.GET_ADMIN_USERS_DESC,
        tags: [messages_1.API_TAGS.ADMIN],
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: messages_1.MESSAGES.GET_USERS_SUCCESS,
        type: [user_response_dto_1.UserResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminCharacters", null);
__decorate([
    (0, common_1.Get)('admin/coupons'),
    (0, swagger_1.ApiOperation)({
        summary: '전체 쿠폰 리스트 조회',
        description: messages_1.MESSAGES.GET_ADMIN_COUPONS_DESC,
        tags: [messages_1.API_TAGS.ADMIN],
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: messages_1.MESSAGES.GET_COUPONS_SUCCESS,
        type: [coupon_response_dto_1.CouponResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminCoupons", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)(messages_1.API_TAGS.APP),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        supabase_service_1.SupabaseService,
        user_1.UserService,
        coupon_1.CouponService,
        jwt_1.JwtService])
], AppController);
//# sourceMappingURL=app.controller.js.map