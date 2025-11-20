import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/ui/Button';
import { User, Settings, LogOut } from 'lucide-react';

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
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-[var(--color-gray-900)]"
          >
            <img src="/makis-logo.png" alt="메키스 로고" className="h-8 w-8" />
            <span>메키스</span>
          </Link>
          <nav className="flex items-center gap-2">
            {user ? (
              // 로그인된 상태
              <>
                <span className="text-[var(--color-gray-700)] font-medium">
                  {user.nickname || user.userId}님
                </span>
                <Button
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="p-2"
                >
                  <User className="w-4 h-4" />
                </Button>
                {user.isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="p-2"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" onClick={handleLogout} className="p-2">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              // 로그인되지 않은 상태
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                <span>로그인</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
