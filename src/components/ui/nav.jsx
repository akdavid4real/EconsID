import Link from "next/link";
import { Bell, Home, Landmark, Menu, Shield, UserRound, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  Credit: Landmark,
  Insurance: Shield,
  Profile: UserRound,
  Loans: WalletCards,
  Alerts: Bell,
  More: Menu,
};

export function TopBar({ title, subtitle, rightLabel = "Demo" }) {
  return (
    <div className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(245,242,234,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-[var(--color-ink)]">{title}</p>
          {subtitle ? (
            <p className="truncate text-sm text-[var(--color-muted)]">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--color-gold-soft)] px-3 py-1 text-xs font-bold text-[#7a5512]">
            {rightLabel}
          </span>
          <button
            type="button"
            aria-label="Open account menu"
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm ring-1 ring-[var(--color-border)]"
          >
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function BottomNav({ items, current }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[rgba(255,252,246,0.96)] backdrop-blur-xl sm:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        {items.map((item) => {
          const Icon = iconMap[item.icon] ?? Home;
          const active = current === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "grid min-h-14 place-items-center gap-1 rounded-2xl px-2 text-[11px] font-bold",
                active
                  ? "bg-[var(--color-accent-soft)] text-[#21593a]"
                  : "text-[var(--color-muted)]"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
