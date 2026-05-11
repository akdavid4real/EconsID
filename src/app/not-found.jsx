import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-lg space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">404</p>
        <h1 className="text-4xl font-semibold tracking-tight">This route does not exist in the EconID demo.</h1>
        <p className="text-[var(--color-muted)]">Use the main navigation to continue through the product scaffold.</p>
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white">Return home</Link>
      </div>
    </main>
  );
}
