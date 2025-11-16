"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_TAG_DESCRIPTIONS = exports.API_TAGS = exports.ERROR_LOG_PREFIX = exports.MESSAGES = void 0;
exports.MESSAGES = {
    MISSING_SUPABASE_ENV_VARS: 'Missing Supabase environment variables',
    DUPLICATE_USER_ID: '이미 등록된 아이디입니다.',
    COUPON_AUTO_PROCESS_RECEIVED: '쿠폰 자동 처리 요청이 접수되었습니다.',
    SUCCESS: '성공',
    BAD_REQUEST: '잘못된 요청',
    INTERNAL_ERROR: '내부 서버 오류',
    CREATE_USER_SUCCESS: '사용자 생성 성공',
    CREATE_COUPON_SUCCESS: '쿠폰 생성 성공',
    GET_USERS_SUCCESS: '유저 리스트 조회 성공',
    GET_COUPONS_SUCCESS: '쿠폰 리스트 조회 성공',
    COUPON_AUTO_PROCESS_DESC: '쿠폰 이름과 전체 유저 리스트를 콘솔에 출력합니다.',
    GET_ADMIN_USERS_DESC: '관리자용 전체 유저 리스트를 반환합니다.',
    GET_ADMIN_COUPONS_DESC: '관리자용 전체 쿠폰 리스트를 반환합니다.',
};
exports.ERROR_LOG_PREFIX = {
    SUPABASE_ERROR_DETAILS: 'Supabase Error Details:',
};
exports.API_TAGS = {
    APP: 'app',
    USERS: 'users',
    COUPONS: 'coupons',
    AUTO: 'auto',
    ADMIN: 'admin',
    AUTH: 'auth',
};
exports.API_TAG_DESCRIPTIONS = {
    [exports.API_TAGS.USERS]: '사용자 관리',
    [exports.API_TAGS.COUPONS]: '쿠폰 관리',
    [exports.API_TAGS.AUTO]: '자동화 기능',
    [exports.API_TAGS.ADMIN]: '관리자 기능',
    [exports.API_TAGS.AUTH]: '인증',
};
//# sourceMappingURL=messages.js.map