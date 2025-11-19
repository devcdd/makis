"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CouponService", {
    enumerable: true,
    get: function() {
        return CouponService;
    }
});
const _common = require("@nestjs/common");
const _supabaseservice = require("../supabase.service");
const _messages = require("../../constants/messages");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CouponService = class CouponService {
    async saveCoupon(name) {
        const { data, error } = await this.supabaseService.getClient().from('coupon').insert([
            {
                name: name
            }
        ]).select();
        if (error) {
            console.error(_messages.ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            throw error;
        }
        return data;
    }
    async getAllCoupons() {
        const { data, error } = await this.supabaseService.getClient().from('coupon').select('*');
        if (error) {
            console.error(_messages.ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            throw error;
        }
        return data;
    }
    constructor(supabaseService){
        this.supabaseService = supabaseService;
    }
};
CouponService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _supabaseservice.SupabaseService === "undefined" ? Object : _supabaseservice.SupabaseService
    ])
], CouponService);

//# sourceMappingURL=coupon.service.js.map