"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CouponResponseDto", {
    enumerable: true,
    get: function() {
        return CouponResponseDto;
    }
});
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CouponResponseDto = class CouponResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '쿠폰 ID',
        example: 1
    }),
    _ts_metadata("design:type", Number)
], CouponResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '쿠폰 이름',
        example: 'discount_coupon'
    }),
    _ts_metadata("design:type", String)
], CouponResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: '생성일시',
        example: '2023-12-01T00:00:00.000Z'
    }),
    _ts_metadata("design:type", String)
], CouponResponseDto.prototype, "createdAt", void 0);

//# sourceMappingURL=coupon-response.dto.js.map