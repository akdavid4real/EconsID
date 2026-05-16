"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentSession, signOut, subscribeToAuthState } from "@/features/auth/browser-auth";

function GateCard({ title, body }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-10">
      <div className="w-full rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_50px_rgba(7,24,47,0.08)]">
        <p className="text-2xl font-bold text-[var(--color-ink)]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{body}</p>
      </div>
    </div>
  );
}

export function RoleGate({ allowedRoles, loginHref, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState({ loading: true, allowed: false, message: "" });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const session = await getCurrentSession();
        if (!session?.user) {
          if (active) {
            setState({ loading: false, allowed: false, message: "Redirecting to sign in." });
            router.replace(loginHref);
          }
          return;
        }

        const role = session.user.user_metadata?.role ?? "trader";
        if (!allowedRoles.includes(role)) {
          await signOut().catch(() => {});
          if (active) {
            setState({
              loading: false,
              allowed: false,
              message: "This account cannot open this workspace.",
            });
            router.replace(loginHref);
          }
          return;
        }

        if (active) {
          setState({ loading: false, allowed: true, message: "" });
        }
      } catch (error) {
        if (active) {
          setState({
            loading: false,
            allowed: false,
            message: error.message || "Unable to verify your session.",
          });
        }
      }
    }

    load();
    const unsubscribe = subscribeToAuthState(() => {
      if (active) {
        load();
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [allowedRoles, loginHref, pathname, router]);

  if (state.loading) {
    return <GateCard title="Checking your session" body="Hold on while EconID verifies this account." />;
  }

  if (!state.allowed) {
    return <GateCard title="Account access required" body={state.message} />;
  }

  return children;
}
