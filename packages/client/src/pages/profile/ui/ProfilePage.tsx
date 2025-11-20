import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { useAuthStore, useAccessToken } from '@/features/auth';
import { axiosInstance } from '@/shared/lib';

interface Character {
  id: number;
  characterId: string;
  ownerId: string;
  createdAt: string;
}

interface CharactersResponse {
  success: boolean;
  message: string;
  data: Character[];
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const accessToken = useAccessToken();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 캐릭터 리스트 가져오기
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get<CharactersResponse>('/characters', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          setCharacters(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('캐릭터 목록 조회 실패:', err);
        setError('캐릭터 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [accessToken, navigate]);

  if (!user) {
    return null; // useEffect에서 리다이렉트 처리됨
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] py-[var(--spacing-5xl)]">
        <div className="container mx-auto px-[var(--container-padding)] text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-[var(--color-gray-900)] mb-[var(--spacing-lg)] leading-tight">
              내 정보
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-gray-600)] mb-[var(--spacing-3xl)] max-w-2xl mx-auto leading-relaxed">
              등록한 캐릭터 정보를 확인하세요
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[var(--color-primary-200)] rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--color-secondary-200)] rounded-full opacity-20"></div>
      </section>

      {/* Profile Content */}
      <section className="py-[var(--spacing-5xl)] bg-white">
        <div className="container mx-auto px-[var(--container-padding)]">
          <div className="max-w-4xl mx-auto space-y-[var(--spacing-4xl)]">
            {/* User Info Card */}
            <div className="bg-[var(--color-card)] rounded-2xl shadow-xl p-[var(--spacing-3xl)]">
              <h2 className="text-2xl font-bold text-[var(--color-gray-900)] mb-[var(--spacing-xl)]">
                사용자 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-lg)]">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                    사용자 ID
                  </label>
                  <p className="text-lg text-[var(--color-gray-900)]">{user.userId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                    닉네임
                  </label>
                  <p className="text-lg text-[var(--color-gray-900)]">
                    {user.nickname || '설정되지 않음'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                    제공자
                  </label>
                  <p className="text-lg text-[var(--color-gray-900)]">
                    {user.provider}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                    권한
                  </label>
                  <p className="text-lg text-[var(--color-gray-900)]">
                    {user.isAdmin ? '관리자' : '일반 사용자'}
                  </p>
                </div>
              </div>
            </div>

            {/* Characters Card */}
            <div className="bg-[var(--color-card)] rounded-2xl shadow-xl p-[var(--spacing-3xl)]">
              <div className="flex items-center justify-between mb-[var(--spacing-xl)]">
                <h2 className="text-2xl font-bold text-[var(--color-gray-900)]">
                  내 캐릭터 목록
                </h2>
                <Button onClick={() => navigate('/submit')}>
                  캐릭터 등록하기
                </Button>
              </div>

              {loading && (
                <div className="text-center py-[var(--spacing-3xl)]">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                  <p className="mt-4 text-[var(--color-gray-600)]">캐릭터 목록을 불러오는 중...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-[var(--spacing-3xl)]">
                  <div className="text-6xl mb-4">❌</div>
                  <p className="text-[var(--color-error)] font-medium">{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    다시 시도
                  </Button>
                </div>
              )}

              {!loading && !error && (
                <>
                  {characters.length === 0 ? (
                    <div className="text-center py-[var(--spacing-3xl)]">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-[var(--color-gray-900)] mb-2">
                        등록된 캐릭터가 없습니다
                      </h3>
                      <p className="text-[var(--color-gray-600)] mb-6">
                        메이플스토리 캐릭터를 등록하여 쿠폰을 받아보세요
                      </p>
                      <Button onClick={() => navigate('/submit')}>
                        캐릭터 등록하기
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-[var(--color-gray-600)]">
                        총 <span className="font-semibold text-[var(--color-primary)]">{characters.length}</span>개의 캐릭터가 등록되어 있습니다.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {characters.map((character) => (
                          <div
                            key={character.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {character.characterId.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-[var(--color-gray-900)]">
                                  {character.characterId}
                                </h4>
                                <p className="text-sm text-[var(--color-gray-500)]">
                                  등록일: {new Date(character.createdAt).toLocaleDateString('ko-KR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
