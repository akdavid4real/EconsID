export default function GlobalLoading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
      <div className="h-10 w-40 animate-pulse rounded-xl bg-[var(--color-border)]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-[22px] bg-white shadow-[0_12px_40px_rgba(15,40,86,0.06)]" />)}
      </div>
      <div className="h-72 animate-pulse rounded-[22px] bg-white shadow-[0_12px_40px_rgba(15,40,86,0.06)]" />
    </main>
  );
}
