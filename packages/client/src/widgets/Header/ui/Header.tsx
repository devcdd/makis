import { Link, useNavigate } from 'react-router-dom';
import { NAVIGATION_TEXTS } from '@/constants';
import { useAuthStore } from '@/features/auth';

export function Header() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="bg-[var(--color-white)] shadow-sm">
      <div className="container mx-auto px-[var(--container-padding)] py-[var(--spacing-lg)]">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[var(--color-gray-900)]">
            {NAVIGATION_TEXTS.BRAND_NAME}
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              // 로그인된 상태
              <>
                <span className="text-[var(--color-gray-600)]">
                  환영합니다, {user.nickname || user.userId}님
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              // 로그인되지 않은 상태
              <Link
                to="/login"
                className="text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

