"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupabaseService", {
    enumerable: true,
    get: function() {
        return SupabaseService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _supabasejs = require("@supabase/supabase-js");
const _messages = require("../constants/messages");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SupabaseService = class SupabaseService {
    getClient() {
        return this.supabase;
    }
    constructor(configService){
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
            throw new Error(_messages.MESSAGES.MISSING_SUPABASE_ENV_VARS);
        }
        this.supabase = (0, _supabasejs.createClient)(supabaseUrl, supabaseKey);
        console.log('Supabase 클라이언트 생성 완료');
    }
};
SupabaseService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], SupabaseService);

//# sourceMappingURL=supabase.service.js.map