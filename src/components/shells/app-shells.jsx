import { BottomNav, TopBar } from "@/components/ui/nav";
import { cn } from "@/lib/utils";

const traderNav = [
  { href: "/dashboard", label: "Home", icon: "Home" },
  { href: "/dashboard/credit", label: "Credit", icon: "Credit" },
  { href: "/dashboard/insurance", label: "Cover", icon: "Insurance" },
  { href: "/dashboard/settings", label: "Me", icon: "Profile" },
];

const lenderNav = [
  { href: "/lender", label: "Home", icon: "Home" },
  { href: "/lender/loans", label: "Loans", icon: "Loans" },
  { href: "/lender/risk-alerts", label: "Alerts", icon: "Alerts" },
  { href: "/lender/settings", label: "More", icon: "More" },
];

export function MarketingShell({ children }) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  navKind = "trader",
  current,
  children,
  className,
}) {
  const nav = navKind === "lender" ? lenderNav : traderNav;

  return (
    <div className="phone-safe min-h-screen">
      <TopBar title={title} subtitle={subtitle} />
      <main
        className={cn(
          "mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8",
          className
        )}
      >
        {children}
      </main>
      <BottomNav items={nav} current={current} />
    </div>
  );
}
