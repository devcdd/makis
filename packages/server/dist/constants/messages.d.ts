export declare const MESSAGES: {
    readonly MISSING_SUPABASE_ENV_VARS: "Missing Supabase environment variables";
    readonly DUPLICATE_USER_ID: "이미 등록된 아이디입니다.";
    readonly COUPON_AUTO_PROCESS_RECEIVED: "쿠폰 자동 처리 요청이 접수되었습니다.";
    readonly SUCCESS: "성공";
    readonly BAD_REQUEST: "잘못된 요청";
    readonly INTERNAL_ERROR: "내부 서버 오류";
    readonly CREATE_USER_SUCCESS: "사용자 생성 성공";
    readonly CREATE_COUPON_SUCCESS: "쿠폰 생성 성공";
    readonly GET_USERS_SUCCESS: "유저 리스트 조회 성공";
    readonly GET_COUPONS_SUCCESS: "쿠폰 리스트 조회 성공";
    readonly COUPON_AUTO_PROCESS_DESC: "쿠폰 이름과 전체 유저 리스트를 콘솔에 출력합니다.";
    readonly GET_ADMIN_USERS_DESC: "관리자용 전체 유저 리스트를 반환합니다.";
    readonly GET_ADMIN_COUPONS_DESC: "관리자용 전체 쿠폰 리스트를 반환합니다.";
};
export declare const ERROR_LOG_PREFIX: {
    readonly SUPABASE_ERROR_DETAILS: "Supabase Error Details:";
};
export declare const API_TAGS: {
    readonly APP: "app";
    readonly USERS: "users";
    readonly COUPONS: "coupons";
    readonly AUTO: "auto";
    readonly ADMIN: "admin";
    readonly AUTH: "auth";
};
export declare const API_TAG_DESCRIPTIONS: {
    readonly users: "사용자 관리";
    readonly coupons: "쿠폰 관리";
    readonly auto: "자동화 기능";
    readonly admin: "관리자 기능";
    readonly auth: "인증";
};
