export const VALIDATION_MESSAGES = {
  USER_ID_REQUIRED: '아이디를 입력해주세요.',
  INVALID_VALUE: '유효하지 않은 값입니다.',
} as const;

// 서버에서 보내는 에러 메시지들 (프론트에서 인식용)
export const SERVER_ERROR_MESSAGES = {
  DUPLICATE_USER_ID: '이미 등록된 아이디입니다.',
  INVALID_CHARACTER: '유효하지 않은 캐릭터입니다. 메이플스토리 캐릭터 정보를 확인해주세요.',
} as const;
