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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase.service");
const types_1 = require("../../types");
const messages_1 = require("../../constants/messages");
let UserService = class UserService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async saveUser(userData) {
        console.log('=== SUPABASE 환경변수 확인 ===');
        console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
        console.log('SUPABASE_ANON_KEY 존재:', !!process.env.SUPABASE_ANON_KEY);
        console.log('SUPABASE_ANON_KEY 길이:', process.env.SUPABASE_ANON_KEY?.length);
        console.log('=== 사용자 데이터 ===');
        console.log('userData:', JSON.stringify(userData, null, 2));
        const { data, error } = await this.supabaseService
            .getClient()
            .from('users')
            .insert([userData])
            .select();
        if (error) {
            console.error(messages_1.ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            if (error.code === '23505') {
                throw new Error(messages_1.MESSAGES.DUPLICATE_USER_ID);
            }
            throw error;
        }
        return data;
    }
    async getUserByUserId(userId) {
        console.log('=== getUserByUserId 호출 ===');
        console.log('조회할 userId:', userId);
        const client = this.supabaseService.getClient();
        console.log('Supabase 클라이언트 URL:', client.supabaseUrl);
        const { data, error } = await client
            .from('users')
            .select('*')
            .eq('userId', userId)
            .single();
        if (error) {
            console.log('supabase error:', error);
            if (error.code === 'PGRST116') {
                console.log('유저를 찾을 수 없음. 새로운 유저 생성:', userId);
                const createdUsers = await this.saveUser({
                    userId,
                    provider: types_1.Provider.KAKAO,
                });
                console.log('유저 생성 완료:', userId);
                return createdUsers[0];
            }
            console.error('유저 조회 중 에러 발생:', error);
            throw error;
        }
        console.log('유저 조회 성공:', userId);
        return data;
    }
    async updateUserNickname(userId, nickname) {
        console.log('=== updateUserNickname 호출 ===');
        console.log('userId:', userId, 'nickname:', nickname);
        const { data, error } = await this.supabaseService
            .getClient()
            .from('users')
            .update({ nickname })
            .eq('userId', userId)
            .select()
            .single();
        if (error) {
            console.error(messages_1.ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            throw error;
        }
        console.log('닉네임 업데이트 성공:', userId, nickname);
        return data;
    }
    async saveCharacter(characterData) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('characters')
            .insert([
            {
                characterId: characterData.characterId,
                ownerId: characterData.ownerId,
            },
        ])
            .select();
        if (error) {
            console.error(messages_1.ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            if (error.code === '23505') {
                throw new Error(messages_1.MESSAGES.DUPLICATE_USER_ID);
            }
            throw error;
        }
        return data;
    }
    async getAllCharacters() {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('characters')
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
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UserService);
//# sourceMappingURL=user.service.js.map