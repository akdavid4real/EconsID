"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSession, signOut, subscribeToAuthState } from "@/features/auth/browser-auth";

function getInitials(email = "EC") {
  return email.slice(0, 2).toUpperCase();
}

export function SessionMenu() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const nextSession = await getCurrentSession().catch(() => null);
      if (active) setSession(nextSession);
    }

    load();
    const unsubscribe = subscribeToAuthState((nextSession) => {
      if (active) setSession(nextSession);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!session?.user) {
    return (
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm ring-1 ring-[var(--color-border)]">
        EC
      </span>
    );
  }

  const role = session.user.user_metadata?.role ?? "trader";

  return (
    <button
      type="button"
      aria-label="Sign out"
      onClick={handleSignOut}
      className="grid h-10 min-w-10 place-items-center rounded-2xl bg-white px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-primary)] shadow-sm ring-1 ring-[var(--color-border)]"
    >
      {loading ? "..." : getInitials(role === "lender" ? "LD" : session.user.email)}
    </button>
  );
}
