"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input, Select } from "@/components/ui/primitives";
import { signInWithPassword } from "@/features/auth/browser-auth";
import { postJson } from "@/lib/client-api";

const storageKey = "econsid-onboarding-draft";

function readDraft() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
  } catch {
    return {};
  }
}

function writeDraft(next) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

export function OnboardingClient({ step }) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => readDraft());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(key, value) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      writeDraft(next);
      return next;
    });
  }

  async function submitFinal(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      try {
        await postJson("/api/auth/trader-signup", {
          email: draft.email,
          password: draft.password,
          phone: draft.phone,
          fullName: draft.fullName,
        });
      } catch (signupError) {
        if (!/already|exists|registered/i.test(signupError.message || "")) {
          throw signupError;
        }
      }
      await signInWithPassword({
        email: draft.email,
        password: draft.password,
      });

      const response = await postJson("/api/onboard", draft);
      setMessage(`Saved in ${response.meta?.mode ?? "demo"} mode.`);
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  if (step === 0) {
    return (
      <div className="grid gap-4">
        <Field label="Phone Number">
          <Input
            placeholder="+234 801 234 5678"
            inputMode="tel"
            value={draft.phone ?? ""}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </Field>
        <Button as="link" href="/onboard/verify" tone="gold">
          Continue
        </Button>
        <p className="text-sm text-[var(--color-muted)]">We use your number to anchor the trader profile.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="grid gap-4">
        <Field label="Email address">
          <Input
            placeholder="you@business.ng"
            type="email"
            autoComplete="email"
            value={draft.email ?? ""}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </Field>
        <Field label="Create password">
          <Input
            placeholder="Minimum 8 characters"
            type="password"
            autoComplete="new-password"
            value={draft.password ?? ""}
            onChange={(event) => updateField("password", event.target.value)}
          />
        </Field>
        <Button as="link" href="/onboard/profile" tone="gold">
          Continue
        </Button>
        <p className="text-sm text-[var(--color-muted)]">These details become the live sign-in for this trader account.</p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="grid gap-4">
        <Field label="Full Name">
          <Input
            placeholder="Your full name"
            value={draft.fullName ?? ""}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </Field>
        <Field label="Market or Business Name">
          <Input
            placeholder="Your market or business name"
            value={draft.market ?? ""}
            onChange={(event) => updateField("market", event.target.value)}
          />
        </Field>
        <Field label="Trade Category">
          <Select value={draft.category ?? "fabric"} onChange={(event) => updateField("category", event.target.value)}>
            <option value="fabric">Fabric</option>
            <option value="electronics">Electronics</option>
            <option value="food">Food</option>
          </Select>
        </Field>
        <div className="flex gap-3 rounded-3xl bg-[var(--color-gold-soft)] p-4">
          <p className="text-sm leading-6 text-[#6c4d14]">
            Keep this simple. You can complete the rest after your account is ready.
          </p>
        </div>
        <Button as="link" href="/onboard/account" tone="gold">
          Continue
        </Button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <form className="grid gap-4" onSubmit={submitFinal}>
        <Field label="Bank Name">
          <Input
            placeholder="Your bank name"
            value={draft.bankName ?? ""}
            onChange={(event) => updateField("bankName", event.target.value)}
          />
        </Field>
        <Field label="Account Number">
          <Input
            placeholder="Your account number"
            inputMode="numeric"
            value={draft.accountNumber ?? ""}
            onChange={(event) => updateField("accountNumber", event.target.value)}
          />
        </Field>
        <Field label="Location">
          <Input
            placeholder="Your city or market area"
            value={draft.location ?? ""}
            onChange={(event) => updateField("location", event.target.value)}
          />
        </Field>
        <div className="rounded-3xl bg-[var(--color-shell)] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Setup status</p>
          <p className="mt-2 text-sm text-white/85">We will create your trader account and save the first profile details from this form.</p>
        </div>
        {error ? <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p> : null}
        {message ? <p className="text-sm font-medium text-[var(--color-primary)]">{message}</p> : null}
        <Button tone="gold" className="justify-center" icon={false}>
          {loading ? "Saving..." : "Finish setup"}
        </Button>
      </form>
    );
  }

  return null;
}
