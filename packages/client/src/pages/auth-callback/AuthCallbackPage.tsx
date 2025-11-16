import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { authApi, type AuthResponse, useAuthStore } from '@/features/auth';

export function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { provider } = useParams<{ provider: string }>();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 중복 요청 방지를 위한 ref
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // 이미 처리되었으면 중복 실행 방지
    if (hasProcessedRef.current) {
      return;
    }

    const handleCallback = async () => {
      try {
        // 처리 시작 표시
        hasProcessedRef.current = true;
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`로그인 실패: ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('인가 코드를 찾을 수 없습니다.');
          return;
        }

        if (!provider) {
          setStatus('error');
          setMessage('OAuth 제공자를 찾을 수 없습니다.');
          return;
        }

        // 지원하는 OAuth provider 검증
        const supportedProviders = ['kakao', 'google', 'naver'];
        if (!supportedProviders.includes(provider)) {
          setStatus('error');
          setMessage(`지원하지 않는 OAuth 제공자입니다: ${provider}`);
          return;
        }

        // 백엔드에 인가 코드 전송하여 로그인 처리
        const response: AuthResponse = await authApi.kakaoCallback({ code });

        if (response.success) {
          // Zustand store와 쿠키에 인증 정보 저장
          setAuth(response.user, response.accessToken, response.refreshToken);

          setStatus('success');
          const nickname = response.user.nickname || response.user.userId;
          setMessage(
            `${provider.toUpperCase()} 로그인 성공! ${nickname}님, 환영합니다.`,
          );

          // nickname이 없으면 닉네임 설정 페이지로 이동, 있으면 메인 페이지로 이동
          setTimeout(() => {
            if (!response.user.nickname) {
              navigate('/nickname-setup');
            } else {
              navigate('/');
            }
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.message || '로그인 처리 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : '로그인 처리 중 오류가 발생했습니다.',
        );
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열로 마운트 시 딱 한 번만 실행

  return (
    <div className="min-h-screen flex items-center justify-center px-[var(--container-padding)] py-[var(--spacing-3xl)]">
      <div className="w-full max-w-md mx-auto bg-[var(--color-card)] rounded-xl shadow-lg p-[var(--section-spacing)]">
        <div className="text-center">
          <div className="mb-[var(--spacing-xl)]">
            {status === 'loading' && (
              <div className="flex justify-center mb-4">
                <svg
                  className="animate-spin h-12 w-12 text-[var(--color-primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}

            {status === 'success' && <div className="text-6xl mb-4">✅</div>}

            {status === 'error' && <div className="text-6xl mb-4">❌</div>}
          </div>

          <h1 className="text-2xl font-bold mb-4 text-[var(--color-gray-800)]">
            {status === 'loading' && '로그인 처리 중...'}
            {status === 'success' && '로그인 성공!'}
            {status === 'error' && '로그인 실패'}
          </h1>

          <p className="text-[var(--color-gray-600)] mb-6">{message}</p>

          {status === 'error' && (
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                fullWidth
              >
                다시 로그인하기
              </Button>
              <Button onClick={() => navigate('/')} fullWidth>
                홈으로 돌아가기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
