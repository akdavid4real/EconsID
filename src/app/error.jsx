"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[var(--color-canvas)] px-4">
        <div className="max-w-lg space-y-4 rounded-[22px] border border-[var(--color-border)] bg-white p-8 text-center shadow-[0_12px_40px_rgba(15,40,86,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Unexpected error</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)]">The demo hit a runtime problem.</h1>
          <p className="text-sm leading-6 text-[var(--color-muted)]">{error?.message ?? "Unknown error"}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={reset} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white">Try again</button>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-border)] px-5 text-sm font-semibold text-[var(--color-primary)]">Go home</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
