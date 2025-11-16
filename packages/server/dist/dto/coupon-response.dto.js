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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CouponResponseDto {
    id;
    name;
    createdAt;
}
exports.CouponResponseDto = CouponResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '쿠폰 ID', example: 1 }),
    __metadata("design:type", Number)
], CouponResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '쿠폰 이름', example: 'discount_coupon' }),
    __metadata("design:type", String)
], CouponResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일시', example: '2023-12-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], CouponResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=coupon-response.dto.js.map