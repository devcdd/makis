"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    enumerable: true,
    get: function() {
        return AppController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwt = require("@nestjs/jwt");
const _express = require("express");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _adminguard = require("./auth/admin.guard");
const _jwtauthguard = require("./auth/jwt-auth.guard");
const _appservice = require("./app.service");
const _supabaseservice = require("./supabase/supabase.service");
const _user = require("./supabase/user");
const _coupon = require("./supabase/coupon");
const _createcoupondto = require("./dto/create-coupon.dto");
const _userresponsedto = require("./dto/user-response.dto");
const _couponresponsedto = require("./dto/coupon-response.dto");
const _messages = require("./constants/messages");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AppController = class AppController {
    /**
   * 메이플스토리 캐릭터 ID 형식 검증
   * 실제 API 호출 대신 안전한 형식 검증만 수행
   */ validateMapleCharacter(characterId, userId) {
        try {
            console.log('🔍 VALIDATE_CHARACTER 호출됨:', {
                characterId,
                userId
            });
            // 기본 형식 검증
            if (!characterId || typeof characterId !== 'string') {
                console.log('캐릭터 ID가 유효하지 않음: 값이 없거나 문자열이 아님');
                return false;
            }
            // 길이 검증 (메이플스토리 캐릭터 ID는 보통 13자리)
            if (characterId.length !== 13) {
                console.log(`캐릭터 ID 길이가 잘못됨: ${characterId.length}자 (예상: 13자)`);
                return false;
            }
            // 숫자만 포함되어 있는지 검증
            if (!/^\d+$/.test(characterId)) {
                console.log('캐릭터 ID가 숫자로만 구성되지 않음');
                return false;
            }
            console.log('캐릭터 ID 형식 검증 성공');
            return true;
        } catch (error) {
            console.error('캐릭터 ID 검증 중 오류 발생:', error);
            return false;
        }
    }
    /**
   * 메이플스토리 쿠폰 등록
   */ async enrollMapleCoupon(characterId, coupon) {
        try {
            console.log('메이플스토리 쿠폰 등록 시작:', {
                characterId,
                coupon
            });
            const response = await _axios.default.post('https://mcoupon.nexon.com/maplestoryidle/coupon/api/v1/redeem-coupon-by-npacode', {
                coupon: coupon,
                id: 'null',
                npaCode: characterId
            });
            console.log('메이플스토리 쿠폰 등록 응답:', JSON.stringify(response.data, null, 2));
            // 성공 응답 확인 (result: true, code: 0)
            if (response.data.result === true && response.data.code === 0) {
                console.log('쿠폰 등록 성공');
                return {
                    success: true,
                    message: response.data.message || '쿠폰 등록 성공'
                };
            }
            // 실패 응답 처리
            console.log('쿠폰 등록 실패:', response.data.message || '알 수 없는 오류');
            return {
                success: false,
                message: response.data.message || '쿠폰 등록 실패'
            };
        } catch (error) {
            console.error('메이플스토리 쿠폰 등록 API 호출 실패:', error);
            return {
                success: false,
                message: 'API 호출 실패'
            };
        }
    }
    getHello() {
        return this.appService.getHello();
    }
    async createCharacter(request, body) {
        // JwtAuthGuard로 인증되었으므로 토큰에서 무조건 userId 추출 가능
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const verifyResult = this.jwtService.verify(request.headers.authorization.substring(7));
        const ownerId = verifyResult.userId;
        // 캐릭터 존재 여부 검증 (토큰이 있으므로 무조건 수행)
        const isValidCharacter = await this.validateMapleCharacter(body.characterId, ownerId);
        if (!isValidCharacter) {
            throw new _common.HttpException('유효하지 않은 캐릭터입니다. 메이플스토리 캐릭터 정보를 확인해주세요.', _common.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.userService.saveCharacter({
                characterId: body.characterId,
                ownerId: ownerId
            });
            return result;
        } catch (error) {
            // 이미 등록된 캐릭터 에러 처리 (PostgreSQL error code 23505)
            if (error instanceof Error && error.message === _messages.MESSAGES.DUPLICATE_CHARACTER_ID) {
                throw new _common.HttpException({
                    success: false,
                    message: _messages.MESSAGES.DUPLICATE_CHARACTER_ID
                }, _common.HttpStatus.CONFLICT);
            }
            // 다른 에러는 그대로 throw
            throw error;
        }
    }
    async createCoupon(createCouponDto) {
        return await this.couponService.saveCoupon(createCouponDto.name);
    }
    async getAutoCoupon(couponName) {
        const characters = await this.userService.getAllCharacters();
        console.log('쿠폰 이름:', couponName);
        console.log('전체 캐릭터 리스트:', characters);
        return {
            message: _messages.MESSAGES.COUPON_AUTO_PROCESS_RECEIVED,
            couponName,
            characterCount: characters.length
        };
    }
    async getAdminCharacters() {
        return await this.userService.getAllCharacters();
    }
    async getAdminCoupons() {
        console.log('=== getAdminCoupons 호출됨 ===');
        const result = await this.couponService.getAllCoupons();
        console.log('=== getAdminCoupons 완료 ===');
        return result;
    }
    async autoDistributeCoupon(couponId) {
        try {
            console.log('쿠폰 자동 배포 시작:', couponId);
            // 전체 캐릭터 리스트 가져오기
            const characters = await this.userService.getAllCharacters();
            console.log(`전체 캐릭터 수: ${characters.length}`);
            const results = [];
            let successCount = 0;
            let failureCount = 0;
            // 각 캐릭터에게 쿠폰 배포
            for (const character of characters){
                try {
                    const result = await this.enrollMapleCoupon(character.characterId, couponId);
                    if (result.success) {
                        successCount++;
                    } else {
                        failureCount++;
                    }
                    results.push({
                        characterId: character.characterId,
                        success: result.success,
                        message: result.message
                    });
                    // API 호출 간격 조절 (너무 빠른 호출 방지)
                    await new Promise((resolve)=>setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`캐릭터 ${character.characterId} 쿠폰 배포 실패:`, error);
                    failureCount++;
                    results.push({
                        characterId: character.characterId,
                        success: false,
                        message: 'API 호출 실패'
                    });
                }
            }
            console.log(`쿠폰 배포 완료 - 성공: ${successCount}, 실패: ${failureCount}`);
            return {
                message: '쿠폰 자동 배포가 완료되었습니다.',
                totalCharacters: characters.length,
                successCount,
                failureCount,
                results
            };
        } catch (error) {
            console.error('쿠폰 자동 배포 중 오류 발생:', error);
            throw new _common.HttpException('쿠폰 자동 배포 중 오류가 발생했습니다.', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    constructor(appService, supabaseService, userService, couponService, jwtService){
        this.appService = appService;
        this.supabaseService = supabaseService;
        this.userService = userService;
        this.couponService = couponService;
        this.jwtService = jwtService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: '기본 인사말'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: _messages.MESSAGES.SUCCESS,
        type: String
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('characters'),
    (0, _swagger.ApiOperation)({
        summary: '새로운 캐릭터 생성',
        tags: [
            _messages.API_TAGS.USERS
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: _messages.MESSAGES.CREATE_CHARACTER_SUCCESS,
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: true
                },
                message: {
                    type: 'string',
                    example: _messages.MESSAGES.CREATE_CHARACTER_SUCCESS
                },
                data: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/UserResponseDto'
                    }
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: _messages.MESSAGES.BAD_REQUEST
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: _messages.MESSAGES.DUPLICATE_CHARACTER_ID,
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: false
                },
                message: {
                    type: 'string',
                    example: _messages.MESSAGES.DUPLICATE_CHARACTER_ID
                }
            }
        }
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "createCharacter", null);
_ts_decorate([
    (0, _common.Post)('coupons'),
    (0, _swagger.ApiOperation)({
        summary: '새로운 쿠폰 생성',
        tags: [
            _messages.API_TAGS.COUPONS
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: _messages.MESSAGES.CREATE_COUPON_SUCCESS,
        type: [
            _couponresponsedto.CouponResponseDto
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: _messages.MESSAGES.BAD_REQUEST
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createcoupondto.CreateCouponDto === "undefined" ? Object : _createcoupondto.CreateCouponDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "createCoupon", null);
_ts_decorate([
    (0, _common.Get)('auto/coupon/:couponName'),
    (0, _swagger.ApiOperation)({
        summary: '쿠폰 자동 배포 요청',
        description: _messages.MESSAGES.COUPON_AUTO_PROCESS_DESC,
        tags: [
            _messages.API_TAGS.AUTO
        ]
    }),
    (0, _swagger.ApiParam)({
        name: 'couponName',
        description: '배포할 쿠폰 이름',
        example: 'discount_coupon'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: _messages.MESSAGES.COUPON_AUTO_PROCESS_RECEIVED,
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string'
                },
                couponName: {
                    type: 'string'
                },
                userCount: {
                    type: 'number'
                }
            }
        }
    }),
    _ts_param(0, (0, _common.Param)('couponName')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "getAutoCoupon", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminguard.AdminGuard),
    (0, _common.Get)('admin/characters'),
    (0, _swagger.ApiOperation)({
        summary: '전체 캐릭터 리스트 조회',
        description: _messages.MESSAGES.GET_ADMIN_USERS_DESC,
        tags: [
            _messages.API_TAGS.ADMIN
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: _messages.MESSAGES.GET_USERS_SUCCESS,
        type: [
            _userresponsedto.UserResponseDto
        ]
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "getAdminCharacters", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminguard.AdminGuard),
    (0, _common.Get)('admin/coupons'),
    (0, _swagger.ApiOperation)({
        summary: '전체 쿠폰 리스트 조회',
        description: _messages.MESSAGES.GET_ADMIN_COUPONS_DESC,
        tags: [
            _messages.API_TAGS.ADMIN
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: _messages.MESSAGES.GET_COUPONS_SUCCESS,
        type: [
            _couponresponsedto.CouponResponseDto
        ]
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "getAdminCoupons", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminguard.AdminGuard),
    (0, _common.Post)('admin/auto-coupon/:couponId'),
    (0, _swagger.ApiOperation)({
        summary: '쿠폰 자동 배포',
        description: '전체 캐릭터에게 지정된 쿠폰을 자동으로 배포합니다.',
        tags: [
            _messages.API_TAGS.ADMIN
        ]
    }),
    (0, _swagger.ApiParam)({
        name: 'couponId',
        description: '배포할 쿠폰 코드',
        example: 'NO1MAPLEIDLE'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: '쿠폰 배포 완료',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string'
                },
                totalCharacters: {
                    type: 'number'
                },
                successCount: {
                    type: 'number'
                },
                failureCount: {
                    type: 'number'
                },
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            characterId: {
                                type: 'string'
                            },
                            success: {
                                type: 'boolean'
                            },
                            message: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        }
    }),
    _ts_param(0, (0, _common.Param)('couponId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "autoDistributeCoupon", null);
AppController = _ts_decorate([
    (0, _swagger.ApiTags)(_messages.API_TAGS.APP),
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _appservice.AppService === "undefined" ? Object : _appservice.AppService,
        typeof _supabaseservice.SupabaseService === "undefined" ? Object : _supabaseservice.SupabaseService,
        typeof _user.UserService === "undefined" ? Object : _user.UserService,
        typeof _coupon.CouponService === "undefined" ? Object : _coupon.CouponService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], AppController);

//# sourceMappingURL=app.controller.js.map