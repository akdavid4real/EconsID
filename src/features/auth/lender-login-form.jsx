"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input } from "@/components/ui/primitives";
import { signInWithPassword, signOut } from "@/features/auth/browser-auth";

export function LenderLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await signInWithPassword({ email, password });
      const role = user?.user_metadata?.role ?? "trader";
      if (!["lender", "admin"].includes(role)) {
        await signOut().catch(() => {});
        throw new Error("This account is not allowed in the lender workspace.");
      }
      router.replace("/lender");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Field label="Work Email">
        <Input
          placeholder="name@institution.ng"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Field label="Password">
        <Input
          placeholder="Enter password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>
      {error ? <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p> : null}
      <Button type="submit" icon={false}>
        {loading ? "Signing in..." : "Continue"}
      </Button>
    </form>
  );
}
