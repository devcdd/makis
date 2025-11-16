import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { authApi, useAuthStore } from '@/features/auth';

export function NicknameSetupPage() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim().length < 2) {
      setError('닉네임은 최소 2자 이상이어야 합니다.');
      return;
    }

    if (!user) {
      setError('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authApi.updateNickname(user.userId, { nickname: nickname.trim() });

      // 사용자 정보 업데이트 (nickname 추가)
      const updatedUser = { ...user, nickname: nickname.trim() };
      setAuth(updatedUser, '', ''); // 토큰은 그대로 유지

      // 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error('닉네임 설정 실패:', error);
      setError(
        error instanceof Error
          ? error.message
          : '닉네임 설정 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[var(--container-padding)] py-[var(--spacing-3xl)]">
      <div className="w-full max-w-md mx-auto bg-[var(--color-card)] rounded-xl shadow-lg p-[var(--section-spacing)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-[var(--color-gray-800)]">
            닉네임 설정
          </h1>

          <p className="text-[var(--color-gray-600)] mb-6">
            게임에서 사용할 닉네임을 설정해주세요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isLoading}
                maxLength={20}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !nickname.trim()}
              fullWidth
            >
              {isLoading ? '설정 중...' : '닉네임 설정하기'}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              fullWidth
            >
              나중에 설정하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
