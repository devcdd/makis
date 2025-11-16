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
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const messages_1 = require("../constants/messages");
let SupabaseService = class SupabaseService {
    configService;
    supabase;
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_ANON_KEY');
        console.log('=== SupabaseService 초기화 ===');
        console.log('SUPABASE_URL:', supabaseUrl);
        console.log('SUPABASE_URL 존재:', !!supabaseUrl);
        console.log('SUPABASE_ANON_KEY 존재:', !!supabaseKey);
        console.log('SUPABASE_ANON_KEY 길이:', supabaseKey?.length);
        console.log('SUPABASE_ANON_KEY 앞 10자:', supabaseKey?.substring(0, 10));
        if (!supabaseUrl || !supabaseKey) {
            throw new Error(messages_1.MESSAGES.MISSING_SUPABASE_ENV_VARS);
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        console.log('Supabase 클라이언트 생성 완료');
    }
    getClient() {
        return this.supabase;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map