import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    positive: "bg-[var(--color-accent-soft)] text-[#21593a]",
    warning: "bg-[var(--color-warning-soft)] text-[#8a5b09]",
    danger: "bg-[var(--color-danger-soft)] text-[#8f1d1d]",
    dark: "bg-[var(--color-primary)] text-white",
    gold: "bg-[var(--color-gold-soft)] text-[#7a5512]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  as = "button",
  href,
  children,
  className,
  tone = "primary",
  icon = true,
}) {
  const styles = {
    primary:
      "bg-[var(--color-primary)] text-white shadow-[0_12px_24px_rgba(11,61,104,0.18)] hover:bg-[var(--color-primary-strong)]",
    secondary:
      "bg-white text-[var(--color-primary)] ring-1 ring-[var(--color-border)] hover:bg-[var(--color-surface-alt)]",
    gold: "bg-[var(--color-gold)] text-[#1c1508] shadow-[0_12px_24px_rgba(184,135,43,0.18)] hover:brightness-95",
  };

  const Icon = typeof icon === "function" ? icon : ArrowRight;
  const showIcon = Boolean(icon);

  const content = (
    <>
      <span>{children}</span>
      {showIcon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
    </>
  );

  const shared = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition active:scale-[0.99]",
    styles[tone],
    className
  );

  if (as === "link" && href) {
    return (
      <Link href={href} className={shared}>
        {content}
      </Link>
    );
  }

  return <button className={shared}>{content}</button>;
}

export function Card({ children, className }) {
  return (
    <section
      className={cn(
        "rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_10px_28px_rgba(7,24,47,0.06)]",
        className
      )}
    >
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
  icon: Icon = Sparkles,
}) {
  const hintTone = tone === "danger" ? "text-[var(--color-danger)]" : "text-[#166534]";

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="text-3xl font-semibold tracking-tight text-[var(--color-primary-strong)]">{value}</p>
      <p className={cn("text-sm", hintTone)}>{hint}</p>
    </Card>
  );
}

export function PageIntro({ eyebrow, title, body, actions }) {
  return (
    <div className="space-y-4">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          {title}
        </h1>
        {body ? (
          <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            {body}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-14 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(63,125,82,0.14)]",
        props.className
      )}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={cn(
        "min-h-14 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(63,125,82,0.14)]",
        props.className
      )}
    >
      {children}
    </select>
  );
}

export function SectionTitle({ title, body, tone = "light" }) {
  const dark = tone === "dark";

  return (
    <header className="space-y-1">
      <h2 className={cn("text-xl font-bold tracking-tight", dark ? "text-white" : "text-[var(--color-ink)]")}>{title}</h2>
      {body ? <p className={cn("text-sm leading-6", dark ? "text-white/72" : "text-[var(--color-muted)]")}>{body}</p> : null}
    </header>
  );
}

export function ProgressRing({ score, max = 850, label = "EconID Score" }) {
  const angle = (score / max) * 360;

  return (
    <Card className="relative overflow-hidden bg-[var(--color-shell)] text-white">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(25,181,107,0.35),rgba(246,184,63,0.32))]" />
      <div className="relative grid gap-5 sm:grid-cols-[190px_1fr] sm:items-center">
        <div
          className="mx-auto grid h-44 w-44 place-items-center rounded-full p-2"
          style={{
            background: `conic-gradient(var(--color-accent) ${angle}deg, rgba(255,255,255,0.16) ${angle}deg 360deg)`,
          }}
        >
          <div className="grid h-36 w-36 place-items-center rounded-full bg-white text-center text-[var(--color-ink)] shadow-inner">
            <div>
              <p className="text-4xl font-bold">{score}</p>
              <p className="text-sm text-[var(--color-muted)]">out of {max}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Badge tone="gold">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </Badge>
          <p className="text-2xl font-bold leading-tight">
            Strong enough for Tier 2 credit and active cover.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/65">Risk level</p>
              <p className="mt-1 font-semibold">Medium-low</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/65">Signal source</p>
              <p className="mt-1 font-semibold">90-day inflows</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ActionTile({
  icon: Icon = CheckCircle2,
  title,
  body,
  href,
  tone = "primary",
}) {
  const bg =
    tone === "gold"
      ? "bg-[var(--color-gold-soft)] text-[#7a5512]"
      : "bg-[var(--color-accent-soft)] text-[#21593a]";

  const inner = (
    <>
      <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", bg)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-[var(--color-ink)]">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-[var(--color-muted)]">{body}</span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 rounded-[24px] border border-[var(--color-border)] bg-white p-4 shadow-[0_10px_28px_rgba(7,24,47,0.06)]"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-white/70 bg-white p-4 shadow-[0_12px_34px_rgba(7,24,47,0.08)]">
      {inner}
    </div>
  );
}

export function LockedOverlay({ title = "Locked", body }) {
  return (
    <div className="absolute inset-0 grid place-items-center rounded-[26px] bg-white/75 p-6 text-center backdrop-blur-sm">
      <div>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[var(--color-primary)] shadow">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="mt-3 font-bold">{title}</p>
        {body ? <p className="mt-1 text-sm text-[var(--color-muted)]">{body}</p> : null}
      </div>
    </div>
  );
}

export function AppTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_16px_44px_rgba(7,24,47,0.08)]">
      <div
        className={`grid gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] ${columns.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}
      >
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      <div>
        {rows.map((row) => (
          <div
            key={row.key}
            className={`grid gap-4 border-b border-[var(--color-border)] px-5 py-4 text-sm last:border-b-0 ${columns.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}
          >
            {row.cells.map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
