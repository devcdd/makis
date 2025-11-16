import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/Header';

export function FullLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
