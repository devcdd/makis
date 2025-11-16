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
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase.service");
const messages_1 = require("../../constants/messages");
let CouponService = class CouponService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async saveCoupon(name) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('coupons')
            .insert([{ name: name }])
            .select();
        if (error) {
            console.error(messages_1.ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            throw error;
        }
        return data;
    }
    async getAllCoupons() {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('coupons')
            .select('*');
        if (error) {
            console.error(messages_1.ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            throw error;
        }
        return data;
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], CouponService);
//# sourceMappingURL=coupon.service.js.map