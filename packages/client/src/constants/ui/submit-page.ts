// SubmitPage 텍스트 상수들
export const SUBMIT_PAGE_TEXTS = {
  title: '메이플 키우기 UUID 등록',
  subtitle: '게임 내에서 확인한 UUID를 입력하세요',
  uuidGuide: {
    question: 'UUID를 어떻게 확인하나요?',
    modalTitle: 'UUID 확인 가이드',
    // 실제 이미지 경로를 여기에 설정하세요
    images: {
      step1: '/images/uuid-guide-1.png', // 게임 접속 화면
      step2: '/images/uuid-guide-2.png', // 설정 메뉴
      step3: '/images/uuid-guide-3.png', // UUID 복사
    },
    steps: [
      {
        title: '1단계: 게임 접속',
        description: '메이플 키우기 게임에 접속하세요',
        image: 'step1'
      },
      {
        title: '2단계: 설정 메뉴',
        description: '게임 내 설정 메뉴를 열어주세요',
        image: 'step2'
      },
      {
        title: '3단계: UUID 복사',
        description: '계정 정보에서 UUID를 복사하세요',
        image: 'step3'
      }
    ]
  },
  form: {
    uuidLabel: 'UUID',
    uuidPlaceholder: '예: 12345678-1234-1234-1234-123456789012',
    submitButton: '등록하기',
    submittingButton: '등록 중...',
    successMessage: 'UUID가 성공적으로 등록되었습니다!',
    errorMessage: '등록에 실패했습니다.',
  }
} as const;
