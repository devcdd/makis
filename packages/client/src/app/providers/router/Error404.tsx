export function Error404() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--color-gray-900)] mb-[var(--spacing-lg)]">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[var(--color-gray-700)] mb-[var(--spacing-md)]">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-[var(--color-gray-600)] mb-[var(--spacing-xl)]">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <a
          href="/"
          className="inline-block px-[var(--spacing-xl)] py-[var(--spacing-lg)] bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-600)] transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
